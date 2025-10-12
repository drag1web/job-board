import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useJobsStore } from "../../store/useJobsStore";
describe('useJobsStore', () => {
    beforeEach(() => {
        localStorage.clear();
    });
    it('fetchJobs загружает вакансии', async () => {
        const { result } = renderHook(() => useJobsStore());
        expect(result.current.jobs).toHaveLength(0);
        expect(result.current.loading).toBe(false);
        expect(result.current.error).toBeNull();
        await act(async () => {
            await result.current.fetchJobs();
        });
        expect(result.current.jobs.length).toBeGreaterThan(0);
        expect(result.current.loading).toBe(false);
        expect(result.current.error).toBeNull();
    });
    it('addJob добавляет вакансию', async () => {
        const { result } = renderHook(() => useJobsStore());
        const newJob = {
            id: 'test-id',
            title: 'Test Job',
            company: 'Acme',
            location: 'Remote',
            type: 'full-time',
            postedAt: new Date().toISOString(),
            salaryFrom: 1000,
            salaryTo: 1500,
            currency: 'USD',
            tags: ['react'],
            description: 'Test description'
        };
        await act(async () => {
            await result.current.addJob(newJob);
        });
        const added = result.current.jobs.find(j => j.id === 'test-id');
        expect(added).toEqual(newJob);
    });
    it('deleteJob удаляет вакансию', async () => {
        const { result } = renderHook(() => useJobsStore());
        await act(async () => {
            await result.current.fetchJobs();
        });
        const jobId = result.current.jobs[0].id;
        await act(async () => {
            await result.current.deleteJob(jobId);
        });
        const deleted = result.current.jobs.find(j => j.id === jobId);
        expect(deleted).toBeUndefined();
    });
});
