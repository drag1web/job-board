import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import JobList from "../features/jobs/components/JobList";
import JobDetails from "../features/jobs/components/JobDetails";
import JobForm from "../features/jobs/components/JobForm";
import Header from "../components/Header";
import "./App.css";
export default function App() {
    return (_jsx(Router, { children: _jsxs("div", { className: "min-h-screen bg-gray-100 transition-colors duration-300", children: [_jsx(Header, {}), _jsx("main", { className: "p-4", children: _jsxs(Routes, { children: [_jsx(Route, { path: "/", element: _jsx(JobList, {}) }), _jsx(Route, { path: "/jobs/:id", element: _jsx(JobDetails, {}) }), _jsx(Route, { path: "/jobs/:id/edit", element: _jsx(JobForm, {}) }), _jsx(Route, { path: "/jobs/new", element: _jsx(JobForm, {}) })] }) }), _jsx(Toaster, { position: "top-right", toastOptions: {
                        duration: 3000,
                        style: {
                            background: "#333",
                            color: "#fff",
                            borderRadius: "10px",
                            padding: "12px 16px",
                        },
                        success: {
                            iconTheme: {
                                primary: "#4ade80",
                                secondary: "#1a1a1a",
                            },
                        },
                        error: {
                            iconTheme: {
                                primary: "#ef4444",
                                secondary: "#1a1a1a",
                            },
                        },
                    } })] }) }));
}
