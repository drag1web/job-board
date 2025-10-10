import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import JobList from '../JobList';

describe('JobList', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('отображает список вакансий после загрузки', async () => {
    render(
      <BrowserRouter>
        <JobList />
      </BrowserRouter>
    );

    // Проверяем текст загрузки
    expect(screen.getByText(/Загрузка вакансий/i)).toBeInTheDocument();

    // Ждём появления вакансий
    await screen.findByText(/Frontend Intern/i);
  });

  it('фильтрует вакансии по поиску', async () => {
    render(
      <BrowserRouter>
        <JobList />
      </BrowserRouter>
    );

    // Ждём загрузки вакансий
    await screen.findByText(/Frontend Intern/i);

    const searchInput = screen.getByPlaceholderText(/Поиск по названию или компании/i);
    await userEvent.type(searchInput, 'Globex');

    // Проверяем результаты фильтрации
    await screen.findByText(/Junior Frontend/i);
    expect(screen.queryByText(/Frontend Intern/i)).toBeNull();
  });
});
