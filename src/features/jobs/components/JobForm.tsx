import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import type { SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, useParams } from "react-router-dom";
import { useJobsStore } from "../../../store/useJobsStore";
import { Job } from "@features/jobs/jobs.model";
import "./JobForm.css";
import { v4 as uuidv4 } from "uuid";
import { z } from "zod";

const JobFormSchema = z.object({
  title: z.string().min(1),
  company: z.string().min(1),
  location: z.string().min(1),
  type: z.enum(["intern", "full-time"]),
  postedAt: z.string().min(1),
  salaryFrom: z.number().min(0),
  salaryTo: z.number().min(0),
  currency: z.string().min(1),
  tags: z.string().optional(),
  description: z.string().min(1),
});

type JobFormValues = z.infer<typeof JobFormSchema>;

export default function JobForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { jobs, addJob, updateJob } = useJobsStore();
  const [tagsPreview, setTagsPreview] = useState("");

  const jobToEdit = id ? jobs.find((j) => j.id === id) : undefined;

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isValid, isSubmitting },
  } = useForm<JobFormValues>({
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

  // Escape → главная
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") navigate("/");
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

  const onSubmit: SubmitHandler<JobFormValues> = async (data) => {
    const jobData: Job = {
      ...data,
      id: jobToEdit?.id || uuidv4(),
      tags: data.tags?.split(",").map((t) => t.trim()).filter(Boolean) || [],
      postedAt: jobToEdit ? data.postedAt : new Date().toISOString(),
    };

    if (jobToEdit) {
      await updateJob(jobData);
    } else {
      await addJob(jobData);
    }

    navigate("/");
    alert("Вакансия сохранена!");
  };

  const typeValue = watch("type");
  const salaryFrom = watch("salaryFrom");
  const salaryTo = watch("salaryTo");
  const currency = watch("currency");

  return (
    <div className="job-form-card mx-auto p-6 max-w-2xl shadow-lg rounded-lg bg-white">
      <h1 className="job-form-title mb-6">
        {jobToEdit ? "Редактировать вакансию" : "Создать вакансию"}
      </h1>
      <form onSubmit={handleSubmit(onSubmit)} className="job-form">
        <div className="job-form-back mb-4">
          <button
            type="button"
            className="job-form-back-btn"
            onClick={() => navigate(-1)}
          >
            ← Назад к списку
          </button>
        </div>

        <div className="job-form-field">
          <label className="job-form-label">Заголовок</label>
          <input {...register("title")} className="job-form-input" />
          {errors.title && <p className="job-form-error">{errors.title.message}</p>}
        </div>

        <div className="job-form-field">
          <label className="job-form-label">Компания</label>
          <input {...register("company")} className="job-form-input" />
          {errors.company && <p className="job-form-error">{errors.company.message}</p>}
        </div>

        <div className="job-form-field">
          <label className="job-form-label">Локация</label>
          <input {...register("location")} className="job-form-input" />
          {errors.location && <p className="job-form-error">{errors.location.message}</p>}
        </div>

        <div className="job-form-field">
          <label className="job-form-label">Тип вакансии</label>
          <select {...register("type")} className="job-form-input">
            <option value="intern">Intern</option>
            <option value="full-time">Full-time</option>
          </select>
          <span className={`job-type-preview ${typeValue}`}>
            {typeValue === "intern" ? "Intern" : "Full-time"}
          </span>
          {errors.type && <p className="job-form-error">{errors.type.message}</p>}
        </div>

        <div className="job-form-row">
          <div className="job-form-field">
            <label className="job-form-label">Зарплата от</label>
            <input
              type="number"
              {...register("salaryFrom", { valueAsNumber: true })}
              className="job-form-input"
            />
          </div>
          <div className="job-form-field">
            <label className="job-form-label">Зарплата до</label>
            <input
              type="number"
              {...register("salaryTo", { valueAsNumber: true })}
              className="job-form-input"
            />
          </div>
        </div>
        <div className="salary-preview">
          Диапазон: {salaryFrom} – {salaryTo} {currency}
        </div>

        <div className="job-form-field">
          <label className="job-form-label">Валюта</label>
          <input {...register("currency")} className="job-form-input" />
          {errors.currency && <p className="job-form-error">{errors.currency.message}</p>}
        </div>

        <div className="job-form-field">
          <label className="job-form-label">Теги (через запятую)</label>
          <input
            {...register("tags")}
            className="job-form-input"
            onChange={(e) => setTagsPreview(e.target.value)}
          />
          {tagsPreview && (
            <div className="tags-preview">
              {tagsPreview
                .split(",")
                .map((tag) => tag.trim())
                .filter(Boolean)
                .map((tag) => (
                  <span key={tag} className="job-tag">
                    {tag}
                  </span>
                ))}
            </div>
          )}
        </div>

        <div className="job-form-field">
          <label className="job-form-label">Дата публикации</label>
          <input
            type="text"
            value={jobToEdit ? jobToEdit.postedAt.split("T")[0] : new Date().toLocaleDateString()}
            readOnly
            className="job-form-input"
          />
        </div>

        <div className="job-form-field">
          <label className="job-form-label">Описание</label>
          <textarea
            {...register("description")}
            className="job-form-textarea"
            rows={5}
          />
          {errors.description && <p className="job-form-error">{errors.description.message}</p>}
        </div>

        <button
          type="submit"
          disabled={!isValid || isSubmitting}
          className="job-form-button"
        >
          Сохранить
        </button>
      </form>
    </div>
  );
}
