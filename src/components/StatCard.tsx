import React from 'react';
import { Card } from '@/components/ui/card';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  color?: string;
  icon?: React.ReactNode;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  color = 'bg-gradient-to-br from-gray-500 to-gray-600',
  icon,
}) => {
  return (
    <Card
      className={`overflow-hidden shadow-md rounded-xl min-h-[120px] flex flex-col justify-center ${color}`}
    >
      <div className="flex flex-col h-full justify-center items-center text-white p-5">
        <div className="flex items-center justify-center mb-2 w-full">
          {icon && <span className="mr-2 text-2xl flex-shrink-0">{icon}</span>}
          <h3 className="text-base font-medium w-full text-center">{title}</h3>
        </div>
        <p className="text-3xl font-bold mb-1 text-center">{value}</p>
        {subtitle && (
          <p className="text-sm opacity-90 text-center">{subtitle}</p>
        )}
      </div>
    </Card>
  );
}; 