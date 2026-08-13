import React, { useState, useEffect } from 'react';
import { RefreshCw, X, Circle } from 'lucide-react';

const ServerWarmingGame = () => {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [isPlayerTurn, setIsPlayerTurn] = useState(true);
  const [winner, setWinner] = useState(null);

  // Check for a winner or draw every time the board changes
  useEffect(() => {
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
      [0, 4, 8], [2, 4, 6]             // Diagonals
    ];
    
    let newWinner = null;
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        newWinner = board[a];
        break;
      }
    }
    
    // Check for draw if no winner and no empty spaces
    if (!newWinner && !board.includes(null)) {
      newWinner = 'Draw';
    }
    
    setWinner(newWinner);
  }, [board]);

  // Computer's Turn Logic
  useEffect(() => {
    if (!isPlayerTurn && !winner) {
      const timer = setTimeout(() => {
        // Find all empty spots
        const emptyIndices = board
          .map((val, idx) => (val === null ? idx : null))
          .filter((val) => val !== null);
          
        if (emptyIndices.length > 0) {
          // Pick a random empty spot
          const randomIndex = emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
          const newBoard = [...board];
          newBoard[randomIndex] = 'O';
          setBoard(newBoard);
          setIsPlayerTurn(true);
        }
      }, 500); // 500ms delay to simulate "thinking"
      
      return () => clearTimeout(timer);
    }
  }, [isPlayerTurn, board, winner]);

  // Handle User Click
  const handleCellClick = (index) => {
    // Prevent clicking if cell is taken, game is over, or it's not player's turn
    if (board[index] || winner || !isPlayerTurn) return;
    
    const newBoard = [...board];
    newBoard[index] = 'X';
    setBoard(newBoard);
    setIsPlayerTurn(false);
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setIsPlayerTurn(true);
    setWinner(null);
  };

  // Helper to render a single square
  const renderCell = (index) => (
    <button
      onClick={() => handleCellClick(index)}
      disabled={!isPlayerTurn || board[index] !== null || winner !== null}
      className="w-20 h-20 sm:w-24 sm:h-24 bg-white hover:bg-slate-50 border-2 border-slate-200 flex items-center justify-center rounded-xl shadow-sm transition-all disabled:cursor-not-allowed"
    >
      {board[index] === 'X' && <X size={48} strokeWidth={2.5} className="text-[#162740] animate-in zoom-in" />}
      {board[index] === 'O' && <Circle size={40} strokeWidth={3} className="text-[#9A7D46] animate-in zoom-in" />}
    </button>
  );

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#FDFBF7] p-4 font-sans text-[#162740]">
      {/* Informational Header */}
      <div className="max-w-md w-full bg-white p-6 rounded-2xl shadow-md border border-[#E8E1D5] mb-8 text-center">
        <h2 className="text-xl font-bold mb-2 flex items-center justify-center gap-2">
          <RefreshCw className="animate-spin text-[#9A7D46]" size={20} />
          Waking up the Server...
        </h2>
        <p className="text-sm text-gray-600 mb-4">
          RideBuddy is hosted on a free cloud tier. The backend takes about 30-40 seconds to boot up from sleep. 
        </p>
        <div className="bg-yellow-50 text-yellow-700 px-4 py-2 rounded-lg text-sm font-medium border border-yellow-200">
          Status: Connecting to backend API...
        </div>
      </div>

      {/* Game Container */}
      <div className="flex flex-col items-center">
        <div className="mb-6 h-8 flex items-center justify-center">
          {!winner ? (
            <p className="text-lg font-semibold text-slate-600">
              {isPlayerTurn ? "Your turn (X)" : "Computer is thinking..."}
            </p>
          ) : (
            <p className="text-xl font-bold text-[#162740]">
              {winner === 'Draw' ? "It's a Draw!" : `${winner === 'X' ? 'You' : 'Computer'} Won!`}
            </p>
          )}
        </div>

        {/* 3x3 Grid */}
        <div className="grid grid-cols-3 gap-3 bg-slate-100 p-4 rounded-2xl border-2 border-slate-200 shadow-inner">
          {board.map((_, index) => (
            <React.Fragment key={index}>
              {renderCell(index)}
            </React.Fragment>
          ))}
        </div>

        {/* Play Again Button (Only shows when game is over) */}
        <div className="h-12 mt-6">
          {winner && (
            <button
              onClick={resetGame}
              className="bg-[#9A7D46] hover:bg-[#8C6D3F] text-white px-6 py-2 rounded-xl font-bold transition-colors shadow-md"
            >
              Play Again
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ServerWarmingGame;