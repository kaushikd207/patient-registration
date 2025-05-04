import React from 'react';
import { Home, BarChart2, Users, Settings, HelpCircle, LogOut } from 'lucide-react';

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
}

const NavItem: React.FC<NavItemProps> = ({ icon, label, active }) => {
  return (
    <li className={`group mb-1 ${active ? 'text-white' : 'text-gray-400 hover:text-white'}`}>
      <a
        href="#"
        className={`flex items-center px-4 py-3 rounded-lg transition-colors duration-150 ${
          active ? 'bg-indigo-600' : 'hover:bg-gray-700/50'
        }`}
      >
        <span className="mr-3">{icon}</span>
        <span className="font-medium">{label}</span>
        {active && (
          <span className="ml-auto h-2 w-2 rounded-full bg-white animate-pulse"></span>
        )}
      </a>
    </li>
  );
};

const Sidebar: React.FC = () => {
  return (
    <aside className="hidden md:flex flex-col w-64 bg-gray-800 text-white">
      <div className="p-5">
        <h1 className="text-2xl font-bold flex items-center">
          <BarChart2 className="mr-2 h-7 w-7 text-indigo-400" />
          Dashboard
        </h1>
      </div>
      <nav className="flex-1 px-2 py-4">
        <ul>
          <NavItem icon={<Home size={20} />} label="Overview" active />
          <NavItem icon={<BarChart2 size={20} />} label="Analytics" />
          <NavItem icon={<Users size={20} />} label="Customers" />
          <NavItem icon={<Settings size={20} />} label="Settings" />
        </ul>
      </nav>
      <div className="p-4 border-t border-gray-700">
        <ul>
          <NavItem icon={<HelpCircle size={20} />} label="Help & Support" />
          <NavItem icon={<LogOut size={20} />} label="Log Out" />
        </ul>
      </div>
    </aside>
  );
};

export default Sidebar;