import React, { useContext, useEffect, useState } from 'react';
import { TransactionContext } from '../context/TransactionContext';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';

ChartJS.register(ArcElement, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function Dashboard({ timeFrame }) {
  const { transactions, monthlyAllowance, setMonthlyAllowance } = useContext(TransactionContext);
  const [allowanceInput, setAllowanceInput] = useState(monthlyAllowance.toString());
  const [editingAllowance, setEditingAllowance] = useState(false);

  useEffect(() => {
    setAllowanceInput(monthlyAllowance.toString());
  }, [monthlyAllowance]);

  // Filter transactions based on time frame
  const filteredTransactions = React.useMemo(() => {
    if (!timeFrame || timeFrame === 'all') {
      return transactions;
    }

    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    if (timeFrame === 'today') {
      return transactions.filter(t => new Date(t.date) >= startOfToday);
    }
    
    if (timeFrame === 'week') {
      const startOfWeek = new Date(now);
      startOfWeek.setDate(now.getDate() - now.getDay()); // Start of week (Sunday)
      startOfWeek.setHours(0, 0, 0, 0);
      return transactions.filter(t => new Date(t.date) >= startOfWeek);
    }
    
    if (timeFrame === 'month') {
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      return transactions.filter(t => new Date(t.date) >= startOfMonth);
    }
    
    return transactions;
  }, [transactions, timeFrame]);

  // Calculate spending by category
  const spendingByCategory = filteredTransactions.reduce((acc, transaction) => {
    const { category, amount } = transaction;
    if (!acc[category]) {
      acc[category] = 0;
    }
    acc[category] += amount;
    return acc;
  }, {});

  // Calculate total spending
  const totalSpending = filteredTransactions.reduce((total, transaction) => total + transaction.amount, 0);

  // Prepare data for pie chart
  const pieData = {
    labels: Object.keys(spendingByCategory),
    datasets: [
      {
        data: Object.values(spendingByCategory),
        backgroundColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
          '#4BC0C0',
          '#9966FF',
          '#FF9F40',
          '#8AC926',
          '#1982C4'
        ],
      },
    ],
  };

  // Prepare data for bar chart (daily spending over last 7 days)
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - i);
    return date;
  }).reverse();

  const dailySpending = last7Days.map(day => {
    const startOfDay = new Date(day.getFullYear(), day.getMonth(), day.getDate());
    const endOfDay = new Date(day.getFullYear(), day.getMonth(), day.getDate() + 1);
    
    return transactions
      .filter(t => {
        const transactionDate = new Date(t.date);
        return transactionDate >= startOfDay && transactionDate < endOfDay;
      })
      .reduce((total, t) => total + t.amount, 0);
  });

  const barData = {
    labels: last7Days.map(day => day.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })),
    datasets: [
      {
        label: 'Daily Spending',
        data: dailySpending,
        backgroundColor: 'rgba(54, 162, 235, 0.5)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
      },
    ],
  };

  const barOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Daily Spending (Last 7 Days)',
      },
    },
  };

  // Monthly allowance tracking
  const today = new Date();
  const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
  const daysPassed = today.getDate();
  const daysRemaining = daysInMonth - daysPassed;

  // Calculate monthly spending (only transactions from current month)
  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const monthlySpending = transactions
    .filter(t => new Date(t.date) >= startOfMonth)
    .reduce((total, t) => total + t.amount, 0);

  const allowanceRemaining = monthlyAllowance - monthlySpending;
  const dailyBudget = allowanceRemaining / (daysRemaining || 1); // Avoid division by zero

  // Handle saving new allowance
  const handleSaveAllowance = () => {
    const newAllowance = parseFloat(allowanceInput);
    if (!isNaN(newAllowance) && newAllowance >= 0) {
      setMonthlyAllowance(newAllowance);
    } else {
      setAllowanceInput(monthlyAllowance.toString());
    }
    setEditingAllowance(false);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Monthly Allowance</h2>
          {editingAllowance ? (
            <div className="flex items-center space-x-2">
              <input
                type="number"
                className="border rounded-md px-2 py-1 w-24"
                value={allowanceInput}
                onChange={(e) => setAllowanceInput(e.target.value)}
                min="0"
                step="0.01"
              />
              <button
                onClick={handleSaveAllowance}
                className="bg-green-500 text-white px-3 py-1 rounded-md hover:bg-green-600"
              >
                Save
              </button>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <span className="font-semibold">${monthlyAllowance.toFixed(2)}</span>
              <button
                onClick={() => setEditingAllowance(true)}
                className="text-blue-500 hover:text-blue-700"
              >
                Edit
              </button>
            </div>
          )}
        </div>

        {/* Progress Bar */}
        <div className="mb-5">
          <div className="flex justify-between text-sm mb-1">
            <span className="font-medium">Monthly Allowance Progress</span>
            <span className="font-medium">
              ${Math.max(0, allowanceRemaining).toFixed(2)} remaining of ${monthlyAllowance.toFixed(2)}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-4 dark:bg-gray-700">
            {monthlySpending >= monthlyAllowance ? (
              <div className="bg-red-600 h-4 rounded-full w-full" style={{ width: '100%' }}></div>
            ) : (
              <div 
                className={`h-4 rounded-full ${monthlySpending / monthlyAllowance > 0.75 ? 'bg-yellow-500' : 'bg-green-500'}`}
                style={{ width: `${Math.min(100, (monthlySpending / monthlyAllowance) * 100)}%` }}
              ></div>
            )}
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-blue-50 p-4 rounded-md">
            <h3 className="text-sm text-blue-800 font-medium">Total Spent</h3>
            <p className="text-2xl font-bold text-blue-600">${monthlySpending.toFixed(2)}</p>
            <p className="text-sm text-blue-800">
              {((monthlySpending / monthlyAllowance) * 100).toFixed(0)}% of monthly allowance
            </p>
          </div>
          <div className="bg-green-50 p-4 rounded-md">
            <h3 className="text-sm text-green-800 font-medium">Remaining</h3>
            <p className="text-2xl font-bold text-green-600">${Math.max(0, allowanceRemaining).toFixed(2)}</p>
            <p className="text-sm text-green-800">For {daysRemaining} days remaining this month</p>
          </div>
          <div className="bg-purple-50 p-4 rounded-md">
            <h3 className="text-sm text-purple-800 font-medium">Daily Budget</h3>
            <p className="text-2xl font-bold text-purple-600">
              ${dailyBudget > 0 ? dailyBudget.toFixed(2) : '0.00'}
            </p>
            <p className="text-sm text-purple-800">
              {allowanceRemaining < 0 ? 'Budget exceeded' : 'Suggested daily budget'}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {Object.keys(spendingByCategory).length > 0 ? (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4">Spending by Category</h2>
            <div className="h-64">
              <Pie data={pieData} options={{ maintainAspectRatio: false }} />
            </div>
          </div>
        ) : (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4">Spending by Category</h2>
            <p className="text-gray-500 text-center h-64 flex items-center justify-center">
              No data available for the selected time frame
            </p>
          </div>
        )}

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4">Daily Spending Trend</h2>
          <div className="h-64">
            <Bar data={barData} options={{ ...barOptions, maintainAspectRatio: false }} />
          </div>
        </div>
      </div>

      {totalSpending > 0 && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4">Summary for Selected Period</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-gray-50 p-4 rounded-md">
              <h3 className="text-sm text-gray-600 font-medium">Total Spending</h3>
              <p className="text-2xl font-bold text-gray-800">${totalSpending.toFixed(2)}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-md">
              <h3 className="text-sm text-gray-600 font-medium">Transactions</h3>
              <p className="text-2xl font-bold text-gray-800">{filteredTransactions.length}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-md">
              <h3 className="text-sm text-gray-600 font-medium">Average Transaction</h3>
              <p className="text-2xl font-bold text-gray-800">
                ${(totalSpending / filteredTransactions.length).toFixed(2)}
              </p>
            </div>
            <div className="bg-gray-50 p-4 rounded-md">
              <h3 className="text-sm text-gray-600 font-medium">Top Category</h3>
              {Object.keys(spendingByCategory).length > 0 ? (
                <p className="text-2xl font-bold text-gray-800">
                  {Object.entries(spendingByCategory).sort((a, b) => b[1] - a[1])[0][0]}
                </p>
              ) : (
                <p className="text-2xl font-bold text-gray-800">N/A</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;