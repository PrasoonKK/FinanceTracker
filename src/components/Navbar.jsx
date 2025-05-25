import React from 'react';
import { Link, useLocation } from 'react-router-dom';

function Navbar() {
  const location = useLocation();

  return (
    <nav className="bg-blue-600 text-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0 font-bold text-xl">
            <Link to="/">Finance Tracker</Link>
          </div>
          <div className="flex space-x-4">
            <Link
              to="/"
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                location.pathname === '/' ? 'bg-blue-700' : 'hover:bg-blue-500'
              }`}
            >
              Home
            </Link>
            <Link
              to="/add"
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                location.pathname === '/add' ? 'bg-blue-700' : 'hover:bg-blue-500'
              }`}
            >
              Add Transaction
            </Link>
            <Link
              to="/view"
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                location.pathname === '/view' ? 'bg-blue-700' : 'hover:bg-blue-500'
              }`}
            >
              View Expenditure
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;