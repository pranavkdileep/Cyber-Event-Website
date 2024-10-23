"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Terminal, Shield, Database, Lock, ChevronDown } from 'lucide-react';
import styles from '@/styles/Home.module.css';

interface TypeWriterProps {
  text: string;
  speed?: number;
}

interface Program {
  id: number;
  title: string;
  description: string;
  icon: React.ReactNode;
  date: string;
  slots: number;
}

interface MousePosition {
  x: number;
  y: number;
}

interface FloatingBit {
  id: number;
  left: string;
  top: string;
  value: string;
  delay: string;
  duration: string;
}

const TypeWriter: React.FC<TypeWriterProps> = ({ text, speed = 100 }) => {
  const [displayText, setDisplayText] = useState<string>('');
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [showCursor, setShowCursor] = useState<boolean>(true);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, speed);
      return () => clearTimeout(timeout);
    }
  }, [currentIndex, text, speed]);

  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 500);
    return () => clearInterval(cursorInterval);
  }, []);

  return (
    <span className="font-mono">
      {displayText}
      <span className={`${showCursor ? 'opacity-100' : 'opacity-0'} text-green-400`}>|</span>
    </span>
  );
};

const InteractiveGrid: React.FC = () => {
  const [mousePosition, setMousePosition] = useState<MousePosition>({ x: 0, y: 0 });
  const [floatingBits, setFloatingBits] = useState<FloatingBit[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const generateBits = () => {
      const bits: FloatingBit[] = Array.from({ length: 20 }).map((_, i) => ({
        id: i,
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        value: ['0', '1'][Math.floor(Math.random() * 2)],
        delay: `${Math.random() * 5}s`,
        duration: `${5 + Math.random() * 5}s`
      }));
      setFloatingBits(bits);
    };

    generateBits();
    const interval = setInterval(generateBits, 10000); // Regenerate bits every 10 seconds
    return () => clearInterval(interval);
  }, []);
  
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };

  if (!mounted) return null;

  return (
    <div 
      className="absolute inset-0 overflow-hidden"
      onMouseMove={handleMouseMove}
    >
      <div className={styles.cyberGrid} />
      <div 
        className={styles.highlightCircle}
        style={{
          left: `${mousePosition.x}px`,
          top: `${mousePosition.y}px`
        }}
      />
      {floatingBits.map((bit) => (
        <div
          key={bit.id}
          className={styles.animateFloat}
          style={{
            position: 'absolute',
            left: bit.left,
            top: bit.top,
            animationDelay: bit.delay,
            animationDuration: bit.duration
          }}
        >
          {bit.value}
        </div>
      ))}
    </div>
  );
};

const Home: React.FC = () => {
  const [commandInput, setCommandInput] = useState<string>('');
  const [terminalHistory, setTerminalHistory] = useState<string[]>(['Welcome to CyberSec Program Terminal...']);
  const [startTyping, setStartTyping] = useState<boolean>(false);
  const programsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setStartTyping(true);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const scrollToPrograms = (): void => {
    programsRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const programs: Program[] = [
    {
      id: 1,
      title: "Santos Degital Forensics Workshop",
      description: "Learn the basics of digital forensics and evidence collection in this hands-on workshop.",
      icon: <Shield className="w-6 h-6 text-green-400" />,
      date: "Nov 15, 2024",
      slots: 20
    },
    {
      id: 2,
      title: "Penetration Testing Workshop",
      description: "Hands-on training in ethical hacking, vulnerability assessment, and penetration testing methodologies.",
      icon: <Lock className="w-6 h-6 text-green-400" />,
      date: "Nov 15, 2024",
      slots: 15
    },
    {
      id: 3,
      title: "Digital Forensics Course",
      description: "Master the art of digital investigation and evidence collection using industry-standard tools.",
      icon: <Database className="w-6 h-6 text-green-400" />,
      date: "Nov 15, 2024",
      slots: 25
    }
  ];

  const handleCommand = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === 'Enter') {
      const newHistory = [...terminalHistory, `$ ${commandInput}`];
      if (commandInput.toLowerCase() === 'help') {
        newHistory.push('Available commands:', '- list: Show all programs', '- clear: Clear terminal', '- help: Show commands');
      } else if (commandInput.toLowerCase() === 'list') {
        newHistory.push('Loading programs...');
      } else if (commandInput.toLowerCase() === 'clear') {
        setTerminalHistory([]);
        setCommandInput('');
        return;
      } else {
        newHistory.push(`Command not found: ${commandInput}`);
      }
      setTerminalHistory(newHistory);
      setCommandInput('');
    }
  };

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Hero Section */}
      <div className="h-screen relative flex flex-col items-center justify-center overflow-hidden">
        <InteractiveGrid />

        {/* Hero Content */}
        <div className="relative z-10 text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 text-green-400 font-mono">
            <span className="animate-pulse">&gt;</span> Cyber Security UCE
          </h1>
          <div className="h-16">
            <p className="text-xl md:text-2xl text-green-300 mb-12">
              {startTyping && <TypeWriter text="Security Operations AndPrograms" speed={50} />}
            </p>
          </div>
          <button
            onClick={scrollToPrograms}
            className="bg-green-400 text-black px-8 py-4 rounded-lg font-mono text-lg hover:bg-green-500 transition-colors flex items-center gap-2 relative overflow-hidden group"
          >
            <span className="relative z-10">./view-programs.sh</span>
            <ChevronDown className="w-5 h-5 animate-bounce relative z-10" />
            <div className="absolute inset-0 bg-green-300 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></div>
          </button>
        </div>
      </div>

      {/* Programs Section */}
      <div ref={programsRef} className="min-h-screen p-6">
        <div className="flex items-center gap-2 mb-6">
          <Terminal className="w-8 h-8 text-green-400" />
          <h1 className="text-2xl font-mono text-green-400">CyberSec Programs Terminal</h1>
        </div>

        <div className="bg-black rounded-lg p-4 mb-8 font-mono">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
          </div>
          {terminalHistory.map((line, index) => (
            <div key={index} className="mb-1 text-green-400">{line}</div>
          ))}
          <div className="flex items-center">
            <span className="mr-2 text-green-400">$</span>
            <input
              type="text"
              value={commandInput}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCommandInput(e.target.value)}
              onKeyDown={handleCommand}
              className="bg-transparent border-none outline-none flex-1 text-green-400"
              placeholder="Type 'help' for commands..."
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {programs.map((program) => (
            <div key={program.id} className="bg-gray-800 rounded-lg p-6 border border-green-400">
              <div className="flex items-center gap-3 mb-4">
                {program.icon}
                <h2 className="text-xl font-mono text-green-400">{program.title}</h2>
              </div>
              <p className="text-gray-400 mb-4">{program.description}</p>
              <div className="flex justify-between items-center text-sm text-gray-400 mb-4">
                <span>Date: {program.date}</span>
                <span>Slots: {program.slots}</span>
              </div>
              <button 
                className="w-full bg-green-400 text-black py-2 px-4 rounded hover:bg-green-500 transition-colors font-mono"
                onClick={() => setTerminalHistory([...terminalHistory, `Registering for ${program.title}...`])}
              >
                ./register.sh
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;