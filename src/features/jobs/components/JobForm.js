import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, useParams } from "react-router-dom";
import { useJobsStore } from "../../../store/useJobsStore";
import "./JobForm.css";
import { v4 as uuidv4 } from "uuid";
import { z } from "zod";
import toast from "react-hot-toast";
const JobFormSchema = z.object({
    title: z.string().min(3, { message: "Заголовок слишком короткий (мин. 3 символа)" }),
    company: z.string().min(2, { message: "Введите название компании" }),
    location: z.string().min(2, { message: "Введите локацию" }),
    type: z.enum(["intern", "full-time"]),
    postedAt: z.string().min(1, { message: "Укажите дату публикации" }),
    salaryFrom: z.number().min(0, { message: "Зарплата не может быть отрицательной" }),
    salaryTo: z.number().min(0, { message: "Зарплата не может быть отрицательной" }),
    currency: z.string().min(1, { message: "Введите валюту" }),
    tags: z.string().optional(),
    description: z.string().min(10, { message: "Описание должно быть не менее 10 символов" }),
});
export default function JobForm() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { jobs, addJob, updateJob } = useJobsStore();
    const [tagsPreview, setTagsPreview] = useState("");
    const jobToEdit = id ? jobs.find((j) => j.id === id) : undefined;
    const { register, handleSubmit, reset, watch, formState: { errors, isValid, isSubmitting }, } = useForm({
        resolver: zodResolver(JobFormSchema),
        mode: "onChange",
        defaultValues: jobToEdit
            ? {
                ...jobToEdit,
                tags: jobToEdit.tags.join(", "),
                postedAt: jobToEdit.postedAt.split("T")[0],
            }
            : {
                title: "",
                company: "",
                location: "",
                type: "intern",
                postedAt: new Date().toISOString().split("T")[0],
                salaryFrom: 0,
                salaryTo: 0,
                currency: "EUR",
                tags: "",
                description: "",
            },
    });
    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === "Escape")
                navigate("/");
        };
        window.addEventListener("keydown", handleEscape);
        return () => window.removeEventListener("keydown", handleEscape);
    }, [navigate]);
    useEffect(() => {
        if (jobToEdit) {
            reset({
                ...jobToEdit,
                postedAt: jobToEdit.postedAt.split("T")[0],
                tags: jobToEdit.tags.join(", "),
            });
            setTagsPreview(jobToEdit.tags.join(", "));
        }
    }, [jobToEdit, reset]);
    const onSubmit = async (data) => {
        try {
            const jobData = {
                ...data,
                id: jobToEdit?.id || uuidv4(),
                tags: data.tags?.split(",").map((t) => t.trim()).filter(Boolean) || [],
                postedAt: jobToEdit ? data.postedAt : new Date().toISOString(),
            };
            if (jobToEdit) {
                await updateJob(jobData);
                toast.success("Вакансия обновлена!");
            }
            else {
                await addJob(jobData);
                toast.success("Вакансия создана!");
            }
            navigate("/");
        }
        catch (error) {
            console.error(error);
            toast.error("Произошла ошибка при сохранении вакансии.");
        }
    };
    const typeValue = watch("type");
    const salaryFrom = watch("salaryFrom");
    const salaryTo = watch("salaryTo");
    const currency = watch("currency");
    return (_jsxs("div", { className: "job-form-card mx-auto p-6 max-w-2xl shadow-lg rounded-lg bg-white", children: [_jsx("h1", { className: "job-form-title mb-6", children: jobToEdit ? "Редактировать вакансию" : "Создать вакансию" }), _jsxs("form", { onSubmit: handleSubmit(onSubmit), className: "job-form", children: [_jsx("div", { className: "job-form-back mb-4", children: _jsx("button", { type: "button", className: "job-form-back-btn", onClick: () => navigate(-1), children: "\u2190 \u041D\u0430\u0437\u0430\u0434 \u043A \u0441\u043F\u0438\u0441\u043A\u0443" }) }), _jsxs("div", { className: "job-form-field", children: [_jsx("label", { className: "job-form-label", children: "\u0417\u0430\u0433\u043E\u043B\u043E\u0432\u043E\u043A" }), _jsx("input", { ...register("title"), className: `job-form-input ${errors.title ? "input-error" : ""}` }), errors.title && _jsx("p", { className: "job-form-error", children: errors.title.message })] }), _jsxs("div", { className: "job-form-field", children: [_jsx("label", { className: "job-form-label", children: "\u041A\u043E\u043C\u043F\u0430\u043D\u0438\u044F" }), _jsx("input", { ...register("company"), className: `job-form-input ${errors.company ? "input-error" : ""}` }), errors.company && _jsx("p", { className: "job-form-error", children: errors.company.message })] }), _jsxs("div", { className: "job-form-field", children: [_jsx("label", { className: "job-form-label", children: "\u041B\u043E\u043A\u0430\u0446\u0438\u044F" }), _jsx("input", { ...register("location"), className: `job-form-input ${errors.location ? "input-error" : ""}` }), errors.location && _jsx("p", { className: "job-form-error", children: errors.location.message })] }), _jsxs("div", { className: "job-form-field", children: [_jsx("label", { className: "job-form-label", children: "\u0422\u0438\u043F \u0432\u0430\u043A\u0430\u043D\u0441\u0438\u0438" }), _jsxs("select", { ...register("type"), className: `job-form-input ${errors.type ? "input-error" : ""}`, children: [_jsx("option", { value: "intern", children: "Intern" }), _jsx("option", { value: "full-time", children: "Full-time" })] }), _jsx("span", { className: `job-type-preview ${typeValue}`, children: typeValue === "intern" ? "Intern" : "Full-time" }), errors.type && _jsx("p", { className: "job-form-error", children: errors.type.message })] }), _jsxs("div", { className: "job-form-row", children: [_jsxs("div", { className: "job-form-field", children: [_jsx("label", { className: "job-form-label", children: "\u0417\u0430\u0440\u043F\u043B\u0430\u0442\u0430 \u043E\u0442" }), _jsx("input", { type: "number", ...register("salaryFrom", { valueAsNumber: true }), className: `job-form-input ${errors.salaryFrom ? "input-error" : ""}` }), errors.salaryFrom && _jsx("p", { className: "job-form-error", children: errors.salaryFrom.message })] }), _jsxs("div", { className: "job-form-field", children: [_jsx("label", { className: "job-form-label", children: "\u0417\u0430\u0440\u043F\u043B\u0430\u0442\u0430 \u0434\u043E" }), _jsx("input", { type: "number", ...register("salaryTo", { valueAsNumber: true }), className: `job-form-input ${errors.salaryTo ? "input-error" : ""}` }), errors.salaryTo && _jsx("p", { className: "job-form-error", children: errors.salaryTo.message })] })] }), _jsxs("div", { className: "salary-preview", children: ["\u0414\u0438\u0430\u043F\u0430\u0437\u043E\u043D: ", salaryFrom, " \u2013 ", salaryTo, " ", currency] }), _jsxs("div", { className: "job-form-field", children: [_jsx("label", { className: "job-form-label", children: "\u0412\u0430\u043B\u044E\u0442\u0430" }), _jsx("input", { ...register("currency"), className: `job-form-input ${errors.currency ? "input-error" : ""}` }), errors.currency && _jsx("p", { className: "job-form-error", children: errors.currency.message })] }), _jsxs("div", { className: "job-form-field", children: [_jsx("label", { className: "job-form-label", children: "\u0422\u0435\u0433\u0438 (\u0447\u0435\u0440\u0435\u0437 \u0437\u0430\u043F\u044F\u0442\u0443\u044E)" }), _jsx("input", { ...register("tags"), className: "job-form-input", onChange: (e) => setTagsPreview(e.target.value) }), tagsPreview && (_jsx("div", { className: "tags-preview", children: tagsPreview
                                    .split(",")
                                    .map((tag) => tag.trim())
                                    .filter(Boolean)
                                    .map((tag) => (_jsx("span", { className: "job-tag", children: tag }, tag))) }))] }), _jsxs("div", { className: "job-form-field", children: [_jsx("label", { className: "job-form-label", children: "\u0414\u0430\u0442\u0430 \u043F\u0443\u0431\u043B\u0438\u043A\u0430\u0446\u0438\u0438" }), _jsx("input", { type: "text", value: jobToEdit ? jobToEdit.postedAt.split("T")[0] : new Date().toLocaleDateString(), readOnly: true, className: "job-form-input" })] }), _jsxs("div", { className: "job-form-field", children: [_jsx("label", { className: "job-form-label", children: "\u041E\u043F\u0438\u0441\u0430\u043D\u0438\u0435" }), _jsx("textarea", { ...register("description"), className: `job-form-textarea ${errors.description ? "input-error" : ""}`, rows: 5 }), errors.description && _jsx("p", { className: "job-form-error", children: errors.description.message })] }), _jsx("button", { type: "submit", disabled: !isValid || isSubmitting, className: "job-form-button", children: "\u0421\u043E\u0445\u0440\u0430\u043D\u0438\u0442\u044C" })] })] }));
}
