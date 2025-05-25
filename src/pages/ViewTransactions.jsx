import React, { useState } from 'react';
import TransactionList from '../components/TransactionList';
import Dashboard from '../components/Dashboard';

function ViewTransactions() {
  const [timeFrame, setTimeFrame] = useState('month');
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Expenditure Analysis</h1>

      {/* Time frame selector */}
      <div className="mb-6">
        <div className="bg-white shadow rounded-lg p-4">
          <h2 className="text-lg font-medium mb-3">Select Time Frame</h2>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setTimeFrame('today')}
              className={`px-4 py-2 rounded-md ${
                timeFrame === 'today'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Today
            </button>
            <button
              onClick={() => setTimeFrame('week')}
              className={`px-4 py-2 rounded-md ${
                timeFrame === 'week'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              This Week
            </button>
            <button
              onClick={() => setTimeFrame('month')}
              className={`px-4 py-2 rounded-md ${
                timeFrame === 'month'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              This Month
            </button>
            <button
              onClick={() => setTimeFrame('all')}
              className={`px-4 py-2 rounded-md ${
                timeFrame === 'all'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All Time
            </button>
          </div>
        </div>
      </div>

      {/* Tab navigation */}
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px space-x-8">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'dashboard'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Dashboard
            </button>
            <button
              onClick={() => setActiveTab('transactions')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'transactions'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Transactions List
            </button>
          </nav>
        </div>
      </div>

      {/* Tab content */}
      {activeTab === 'dashboard' ? (
        <Dashboard timeFrame={timeFrame} />
      ) : (
        <TransactionList timeFrame={timeFrame} />
      )}
    </div>
  );
}

export default ViewTransactions;