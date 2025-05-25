// This utility file handles storing and retrieving transaction data from localStorage

// Key for storing transactions in localStorage
const TRANSACTIONS_STORAGE_KEY = 'finance_tracker_transactions';
const MONTHLY_ALLOWANCE_KEY = 'finance_tracker_allowance';

// Get all transactions from localStorage
export const getTransactions = () => {
  try {
    const storedTransactions = localStorage.getItem(TRANSACTIONS_STORAGE_KEY);
    return storedTransactions ? JSON.parse(storedTransactions) : [];
  } catch (error) {
    console.error('Error retrieving transactions from localStorage:', error);
    return [];
  }
};

// Save transactions to localStorage
export const saveTransactions = (transactions) => {
  try {
    localStorage.setItem(TRANSACTIONS_STORAGE_KEY, JSON.stringify(transactions));
  } catch (error) {
    console.error('Error saving transactions to localStorage:', error);
  }
};

// Add a new transaction
export const addTransaction = (transaction) => {
  const transactions = getTransactions();
  const updatedTransactions = [...transactions, transaction];
  saveTransactions(updatedTransactions);
  return updatedTransactions;
};

// Delete a transaction by ID
export const deleteTransaction = (id) => {
  const transactions = getTransactions();
  const updatedTransactions = transactions.filter(transaction => transaction.id !== id);
  saveTransactions(updatedTransactions);
  return updatedTransactions;
};

// Get the monthly allowance
export const getMonthlyAllowance = () => {
  try {
    const storedAllowance = localStorage.getItem(MONTHLY_ALLOWANCE_KEY);
    const allowance = storedAllowance ? parseFloat(storedAllowance) : 1000;
    return isNaN(allowance) ? 1000 : allowance;  // Default to 1000 if invalid
  } catch (error) {
    console.error('Error retrieving monthly allowance from localStorage:', error);
    return 1000;  // Default value
  }
};

// Save the monthly allowance
export const saveMonthlyAllowance = (amount) => {
  try {
    localStorage.setItem(MONTHLY_ALLOWANCE_KEY, amount.toString());
  } catch (error) {
    console.error('Error saving monthly allowance to localStorage:', error);
  }
};