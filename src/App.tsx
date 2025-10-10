import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import JobList from './components/JobList';
import JobDetails from './components/JobDetails';
import JobForm from './components/JobForm'; 
import './App.css';

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <header className="bg-blue-600 text-white p-4 text-center text-2xl font-bold">
          Мини-доска вакансий
        </header>
        <Routes>
          <Route path="/" element={<JobList />} />
          <Route path="/jobs/:id" element={<JobDetails />} />
          <Route path="/jobs/:id/edit" element={<JobForm />} />
          <Route path="/jobs/new" element={<JobForm />} />        
        </Routes>
      </div>
    </Router>
  );
}
