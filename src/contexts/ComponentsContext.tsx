
import React, { createContext, useContext, useState, useEffect } from 'react';

export interface Component {
  id: string;
  shipId: string;
  name: string;
  serialNumber: string;
  installDate: string;
  lastMaintenanceDate: string;
}

interface ComponentsContextType {
  components: Component[];
  addComponent: (component: Omit<Component, 'id'>) => void;
  updateComponent: (id: string, component: Partial<Component>) => void;
  deleteComponent: (id: string) => void;
  getComponentsByShip: (shipId: string) => Component[];
  getComponent: (id: string) => Component | undefined;
}

const ComponentsContext = createContext<ComponentsContextType | undefined>(undefined);

const initialComponents: Component[] = [
  { id: "c1", shipId: "s1", name: "Main Engine", serialNumber: "ME-1234", installDate: "2020-01-10", lastMaintenanceDate: "2024-03-12" },
  { id: "c2", shipId: "s2", name: "Radar", serialNumber: "RAD-5678", installDate: "2021-07-18", lastMaintenanceDate: "2023-12-01" },
  { id: "c3", shipId: "s1", name: "Navigation System", serialNumber: "NAV-9876", installDate: "2020-02-15", lastMaintenanceDate: "2024-01-20" },
  { id: "c4", shipId: "s3", name: "Propeller", serialNumber: "PROP-4321", installDate: "2019-11-30", lastMaintenanceDate: "2023-11-15" }
];

export const ComponentsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [components, setComponents] = useState<Component[]>([]);

  useEffect(() => {
    const savedComponents = localStorage.getItem('components');
    if (savedComponents) {
      setComponents(JSON.parse(savedComponents));
    } else {
      setComponents(initialComponents);
      localStorage.setItem('components', JSON.stringify(initialComponents));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('components', JSON.stringify(components));
  }, [components]);

  const addComponent = (component: Omit<Component, 'id'>) => {
    const newComponent = { ...component, id: `c${Date.now()}` };
    setComponents(prev => [...prev, newComponent]);
  };

  const updateComponent = (id: string, updatedComponent: Partial<Component>) => {
    setComponents(prev => prev.map(comp => comp.id === id ? { ...comp, ...updatedComponent } : comp));
  };

  const deleteComponent = (id: string) => {
    setComponents(prev => prev.filter(comp => comp.id !== id));
  };

  const getComponentsByShip = (shipId: string) => {
    return components.filter(comp => comp.shipId === shipId);
  };

  const getComponent = (id: string) => {
    return components.find(comp => comp.id === id);
  };

  return (
    <ComponentsContext.Provider value={{
      components,
      addComponent,
      updateComponent,
      deleteComponent,
      getComponentsByShip,
      getComponent
    }}>
      {children}
    </ComponentsContext.Provider>
  );
};

export const useComponents = () => {
  const context = useContext(ComponentsContext);
  if (context === undefined) {
    throw new Error('useComponents must be used within a ComponentsProvider');
  }
  return context;
};
