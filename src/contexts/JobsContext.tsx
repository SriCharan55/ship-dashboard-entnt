
import React, { createContext, useContext, useState, useEffect } from 'react';

export interface Job {
  id: string;
  componentId: string;
  shipId: string;
  type: 'Inspection' | 'Repair' | 'Replacement' | 'Cleaning';
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  status: 'Open' | 'In Progress' | 'Completed' | 'Cancelled';
  assignedEngineerId: string;
  scheduledDate: string;
  completedDate?: string;
  description?: string;
}

interface JobsContextType {
  jobs: Job[];
  addJob: (job: Omit<Job, 'id'>) => void;
  updateJob: (id: string, job: Partial<Job>) => void;
  deleteJob: (id: string) => void;
  getJobsByShip: (shipId: string) => Job[];
  getJobsByComponent: (componentId: string) => Job[];
  getJob: (id: string) => Job | undefined;
}

const JobsContext = createContext<JobsContextType | undefined>(undefined);

const initialJobs: Job[] = [
  { 
    id: "j1", 
    componentId: "c1", 
    shipId: "s1", 
    type: "Inspection", 
    priority: "High", 
    status: "Open", 
    assignedEngineerId: "3", 
    scheduledDate: "2025-06-05",
    description: "Routine engine inspection"
  },
  { 
    id: "j2", 
    componentId: "c2", 
    shipId: "s2", 
    type: "Repair", 
    priority: "Critical", 
    status: "In Progress", 
    assignedEngineerId: "3", 
    scheduledDate: "2025-05-28",
    description: "Radar calibration and repair"
  },
  { 
    id: "j3", 
    componentId: "c3", 
    shipId: "s1", 
    type: "Cleaning", 
    priority: "Medium", 
    status: "Completed", 
    assignedEngineerId: "3", 
    scheduledDate: "2025-05-20",
    completedDate: "2025-05-22",
    description: "Navigation system cleaning"
  }
];

export const JobsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [jobs, setJobs] = useState<Job[]>([]);

  useEffect(() => {
    const savedJobs = localStorage.getItem('jobs');
    if (savedJobs) {
      setJobs(JSON.parse(savedJobs));
    } else {
      setJobs(initialJobs);
      localStorage.setItem('jobs', JSON.stringify(initialJobs));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('jobs', JSON.stringify(jobs));
  }, [jobs]);

  const addJob = (job: Omit<Job, 'id'>) => {
    const newJob = { ...job, id: `j${Date.now()}` };
    setJobs(prev => [...prev, newJob]);
  };

  const updateJob = (id: string, updatedJob: Partial<Job>) => {
    setJobs(prev => prev.map(job => job.id === id ? { ...job, ...updatedJob } : job));
  };

  const deleteJob = (id: string) => {
    setJobs(prev => prev.filter(job => job.id !== id));
  };

  const getJobsByShip = (shipId: string) => {
    return jobs.filter(job => job.shipId === shipId);
  };

  const getJobsByComponent = (componentId: string) => {
    return jobs.filter(job => job.componentId === componentId);
  };

  const getJob = (id: string) => {
    return jobs.find(job => job.id === id);
  };

  return (
    <JobsContext.Provider value={{
      jobs,
      addJob,
      updateJob,
      deleteJob,
      getJobsByShip,
      getJobsByComponent,
      getJob
    }}>
      {children}
    </JobsContext.Provider>
  );
};

export const useJobs = () => {
  const context = useContext(JobsContext);
  if (context === undefined) {
    throw new Error('useJobs must be used within a JobsProvider');
  }
  return context;
};
