import React, { useState, useEffect } from "react";
import "./App.css";

// Color palette according to the requirements:
const themeColors = {
  primary: "#1976d2",    // Main blue for highlights/borders
  background: "#ffffff", // Board/cell background
  accent: "#388e3c",     // For win highlight or accents
  text: "#282c34",       // Main text
};

// PUBLIC_INTERFACE
function App() {
  // 3x3 Board state: Array of 9 'X', 'O', or null
  const [board, setBoard] = useState(Array(9).fill(null));
  // True: X's turn, False: O's turn
  const [xIsNext, setXIsNext] = useState(true);
  // Winner value: 'X', 'O', 'TIE', or null
  const [winner, setWinner] = useState(null);
  // Score: track games won
  const [score, setScore] = useState({ X: 0, O: 0 });
  // Theme state (dark mode reuses template logic)
  const [theme, setTheme] = useState('light');

  // Effect to update HTML theme, per starter template
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  // Effect to evaluate winner/tie after each board update
  useEffect(() => {
    const result = calculateWinner(board);
    if (result === "X" || result === "O") {
      setWinner(result);
      setScore((prev) => ({ ...prev, [result]: prev[result] + 1 }));
    } else if (result === "TIE") {
      setWinner("TIE");
    }
  }, [board]);

  // PUBLIC_INTERFACE
  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  // PUBLIC_INTERFACE
  function handleCellClick(idx) {
    if (board[idx] || winner) return; // Can't overwrite or play after win
    const nextBoard = board.slice();
    nextBoard[idx] = xIsNext ? "X" : "O";
    setBoard(nextBoard);
    setXIsNext(!xIsNext);
  }

  // PUBLIC_INTERFACE
  function handleRestart() {
    setBoard(Array(9).fill(null));
    setWinner(null);
    setXIsNext((lastX) =>
      winner === "TIE"
        ? lastX // keep same starter
        : winner // winner goes 2nd next
        ? winner === "X"
          ? false
          : true
        : lastX
    );
  }

  // Helper: message and next symbol
  let status;
  if (winner === "TIE") {
    status = "It's a tie!";
  } else if (winner === "X" || winner === "O") {
    status = `Player ${winner} wins! 🎉`;
  } else {
    status = `Turn: ${xIsNext ? "X" : "O"}`;
  }

  // Board render helper: calculate winning line for highlight
  const winLine = getWinningLine(board);

  return (
    <div className="App">
      <header className="App-header" style={{ background: "var(--bg-secondary)" }}>
        <button
          className="theme-toggle"
          onClick={toggleTheme}
          aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        >
          {theme === "light" ? "🌙 Dark" : "☀️ Light"}
        </button>
        <h1 style={{ color: themeColors.primary, marginBottom: "0.5em" }}>Tic Tac Toe</h1>
        <div style={{ display: "flex", gap: "2em", alignItems: "center", marginBottom: 16 }}>
          <ScoreBoard score={score} themeColors={themeColors} />
          <GameStatus status={status} next={xIsNext ? "X" : "O"} />
        </div>
        <Board
          board={board}
          onCellClick={handleCellClick}
          winningLine={winLine}
          winner={winner}
          themeColors={themeColors}
        />
        <button
          className="ttt-restart-btn"
          onClick={handleRestart}
          aria-label="Restart Game"
          style={{
            marginTop: "2em",
            padding: "0.5em 2em",
            background: themeColors.primary,
            color: "#fff",
            border: "none",
            borderRadius: 8,
            fontSize: "1.2rem",
            fontWeight: 600,
            cursor: "pointer",
            boxShadow: "0 2px 4px rgba(0,0,0,0.07)"
          }}
        >
          Restart
        </button>
        <div style={{ marginTop: 28, fontSize: "0.9em", color: "var(--text-secondary)" }}>
          Modern, responsive two-player Tic Tac Toe – made with React
        </div>
      </header>
    </div>
  );
}

// PUBLIC_INTERFACE
function ScoreBoard({ score, themeColors }) {
  return (
    <div
      style={{
        display: "flex",
        gap: 24,
        alignItems: "center",
        fontSize: "1.15rem",
        fontWeight: 500,
      }}
      aria-label="Scoreboard"
    >
      <span style={{ color: themeColors.primary }}>X: {score.X}</span>
      <span style={{ color: themeColors.accent }}>O: {score.O}</span>
    </div>
  );
}

// PUBLIC_INTERFACE
function GameStatus({ status }) {
  return (
    <div
      style={{
        fontWeight: 500,
        fontSize: "1.18rem",
        minWidth: 120,
        color: "var(--text-primary)"
      }}
      aria-live="polite"
      aria-atomic="true"
    >
      {status}
    </div>
  );
}

// PUBLIC_INTERFACE
function Board({ board, onCellClick, winningLine, winner, themeColors }) {
  // Inline style for responsive board
  return (
    <div
      className="ttt-board"
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gap: 0,
        width: "min(340px, 85vw)",
        aspectRatio: "1/1",
        margin: "0 auto",
        boxShadow: "0 6px 16px 2px rgba(25, 118, 210, 0.06)",
        borderRadius: 16,
        background: themeColors.background,
        border: `2px solid ${themeColors.primary}`,
        overflow: "hidden",
        userSelect: "none",
        touchAction: "manipulation"
      }}
      role="grid"
      aria-label="Tic Tac Toe Game Board"
    >
      {board.map((cell, idx) => (
        <Cell
          key={idx}
          value={cell}
          idx={idx}
          onClick={onCellClick}
          highlight={winningLine && winningLine.includes(idx)}
          isDisabled={cell !== null || winner !== null}
          themeColors={themeColors}
        />
      ))}
    </div>
  );
}

// PUBLIC_INTERFACE
function Cell({ value, idx, onClick, highlight, isDisabled, themeColors }) {
  return (
    <button
      className="ttt-cell"
      type="button"
      style={{
        width: "100%",
        height: "100%",
        fontSize: "2.9rem",
        fontWeight: "600",
        color: value === "X" ? themeColors.primary : themeColors.accent,
        background: highlight
          ? "rgba(56, 142, 60, 0.19)"
          : themeColors.background,
        border: `1.5px solid ${themeColors.primary}`,
        outline: highlight ? `2px solid ${themeColors.accent}` : "none",
        transition: "background 0.15s, outline 0.2s",
        cursor: isDisabled ? "default" : "pointer",
        borderRadius: 0,
        boxSizing: "border-box"
      }}
      tabIndex={0}
      aria-label={
        value
          ? `Player ${value}`
          : `Empty cell, click to play here`
      }
      aria-disabled={isDisabled}
      disabled={isDisabled}
      onClick={() => onClick(idx)}
    >
      {value}
    </button>
  );
}

// Winner detection function
// PUBLIC_INTERFACE
function calculateWinner(squares) {
  const lines = [
    [0,1,2],[3,4,5],[6,7,8], // rows
    [0,3,6],[1,4,7],[2,5,8], // columns
    [0,4,8],[2,4,6]          // diagonals
  ];
  for (let line of lines) {
    const [a, b, c] = line;
    if (
      squares[a] &&
      squares[a] === squares[b] &&
      squares[a] === squares[c]
    ) {
      return squares[a];
    }
  }
  if (squares.every((cell) => cell)) return "TIE";
  return null;
}

// Returns winning line (array of indices) or null
function getWinningLine(squares) {
  const lines = [
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6] 
  ];
  for (let line of lines) {
    const [a, b, c] = line;
    if (
      squares[a] &&
      squares[a] === squares[b] &&
      squares[a] === squares[c]
    ) {
      return line;
    }
  }
  return null;
}

export default App;
