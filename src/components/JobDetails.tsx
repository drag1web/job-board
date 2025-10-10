import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useJobsStore } from '../store/useJobsStore';
import type { Job } from '../models/Job';
import './JobDetails.css';

export default function JobDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { jobs, loading, error, fetchJobs, deleteJob } = useJobsStore();
  const [job, setJob] = useState<Job | null>(null);

  useEffect(() => {
    if (jobs.length === 0) {
      fetchJobs();
    } else if (id) {
      const found = jobs.find(j => j.id === id) || null;
      setJob(found);
    }
  }, [jobs, fetchJobs, id]);

  const handleDelete = async () => {
    if (!id) return;
    if (confirm('Вы уверены, что хотите удалить эту вакансию?')) {
      await deleteJob(id);
      navigate('/');
    }
  };

  if (loading) return <div className="job-details-loading">Загрузка вакансии...</div>;
  if (error) return <div className="job-details-error">{error}</div>;
  if (!job) return (
    <div className="job-details-notfound">
      Вакансия не найдена. <Link to="/" className="job-details-backlink">Назад к списку</Link>
    </div>
  );

  return (
    <div className="job-details-card">
      <Link to="/" className="job-details-backlink">← Назад к списку</Link>

      <h1 className="job-details-title">{job.title}</h1>
      <p className="job-details-company">{job.company}</p>
      <p className="job-details-location">{job.location}</p>

      <span className={`job-details-type ${job.type}`}>{job.type}</span>

      <p className="job-details-salary">{job.salaryFrom} – {job.salaryTo} {job.currency}</p>

      <div className="job-details-tags">
        {job.tags.map(tag => (
          <span key={tag} className="job-details-tag">{tag}</span>
        ))}
      </div>

      <p className="job-details-description">{job.description}</p>

      <div className="job-details-actions">
        <Link
          to={`/jobs/${job.id}/edit`}
          className="job-details-edit-btn"
        >
          Редактировать
        </Link>
        <button
          onClick={handleDelete}
          className="job-details-delete-btn"
        >
          Удалить
        </button>
      </div>
    </div>
  );
}
