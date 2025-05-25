import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import AddTransaction from './pages/AddTransaction';
import ViewTransactions from './pages/ViewTransactions';
import { TransactionProvider } from './context/TransactionContext';

function App() {
  return (
    <Router>
      <TransactionProvider>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <div className="container mx-auto px-4 py-8">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/add" element={<AddTransaction />} />
              <Route path="/view" element={<ViewTransactions />} />
            </Routes>
          </div>
        </div>
      </TransactionProvider>
    </Router>
  );
}

export default App;