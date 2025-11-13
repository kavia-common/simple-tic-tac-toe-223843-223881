import React, { useEffect, useMemo, useState, useCallback } from 'react';
import './App.css';

/**
 * PUBLIC_INTERFACE
 * Square component represents a single cell in the Tic Tac Toe grid.
 * Accessible button with proper labels and focus outlines.
 */
function Square({ value, onClick, disabled, index }) {
  const label = useMemo(() => {
    const row = Math.floor(index / 3) + 1;
    const col = (index % 3) + 1;
    const cellState = value ? `occupied by ${value}` : 'empty';
    return `Row ${row}, Column ${col}, ${cellState}`;
  }, [index, value]);

  return (
    <button
      type="button"
      className="ttt-square"
      aria-label={label}
      aria-pressed={!!value}
      onClick={onClick}
      disabled={disabled}
    >
      <span aria-hidden="true">{value}</span>
    </button>
  );
}

/**
 * PUBLIC_INTERFACE
 * Board component renders the 3x3 grid of squares.
 */
function Board({ squares, onSquareClick, gameOver }) {
  return (
    <div
      className="ttt-board"
      role="grid"
      aria-label="Tic Tac Toe board 3 by 3"
    >
      {squares.map((val, idx) => (
        <div role="row" className="ttt-row" key={`row-${Math.floor(idx / 3)}`} aria-label={Math.floor(idx / 3) % 1 === 0 ? undefined : undefined}>
          {/* We render squares by row groups; CSS handles wrapping */}
          <Square
            key={idx}
            value={val}
            index={idx}
            onClick={() => onSquareClick(idx)}
            disabled={gameOver || Boolean(val)}
          />
        </div>
      ))}
    </div>
  );
}

/**
 * PUBLIC_INTERFACE
 * Calculates winner of current grid or returns null if no winner.
 * Also returns the winning line indices when available.
 */
function calculateWinner(squares) {
  /** This function checks all 8 winning lines and returns information if a winner exists. */
  const lines = [
    [0, 1, 2], // rows
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6], // columns
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8], // diagonals
    [2, 4, 6],
  ];
  for (const [a, b, c] of lines) {
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return { winner: squares[a], line: [a, b, c] };
    }
  }
  return null;
}

/**
 * PUBLIC_INTERFACE
 * Determines whether the board is full, indicating a draw if no winner.
 */
function isBoardFull(squares) {
  /** Returns true if all squares are filled (non-null). */
  return squares.every((s) => s !== null);
}

/**
 * PUBLIC_INTERFACE
 * Main App component: manages game state, renders layout and controls.
 * - Maintains board state, turn, and computes winner/draw
 * - Provides Reset button
 * - Accessible and responsive UI
 */
function App() {
  const [theme, setTheme] = useState('light');
  const [squares, setSquares] = useState(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);

  // Apply theme to document element
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const result = useMemo(() => calculateWinner(squares), [squares]);
  const winner = result?.winner || null;
  const draw = !winner && isBoardFull(squares);
  const nextPlayer = xIsNext ? 'X' : 'O';

  // PUBLIC_INTERFACE
  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  // PUBLIC_INTERFACE
  const handleSquareClick = useCallback(
    (index) => {
      // Prevent play if game over or square filled
      if (winner || squares[index]) return;

      setSquares((prev) => {
        if (prev[index]) return prev; // safety
        const next = prev.slice();
        next[index] = xIsNext ? 'X' : 'O';
        return next;
      });
      setXIsNext((prev) => !prev);
    },
    [winner, squares, xIsNext]
  );

  // PUBLIC_INTERFACE
  const resetGame = useCallback(() => {
    setSquares(Array(9).fill(null));
    setXIsNext(true);
  }, []);

  const statusText = winner
    ? `Winner: ${winner}`
    : draw
    ? 'Draw game!'
    : `Next player: ${nextPlayer}`;

  return (
    <div className="App">
      <header className="App-header">
        <button
          className="theme-toggle"
          onClick={toggleTheme}
          aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        >
          {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
        </button>

        <main className="ttt-container">
          <h1 className="ttt-title">Tic Tac Toe</h1>

          <div
            className="ttt-status"
            role="status"
            aria-live="polite"
            aria-atomic="true"
          >
            {statusText}
          </div>

          <div className="ttt-grid-wrapper">
            <div className={`ttt-grid ${winner ? 'game-over' : ''}`}>
              {Array.from({ length: 9 }).map((_, idx) => (
                <Square
                  key={idx}
                  value={squares[idx]}
                  index={idx}
                  onClick={() => handleSquareClick(idx)}
                  disabled={!!winner || !!squares[idx]}
                />
              ))}
            </div>
          </div>

          <div className="ttt-controls">
            <button
              type="button"
              className="ttt-btn"
              onClick={resetGame}
              aria-label="Start a new game"
            >
              New Game
            </button>
          </div>

          <footer className="ttt-footer">
            <small>Local 2-player game. No network required.</small>
          </footer>
        </main>
      </header>
    </div>
  );
}

export default App;
