export type JobType = 'intern' | 'full-time';

export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  type: JobType;
  postedAt: string;
  salaryFrom: number;
  salaryTo: number;
  currency: string;
  tags: string[];
  description: string;
}

import { z } from 'zod';

export const JobSchema = z.object({
  id: z.string(),
  title: z.string().min(3, "Заголовок слишком короткий"),
  company: z.string().min(2, "Название компании слишком короткое"),
  location: z.string().min(2),
  type: z.enum(['intern', 'full-time']),
  postedAt: z.string().refine(
    (date) => !isNaN(Date.parse(date)),
    "Некорректная дата"
  ),
  salaryFrom: z.number().min(0),
  salaryTo: z.number().min(0),
  currency: z.string().length(3),
  tags: z.array(z.string()),
  description: z.string().min(5),
});

export type JobFormValues = z.infer<typeof JobSchema>;

