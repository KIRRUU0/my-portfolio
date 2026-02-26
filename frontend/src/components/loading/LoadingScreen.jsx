import React, { useEffect, useState } from 'react';
import { useApp } from '../../context/AppContext';
import './LoadingScreen.css';

const LoadingScreen = ({ onFinish }) => {
  const { language } = useApp();
  const [progress, setProgress] = useState(0);
  const [loadingText, setLoadingText] = useState('');
  const [show, setShow] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);
  const [displayedWelcome, setDisplayedWelcome] = useState('');
  
  const t = {
    en: {
      welcome: 'Welcome',
      loading: 'Loading',
      complete: 'Ready'
    },
    id: {
      welcome: 'Selamat datang',
      loading: 'Memuat',
      complete: 'Siap'
    }
  };

  const text = t[language] || t.en;

  // Kode-kode untuk animasi coding
  const codeLines = [
    'import { Portfolio } from "./components";',
    'const developer = new Developer("Haekal");',
    'developer.skills = ["React", "Go", "Node.js"];',
    'function createAwesome() {',
    '  return <Portfolio />;',
    '}',
    'npm install creativity --save',
    'git commit -m "Add amazing features"',
    'deploy --production',
    'console.log("Hello World!");',
    '<Loading complete={true} />',
    'export default function App() {',
    '  return <Experience />;',
    '}',
    'while(alive) { code(); }',
    'if(success) { celebrate(); }',
    'const future = "Bright";',
    'portfolio.render();',
    '🎉 Deployment successful! 🎉'
  ];

  // Tech stack 1 baris
  const techStacks = [
    '⚛️ React', '🐹 Go', '📘 Node.js', '🐍 Python', '🐳 Docker', 
    '☸️ Kubernetes', '📦 MongoDB', '🐬 MySQL', '☁️ AWS', '📝 TypeScript',
    '🎨 Vue', '🔷 Angular', '⚡ Next.js', '💅 Tailwind', '📘 Express',
    '🔧 NestJS', '📊 GraphQL', '🔍 PostgreSQL', '📈 Redis', '🚀 Vercel'
  ];

  useEffect(() => {
    // Animasi text per text untuk welcome message
    let charIndex = 0;
    const welcomeText = text.welcome;
    
    const textInterval = setInterval(() => {
      if (charIndex <= welcomeText.length) {
        setDisplayedWelcome(welcomeText.substring(0, charIndex));
        charIndex++;
      } else {
        clearInterval(textInterval);
      }
    }, 80); // Kecepatan muncul per karakter

    // Update loading text secara acak
    const codeInterval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * codeLines.length);
      setLoadingText(codeLines[randomIndex]);
    }, 150);

    // Progress bar
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          clearInterval(codeInterval);
          
          // Trigger fade out
          setFadeOut(true);
          
          // Setelah fade out selesai, panggil onFinish
          setTimeout(() => {
            setShow(false);
            onFinish();
          }, 800);
          
          return 100;
        }
        return prev + 1;
      });
    }, 30);

    return () => {
      clearInterval(progressInterval);
      clearInterval(codeInterval);
      clearInterval(textInterval);
    };
  }, [onFinish, text.welcome]);

  if (!show) return null;

  return (
    <div className={`loading-screen ${fadeOut ? 'fade-out' : 'fade-in'}`}>
      <div className="matrix-bg"></div>
      
      <div className="loading-content">
        <h1 className="welcome-text">
          <span className="welcome">{displayedWelcome}</span>
          <span className="cursor">_</span>
        </h1>
        
        <div className="code-animation">
          <div className="code-window">
            <div className="code-header">
              <span className="dot red"></span>
              <span className="dot yellow"></span>
              <span className="dot green"></span>
              <span className="filename">portfolio.js</span>
            </div>
            <div className="code-body">
              {loadingText && (
                <div className="code-line">
                  <span className="line-number">{String(progress).padStart(3, '0')}</span>
                  <span className="code-text">{loadingText}</span>
                  <span className="blink-cursor">|</span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="progress-container">
          <div className="progress-bar-wrapper">
            <div 
              className="progress-bar-fill" 
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <div className="progress-text">
            <span className="progress-percentage">{progress}%</span>
            <span className="progress-status">
              {progress < 100 ? text.loading : text.complete}
            </span>
          </div>
        </div>

        {/* Tech Stack - 1 Baris dengan scroll */}
        <div className="tech-stack-container">
          <div className="tech-stack-track">
            {techStacks.map((tech, index) => (
              <span key={index} className="tech-icon">{tech}</span>
            ))}
            {techStacks.map((tech, index) => (
              <span key={`dup-${index}`} className="tech-icon">{tech}</span>
            ))}
          </div>
        </div>

        <div className="particles">
          {[...Array(20)].map((_, i) => (
            <div 
              key={i} 
              className="particle"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${3 + Math.random() * 4}s`,
                fontSize: `${0.8 + Math.random() * 1}rem`
              }}
            >
              {['{', '}', '<', '>', '/', ';', '(', ')', '=', '$', '#', '@'][Math.floor(Math.random() * 12)]}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;