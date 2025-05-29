
import React, { useState } from 'react';
import { useJobs } from '@/contexts/JobsContext';
import { useShips } from '@/contexts/ShipsContext';
import { useComponents } from '@/contexts/ComponentsContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';

export const JobCalendar: React.FC = () => {
  const { jobs } = useJobs();
  const { ships } = useShips();
  const { components } = useComponents();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const getJobsForDate = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    return jobs.filter(job => job.scheduledDate === dateStr);
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(prev.getMonth() - 1);
      } else {
        newDate.setMonth(prev.getMonth() + 1);
      }
      return newDate;
    });
    setSelectedDate(null);
  };

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const days = [];

    // Empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-24 p-1"></div>);
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
      const dayJobs = getJobsForDate(date);
      const isToday = date.toDateString() === new Date().toDateString();
      const isSelected = selectedDate?.toDateString() === date.toDateString();

      days.push(
        <div
          key={day}
          className={`h-24 p-1 border cursor-pointer transition-colors ${
            isToday ? 'bg-blue-50 border-blue-200' : 'border-gray-200'
          } ${isSelected ? 'bg-blue-100' : 'hover:bg-gray-50'}`}
          onClick={() => setSelectedDate(date)}
        >
          <div className={`text-sm font-medium ${isToday ? 'text-blue-600' : 'text-gray-900'}`}>
            {day}
          </div>
          <div className="space-y-1 mt-1">
            {dayJobs.slice(0, 2).map((job) => {
              const component = components.find(c => c.id === job.componentId);
              return (
                <div
                  key={job.id}
                  className={`text-xs p-1 rounded truncate ${
                    job.priority === 'Critical' ? 'bg-red-100 text-red-800' :
                    job.priority === 'High' ? 'bg-orange-100 text-orange-800' :
                    job.priority === 'Medium' ? 'bg-blue-100 text-blue-800' :
                    'bg-gray-100 text-gray-800'
                  }`}
                  title={`${job.type} - ${component?.name}`}
                >
                  {job.type}
                </div>
              );
            })}
            {dayJobs.length > 2 && (
              <div className="text-xs text-gray-500">+{dayJobs.length - 2} more</div>
            )}
          </div>
        </div>
      );
    }

    return days;
  };

  const selectedDateJobs = selectedDate ? getJobsForDate(selectedDate) : [];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Low': return 'bg-gray-100 text-gray-800';
      case 'Medium': return 'bg-blue-100 text-blue-800';
      case 'High': return 'bg-orange-100 text-orange-800';
      case 'Critical': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Open': return 'bg-blue-100 text-blue-800';
      case 'In Progress': return 'bg-orange-100 text-orange-800';
      case 'Completed': return 'bg-green-100 text-green-800';
      case 'Cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center">
          <Calendar className="mr-3 h-8 w-8" />
          Maintenance Calendar
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl">
                  {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
                </CardTitle>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigateMonth('prev')}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigateMonth('next')}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-7 gap-px bg-gray-200">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                  <div key={day} className="bg-gray-50 p-2 text-center text-sm font-medium text-gray-700">
                    {day}
                  </div>
                ))}
                {renderCalendar()}
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">
                {selectedDate 
                  ? `Jobs for ${selectedDate.toLocaleDateString()}`
                  : 'Select a date to view jobs'
                }
              </CardTitle>
            </CardHeader>
            <CardContent>
              {selectedDateJobs.length > 0 ? (
                <div className="space-y-3">
                  {selectedDateJobs.map((job) => {
                    const ship = ships.find(s => s.id === job.shipId);
                    const component = components.find(c => c.id === job.componentId);
                    
                    return (
                      <div key={job.id} className="p-3 border rounded-lg space-y-2">
                        <div className="flex justify-between items-start">
                          <h4 className="font-medium text-sm">{job.type}</h4>
                          <div className="flex space-x-1">
                            <Badge className={getPriorityColor(job.priority)} variant="secondary">
                              {job.priority}
                            </Badge>
                            <Badge className={getStatusColor(job.status)} variant="secondary">
                              {job.status}
                            </Badge>
                          </div>
                        </div>
                        <div className="text-xs text-gray-600">
                          <p><strong>Ship:</strong> {ship?.name}</p>
                          <p><strong>Component:</strong> {component?.name}</p>
                          {job.description && (
                            <p><strong>Description:</strong> {job.description}</p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : selectedDate ? (
                <p className="text-gray-500 text-sm">No jobs scheduled for this date.</p>
              ) : (
                <p className="text-gray-500 text-sm">Click on a date in the calendar to view scheduled jobs.</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
