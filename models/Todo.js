const mongoose = require('mongoose');

const todoSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Todo title is required'],
        trim: true,
        maxlength: [200, 'Todo title cannot exceed 200 characters']
    },
    description: {
        type: String,
        trim: true,
        maxlength: [1000, 'Description cannot exceed 1000 characters']
    },
    completed: {
        type: Boolean,
        default: false
    },
    priority: {
        type: String,
        enum: ['low', 'medium', 'high', 'urgent'],
        default: 'medium'
    },
    dueDate: {
        type: Date,
        validate: {
            validator: function(value) {
                return !value || value >= new Date();
            },
            message: 'Due date cannot be in the past'
        }
    },
    category: {
        type: String,
        trim: true,
        maxlength: [50, 'Category cannot exceed 50 characters']
    },
    tags: [{
        type: String,
        trim: true,
        maxlength: [30, 'Tag cannot exceed 30 characters']
    }],
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'User is required']
    },
    parentTodo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Todo',
        default: null
    },
    subtodos: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Todo'
    }],
    attachments: [{
        filename: {
            type: String,
            required: true
        },
        url: {
            type: String,
            required: true
        },
        size: {
            type: Number,
            required: true
        },
        uploadedAt: {
            type: Date,
            default: Date.now
        }
    }],
    notes: [{
        content: {
            type: String,
            required: true,
            maxlength: [500, 'Note cannot exceed 500 characters']
        },
        createdAt: {
            type: Date,
            default: Date.now
        },
        updatedAt: {
            type: Date,
            default: Date.now
        }
    }],
    timeEstimate: {
        hours: {
            type: Number,
            min: 0,
            default: 0
        },
        minutes: {
            type: Number,
            min: 0,
            max: 59,
            default: 0
        }
    },
    timeSpent: {
        hours: {
            type: Number,
            min: 0,
            default: 0
        },
        minutes: {
            type: Number,
            min: 0,
            max: 59,
            default: 0
        }
    },
    isArchived: {
        type: Boolean,
        default: false
    },
    completedAt: {
        type: Date,
        default: null
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Virtual for total time estimate in minutes
todoSchema.virtual('totalTimeEstimate').get(function() {
    return (this.timeEstimate.hours * 60) + this.timeEstimate.minutes;
});

// Virtual for total time spent in minutes
todoSchema.virtual('totalTimeSpent').get(function() {
    return (this.timeSpent.hours * 60) + this.timeSpent.minutes;
});

// Virtual for overdue status
todoSchema.virtual('isOverdue').get(function() {
    if (!this.dueDate || this.completed) return false;
    return new Date() > this.dueDate;
});

// Virtual for completion percentage
todoSchema.virtual('completionPercentage').get(function() {
    if (this.subtodos.length === 0) {
        return this.completed ? 100 : 0;
    }
    
    const completedSubtodos = this.subtodos.filter(subtodo => subtodo.completed).length;
    return Math.round((completedSubtodos / this.subtodos.length) * 100);
});

// Indexes for better query performance
todoSchema.index({ user: 1, completed: 1 });
todoSchema.index({ user: 1, dueDate: 1 });
todoSchema.index({ user: 1, priority: 1 });
todoSchema.index({ user: 1, category: 1 });
todoSchema.index({ user: 1, isArchived: 1 });

// Pre-save middleware to update completedAt
todoSchema.pre('save', function(next) {
    if (this.isModified('completed') && this.completed && !this.completedAt) {
        this.completedAt = new Date();
    } else if (this.isModified('completed') && !this.completed) {
        this.completedAt = null;
    }
    next();
});

// Method to add subtodo
todoSchema.methods.addSubtodo = function(subtodoId) {
    if (!this.subtodos.includes(subtodoId)) {
        this.subtodos.push(subtodoId);
    }
    return this.save();
};

// Method to remove subtodo
todoSchema.methods.removeSubtodo = function(subtodoId) {
    this.subtodos = this.subtodos.filter(id => !id.equals(subtodoId));
    return this.save();
};

// Method to add note
todoSchema.methods.addNote = function(content) {
    this.notes.push({ content });
    return this.save();
};

// Method to update note
todoSchema.methods.updateNote = function(noteId, content) {
    const note = this.notes.id(noteId);
    if (note) {
        note.content = content;
        note.updatedAt = new Date();
    }
    return this.save();
};

// Method to delete note
todoSchema.methods.deleteNote = function(noteId) {
    this.notes = this.notes.filter(note => !note._id.equals(noteId));
    return this.save();
};

// Method to add time spent
todoSchema.methods.addTimeSpent = function(hours, minutes) {
    const totalMinutes = (this.timeSpent.hours * 60) + this.timeSpent.minutes + (hours * 60) + minutes;
    this.timeSpent.hours = Math.floor(totalMinutes / 60);
    this.timeSpent.minutes = totalMinutes % 60;
    return this.save();
};

// Static method to get todos by user with pagination
todoSchema.statics.findByUser = function(userId, options = {}) {
    const {
        page = 1,
        limit = 10,
        completed,
        priority,
        category,
        search,
        sortBy = 'createdAt',
        sortOrder = 'desc'
    } = options;

    const query = { user: userId, isArchived: false };
    
    if (completed !== undefined) query.completed = completed;
    if (priority) query.priority = priority;
    if (category) query.category = category;
    if (search) {
        query.$or = [
            { title: { $regex: search, $options: 'i' } },
            { description: { $regex: search, $options: 'i' } }
        ];
    }

    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    return this.find(query)
        .sort(sort)
        .limit(limit * 1)
        .skip((page - 1) * limit)
        .populate('user', 'username email firstName lastName')
        .populate('subtodos', 'title completed');
};

module.exports = mongoose.model('Todo', todoSchema);