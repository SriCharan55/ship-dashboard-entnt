
import React, { useState } from 'react';
import { useShips } from '@/contexts/ShipsContext';
import { useAuth } from '@/contexts/AuthContext';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Search, Edit, Trash2, Eye } from 'lucide-react';
import { ShipForm } from './ShipForm';

export const ShipList: React.FC = () => {
  const { ships, deleteShip } = useShips();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingShip, setEditingShip] = useState<string | null>(null);

  const canModify = user?.role === 'Admin';

  const filteredShips = ships.filter(ship =>
    ship.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ship.imo.includes(searchTerm) ||
    ship.flag.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-green-600 text-white hover:bg-green-700';
      case 'Under Maintenance': return 'bg-yellow-600 text-white hover:bg-yellow-700';
      case 'Inactive': return 'bg-gray-600 text-white hover:bg-gray-700';
      default: return 'bg-gray-600 text-white hover:bg-gray-700';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'Under Maintenance': return 'Maintenance';
      default: return status;
    }
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this ship?')) {
      deleteShip(id);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Ships Management</h1>
        {canModify && (
          <Button onClick={() => setShowForm(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Ship
          </Button>
        )}
      </div>

      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search ships..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredShips.map((ship) => (
          <Card key={ship.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg">{ship.name}</CardTitle>
                <Badge className={getStatusColor(ship.status)}>
                  {getStatusText(ship.status)}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-sm text-gray-600">
                <p><strong>IMO:</strong> {ship.imo}</p>
                <p><strong>Flag:</strong> {ship.flag}</p>
              </div>
              
              <div className="flex justify-between items-center pt-4">
                <Link to={`/ships/${ship.id}`}>
                  <Button variant="outline" size="sm">
                    <Eye className="mr-2 h-4 w-4" />
                    View Details
                  </Button>
                </Link>
                
                {canModify && (
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setEditingShip(ship.id)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(ship.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredShips.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No ships found matching your search.</p>
        </div>
      )}

      {(showForm || editingShip) && (
        <ShipForm
          shipId={editingShip}
          onClose={() => {
            setShowForm(false);
            setEditingShip(null);
          }}
        />
      )}
    </div>
  );
};
