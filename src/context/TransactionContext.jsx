import React, { createContext, useState, useEffect } from 'react';
import { getTransactions, saveTransactions, getMonthlyAllowance, saveMonthlyAllowance } from '../utils/localStorage';

export const TransactionContext = createContext();

export const TransactionProvider = ({ children }) => {
  const [transactions, setTransactions] = useState([]);
  const [monthlyAllowance, setMonthlyAllowanceState] = useState(1000); // Default value
  const [isLoading, setIsLoading] = useState(true);

  // Load transactions from localStorage on initial render
  useEffect(() => {
    const loadTransactions = () => {
      const storedTransactions = getTransactions();
      const storedAllowance = getMonthlyAllowance();
      
      setTransactions(storedTransactions);
      setMonthlyAllowanceState(storedAllowance);
      setIsLoading(false);
    };
    
    loadTransactions();
  }, []);

  // Add a new transaction
  const addTransaction = (transaction) => {
    const updatedTransactions = [...transactions, transaction];
    setTransactions(updatedTransactions);
    saveTransactions(updatedTransactions);
  };

  // Delete a transaction
  const deleteTransaction = (id) => {
    const updatedTransactions = transactions.filter(transaction => transaction.id !== id);
    setTransactions(updatedTransactions);
    saveTransactions(updatedTransactions);
  };

  // Update monthly allowance
  const setMonthlyAllowance = (amount) => {
    setMonthlyAllowanceState(amount);
    saveMonthlyAllowance(amount);
  };

  // Calculate spending for a specific period
  const calculateSpending = (period) => {
    const now = new Date();
    let startDate;
    
    switch (period) {
      case 'day':
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        break;
      case 'week':
        const day = now.getDay();
        startDate = new Date(now);
        startDate.setDate(startDate.getDate() - day);
        startDate.setHours(0, 0, 0, 0);
        break;
      case 'month':
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
      default:
        startDate = new Date(0); // All time
    }
    
    return transactions
      .filter(t => new Date(t.date) >= startDate)
      .reduce((sum, t) => sum + t.amount, 0);
  };

  // Group transactions by category for a specified period
  const getSpendingByCategory = (period) => {
    const now = new Date();
    let startDate;
    
    switch (period) {
      case 'day':
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        break;
      case 'week':
        const day = now.getDay();
        startDate = new Date(now);
        startDate.setDate(startDate.getDate() - day);
        startDate.setHours(0, 0, 0, 0);
        break;
      case 'month':
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
      default:
        startDate = new Date(0); // All time
    }
    
    return transactions
      .filter(t => new Date(t.date) >= startDate)
      .reduce((acc, t) => {
        if (!acc[t.category]) {
          acc[t.category] = 0;
        }
        acc[t.category] += t.amount;
        return acc;
      }, {});
  };

  // Clear all transactions
  const clearAllTransactions = () => {
    setTransactions([]);
    saveTransactions([]);
  };

  return (
    <TransactionContext.Provider
      value={{
        transactions,
        addTransaction,
        deleteTransaction,
        clearAllTransactions,
        monthlyAllowance,
        setMonthlyAllowance,
        calculateSpending,
        getSpendingByCategory,
        isLoading
      }}
    >
      {children}
    </TransactionContext.Provider>
  );
};