import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';

test('renders Tic Tac Toe title and can place X on first move', () => {
  render(<App />);
  expect(screen.getByText(/Tic Tac Toe/i)).toBeInTheDocument();
  const buttons = screen.getAllByRole('button');
  // Find a board square (not the theme or new game button) by aria-label including Row 1, Column 1
  const firstSquare = screen.getByLabelText(/Row 1, Column 1/i);
  fireEvent.click(firstSquare);
  expect(firstSquare).toHaveTextContent('X');
});
