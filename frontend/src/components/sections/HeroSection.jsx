import React, { useLayoutEffect, useRef, useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import ScrambleText from '../ScrambleText';
import gsap from 'gsap';
import './HeroSection.css';

const calculateWinner = (squares) => {
  const lines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  if (squares.every(square => square !== null)) {
    return 'Draw';
  }
  return null;
};

const getBotMove = (squares) => {
  const winLines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
  ];

  // 1. Can Bot ('O') win?
  for (let line of winLines) {
    const [a, b, c] = line;
    if (squares[a] === 'O' && squares[b] === 'O' && squares[c] === null) return c;
    if (squares[a] === 'O' && squares[c] === 'O' && squares[b] === null) return b;
    if (squares[b] === 'O' && squares[c] === 'O' && squares[a] === null) return a;
  }

  // 2. Can Player ('X') win? Block them.
  for (let line of winLines) {
    const [a, b, c] = line;
    if (squares[a] === 'X' && squares[b] === 'X' && squares[c] === null) return c;
    if (squares[a] === 'X' && squares[c] === 'X' && squares[b] === null) return b;
    if (squares[b] === 'X' && squares[c] === 'X' && squares[a] === null) return a;
  }

  // 3. Take center if empty
  if (squares[4] === null) return 4;

  // 4. Take corners
  const corners = [0, 2, 6, 8];
  const emptyCorners = corners.filter(i => squares[i] === null);
  if (emptyCorners.length > 0) {
    return emptyCorners[Math.floor(Math.random() * emptyCorners.length)];
  }

  // 5. Take any empty cell
  const emptyCells = squares.map((val, idx) => val === null ? idx : null).filter(val => val !== null);
  if (emptyCells.length > 0) {
    return emptyCells[Math.floor(Math.random() * emptyCells.length)];
  }

  return null;
};

const HeroSection = ({ homeRef }) => {
  const { language } = useApp();
  const heroRef = useRef(null);

  // Tic Tac Toe States
  const [board, setBoard] = useState(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState(true);
  const [isBotThinking, setIsBotThinking] = useState(false);
  const [winner, setWinner] = useState(null);

  const t = {
    en: {
      greeting: "Hello, I'm Haekal",
      role: "Fullstack Developer & UI/UX Designer",
      description: "Developing robust backend systems and intuitive digital experiences. Specializing in Laravel, React, Tailwind, and modern UI/UX design.",
      ctaPrimary: "View Projects",
      ctaSecondary: "Contact Me",
      gameTitle: "tic-tac-toe.sh",
      turnPlayer: "Your Turn (X)",
      turnBot: "Bot is thinking...",
      winPlayer: "You Win! 🎉",
      winBot: "Bot Wins! 🤖",
      draw: "It's a Draw! 🤝",
      reset: "Reset Game"
    },
    id: {
      greeting: "Halo, Saya Haekal",
      role: "Fullstack Developer & UI/UX Designer",
      description: "Mengembangkan sistem backend yang handal dan pengalaman digital yang intuitif. Memiliki spesialisasi dalam Laravel, React, Tailwind, dan desain UI/UX.",
      ctaPrimary: "Lihat Proyek",
      ctaSecondary: "Hubungi Saya",
      gameTitle: "tic-tac-toe.sh",
      turnPlayer: "Giliran Anda (X)",
      turnBot: "Bot sedang berpikir...",
      winPlayer: "Anda Menang! 🎉",
      winBot: "Bot Menang! 🤖",
      draw: "Seri! 🤝",
      reset: "Ulangi Game"
    }
  };

  const text = t[language] || t.en;

  useLayoutEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    let ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      
      tl.from(".hero-greeting", { 
        opacity: 0, x: -30, duration: 0.6 
      })
      .from(".hero-title", { 
        opacity: 0, y: 30, duration: 0.7 
      }, "-=0.3")
      .from(".hero-description", { 
        opacity: 0, y: 20, duration: 0.6 
      }, "-=0.3")
      .from(".hero-cta-group .cta-primary", { 
        opacity: 0, y: 20, duration: 0.5 
      }, "-=0.2")
      .from(".hero-cta-group .cta-secondary", { 
        opacity: 0, y: 20, duration: 0.5 
      }, "-=0.3")
      .from(".digital-canvas", { 
        opacity: 0, scale: 0.88, duration: 1, ease: "power2.out" 
      }, "-=0.8");
    }, heroRef);

    return () => ctx.revert();
  }, []);

  // Bot Logic
  useEffect(() => {
    if (isXNext || winner || !isBotThinking) return;

    const timeout = setTimeout(() => {
      const move = getBotMove(board);
      if (move !== null) {
        const nextBoard = [...board];
        nextBoard[move] = 'O';
        setBoard(nextBoard);
        
        const currentWinner = calculateWinner(nextBoard);
        if (currentWinner) {
          setWinner(currentWinner);
        } else {
          setIsXNext(true);
        }
      }
      setIsBotThinking(false);
    }, 600);

    return () => clearTimeout(timeout);
  }, [isXNext, board, winner, isBotThinking]);

  const handleCellClick = (index) => {
    if (board[index] || winner || !isXNext || isBotThinking) return;

    const nextBoard = [...board];
    nextBoard[index] = 'X';
    setBoard(nextBoard);

    const currentWinner = calculateWinner(nextBoard);
    if (currentWinner) {
      setWinner(currentWinner);
    } else {
      setIsXNext(false);
      setIsBotThinking(true);
    }
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setIsXNext(true);
    setIsBotThinking(false);
    setWinner(null);
  };

  const getStatusText = () => {
    if (winner === 'X') return text.winPlayer;
    if (winner === 'O') return text.winBot;
    if (winner === 'Draw') return text.draw;
    return isXNext ? text.turnPlayer : text.turnBot;
  };

  const scrollToRef = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="home" ref={(el) => { homeRef.current = el; heroRef.current = el; }} className="hero-section">
      <div className="hero-background-glow"></div>
      <div className="hero-container">
        <div className="hero-text">
          <span className="hero-greeting">
            <ScrambleText text={text.greeting} duration={1.0} delay={0.1} />
          </span>
          <h1 className="hero-title">
            <ScrambleText text={text.role} duration={1.4} delay={0.3} />
          </h1>
          <p className="hero-description">{text.description}</p>
          <div className="hero-cta-group">
            <button className="cta-primary" onClick={() => scrollToRef('projects')}>
              {text.ctaPrimary}
            </button>
            <button className="cta-secondary" onClick={() => scrollToRef('contact')}>
              {text.ctaSecondary}
            </button>
          </div>
        </div>
        
        <div className="hero-visual">
          <div className="digital-canvas">
            <div className="dot-grid"></div>
            
            <div className="visual-layer layer-1">
              <div className="minimal-glass-card">
                <div className="card-header">
                  <div className="window-dots">
                    <span className="window-dot red"></span>
                    <span className="window-dot yellow"></span>
                    <span className="window-dot green"></span>
                  </div>
                  <span className="status-text">{text.gameTitle}</span>
                </div>
                <div className="card-body">
                  <div className="ttt-status">{getStatusText()}</div>
                  <div className="ttt-board">
                    {board.map((cell, idx) => (
                      <button 
                        key={idx}
                        className={`ttt-cell ${cell === 'X' ? 'x-cell' : cell === 'O' ? 'o-cell' : ''}`}
                        onClick={() => handleCellClick(idx)}
                        disabled={cell !== null || winner !== null || !isXNext || isBotThinking}
                      >
                        {cell}
                      </button>
                    ))}
                  </div>
                  <button className="ttt-reset-btn" onClick={resetGame}>
                    {text.reset}
                  </button>
                </div>
              </div>
            </div>

            <div className="ambient-glow"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
