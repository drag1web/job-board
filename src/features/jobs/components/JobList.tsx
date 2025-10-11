import { useEffect, useState, useMemo, useRef } from "react";
import { useJobsStore } from "../../../store/useJobsStore";
import { Link, useSearchParams } from "react-router-dom";
import debounce from "lodash/debounce";
import "./JobList.css";

export default function JobList() {
  const { jobs, error, fetchJobs } = useJobsStore();
  const [searchParams, setSearchParams] = useSearchParams();

  const [search, setSearch] = useState(searchParams.get("q") || "");
  const [searchInput, setSearchInput] = useState(search);
  const [typeFilter, setTypeFilter] = useState(searchParams.get("type") || "");
  const [locationFilter, setLocationFilter] = useState(
    searchParams.get("location") || ""
  );
  const [tagsFilter, setTagsFilter] = useState(searchParams.get("tags") || "");
  const [sortBy, setSortBy] = useState(searchParams.get("sort") || "date");
  const [currentPage, setCurrentPage] = useState(
    Number(searchParams.get("page")) || 1
  );
  const jobsPerPage = 8;

  const [loading, setLoading] = useState(true);

  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function loadJobs() {
      setLoading(true);
      await new Promise((res) => setTimeout(res, 500 + Math.random() * 300));
      await fetchJobs();
      setLoading(false);
    }
    loadJobs();
  }, [fetchJobs]);

  useEffect(() => {
    const params: Record<string, string> = {};
    if (search) params.q = search;
    if (typeFilter) params.type = typeFilter;
    if (locationFilter) params.location = locationFilter;
    if (tagsFilter) params.tags = tagsFilter;
    if (sortBy) params.sort = sortBy;
    if (currentPage > 1) params.page = String(currentPage);
    setSearchParams(params);
  }, [
    search,
    typeFilter,
    locationFilter,
    tagsFilter,
    sortBy,
    currentPage,
    setSearchParams,
  ]);

  const debouncedSetSearch = useMemo(
    () => debounce((val: string) => setSearch(val), 300),
    []
  );

  useEffect(() => () => debouncedSetSearch.cancel(), [debouncedSetSearch]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value);
    debouncedSetSearch(e.target.value);
    setCurrentPage(1);
  };

  const filteredJobs = useMemo(() => {
    return [...jobs]
      .filter(
        (job) =>
          job.title.toLowerCase().includes(search.toLowerCase()) ||
          job.company.toLowerCase().includes(search.toLowerCase())
      )
      .filter((job) => (typeFilter ? job.type === typeFilter : true))
      .filter((job) =>
        locationFilter
          ? job.location.toLowerCase().includes(locationFilter.toLowerCase())
          : true
      )
      .filter((job) => {
        if (!tagsFilter) return true;
        const tags = tagsFilter.split(",").map((t) => t.trim().toLowerCase());
        return tags.every((tag) =>
          job.tags.map((t) => t.toLowerCase()).includes(tag)
        );
      })
      .sort((a, b) => {
        if (sortBy === "date")
          return (
            new Date(b.postedAt).getTime() - new Date(a.postedAt).getTime()
          );
        if (sortBy === "salary") return b.salaryFrom - a.salaryFrom;
        return 0;
      });
  }, [jobs, search, typeFilter, locationFilter, tagsFilter, sortBy]);

  const totalPages = Math.ceil(filteredJobs.length / jobsPerPage);
  const startIndex = (currentPage - 1) * jobsPerPage;
  const paginatedJobs = filteredJobs.slice(
    startIndex,
    startIndex + jobsPerPage
  );

  const changePage = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const resetFilters = () => {
    setSearch("");
    setSearchInput("");
    setTypeFilter("");
    setLocationFilter("");
    setTagsFilter("");
    setSortBy("date");
    setCurrentPage(1);
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (paginatedJobs.length === 0) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setFocusedIndex((prev) =>
        prev === null ? 0 : Math.min(prev + 1, paginatedJobs.length - 1)
      );
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      setFocusedIndex((prev) =>
        prev === null ? 0 : Math.max(prev - 1, 0)
      );
    }
    if (e.key === "Enter" || e.key === " ") {
      if (focusedIndex !== null) {
        const link = listRef.current?.querySelectorAll<HTMLAnchorElement>(
          ".job-card"
        )[focusedIndex];
        link?.click();
      }
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [focusedIndex, paginatedJobs]);

  if (loading) {
    return (
      <div className="job-list-container">
        {Array.from({ length: jobsPerPage }).map((_, i) => (
          <div key={i} className="skeleton-card" />
        ))}
      </div>
    );
  }

  if (error)
    return <div className="job-list-error">Ой! Что-то пошло не так.</div>;

  return (
    <div className="job-list-container" ref={listRef}>
      <div className="job-list-header">
        <h1 className="job-list-title">
          Список вакансий ({filteredJobs.length})
        </h1>
        <Link to="/jobs/new" className="job-create-btn">
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
        <select
          value={typeFilter}
          onChange={(e) => {
            setTypeFilter(e.target.value);
            setCurrentPage(1);
          }}
        >
          <option value="">Все типы</option>
          <option value="intern">Intern</option>
          <option value="full-time">Full-time</option>
        </select>
        <input
          type="text"
          value={locationFilter}
          onChange={(e) => {
            setLocationFilter(e.target.value);
            setCurrentPage(1);
          }}
          placeholder="Фильтр по локации"
        />
        <input
          type="text"
          value={tagsFilter}
          onChange={(e) => {
            setTagsFilter(e.target.value);
            setCurrentPage(1);
          }}
          placeholder="Фильтр по тегам (через запятую)"
        />
        <select
          value={sortBy}
          onChange={(e) => {
            setSortBy(e.target.value);
            setCurrentPage(1);
          }}
        >
          <option value="date">Сначала новые</option>
          <option value="salary">По зарплате</option>
        </select>
        <button className="reset-filters-btn" onClick={resetFilters}>
          Сбросить фильтры
        </button>
      </div>

      <div className="job-cards">
        {filteredJobs.length === 0 ? (
          <div className="no-jobs">Вакансий не найдено.</div>
        ) : (
          paginatedJobs.map((job, index) => (
            <Link
              to={`/jobs/${job.id}`}
              key={job.id}
              className={`job-card ${focusedIndex === index ? "focused" : ""}`}
              tabIndex={0}
              onFocus={() => setFocusedIndex(index)}
            >
              <div className="job-header">
                <h2>{job.title}</h2>
                <span className={`job-type ${job.type}`}>{job.type}</span>
              </div>
              <p className="job-location">📍 {job.location}</p>
              <p className="job-company">💼 {job.company}</p>
              <p className="job-salary">
                💰 {job.salaryFrom} – {job.salaryTo} {job.currency}
              </p>
              <div className="job-tags">
                {job.tags.map((tag) => (
                  <span key={tag} className="job-tag">
                    {tag}
                  </span>
                ))}
              </div>
            </Link>
          ))
        )}
      </div>

      {totalPages > 1 && (
        <div className="pagination">
          <button
            disabled={currentPage === 1}
            onClick={() => changePage(currentPage - 1)}
          >
            ← Назад
          </button>
          <span>
            Страница {currentPage} из {totalPages}
          </span>
          <button
            disabled={currentPage === totalPages}
            onClick={() => changePage(currentPage + 1)}
          >
            Вперёд →
          </button>
        </div>
      )}
    </div>
  );
}
