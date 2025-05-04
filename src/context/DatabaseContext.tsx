import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Patient, DatabaseContextType } from '../types';
import { initDatabase } from '../services/database';

// context with a default value
const DatabaseContext = createContext<DatabaseContextType>({
  isLoading: true,
  isInitialized: false,
  patients: [],
  addPatient: async () => {
    throw new Error('Database not initialized');
  },
  getPatient: async () => null,
  getAllPatients: async () => [],
  executeQuery: async () => [],
  error: null,
  channel: null,
  closeChannel: () => {}
});

// Custom hook to use the database context
export const useDatabase = () => useContext(DatabaseContext);

interface DatabaseProviderProps {
  children: ReactNode;
}

export const DatabaseProvider: React.FC<DatabaseProviderProps> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [db, setDb] = useState<any>(null);
  const [channel, setChannel] = useState<BroadcastChannel | null>(null);

  // Initialize the database and channel
  useEffect(() => {
    const newChannel = new BroadcastChannel('patient-db-sync');
    setChannel(newChannel);

    const setupDb = async () => {
      try {
        setIsLoading(true);
        const database = await initDatabase();
        setDb(database);
        
        // Create patients table if it doesn't exist
        await database.exec(`
          CREATE TABLE IF NOT EXISTS patients (
            id TEXT PRIMARY KEY,
            data TEXT NOT NULL
          )
        `);
        
        // Load all patients
        const result = await database.exec({
          sql: 'SELECT * FROM patients',
          returnValue: 'resultRows'
        });
        
        const loadedPatients = result.map((row: any) => JSON.parse(row.data));
        setPatients(loadedPatients);
        setIsInitialized(true);
        setIsLoading(false);
      } catch (err) {
        console.error('Database initialization error:', err);
        setError('Failed to initialize database: ' + (err instanceof Error ? err.message : String(err)));
        setIsLoading(false);
      }
    };

    setupDb();

    // Listen for changes from other tabs
    newChannel.onmessage = (event) => {
      if (event.data.type === 'PATIENT_ADDED') {
        setPatients(prev => [...prev, event.data.patient]);
      }
    };

    return () => {
      newChannel.close();
    };
  }, []);

  const closeChannel = () => {
    if (channel) {
      channel.close();
      setChannel(null);
    }
  };

  // Add a new patient
  const addPatient = async (patientData: Omit<Patient, 'id' | 'createdAt' | 'updatedAt'>): Promise<Patient> => {
    if (!db || !isInitialized) {
      throw new Error('Database not initialized');
    }

    try {
      const now = new Date().toISOString();
      const newPatient: Patient = {
        ...patientData,
        id: uuidv4(),
        createdAt: now,
        updatedAt: now
      };

      // Save to database
      await db.exec({
        sql: 'INSERT INTO patients (id, data) VALUES (?, ?)',
        bind: [newPatient.id, JSON.stringify(newPatient)]
      });

      // Update local state
      setPatients(prev => [...prev, newPatient]);
      
      // Notify other tabs if channel is open
      if (channel) {
        channel.postMessage({
          type: 'PATIENT_ADDED',
          patient: newPatient
        });
      }

      return newPatient;
    } catch (err) {
      console.error('Error adding patient:', err);
      setError('Failed to add patient: ' + (err instanceof Error ? err.message : String(err)));
      throw err;
    }
  };

  // Get a single patient by ID
  const getPatient = async (id: string): Promise<Patient | null> => {
    if (!db || !isInitialized) {
      throw new Error('Database not initialized');
    }

    try {
      const result = await db.exec({
        sql: 'SELECT data FROM patients WHERE id = ?',
        bind: [id],
        returnValue: 'resultRows'
      });

      if (result.length === 0) {
        return null;
      }

      return JSON.parse(result[0].data);
    } catch (err) {
      console.error('Error getting patient:', err);
      setError('Failed to get patient: ' + (err instanceof Error ? err.message : String(err)));
      throw err;
    }
  };

  // Get all patients
  const getAllPatients = async (): Promise<Patient[]> => {
    if (!db || !isInitialized) {
      throw new Error('Database not initialized');
    }

    try {
      const result = await db.exec({
        sql: 'SELECT data FROM patients',
        returnValue: 'resultRows'
      });

      return result.map((row: any) => JSON.parse(row.data));
    } catch (err) {
      console.error('Error getting all patients:', err);
      setError('Failed to get patients: ' + (err instanceof Error ? err.message : String(err)));
      throw err;
    }
  };

  // Execute custom SQL query
  const executeQuery = async (query: string): Promise<any[]> => {
    if (!db || !isInitialized) {
      throw new Error('Database not initialized');
    }

    try {
      const result = await db.exec({
        sql: query,
        returnValue: 'resultRows'
      });

      return result;
    } catch (err) {
      console.error('Error executing query:', err);
      setError('Failed to execute query: ' + (err instanceof Error ? err.message : String(err)));
      throw err;
    }
  };

  const value = {
    isLoading,
    isInitialized,
    patients,
    addPatient,
    getPatient,
    getAllPatients,
    executeQuery,
    error,
    channel,
    closeChannel
  };

  return (
    <DatabaseContext.Provider value={value}>
      {children}
    </DatabaseContext.Provider>
  );
};