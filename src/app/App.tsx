import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import JobList from "../features/jobs/components/JobList";
import JobDetails from "../features/jobs/components/JobDetails";
import JobForm from "../features/jobs/components/JobForm";
import Header from '../components/Header';
import './App.css';

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100 transition-colors duration-300">
        <Header /> 
        <main className="p-4">
          <Routes>
            <Route path="/" element={<JobList />} />
            <Route path="/jobs/:id" element={<JobDetails />} />
            <Route path="/jobs/:id/edit" element={<JobForm />} />
            <Route path="/jobs/new" element={<JobForm />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}
