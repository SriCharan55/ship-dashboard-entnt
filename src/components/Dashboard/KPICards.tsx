
import React from 'react';
import { useShips } from '@/contexts/ShipsContext';
import { useComponents } from '@/contexts/ComponentsContext';
import { useJobs } from '@/contexts/JobsContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Ship, Wrench, AlertTriangle, CheckCircle } from 'lucide-react';

export const KPICards: React.FC = () => {
  const { ships } = useShips();
  const { components } = useComponents();
  const { jobs } = useJobs();

  const totalShips = ships.length;
  const overdueComponents = components.filter(comp => {
    const lastMaintenance = new Date(comp.lastMaintenanceDate);
    const threeMonthsAgo = new Date();
    threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
    return lastMaintenance < threeMonthsAgo;
  }).length;
  
  const jobsInProgress = jobs.filter(job => job.status === 'In Progress').length;
  const completedJobs = jobs.filter(job => job.status === 'Completed').length;

  const kpis = [
    {
      title: 'Total Ships',
      value: totalShips,
      icon: Ship,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Overdue Maintenance',
      value: overdueComponents,
      icon: AlertTriangle,
      color: 'text-red-600',
      bgColor: 'bg-red-50'
    },
    {
      title: 'Jobs in Progress',
      value: jobsInProgress,
      icon: Wrench,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    },
    {
      title: 'Completed Jobs',
      value: completedJobs,
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {kpis.map((kpi) => {
        const Icon = kpi.icon;
        return (
          <Card key={kpi.title} className="transition-shadow hover:shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                {kpi.title}
              </CardTitle>
              <div className={`p-2 rounded-lg ${kpi.bgColor}`}>
                <Icon className={`h-5 w-5 ${kpi.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{kpi.value}</div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};
