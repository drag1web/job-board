import { useEffect, useState, useMemo, useCallback } from 'react';
import { useJobsStore } from '../store/useJobsStore';
import { Link, useSearchParams } from 'react-router-dom';
import debounce from 'lodash/debounce';
import './JobList.css';

export default function JobList() {
  const { jobs, loading, error, fetchJobs } = useJobsStore();
  const [searchParams, setSearchParams] = useSearchParams();

  const [search, setSearch] = useState(searchParams.get('q') || '');
  const [searchInput, setSearchInput] = useState(search);
  const [typeFilter, setTypeFilter] = useState(searchParams.get('type') || '');
  const [locationFilter, setLocationFilter] = useState(searchParams.get('location') || '');
  const [tagsFilter, setTagsFilter] = useState(searchParams.get('tags') || '');
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'date');

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  useEffect(() => {
    const params: Record<string, string> = {};
    if (search) params.q = search;
    if (typeFilter) params.type = typeFilter;
    if (locationFilter) params.location = locationFilter;
    if (tagsFilter) params.tags = tagsFilter;
    if (sortBy) params.sort = sortBy;
    setSearchParams(params);
  }, [search, typeFilter, locationFilter, tagsFilter, sortBy, setSearchParams]);

  const debouncedSetSearch = useCallback(
    debounce((val: string) => setSearch(val), 300),
    []
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value);
    debouncedSetSearch(e.target.value);
  };

  const filteredJobs = useMemo(() => {
    return [...jobs]
      .filter(job =>
        job.title.toLowerCase().includes(search.toLowerCase()) ||
        job.company.toLowerCase().includes(search.toLowerCase())
      )
      .filter(job => (typeFilter ? job.type === typeFilter : true))
      .filter(job => (locationFilter ? job.location.toLowerCase().includes(locationFilter.toLowerCase()) : true))
      .filter(job => {
        if (!tagsFilter) return true;
        const tags = tagsFilter.split(',').map(t => t.trim().toLowerCase());
        return tags.every(tag => job.tags.map(t => t.toLowerCase()).includes(tag));
      })
      .sort((a, b) => {
        if (sortBy === 'date') return new Date(b.postedAt).getTime() - new Date(a.postedAt).getTime();
        if (sortBy === 'salary') return b.salaryFrom - a.salaryFrom;
        return 0;
      });
  }, [jobs, search, typeFilter, locationFilter, tagsFilter, sortBy]);

  if (loading) return <div className="job-list-loading">Загрузка вакансий...</div>;
  if (error) return <div className="job-list-error">Ой! Что-то пошло не так.</div>;

  return (
    <div className="job-list-container">
      <div className="job-list-header">
        <h1 className="job-list-title">Список вакансий</h1>
        <Link
          to="/jobs/new"
          className="job-create-btn"
        >
          + Создать вакансию
        </Link>
      </div>

      <div className="job-filters">
        <input
          type="text"
          value={searchInput}
          onChange={handleSearchChange}
          placeholder="Поиск по названию или компании"
        />
        <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)}>
          <option value="">Все типы</option>
          <option value="intern">Intern</option>
          <option value="full-time">Full-time</option>
        </select>
        <input
          type="text"
          value={locationFilter}
          onChange={e => setLocationFilter(e.target.value)}
          placeholder="Фильтр по локации"
        />
        <input
          type="text"
          value={tagsFilter}
          onChange={e => setTagsFilter(e.target.value)}
          placeholder="Фильтр по тегам (через запятую)"
        />
        <select value={sortBy} onChange={e => setSortBy(e.target.value)}>
          <option value="date">Сначала новые</option>
          <option value="salary">По зарплате</option>
        </select>
        <button onClick={() => {
          setSearch('');
          setSearchInput('');
          setTypeFilter('');
          setLocationFilter('');
          setTagsFilter('');
          setSortBy('date');
        }}>Сбросить фильтры</button>
      </div>

      <div className="job-cards">
        {filteredJobs.length === 0 ? (
          <div className="no-jobs">Вакансий не найдено.</div>
        ) : (
          filteredJobs.map(job => (
            <Link to={`/jobs/${job.id}`} key={job.id} className="job-card">
              <div className="job-header">
                <h2>{job.title}</h2>
                <span className={`job-type ${job.type}`}>{job.type}</span>
              </div>
              <p className="job-location">📍 {job.location}</p>
              <p className="job-company">{job.company}</p>
              <div className="job-tags">
                {job.tags.map(tag => <span key={tag} className="job-tag">{tag}</span>)}
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
