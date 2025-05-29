
import React, { useState, useEffect } from 'react';
import { useComponents } from '@/contexts/ComponentsContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface ComponentFormProps {
  componentId?: string | null;
  shipId: string;
  onClose: () => void;
}

export const ComponentForm: React.FC<ComponentFormProps> = ({ componentId, shipId, onClose }) => {
  const { components, addComponent, updateComponent, getComponent } = useComponents();
  const [formData, setFormData] = useState({
    name: '',
    serialNumber: '',
    installDate: '',
    lastMaintenanceDate: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (componentId) {
      const component = getComponent(componentId);
      if (component) {
        setFormData({
          name: component.name,
          serialNumber: component.serialNumber,
          installDate: component.installDate,
          lastMaintenanceDate: component.lastMaintenanceDate
        });
      }
    }
  }, [componentId, getComponent]);

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Component name is required';
    }

    if (!formData.serialNumber.trim()) {
      newErrors.serialNumber = 'Serial number is required';
    } else {
      // Check if serial number already exists (except for current component being edited)
      const existingComponent = components.find(comp => 
        comp.serialNumber === formData.serialNumber && comp.id !== componentId
      );
      if (existingComponent) {
        newErrors.serialNumber = 'Serial number already exists';
      }
    }

    if (!formData.installDate) {
      newErrors.installDate = 'Installation date is required';
    }

    if (!formData.lastMaintenanceDate) {
      newErrors.lastMaintenanceDate = 'Last maintenance date is required';
    }

    if (formData.installDate && formData.lastMaintenanceDate) {
      if (new Date(formData.lastMaintenanceDate) < new Date(formData.installDate)) {
        newErrors.lastMaintenanceDate = 'Last maintenance date cannot be before installation date';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) {
      return;
    }

    const componentData = {
      ...formData,
      shipId
    };

    if (componentId) {
      updateComponent(componentId, componentData);
    } else {
      addComponent(componentData);
    }
    
    onClose();
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{componentId ? 'Edit Component' : 'Add New Component'}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Component Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Enter component name"
            />
            {errors.name && <p className="text-sm text-red-600">{errors.name}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="serialNumber">Serial Number</Label>
            <Input
              id="serialNumber"
              value={formData.serialNumber}
              onChange={(e) => setFormData({ ...formData, serialNumber: e.target.value })}
              placeholder="Enter serial number"
            />
            {errors.serialNumber && <p className="text-sm text-red-600">{errors.serialNumber}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="installDate">Installation Date</Label>
            <Input
              id="installDate"
              type="date"
              value={formData.installDate}
              onChange={(e) => setFormData({ ...formData, installDate: e.target.value })}
            />
            {errors.installDate && <p className="text-sm text-red-600">{errors.installDate}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="lastMaintenanceDate">Last Maintenance Date</Label>
            <Input
              id="lastMaintenanceDate"
              type="date"
              value={formData.lastMaintenanceDate}
              onChange={(e) => setFormData({ ...formData, lastMaintenanceDate: e.target.value })}
            />
            {errors.lastMaintenanceDate && <p className="text-sm text-red-600">{errors.lastMaintenanceDate}</p>}
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              {componentId ? 'Update Component' : 'Add Component'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
