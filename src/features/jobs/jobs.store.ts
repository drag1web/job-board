import { create } from 'zustand';
import type { Job } from './jobs.model';
import { JobSchema } from './jobs.model';

const LOCAL_STORAGE_KEY = 'jobs_data';
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const initialJobs: Job[] = [
  {
    id: '1',
    title: 'Frontend Intern',
    company: 'Acme',
    location: 'Stockholm',
    type: 'intern',
    postedAt: '2025-09-15T09:30:00.000Z',
    salaryFrom: 1200,
    salaryTo: 1600,
    currency: 'EUR',
    tags: ['react', 'typescript', 'css'],
    description: 'Work on UI components and tests.',
  },
  {
    id: '2',
    title: 'Junior Frontend',
    company: 'Globex',
    location: 'Remote',
    type: 'full-time',
    postedAt: '2025-08-28T12:00:00.000Z',
    salaryFrom: 2500,
    salaryTo: 3200,
    currency: 'EUR',
    tags: ['react', 'zustand', 'vite'],
    description: 'Build dashboards with charts.',
  },
  {
    id: '3',
    title: 'UI Intern',
    company: 'Initech',
    location: 'Prague',
    type: 'intern',
    postedAt: '2025-09-30T10:15:00.000Z',
    salaryFrom: 1100,
    salaryTo: 1500,
    currency: 'EUR',
    tags: ['react', 'a11y'],
    description: 'Improve accessibility and forms.',
  },
];

const loadJobs = (): Job[] => {
  const data = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (data) {
    try {
      const parsed = JSON.parse(data) as Job[];
      return parsed.map(job => JobSchema.parse(job));
    } catch {
      localStorage.removeItem(LOCAL_STORAGE_KEY);
    }
  }
  return initialJobs;
};

const saveJobs = (jobs: Job[]) => {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(jobs));
};

interface JobsState {
  jobs: Job[];
  loading: boolean;
  error: string | null;
  fetchJobs: () => Promise<void>;
  addJob: (job: Job) => Promise<void>;
  updateJob: (job: Job) => Promise<void>;
  deleteJob: (id: string) => Promise<void>;
}

export const useJobsStore = create<JobsState>((set, get) => ({
  jobs: [],
  loading: false,
  error: null,
  fetchJobs: async () => {
    set({ loading: true, error: null });
    try {
      await sleep(400 + Math.random() * 300);
      const jobs = loadJobs();
      set({ jobs });
    } catch {
      set({ error: 'Не удалось загрузить вакансии' });
    } finally {
      set({ loading: false });
    }
  },
  addJob: async (job: Job) => {
    const optimisticJob = { ...JobSchema.parse(job), id: Date.now().toString() };
    const prevJobs = get().jobs;
    set({ jobs: [optimisticJob, ...prevJobs] });
    saveJobs([optimisticJob, ...prevJobs]);

    try {
      await sleep(300 + Math.random() * 200);
      if (Math.random() < 0.1) throw new Error('Random fail');

      const validated = JobSchema.parse(optimisticJob);
      const jobs = [validated, ...prevJobs];
      saveJobs(jobs);
      set({ jobs });
    } catch {
      set({ jobs: prevJobs, error: 'Ошибка при создании вакансии' });
      saveJobs(prevJobs);
    }
  },

  updateJob: async (job: Job) => {
    const prevJobs = get().jobs;
    const updated = JobSchema.parse(job);
    set({
      jobs: prevJobs.map(j => (j.id === job.id ? updated : j)),
    });
    saveJobs(get().jobs);

    try {
      await sleep(300 + Math.random() * 200);
      if (Math.random() < 0.1) throw new Error('Random fail');
    } catch {
      set({ jobs: prevJobs, error: 'Ошибка при обновлении вакансии' });
      saveJobs(prevJobs);
    }
  },
  deleteJob: async (id: string) => {
    const prevJobs = get().jobs;
    const updatedJobs = prevJobs.filter(j => j.id !== id);
    set({ jobs: updatedJobs });
    saveJobs(updatedJobs);

    try {
      await sleep(300 + Math.random() * 200);
      if (Math.random() < 0.1) throw new Error('Random fail');
    } catch {
      set({ jobs: prevJobs, error: 'Ошибка при удалении вакансии' });
      saveJobs(prevJobs);
    }
  },
}));
