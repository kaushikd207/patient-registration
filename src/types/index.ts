export interface Patient {
  id: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: 'male' | 'female' | 'other';
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  insuranceProvider?: string;
  insuranceNumber?: string;
  emergencyContact?: string;
  emergencyPhone?: string;
  medicalHistory: any[];
  createdAt: string;
  updatedAt: string;
}

export interface DatabaseContextType {
  isLoading: boolean;
  isInitialized: boolean;
  patients: Patient[];
  addPatient: (patient: Omit<Patient, 'id' | 'createdAt' | 'updatedAt'>) => Promise<Patient>;
  getPatient: (id: string) => Promise<Patient | null>;
  getAllPatients: () => Promise<Patient[]>;
  executeQuery: (query: string) => Promise<any[]>;
  error: string | null;
  channel: BroadcastChannel | null;
  closeChannel: () => void;
}