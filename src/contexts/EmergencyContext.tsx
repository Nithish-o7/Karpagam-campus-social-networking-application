import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import { emergencyService } from '../services/emergencyService';

interface EmergencyContextType {
  isEmergencyMode: boolean;
  isTriggering:    boolean;
  error:           string | null;
  triggerEmergency: (location: string) => Promise<void>;
  resetEmergency:   () => void;
}

const EmergencyContext = createContext<EmergencyContextType | undefined>(undefined);

export function EmergencyProvider({ children }: { children: ReactNode }) {
  const [isEmergencyMode, setIsEmergencyMode] = useState(false);
  const [isTriggering,    setIsTriggering]    = useState(false);
  const [error,           setError]           = useState<string | null>(null);

  const triggerEmergency = useCallback(async (location: string) => {
    setIsTriggering(true);
    setError(null);
    try {
      await emergencyService.trigger(location);
      setIsEmergencyMode(true);
      // Once triggered, we "lock" into emergency mode
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Emergency trigger failed. Please call security directly.';
      setError(msg);
      throw new Error(msg);
    } finally {
      setIsTriggering(false);
    }
  }, []);

  const resetEmergency = useCallback(() => {
    setIsEmergencyMode(false);
    setError(null);
  }, []);

  return (
    <EmergencyContext.Provider value={{ 
      isEmergencyMode, 
      isTriggering, 
      error, 
      triggerEmergency,
      resetEmergency 
    }}>
      {children}
    </EmergencyContext.Provider>
  );
}

export function useEmergency() {
  const context = useContext(EmergencyContext);
  if (context === undefined) {
    throw new Error('useEmergency must be used within an EmergencyProvider');
  }
  return context;
}
