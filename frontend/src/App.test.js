import { render, screen } from '@testing-library/react';
import App from './App';

test('renders header with application title', () => {
  render(<App />);
  const titleElement = screen.getByText(/Minhas Finanças/i);
  expect(titleElement).toBeInTheDocument();
});
