import { useState } from "react";
import Header from "./components/layout/Header";
import Sidebar from "./components/layout/Sidebar";
import PatientRegistration from "./components/PatientRegistration";
import PatientList from "./components/PatientList";
import PatientQuery from "./components/PatientQuery";
import { DatabaseProvider } from "./context/DatabaseContext";
import { LayoutGrid as LayoutGroup, UserPlus, Database } from "lucide-react";

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"register" | "list" | "query">(
    "register"
  );

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const renderContent = () => {
    switch (activeTab) {
      case "register":
        return <PatientRegistration />;
      case "list":
        return <PatientList />;
      case "query":
        return <PatientQuery />;
      default:
        return <PatientRegistration />;
    }
  };

  return (
    <DatabaseProvider>
      <div className="min-h-screen bg-gray-100">
        <div className="flex h-screen overflow-hidden">
          <div className="flex-1 flex flex-col overflow-hidden">
            <Header />

            <main className="flex-1 overflow-y-auto bg-gray-100 p-4 md:p-6">
              {/* Navigation Tabs */}
              <div className="mb-6">
                <div className="flex flex-wrap border-b border-gray-200">
                  <button
                    className={`mr-4 py-4 px-1 text-sm font-medium border-b-2 ${
                      activeTab === "register"
                        ? "border-blue-500 text-blue-600"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    } focus:outline-none transition-colors duration-200 flex items-center`}
                    onClick={() => setActiveTab("register")}
                  >
                    <UserPlus className="mr-2 h-4 w-4" />
                    Register Patient
                  </button>
                  <button
                    className={`mr-4 py-4 px-1 text-sm font-medium border-b-2 ${
                      activeTab === "list"
                        ? "border-blue-500 text-blue-600"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    } focus:outline-none transition-colors duration-200 flex items-center`}
                    onClick={() => setActiveTab("list")}
                  >
                    <LayoutGroup className="mr-2 h-4 w-4" />
                    Patient Records
                  </button>
                  <button
                    className={`py-4 px-1 text-sm font-medium border-b-2 ${
                      activeTab === "query"
                        ? "border-blue-500 text-blue-600"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    } focus:outline-none transition-colors duration-200 flex items-center`}
                    onClick={() => setActiveTab("query")}
                  >
                    <Database className="mr-2 h-4 w-4" />
                    SQL Query Tool
                  </button>
                </div>
              </div>

              {/* Page Content */}
              <div className="animate-fadeIn">{renderContent()}</div>
            </main>

            {/* Footer */}
            <footer className="bg-white shadow-md px-4 py-3 text-center">
              <p className="text-sm text-gray-600">
                Patient Registration System · {new Date().getFullYear()}
              </p>
            </footer>
          </div>
        </div>
      </div>
    </DatabaseProvider>
  );
}

export default App;
