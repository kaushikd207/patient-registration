import React, { useState, useEffect } from 'react';
import { useDatabase } from '../context/DatabaseContext';
import { Patient } from '../types';
import { Users, Search, ChevronDown, ChevronUp, User, Calendar, Phone, Mail } from 'lucide-react';

const PatientList: React.FC = () => {
  const { patients, isLoading } = useDatabase();
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredPatients, setFilteredPatients] = useState<Patient[]>([]);
  const [sortField, setSortField] = useState<keyof Patient>('lastName');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [expandedPatient, setExpandedPatient] = useState<string | null>(null);

  useEffect(() => {
    let result = [...patients];
    
    // Apply search filter
    if (searchTerm) {
      const lowerSearchTerm = searchTerm.toLowerCase();
      result = result.filter(patient => 
        patient.firstName.toLowerCase().includes(lowerSearchTerm) ||
        patient.lastName.toLowerCase().includes(lowerSearchTerm) ||
        patient.email.toLowerCase().includes(lowerSearchTerm) ||
        patient.phone.includes(searchTerm)
      );
    }
    
    // Apply sorting
    result.sort((a, b) => {
      const fieldA = a[sortField] as string;
      const fieldB = b[sortField] as string;
      
      if (fieldA < fieldB) return sortDirection === 'asc' ? -1 : 1;
      if (fieldA > fieldB) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
    
    setFilteredPatients(result);
  }, [patients, searchTerm, sortField, sortDirection]);

  const handleSort = (field: keyof Patient) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const togglePatientDetails = (patientId: string) => {
    if (expandedPatient === patientId) {
      setExpandedPatient(null);
    } else {
      setExpandedPatient(patientId);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-2">
            <Users className="h-6 w-6 text-blue-500" />
          </div>
          <p className="text-gray-500">Loading patients...</p>
        </div>
      </div>
    );
  }

  if (patients.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex flex-col items-center justify-center py-12">
          <Users className="h-16 w-16 text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-900">No patients found</h3>
          <p className="text-gray-500 mt-1">Start by registering a new patient.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-6 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800 flex items-center mb-4 sm:mb-0">
            <Users className="mr-2 h-5 w-5 text-blue-500" />
            Patient Records
            <span className="ml-2 text-sm font-normal text-gray-500">
              ({filteredPatients.length} {filteredPatients.length === 1 ? 'patient' : 'patients'})
            </span>
          </h2>
          <div className="relative w-full sm:w-64">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Search patients..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('lastName')}
              >
                <div className="flex items-center">
                  <span>Patient Name</span>
                  {sortField === 'lastName' && (
                    <span className="ml-1">
                      {sortDirection === 'asc' ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )}
                    </span>
                  )}
                </div>
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('dateOfBirth')}
              >
                <div className="flex items-center">
                  <span>Date of Birth</span>
                  {sortField === 'dateOfBirth' && (
                    <span className="ml-1">
                      {sortDirection === 'asc' ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )}
                    </span>
                  )}
                </div>
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('email')}
              >
                <div className="flex items-center">
                  <span>Contact</span>
                  {sortField === 'email' && (
                    <span className="ml-1">
                      {sortDirection === 'asc' ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )}
                    </span>
                  )}
                </div>
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('createdAt')}
              >
                <div className="flex items-center">
                  <span>Registered</span>
                  {sortField === 'createdAt' && (
                    <span className="ml-1">
                      {sortDirection === 'asc' ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )}
                    </span>
                  )}
                </div>
              </th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredPatients.map((patient) => (
              <React.Fragment key={patient.id}>
                <tr className="group hover:bg-gray-50 transition-colors duration-150">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                        <User className="h-5 w-5 text-blue-600" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {patient.lastName}, {patient.firstName}
                        </div>
                        <div className="text-sm text-gray-500 capitalize">
                          {patient.gender}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                      <span className="text-sm text-gray-900">{patient.dateOfBirth}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm">
                      <div className="flex items-center">
                        <Mail className="h-4 w-4 text-gray-400 mr-2" />
                        <span className="text-gray-900">{patient.email}</span>
                      </div>
                      <div className="flex items-center mt-1">
                        <Phone className="h-4 w-4 text-gray-400 mr-2" />
                        <span className="text-gray-500">{patient.phone}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(patient.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => togglePatientDetails(patient.id)}
                      className="text-blue-600 hover:text-blue-900 transition-colors duration-150 flex items-center justify-end space-x-1"
                    >
                      <span>Details</span>
                      {expandedPatient === patient.id ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )}
                    </button>
                  </td>
                </tr>
                {expandedPatient === patient.id && (
                  <tr className="bg-gray-50">
                    <td colSpan={5} className="px-6 py-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <h3 className="font-medium text-gray-900 mb-2">Address</h3>
                          <p className="text-gray-500">{patient.address}</p>
                          <p className="text-gray-500">{patient.city}, {patient.state} {patient.zipCode}</p>
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900 mb-2">Insurance</h3>
                          {patient.insuranceProvider ? (
                            <>
                              <p className="text-gray-500">Provider: {patient.insuranceProvider}</p>
                              <p className="text-gray-500">Policy Number: {patient.insuranceNumber}</p>
                            </>
                          ) : (
                            <p className="text-gray-500">No insurance information provided</p>
                          )}
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900 mb-2">Emergency Contact</h3>
                          {patient.emergencyContact ? (
                            <>
                              <p className="text-gray-500">Name: {patient.emergencyContact}</p>
                              <p className="text-gray-500">Phone: {patient.emergencyPhone}</p>
                            </>
                          ) : (
                            <p className="text-gray-500">No emergency contact provided</p>
                          )}
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900 mb-2">Medical History</h3>
                          {patient.medicalHistory && patient.medicalHistory.length > 0 ? (
                            <ul className="list-disc list-inside text-gray-500">
                              {patient.medicalHistory.map((item) => (
                                <li key={item.id}>{item.condition} ({item.diagnosisDate})</li>
                              ))}
                            </ul>
                          ) : (
                            <p className="text-gray-500">No medical history recorded</p>
                          )}
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PatientList;