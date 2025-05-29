
import React, { useState, useEffect } from 'react';
import { useShips } from '@/contexts/ShipsContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface ShipFormProps {
  shipId?: string | null;
  onClose: () => void;
}

export const ShipForm: React.FC<ShipFormProps> = ({ shipId, onClose }) => {
  const { ships, addShip, updateShip, getShip } = useShips();
  const [formData, setFormData] = useState({
    name: '',
    imo: '',
    flag: '',
    status: 'Active' as 'Active' | 'Under Maintenance' | 'Inactive'
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (shipId) {
      const ship = getShip(shipId);
      if (ship) {
        setFormData({
          name: ship.name,
          imo: ship.imo,
          flag: ship.flag,
          status: ship.status
        });
      }
    }
  }, [shipId, getShip]);

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Ship name is required';
    }

    if (!formData.imo.trim()) {
      newErrors.imo = 'IMO number is required';
    } else if (!/^\d{7}$/.test(formData.imo)) {
      newErrors.imo = 'IMO number must be 7 digits';
    } else {
      // Check if IMO already exists (except for current ship being edited)
      const existingShip = ships.find(ship => ship.imo === formData.imo && ship.id !== shipId);
      if (existingShip) {
        newErrors.imo = 'IMO number already exists';
      }
    }

    if (!formData.flag.trim()) {
      newErrors.flag = 'Flag is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) {
      return;
    }

    if (shipId) {
      updateShip(shipId, formData);
    } else {
      addShip(formData);
    }
    
    onClose();
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{shipId ? 'Edit Ship' : 'Add New Ship'}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Ship Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Enter ship name"
            />
            {errors.name && <p className="text-sm text-red-600">{errors.name}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="imo">IMO Number</Label>
            <Input
              id="imo"
              value={formData.imo}
              onChange={(e) => setFormData({ ...formData, imo: e.target.value })}
              placeholder="7-digit IMO number"
              maxLength={7}
            />
            {errors.imo && <p className="text-sm text-red-600">{errors.imo}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="flag">Flag</Label>
            <Input
              id="flag"
              value={formData.flag}
              onChange={(e) => setFormData({ ...formData, flag: e.target.value })}
              placeholder="Enter flag country"
            />
            {errors.flag && <p className="text-sm text-red-600">{errors.flag}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select value={formData.status} onValueChange={(value: any) => setFormData({ ...formData, status: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Under Maintenance">Under Maintenance</SelectItem>
                <SelectItem value="Inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              {shipId ? 'Update Ship' : 'Add Ship'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
