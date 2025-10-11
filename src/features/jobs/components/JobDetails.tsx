import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useJobsStore } from "../../../store/useJobsStore";
import { Job } from "@features/jobs/jobs.model";
import "./JobDetails.css";

export default function JobDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { jobs, loading: jobsLoading, error, fetchJobs, deleteJob } = useJobsStore();

  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [deleting, setDeleting] = useState<boolean>(false);

  useEffect(() => {
    async function loadJob() {
      setLoading(true);
      const delay = 300 + Math.random() * 500;
      await new Promise((resolve) => setTimeout(resolve, delay));

      if (jobs.length === 0) await fetchJobs();

      const found = useJobsStore.getState().jobs.find((j) => j.id === id) || null;
      setJob(found);
      setLoading(false);
    }
    loadJob();
  }, [jobs, fetchJobs, id]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") navigate("/");
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [navigate]);

  const handleDelete = async () => {
    if (!id || deleting) return;
    if (!confirm("Вы уверены, что хотите удалить эту вакансию?")) return;

    setDeleting(true);
    try {
      await deleteJob(id);
      navigate("/");
    } catch (err) {
      console.error(err);
      setDeleting(false);
      alert("Ошибка при удалении вакансии");
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    alert("Ссылка на вакансию скопирована!");
  };

  if (loading || jobsLoading) return <div className="job-details-loading">Загрузка вакансии...</div>;
  if (error) return <div className="job-details-error">{error}</div>;
  if (!job)
    return (
      <div className="job-details-notfound">
        Вакансия не найдена.{" "}
        <Link to="/" className="job-details-backlink">
          ← Назад к списку
        </Link>
      </div>
    );

  return (
    <div className="job-details-card">
      <div className="job-details-top">
        <Link to="/" className="job-details-backlink">
          ← Назад к списку
        </Link>
        <button className="job-details-copy-btn" onClick={handleCopyLink}>
          📋 Скопировать ссылку
        </button>
      </div>

      <div className="job-details-header">
        <h1 className="job-details-title">{job.title}</h1>
        <span className={`job-details-type ${job.type}`}>
          {job.type === "intern" ? "Intern" : "Full-time"}
        </span>
      </div>

      <div className="job-details-company-info">
        <p className="job-details-company">💼 {job.company}</p>
        <p className="job-details-location">📍 {job.location}</p>
        <p className="job-details-posted">
          🗓 Опубликовано: {new Date(job.postedAt).toLocaleDateString()}
        </p>
      </div>

      <div className="job-details-extra">
        <p>
          <strong>Зарплата:</strong> {job.salaryFrom} – {job.salaryTo} {job.currency}
        </p>
      </div>

      {job.tags?.length > 0 && (
        <div className="job-details-tags">
          {job.tags.map((tag, index) => (
            <span key={`${tag}-${index}`} className="job-details-tag">
              {tag}
            </span>
          ))}
        </div>
      )}

      <div className="job-details-description">
        <h2>Описание вакансии</h2>
        <p>{job.description}</p>
      </div>

      <div className="job-details-actions">
        <Link to={`/jobs/${job.id}/edit`} className="job-details-edit-btn">
          Редактировать
        </Link>
        <button
          onClick={handleDelete}
          className="job-details-delete-btn"
          disabled={deleting}
        >
          {deleting ? "Удаление..." : "Удалить"}
        </button>
      </div>

      <div className="job-details-info-box">
        <h3>Совет соискателю</h3>
        <p>
          Перед откликом убедитесь, что ваше резюме актуально, а навыки соответствуют требованиям вакансии.
        </p>
      </div>
    </div>
  );
}
