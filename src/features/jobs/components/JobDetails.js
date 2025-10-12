import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useJobsStore } from "../../../store/useJobsStore";
import "./JobDetails.css";
import toast from "react-hot-toast";
export default function JobDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { jobs, loading: jobsLoading, error, fetchJobs, deleteJob } = useJobsStore();
    const [job, setJob] = useState(null);
    const [loading, setLoading] = useState(true);
    const [deleting, setDeleting] = useState(false);
    useEffect(() => {
        async function loadJob() {
            setLoading(true);
            const delay = 300 + Math.random() * 500;
            await new Promise((resolve) => setTimeout(resolve, delay));
            if (jobs.length === 0)
                await fetchJobs();
            const found = useJobsStore.getState().jobs.find((j) => j.id === id) || null;
            setJob(found);
            setLoading(false);
        }
        loadJob();
    }, [jobs, fetchJobs, id]);
    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === "Escape")
                navigate("/");
        };
        window.addEventListener("keydown", handleEscape);
        return () => window.removeEventListener("keydown", handleEscape);
    }, [navigate]);
    const handleDelete = async () => {
        if (!id || deleting)
            return;
        const confirmed = window.confirm("Вы уверены, что хотите удалить эту вакансию?");
        if (!confirmed)
            return;
        setDeleting(true);
        try {
            await deleteJob(id);
            toast.success("Вакансия удалена!");
            navigate("/");
        }
        catch (err) {
            console.error(err);
            toast.error("Ошибка при удалении вакансии");
            setDeleting(false);
        }
    };
    const handleCopyLink = () => {
        navigator.clipboard.writeText(window.location.href);
        toast.success("Ссылка на вакансию скопирована!");
    };
    if (loading || jobsLoading)
        return _jsx("div", { className: "job-details-loading", children: "\u0417\u0430\u0433\u0440\u0443\u0437\u043A\u0430 \u0432\u0430\u043A\u0430\u043D\u0441\u0438\u0438..." });
    if (error)
        return _jsx("div", { className: "job-details-error", children: error });
    if (!job)
        return (_jsxs("div", { className: "job-details-notfound", children: ["\u0412\u0430\u043A\u0430\u043D\u0441\u0438\u044F \u043D\u0435 \u043D\u0430\u0439\u0434\u0435\u043D\u0430.", " ", _jsx(Link, { to: "/", className: "job-details-backlink", children: "\u2190 \u041D\u0430\u0437\u0430\u0434 \u043A \u0441\u043F\u0438\u0441\u043A\u0443" })] }));
    return (_jsxs("div", { className: "job-details-card", children: [_jsxs("div", { className: "job-details-top", children: [_jsx(Link, { to: "/", className: "job-details-backlink", children: "\u2190 \u041D\u0430\u0437\u0430\u0434 \u043A \u0441\u043F\u0438\u0441\u043A\u0443" }), _jsx("button", { className: "job-details-copy-btn", onClick: handleCopyLink, children: "\uD83D\uDCCB \u0421\u043A\u043E\u043F\u0438\u0440\u043E\u0432\u0430\u0442\u044C \u0441\u0441\u044B\u043B\u043A\u0443" })] }), _jsxs("div", { className: "job-details-header", children: [_jsx("h1", { className: "job-details-title", children: job.title }), _jsx("span", { className: `job-details-type ${job.type}`, children: job.type === "intern" ? "Intern" : "Full-time" })] }), _jsxs("div", { className: "job-details-company-info", children: [_jsxs("p", { className: "job-details-company", children: ["\uD83D\uDCBC ", job.company] }), _jsxs("p", { className: "job-details-location", children: ["\uD83D\uDCCD ", job.location] }), _jsxs("p", { className: "job-details-posted", children: ["\uD83D\uDDD3 \u041E\u043F\u0443\u0431\u043B\u0438\u043A\u043E\u0432\u0430\u043D\u043E: ", new Date(job.postedAt).toLocaleDateString()] })] }), _jsx("div", { className: "job-details-extra", children: _jsxs("p", { children: [_jsx("strong", { children: "\u0417\u0430\u0440\u043F\u043B\u0430\u0442\u0430:" }), " ", job.salaryFrom, " \u2013 ", job.salaryTo, " ", job.currency] }) }), job.tags?.length > 0 && (_jsx("div", { className: "job-details-tags", children: job.tags.map((tag, index) => (_jsx("span", { className: "job-details-tag", children: tag }, `${tag}-${index}`))) })), _jsxs("div", { className: "job-details-description", children: [_jsx("h2", { children: "\u041E\u043F\u0438\u0441\u0430\u043D\u0438\u0435 \u0432\u0430\u043A\u0430\u043D\u0441\u0438\u0438" }), _jsx("p", { children: job.description })] }), _jsxs("div", { className: "job-details-actions", children: [_jsx(Link, { to: `/jobs/${job.id}/edit`, className: "job-details-edit-btn", children: "\u0420\u0435\u0434\u0430\u043A\u0442\u0438\u0440\u043E\u0432\u0430\u0442\u044C" }), _jsx("button", { onClick: handleDelete, className: "job-details-delete-btn", disabled: deleting, children: deleting ? "Удаление..." : "Удалить" })] }), _jsxs("div", { className: "job-details-info-box", children: [_jsx("h3", { children: "\u0421\u043E\u0432\u0435\u0442 \u0441\u043E\u0438\u0441\u043A\u0430\u0442\u0435\u043B\u044E" }), _jsx("p", { children: "\u041F\u0435\u0440\u0435\u0434 \u043E\u0442\u043A\u043B\u0438\u043A\u043E\u043C \u0443\u0431\u0435\u0434\u0438\u0442\u0435\u0441\u044C, \u0447\u0442\u043E \u0432\u0430\u0448\u0435 \u0440\u0435\u0437\u044E\u043C\u0435 \u0430\u043A\u0442\u0443\u0430\u043B\u044C\u043D\u043E, \u0430 \u043D\u0430\u0432\u044B\u043A\u0438 \u0441\u043E\u043E\u0442\u0432\u0435\u0442\u0441\u0442\u0432\u0443\u044E\u0442 \u0442\u0440\u0435\u0431\u043E\u0432\u0430\u043D\u0438\u044F\u043C \u0432\u0430\u043A\u0430\u043D\u0441\u0438\u0438." })] })] }));
}
