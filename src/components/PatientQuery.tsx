import React, { useState } from 'react';
import { useDatabase } from '../context/DatabaseContext';
import { Database, Play, Copy, Search, Check } from 'lucide-react';

const PatientQuery: React.FC = () => {
  const { executeQuery, isInitialized } = useDatabase();
  const [query, setQuery] = useState<string>('SELECT * FROM patients');
  const [results, setResults] = useState<any[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  const handleQuerySubmit = async () => {
    if (!query.trim()) return;
    
    try {
      setIsLoading(true);
      setError(null);
      const queryResults = await executeQuery(query);
      setResults(queryResults);
    } catch (err) {
      console.error('Query execution error:', err);
      setError(err instanceof Error ? err.message : String(err));
      setResults(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyToClipboard = () => {
    if (!results) return;
    
    try {
      const json = JSON.stringify(results, null, 2);
      navigator.clipboard.writeText(json);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy to clipboard:', err);
    }
  };

  const handleSampleQuery = (sampleQuery: string) => {
    setQuery(sampleQuery);
  };

  const sampleQueries = [
    {
      name: 'List All Patients',
      query: 'SELECT * FROM patients'
    },
    {
      name: 'Count Patients',
      query: 'SELECT COUNT(*) as patientCount FROM patients'
    },
    {
      name: 'Find by Last Name',
      query: "SELECT data FROM patients WHERE json_extract(data, '$.lastName') LIKE '%Doe%'"
    },
    {
      name: 'Patients by State',
      query: "SELECT json_extract(data, '$.firstName') as firstName, json_extract(data, '$.lastName') as lastName, json_extract(data, '$.state') as state FROM patients ORDER BY state"
    }
  ];

  if (!isInitialized) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-2">
            <Database className="h-6 w-6 text-blue-500" />
          </div>
          <p className="text-gray-500">Initializing database...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-800 flex items-center">
          <Database className="mr-2 h-5 w-5 text-blue-500" />
          SQL Query Tool
        </h2>
        <p className="text-gray-500 mt-1">Execute SQL queries against your patient database.</p>
      </div>

      <div className="p-6">
        <div className="mb-4">
          <label htmlFor="query" className="block text-sm font-medium text-gray-700 mb-2">
            SQL Query
          </label>
          <div className="relative">
            <textarea
              id="query"
              rows={4}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 font-mono text-sm"
              placeholder="Enter SQL query..."
            />
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Sample Queries
          </label>
          <div className="flex flex-wrap gap-2">
            {sampleQueries.map((sample, index) => (
              <button
                key={index}
                className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 hover:bg-blue-200 transition-colors duration-150"
                onClick={() => handleSampleQuery(sample.query)}
              >
                <Search className="mr-1 h-3 w-3" />
                {sample.name}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between">
          <button
            onClick={handleQuerySubmit}
            disabled={isLoading || !query.trim()}
            className={`${
              isLoading || !query.trim() ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
            } py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-150 ease-in-out flex items-center`}
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Executing...
              </>
            ) : (
              <>
                <Play className="mr-2 h-4 w-4" />
                Execute Query
              </>
            )}
          </button>

          {results && results.length > 0 && (
            <button
              onClick={handleCopyToClipboard}
              className="ml-2 inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              {copied ? (
                <>
                  <Check className="mr-2 h-4 w-4 text-green-500" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="mr-2 h-4 w-4" />
                  Copy Results
                </>
              )}
            </button>
          )}
        </div>

        {error && (
          <div className="mt-4 bg-red-50 border-l-4 border-red-500 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">
                  {error}
                </p>
              </div>
            </div>
          </div>
        )}

        {results && results.length > 0 && (
          <div className="mt-6 border rounded-lg overflow-hidden">
            <div className="px-4 py-3 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-sm font-medium text-gray-700">
                Query Results ({results.length} {results.length === 1 ? 'row' : 'rows'})
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    {Object.keys(results[0]).map((key) => (
                      <th
                        key={key}
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        {key}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {results.map((row, rowIndex) => (
                    <tr key={rowIndex} className="hover:bg-gray-50">
                      {Object.entries(row).map(([key, value], colIndex) => (
                        <td
                          key={`${rowIndex}-${colIndex}`}
                          className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                        >
                          {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {results && results.length === 0 && (
          <div className="mt-6 border rounded-md p-6 text-center bg-gray-50">
            <Search className="h-8 w-8 text-gray-400 mx-auto mb-2" />
            <h3 className="text-sm font-medium text-gray-500">No results found</h3>
            <p className="text-xs text-gray-400 mt-1">Try a different query or check your syntax</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PatientQuery;