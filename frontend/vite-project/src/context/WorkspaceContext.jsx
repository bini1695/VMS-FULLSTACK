import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext.jsx';

const WorkspaceContext = createContext(null);

export const WORKSPACES = {
  ADMIN: 'admin',
  VETERINARIAN: 'veterinarian',
  LAB: 'lab',
  RECEPTIONIST: 'receptionist',
  PHARMACIST: 'pharmacist',
  OWNER: 'owner',
};

export function WorkspaceProvider({ children }) {
  const { user } = useAuth();
  const [workspace, setWorkspace] = useState(WORKSPACES.ADMIN);

  useEffect(() => {
    if (user?.role) setWorkspace(user.role);
    else setWorkspace(WORKSPACES.ADMIN);
  }, [user]);

  return (
    <WorkspaceContext.Provider value={{ workspace, setWorkspace }}>
      {children}
    </WorkspaceContext.Provider>
  );
}

export function useWorkspace() {
  const ctx = useContext(WorkspaceContext);
  if (!ctx) throw new Error('useWorkspace must be used inside WorkspaceProvider');
  return ctx;
}