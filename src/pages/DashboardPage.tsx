
import React from 'react';
import { KPICards } from '@/components/Dashboard/KPICards';
import { Charts } from '@/components/Dashboard/Charts';

const DashboardPage: React.FC = () => {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">Overview of ship maintenance operations</p>
      </div>
      
      <KPICards />
      <Charts />
    </div>
  );
};

export default DashboardPage;
