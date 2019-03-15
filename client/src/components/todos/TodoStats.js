import React from 'react';
import { CheckCircle, Clock, AlertTriangle, List } from 'lucide-react';

const TodoStats = ({ stats }) => {
  const statItems = [
    {
      title: 'Total',
      value: stats.total,
      icon: List,
      color: 'bg-blue-500',
      textColor: 'text-blue-600'
    },
    {
      title: 'Completed',
      value: stats.completed,
      icon: CheckCircle,
      color: 'bg-green-500',
      textColor: 'text-green-600'
    },
    {
      title: 'Pending',
      value: stats.pending,
      icon: Clock,
      color: 'bg-yellow-500',
      textColor: 'text-yellow-600'
    },
    {
      title: 'Overdue',
      value: stats.overdue,
      icon: AlertTriangle,
      color: 'bg-red-500',
      textColor: 'text-red-600'
    }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      {statItems.map((item) => {
        const Icon = item.icon;
        return (
          <div key={item.title} className="bg-white rounded-lg shadow-sm border p-4">
            <div className="flex items-center">
              <div className={`p-2 rounded-lg ${item.color} bg-opacity-10`}>
                <Icon className={`h-6 w-6 ${item.textColor}`} />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">{item.title}</p>
                <p className="text-2xl font-bold text-gray-900">{item.value}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default TodoStats; 