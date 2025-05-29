
import React, { useState, useEffect } from 'react';
import { useJobs } from '@/contexts/JobsContext';
import { useShips } from '@/contexts/ShipsContext';
import { useComponents } from '@/contexts/ComponentsContext';
import { useNotifications } from '@/contexts/NotificationContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface JobFormProps {
  jobId?: string | null;
  onClose: () => void;
}

export const JobForm: React.FC<JobFormProps> = ({ jobId, onClose }) => {
  const { jobs, addJob, updateJob, getJob } = useJobs();
  const { ships } = useShips();
  const { components } = useComponents();
  const { addNotification } = useNotifications();
  
  const [formData, setFormData] = useState({
    shipId: '',
    componentId: '',
    type: '' as 'Inspection' | 'Repair' | 'Replacement' | 'Cleaning' | '',
    priority: '' as 'Low' | 'Medium' | 'High' | 'Critical' | '',
    status: 'Open' as 'Open' | 'In Progress' | 'Completed' | 'Cancelled',
    assignedEngineerId: '3', // Default engineer
    scheduledDate: '',
    description: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [availableComponents, setAvailableComponents] = useState(components);

  useEffect(() => {
    if (jobId) {
      const job = getJob(jobId);
      if (job) {
        setFormData({
          shipId: job.shipId,
          componentId: job.componentId,
          type: job.type,
          priority: job.priority,
          status: job.status,
          assignedEngineerId: job.assignedEngineerId,
          scheduledDate: job.scheduledDate,
          description: job.description || ''
        });
      }
    }
  }, [jobId, getJob]);

  useEffect(() => {
    if (formData.shipId) {
      const shipComponents = components.filter(c => c.shipId === formData.shipId);
      setAvailableComponents(shipComponents);
      
      // Reset component selection if current component doesn't belong to selected ship
      if (formData.componentId && !shipComponents.find(c => c.id === formData.componentId)) {
        setFormData(prev => ({ ...prev, componentId: '' }));
      }
    } else {
      setAvailableComponents(components);
    }
  }, [formData.shipId, components]);

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.shipId) {
      newErrors.shipId = 'Ship is required';
    }

    if (!formData.componentId) {
      newErrors.componentId = 'Component is required';
    }

    if (!formData.type) {
      newErrors.type = 'Job type is required';
    }

    if (!formData.priority) {
      newErrors.priority = 'Priority is required';
    }

    if (!formData.scheduledDate) {
      newErrors.scheduledDate = 'Scheduled date is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) {
      return;
    }

    // Create a clean job object without empty strings
    const jobData = {
      shipId: formData.shipId,
      componentId: formData.componentId,
      type: formData.type as 'Inspection' | 'Repair' | 'Replacement' | 'Cleaning',
      priority: formData.priority as 'Low' | 'Medium' | 'High' | 'Critical',
      status: formData.status,
      assignedEngineerId: formData.assignedEngineerId,
      scheduledDate: formData.scheduledDate,
      description: formData.description
    };

    if (jobId) {
      updateJob(jobId, jobData);
      
      // Add notification for job update
      const ship = ships.find(s => s.id === formData.shipId);
      const component = components.find(c => c.id === formData.componentId);
      
      addNotification({
        type: 'job_updated',
        title: 'Job Updated',
        message: `${formData.type} for ${component?.name} on ${ship?.name} has been updated`
      });
    } else {
      addJob(jobData);
      
      // Add notification for new job
      const ship = ships.find(s => s.id === formData.shipId);
      const component = components.find(c => c.id === formData.componentId);
      
      addNotification({
        type: 'job_created',
        title: 'New Job Created',
        message: `${formData.type} scheduled for ${component?.name} on ${ship?.name}`
      });
    }
    
    onClose();
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{jobId ? 'Edit Job' : 'Create New Job'}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="shipId">Ship</Label>
              <Select value={formData.shipId} onValueChange={(value) => setFormData({ ...formData, shipId: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select ship" />
                </SelectTrigger>
                <SelectContent>
                  {ships.map((ship) => (
                    <SelectItem key={ship.id} value={ship.id}>
                      {ship.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.shipId && <p className="text-sm text-red-600">{errors.shipId}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="componentId">Component</Label>
              <Select 
                value={formData.componentId} 
                onValueChange={(value) => setFormData({ ...formData, componentId: value })}
                disabled={!formData.shipId}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select component" />
                </SelectTrigger>
                <SelectContent>
                  {availableComponents.map((component) => (
                    <SelectItem key={component.id} value={component.id}>
                      {component.name} ({component.serialNumber})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.componentId && <p className="text-sm text-red-600">{errors.componentId}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="type">Job Type</Label>
              <Select value={formData.type} onValueChange={(value: any) => setFormData({ ...formData, type: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select job type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Inspection">Inspection</SelectItem>
                  <SelectItem value="Repair">Repair</SelectItem>
                  <SelectItem value="Replacement">Replacement</SelectItem>
                  <SelectItem value="Cleaning">Cleaning</SelectItem>
                </SelectContent>
              </Select>
              {errors.type && <p className="text-sm text-red-600">{errors.type}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="priority">Priority</Label>
              <Select value={formData.priority} onValueChange={(value: any) => setFormData({ ...formData, priority: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Low">Low</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="High">High</SelectItem>
                  <SelectItem value="Critical">Critical</SelectItem>
                </SelectContent>
              </Select>
              {errors.priority && <p className="text-sm text-red-600">{errors.priority}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="scheduledDate">Scheduled Date</Label>
              <Input
                id="scheduledDate"
                type="date"
                value={formData.scheduledDate}
                onChange={(e) => setFormData({ ...formData, scheduledDate: e.target.value })}
              />
              {errors.scheduledDate && <p className="text-sm text-red-600">{errors.scheduledDate}</p>}
            </div>

            {jobId && (
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select value={formData.status} onValueChange={(value: any) => setFormData({ ...formData, status: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Open">Open</SelectItem>
                    <SelectItem value="In Progress">In Progress</SelectItem>
                    <SelectItem value="Completed">Completed</SelectItem>
                    <SelectItem value="Cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Enter job description (optional)"
              rows={3}
            />
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              {jobId ? 'Update Job' : 'Create Job'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
