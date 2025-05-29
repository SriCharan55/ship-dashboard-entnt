
import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useShips } from '@/contexts/ShipsContext';
import { useComponents } from '@/contexts/ComponentsContext';
import { useJobs } from '@/contexts/JobsContext';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Plus, Edit, Trash2 } from 'lucide-react';
import { ComponentForm } from '../Components/ComponentForm';

export const ShipDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { getShip } = useShips();
  const { getComponentsByShip, deleteComponent } = useComponents();
  const { getJobsByShip } = useJobs();
  const { user } = useAuth();
  const [showComponentForm, setShowComponentForm] = useState(false);
  const [editingComponent, setEditingComponent] = useState<string | null>(null);

  const ship = id ? getShip(id) : null;
  const components = id ? getComponentsByShip(id) : [];
  const jobs = id ? getJobsByShip(id) : [];

  const canModify = user?.role === 'Admin' || user?.role === 'Engineer';

  if (!ship) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 text-lg">Ship not found</p>
        <Link to="/ships">
          <Button className="mt-4">Back to Ships</Button>
        </Link>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800';
      case 'Under Maintenance': return 'bg-yellow-100 text-yellow-800';
      case 'Inactive': return 'bg-gray-100 text-gray-800';
      case 'Open': return 'bg-blue-100 text-blue-800';
      case 'In Progress': return 'bg-orange-100 text-orange-800';
      case 'Completed': return 'bg-green-100 text-green-800';
      case 'Cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Low': return 'bg-gray-100 text-gray-800';
      case 'Medium': return 'bg-blue-100 text-blue-800';
      case 'High': return 'bg-orange-100 text-orange-800';
      case 'Critical': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleDeleteComponent = (componentId: string) => {
    if (window.confirm('Are you sure you want to delete this component?')) {
      deleteComponent(componentId);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link to="/ships">
            <Button variant="outline" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Ships
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">{ship.name}</h1>
          <Badge className={getStatusColor(ship.status)}>
            {ship.status}
          </Badge>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>General Information</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <p className="text-sm font-medium text-gray-500">IMO Number</p>
            <p className="text-lg font-semibold">{ship.imo}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Flag</p>
            <p className="text-lg font-semibold">{ship.flag}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Status</p>
            <Badge className={getStatusColor(ship.status)}>
              {ship.status}
            </Badge>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="components" className="space-y-4">
        <TabsList>
          <TabsTrigger value="components">Components ({components.length})</TabsTrigger>
          <TabsTrigger value="maintenance">Maintenance History ({jobs.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="components" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Ship Components</h2>
            {canModify && (
              <Button onClick={() => setShowComponentForm(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Add Component
              </Button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {components.map((component) => (
              <Card key={component.id}>
                <CardHeader>
                  <CardTitle className="text-lg">{component.name}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p className="text-sm"><strong>Serial:</strong> {component.serialNumber}</p>
                  <p className="text-sm"><strong>Installed:</strong> {new Date(component.installDate).toLocaleDateString()}</p>
                  <p className="text-sm"><strong>Last Maintenance:</strong> {new Date(component.lastMaintenanceDate).toLocaleDateString()}</p>
                  
                  {canModify && (
                    <div className="flex justify-end space-x-2 pt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setEditingComponent(component.id)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteComponent(component.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          {components.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No components found for this ship.</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="maintenance" className="space-y-4">
          <h2 className="text-xl font-semibold">Maintenance History</h2>
          
          <div className="space-y-4">
            {jobs.map((job) => {
              const component = components.find(c => c.id === job.componentId);
              return (
                <Card key={job.id}>
                  <CardContent className="pt-6">
                    <div className="flex justify-between items-start">
                      <div className="space-y-2">
                        <h3 className="font-semibold">{job.type} - {component?.name}</h3>
                        <p className="text-sm text-gray-600">{job.description}</p>
                        <div className="flex space-x-4">
                          <Badge className={getPriorityColor(job.priority)}>
                            {job.priority}
                          </Badge>
                          <Badge className={getStatusColor(job.status)}>
                            {job.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-500">
                          Scheduled: {new Date(job.scheduledDate).toLocaleDateString()}
                          {job.completedDate && (
                            <span> | Completed: {new Date(job.completedDate).toLocaleDateString()}</span>
                          )}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {jobs.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No maintenance history found for this ship.</p>
            </div>
          )}
        </TabsContent>
      </Tabs>

      {(showComponentForm || editingComponent) && (
        <ComponentForm
          componentId={editingComponent}
          shipId={ship.id}
          onClose={() => {
            setShowComponentForm(false);
            setEditingComponent(null);
          }}
        />
      )}
    </div>
  );
};
