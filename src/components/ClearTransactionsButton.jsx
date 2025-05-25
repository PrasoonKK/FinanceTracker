import React, { useState, useContext } from 'react';
import { TransactionContext } from '../context/TransactionContext';

function ClearTransactionsButton() {
  const [isConfirming, setIsConfirming] = useState(false);
  const { clearAllTransactions } = useContext(TransactionContext);

  const handleConfirm = () => {
    clearAllTransactions();
    setIsConfirming(false);
  };

  const handleCancel = () => {
    setIsConfirming(false);
  };

  if (isConfirming) {
    return (
      <div className="flex items-center space-x-2">
        <span className="text-sm text-red-600">Are you sure?</span>
        <button 
          onClick={handleConfirm}
          className="text-sm bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700"
        >
          Yes
        </button>
        <button 
          onClick={handleCancel}
          className="text-sm bg-gray-300 text-gray-800 px-2 py-1 rounded hover:bg-gray-400"
        >
          No
        </button>
      </div>
    );
  }

  return (
    <button 
      onClick={() => setIsConfirming(true)}
      className="text-red-600 hover:text-red-800"
    >
      Clear All
    </button>
  );
}

export default ClearTransactionsButton;