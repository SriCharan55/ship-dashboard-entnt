
import React, { createContext, useContext, useState, useEffect } from 'react';

export interface Ship {
  id: string;
  name: string;
  imo: string;
  flag: string;
  status: 'Active' | 'Under Maintenance' | 'Inactive';
}

interface ShipsContextType {
  ships: Ship[];
  addShip: (ship: Omit<Ship, 'id'>) => void;
  updateShip: (id: string, ship: Partial<Ship>) => void;
  deleteShip: (id: string) => void;
  getShip: (id: string) => Ship | undefined;
}

const ShipsContext = createContext<ShipsContextType | undefined>(undefined);

const initialShips: Ship[] = [
  { id: "s1", name: "Ever Given", imo: "9811000", flag: "Panama", status: "Active" },
  { id: "s2", name: "Maersk Alabama", imo: "9164263", flag: "USA", status: "Under Maintenance" },
  { id: "s3", name: "MSC Oscar", imo: "9703291", flag: "Panama", status: "Active" }
];

export const ShipsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [ships, setShips] = useState<Ship[]>([]);

  useEffect(() => {
    const savedShips = localStorage.getItem('ships');
    if (savedShips) {
      setShips(JSON.parse(savedShips));
    } else {
      setShips(initialShips);
      localStorage.setItem('ships', JSON.stringify(initialShips));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('ships', JSON.stringify(ships));
  }, [ships]);

  const addShip = (ship: Omit<Ship, 'id'>) => {
    const newShip = { ...ship, id: `s${Date.now()}` };
    setShips(prev => [...prev, newShip]);
  };

  const updateShip = (id: string, updatedShip: Partial<Ship>) => {
    setShips(prev => prev.map(ship => ship.id === id ? { ...ship, ...updatedShip } : ship));
  };

  const deleteShip = (id: string) => {
    setShips(prev => prev.filter(ship => ship.id !== id));
  };

  const getShip = (id: string) => {
    return ships.find(ship => ship.id === id);
  };

  return (
    <ShipsContext.Provider value={{
      ships,
      addShip,
      updateShip,
      deleteShip,
      getShip
    }}>
      {children}
    </ShipsContext.Provider>
  );
};

export const useShips = () => {
  const context = useContext(ShipsContext);
  if (context === undefined) {
    throw new Error('useShips must be used within a ShipsProvider');
  }
  return context;
};
