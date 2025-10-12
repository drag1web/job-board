import { jsx as _jsx } from "react/jsx-runtime";
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import JobList from '../../features/jobs/components/JobList';
describe('JobList', () => {
    it('отображает список вакансий после загрузки', async () => {
        render(_jsx(BrowserRouter, { children: _jsx(JobList, {}) }));
        const firstJob = await screen.findByText(/Frontend Intern/i);
        const secondJob = await screen.findByText(/Junior Frontend/i);
        expect(firstJob).toBeInTheDocument();
        expect(secondJob).toBeInTheDocument();
    });
    it('фильтрует вакансии по поиску', async () => {
        render(_jsx(BrowserRouter, { children: _jsx(JobList, {}) }));
        await screen.findByText(/Frontend Intern/i);
        await screen.findByText(/Junior Frontend/i);
        const searchInput = screen.getByPlaceholderText(/Поиск по названию или компании/i);
        await userEvent.clear(searchInput);
        await userEvent.type(searchInput, 'Globex');
        await waitFor(() => {
            expect(screen.queryByText(/Frontend Intern/i)).toBeNull();
        });
        expect(screen.getByText(/Junior Frontend/i)).toBeInTheDocument();
    });
});
