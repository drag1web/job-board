import { create } from 'zustand';
import type { Job } from '../models/Job';
import { JobSchema } from '../models/Job';


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
    description: 'Work on UI components and tests.'
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
    description: 'Build dashboards with charts.'
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
    description: 'Improve accessibility and forms.'
  }
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
      await sleep(500 + Math.random() * 300);
      const jobs = loadJobs();
      set({ jobs });
    } catch {
      set({ error: 'Не удалось загрузить вакансии' });
    } finally {
      set({ loading: false });
    }
  },

  addJob: async (job: Job) => {
    set({ loading: true, error: null });
    await sleep(300 + Math.random() * 200);
    const jobs = [...get().jobs, JobSchema.parse(job)];
    saveJobs(jobs);
    set({ jobs, loading: false });
  },

  updateJob: async (job: Job) => {
    set({ loading: true, error: null });
    await sleep(300 + Math.random() * 200);
    const jobs = get().jobs.map(j => (j.id === job.id ? JobSchema.parse(job) : j));
    saveJobs(jobs);
    set({ jobs, loading: false });
  },

  deleteJob: async (id: string) => {
    set({ loading: true, error: null });
    await sleep(300 + Math.random() * 200);
    const jobs = get().jobs.filter(j => j.id !== id);
    saveJobs(jobs);
    set({ jobs, loading: false });
  }
}));
