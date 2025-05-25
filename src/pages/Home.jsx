import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { TransactionContext } from '../context/TransactionContext';
import ClearTransactionsButton from '../components/ClearTransactionsButton';

function Home() {
  const { transactions } = useContext(TransactionContext);
  
  // Get recent transactions (last 3)
  const recentTransactions = [...transactions]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 3);
  
  // Calculate total spending for the current month
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const monthlySpending = transactions
    .filter(t => new Date(t.date) >= startOfMonth)
    .reduce((total, t) => total + t.amount, 0);

  return (
    <div className="space-y-8">
      <div className="text-center py-8">
        <h1 className="text-4xl font-bold text-blue-700 mb-2">Personal Finance Tracker</h1>
        <p className="text-xl text-gray-600">Track, analyze, and manage your expenses easily</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link to="/add" className="bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition-colors">
          <div className="p-6 flex flex-col items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            <h2 className="text-2xl font-bold mb-2">Add New Transaction</h2>
            <p className="text-center">Record your expenses and income easily</p>
          </div>
        </Link>

        <Link to="/view" className="bg-green-600 text-white rounded-lg shadow-md hover:bg-green-700 transition-colors">
          <div className="p-6 flex flex-col items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <h2 className="text-2xl font-bold mb-2">Check Expenditure</h2>
            <p className="text-center">View, analyze, and understand your spending habits</p>
          </div>
        </Link>
      </div>

      {transactions.length > 0 && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Recent Transactions</h2>
            <div className="flex space-x-4">
              <ClearTransactionsButton />
              <Link to="/view" className="text-blue-600 hover:text-blue-800">View All</Link>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {recentTransactions.map((transaction) => {
                  const date = new Date(transaction.date);
                  const formattedDate = date.toLocaleDateString();
                  
                  return (
                    <tr key={transaction.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formattedDate}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{transaction.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{transaction.category}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">${transaction.amount.toFixed(2)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div className="bg-blue-50 p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-4">This Month's Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-md shadow">
            <h3 className="text-sm text-gray-500 font-medium">Total Spent</h3>
            <p className="text-2xl font-bold text-blue-600">${monthlySpending.toFixed(2)}</p>
          </div>
          <div className="bg-white p-4 rounded-md shadow">
            <h3 className="text-sm text-gray-500 font-medium">Transactions</h3>
            <p className="text-2xl font-bold text-blue-600">
              {transactions.filter(t => new Date(t.date) >= startOfMonth).length}
            </p>
          </div>
          <div className="bg-white p-4 rounded-md shadow">
            <h3 className="text-sm text-gray-500 font-medium">Average Transaction</h3>
            <p className="text-2xl font-bold text-blue-600">
              ${transactions.filter(t => new Date(t.date) >= startOfMonth).length > 0 
                ? (monthlySpending / transactions.filter(t => new Date(t.date) >= startOfMonth).length).toFixed(2) 
                : '0.00'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;