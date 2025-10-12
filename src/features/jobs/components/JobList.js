import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState, useMemo, useRef, useCallback } from "react";
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
    const [locationFilter, setLocationFilter] = useState(searchParams.get("location") || "");
    const [tagsFilter, setTagsFilter] = useState(searchParams.get("tags") || "");
    const [sortBy, setSortBy] = useState(searchParams.get("sort") || "date");
    const [currentPage, setCurrentPage] = useState(Number(searchParams.get("page")) || 1);
    const jobsPerPage = 8;
    const [loading, setLoading] = useState(true);
    const [focusedIndex, setFocusedIndex] = useState(null);
    const listRef = useRef(null);
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
        const params = {};
        if (search)
            params.q = search;
        if (typeFilter)
            params.type = typeFilter;
        if (locationFilter)
            params.location = locationFilter;
        if (tagsFilter)
            params.tags = tagsFilter;
        if (sortBy)
            params.sort = sortBy;
        if (currentPage > 1)
            params.page = String(currentPage);
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
    const debouncedSetSearch = useMemo(() => debounce((val) => setSearch(val), 300), []);
    useEffect(() => () => debouncedSetSearch.cancel(), [debouncedSetSearch]);
    const handleSearchChange = (e) => {
        setSearchInput(e.target.value);
        debouncedSetSearch(e.target.value);
        setCurrentPage(1);
    };
    const filteredJobs = useMemo(() => {
        return [...jobs]
            .filter((job) => job.title.toLowerCase().includes(search.toLowerCase()) ||
            job.company.toLowerCase().includes(search.toLowerCase()))
            .filter((job) => (typeFilter ? job.type === typeFilter : true))
            .filter((job) => locationFilter
            ? job.location.toLowerCase().includes(locationFilter.toLowerCase())
            : true)
            .filter((job) => {
            if (!tagsFilter)
                return true;
            const tags = tagsFilter
                .split(",")
                .map((t) => t.trim().toLowerCase())
                .filter(Boolean);
            return tags.every((filterTag) => job.tags.some((t) => t.toLowerCase().includes(filterTag)));
        })
            .sort((a, b) => {
            if (sortBy === "date")
                return (new Date(b.postedAt).getTime() - new Date(a.postedAt).getTime());
            if (sortBy === "salary")
                return b.salaryFrom - a.salaryFrom;
            return 0;
        });
    }, [jobs, search, typeFilter, locationFilter, tagsFilter, sortBy]);
    const totalPages = Math.ceil(filteredJobs.length / jobsPerPage);
    const startIndex = (currentPage - 1) * jobsPerPage;
    const paginatedJobs = filteredJobs.slice(startIndex, startIndex + jobsPerPage);
    const changePage = (page) => {
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
    const handleKeyDown = useCallback((e) => {
        if (paginatedJobs.length === 0)
            return;
        if (e.key === "ArrowDown") {
            e.preventDefault();
            setFocusedIndex((prev) => prev === null ? 0 : Math.min(prev + 1, paginatedJobs.length - 1));
        }
        if (e.key === "ArrowUp") {
            e.preventDefault();
            setFocusedIndex((prev) => (prev === null ? 0 : Math.max(prev - 1, 0)));
        }
        if (e.key === "Enter" || e.key === " ") {
            if (focusedIndex !== null) {
                const link = listRef.current?.querySelectorAll(".job-card")[focusedIndex];
                link?.click();
            }
        }
    }, [focusedIndex, paginatedJobs]);
    useEffect(() => {
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [handleKeyDown]);
    if (loading) {
        return (_jsx("div", { className: "job-list-container", children: Array.from({ length: jobsPerPage }).map((_, i) => (_jsx("div", { className: "skeleton-card" }, `skeleton-${i}`))) }));
    }
    if (error)
        return _jsx("div", { className: "job-list-error", children: "\u041E\u0439! \u0427\u0442\u043E-\u0442\u043E \u043F\u043E\u0448\u043B\u043E \u043D\u0435 \u0442\u0430\u043A." });
    return (_jsxs("div", { className: "job-list-container", ref: listRef, children: [_jsxs("div", { className: "job-list-header", children: [_jsxs("h1", { className: "job-list-title", children: ["\u0421\u043F\u0438\u0441\u043E\u043A \u0432\u0430\u043A\u0430\u043D\u0441\u0438\u0439 (", filteredJobs.length, ")"] }), _jsx(Link, { to: "/jobs/new", className: "job-create-btn", children: "+ \u0421\u043E\u0437\u0434\u0430\u0442\u044C \u0432\u0430\u043A\u0430\u043D\u0441\u0438\u044E" })] }), _jsxs("div", { className: "job-filters", children: [_jsx("input", { type: "text", value: searchInput, onChange: handleSearchChange, placeholder: "\u041F\u043E\u0438\u0441\u043A \u043F\u043E \u043D\u0430\u0437\u0432\u0430\u043D\u0438\u044E \u0438\u043B\u0438 \u043A\u043E\u043C\u043F\u0430\u043D\u0438\u0438" }), _jsxs("select", { value: typeFilter, onChange: (e) => {
                            setTypeFilter(e.target.value);
                            setCurrentPage(1);
                        }, children: [_jsx("option", { value: "", children: "\u0412\u0441\u0435 \u0442\u0438\u043F\u044B" }), _jsx("option", { value: "intern", children: "Intern" }), _jsx("option", { value: "full-time", children: "Full-time" })] }), _jsx("input", { type: "text", value: locationFilter, onChange: (e) => {
                            setLocationFilter(e.target.value);
                            setCurrentPage(1);
                        }, placeholder: "\u0424\u0438\u043B\u044C\u0442\u0440 \u043F\u043E \u043B\u043E\u043A\u0430\u0446\u0438\u0438" }), _jsx("input", { type: "text", value: tagsFilter, onChange: (e) => {
                            setTagsFilter(e.target.value);
                            setCurrentPage(1);
                        }, placeholder: "\u0424\u0438\u043B\u044C\u0442\u0440 \u043F\u043E \u0442\u0435\u0433\u0430\u043C (\u0447\u0435\u0440\u0435\u0437 \u0437\u0430\u043F\u044F\u0442\u0443\u044E)" }), _jsxs("select", { value: sortBy, onChange: (e) => {
                            setSortBy(e.target.value);
                            setCurrentPage(1);
                        }, children: [_jsx("option", { value: "date", children: "\u0421\u043D\u0430\u0447\u0430\u043B\u0430 \u043D\u043E\u0432\u044B\u0435" }), _jsx("option", { value: "salary", children: "\u041F\u043E \u0437\u0430\u0440\u043F\u043B\u0430\u0442\u0435" })] }), _jsx("button", { className: "reset-filters-btn", onClick: resetFilters, children: "\u0421\u0431\u0440\u043E\u0441\u0438\u0442\u044C \u0444\u0438\u043B\u044C\u0442\u0440\u044B" })] }), _jsx("div", { className: "job-cards", children: filteredJobs.length === 0 ? (_jsx("div", { className: "no-jobs", children: "\u0412\u0430\u043A\u0430\u043D\u0441\u0438\u0439 \u043D\u0435 \u043D\u0430\u0439\u0434\u0435\u043D\u043E." })) : (paginatedJobs.map((job, index) => (_jsxs(Link, { to: `/jobs/${job.id}`, className: `job-card ${focusedIndex === index ? "focused" : ""}`, tabIndex: 0, onFocus: () => setFocusedIndex(index), children: [_jsxs("div", { className: "job-header", children: [_jsx("h2", { children: job.title }), _jsx("span", { className: `job-type ${job.type}`, children: job.type })] }), _jsxs("p", { className: "job-location", children: ["\uD83D\uDCCD ", job.location] }), _jsxs("p", { className: "job-company", children: ["\uD83D\uDCBC ", job.company] }), _jsxs("p", { className: "job-salary", children: ["\uD83D\uDCB0 ", job.salaryFrom, " \u2013 ", job.salaryTo, " ", job.currency] }), _jsx("div", { className: "job-tags", children: job.tags.map((tag, i) => (_jsx("span", { className: "job-tag", children: tag }, `${tag}-${i}`))) })] }, `${job.id}-${index}`)))) }), totalPages > 1 && (_jsxs("div", { className: "pagination", children: [_jsx("button", { disabled: currentPage === 1, onClick: () => changePage(currentPage - 1), children: "\u2190 \u041D\u0430\u0437\u0430\u0434" }), _jsxs("span", { children: ["\u0421\u0442\u0440\u0430\u043D\u0438\u0446\u0430 ", currentPage, " \u0438\u0437 ", totalPages] }), _jsx("button", { disabled: currentPage === totalPages, onClick: () => changePage(currentPage + 1), children: "\u0412\u043F\u0435\u0440\u0451\u0434 \u2192" })] }))] }));
}
