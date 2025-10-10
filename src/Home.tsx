import { useJobsStore } from './store/useJobsStore';
import { useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import './Home.css';

export default function Home() {
  const { jobs, fetchJobs, loading } = useJobsStore();
  const [, setSearchParams] = useSearchParams();

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  const totalJobs = jobs.length;
  const fullTimeJobs = jobs.filter(j => j.type === 'full-time').length;
  const internJobs = jobs.filter(j => j.type === 'intern').length;
  const locations = Array.from(new Set(jobs.map(j => j.location)));
  const allTags = Array.from(new Set(jobs.flatMap(j => j.tags)));

  const handleTagClick = (tag: string) => {
    setSearchParams({ tags: tag });
  };

  return (
    <div className="home-container">
      {/* Hero Section */}
      <section className="home-hero">
        <h1>Добро пожаловать на Мини-доску вакансий!</h1>
        <p>Больше возможностей для вашей карьеры</p>
        <Link to="/jobs/new" className="home-hero-btn">
          Создать вакансию
        </Link>
      </section>

      {/* Stats Section */}
      <section className="home-stats">
        {[
          { value: totalJobs, label: 'Всего вакансий' },
          { value: fullTimeJobs, label: 'Full-time' },
          { value: internJobs, label: 'Intern' },
          { value: locations.length, label: 'Локаций' },
        ].map((stat, index) => (
          <div key={index} className="stat-card">
            <h2>{stat.value}</h2>
            <p>{stat.label}</p>
          </div>
        ))}
      </section>

      {/* Tags Section */}
      <section className="home-tags">
        <h3>Популярные теги:</h3>
        <div className="tags-container">
          {allTags.map(tag => (
            <button
              key={tag}
              className="tag-btn"
              onClick={() => handleTagClick(tag)}
            >
              {tag}
            </button>
          ))}
        </div>
      </section>

      {/* Latest Jobs Preview */}
      <section className="home-joblist-preview">
        <h3>Последние вакансии</h3>
        {loading ? (
          <div className="loader"></div>
        ) : (
          <div className="preview-cards">
            {jobs.slice(0, 4).map(job => (
              <Link
                key={job.id}
                to={`/jobs/${job.id}`}
                className="job-preview-card"
              >
                <h4>{job.title}</h4>
                <p>{job.company}</p>
                <span className={`job-type ${job.type}`}>{job.type}</span>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
