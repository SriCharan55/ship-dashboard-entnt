
import React from 'react';
import { useJobs } from '@/contexts/JobsContext';
import { useShips } from '@/contexts/ShipsContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

export const Charts: React.FC = () => {
  const { jobs } = useJobs();
  const { ships } = useShips();

  // Job status distribution
  const jobStatusData = [
    { name: 'Open', value: jobs.filter(j => j.status === 'Open').length, color: '#3b82f6' },
    { name: 'In Progress', value: jobs.filter(j => j.status === 'In Progress').length, color: '#f59e0b' },
    { name: 'Completed', value: jobs.filter(j => j.status === 'Completed').length, color: '#10b981' },
    { name: 'Cancelled', value: jobs.filter(j => j.status === 'Cancelled').length, color: '#ef4444' }
  ];

  // Jobs by priority
  const priorityData = [
    { priority: 'Low', count: jobs.filter(j => j.priority === 'Low').length },
    { priority: 'Medium', count: jobs.filter(j => j.priority === 'Medium').length },
    { priority: 'High', count: jobs.filter(j => j.priority === 'High').length },
    { priority: 'Critical', count: jobs.filter(j => j.priority === 'Critical').length }
  ];

  // Ship status distribution
  const shipStatusData = [
    { name: 'Active', value: ships.filter(s => s.status === 'Active').length, color: '#10b981' },
    { name: 'Under Maintenance', value: ships.filter(s => s.status === 'Under Maintenance').length, color: '#f59e0b' },
    { name: 'Inactive', value: ships.filter(s => s.status === 'Inactive').length, color: '#6b7280' }
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Jobs by Priority</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={priorityData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="priority" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Job Status Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={jobStatusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {jobStatusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Ship Status Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={shipStatusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {shipStatusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};
