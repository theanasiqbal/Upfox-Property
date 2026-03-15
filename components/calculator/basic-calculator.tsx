'use client';

import { useState } from 'react';

export function BasicCalculator() {
  const [display, setDisplay] = useState('0');
  const [previousVal, setPreviousVal] = useState<string | null>(null);
  const [operator, setOperator] = useState<string | null>(null);
  const [waitingForNewValue, setWaitingForNewValue] = useState(false);

  const calculate = (a: number, b: number, op: string) => {
    switch (op) {
      case '+': return a + b;
      case '-': return a - b;
      case '×': return a * b;
      case '÷': return b !== 0 ? a / b : NaN;
      default: return b;
    }
  };

  const handleInput = (val: string) => {
    if (waitingForNewValue) {
      setDisplay(val);
      setWaitingForNewValue(false);
    } else {
      setDisplay(display === '0' ? val : display + val);
    }
  };

  const handleOperator = (op: string) => {
    const currentVal = parseFloat(display);

    if (previousVal === null) {
      setPreviousVal(display);
    } else if (operator && !waitingForNewValue) {
      const result = calculate(parseFloat(previousVal), currentVal, operator);
      setDisplay(String(result));
      setPreviousVal(String(result));
    }

    setOperator(op);
    setWaitingForNewValue(true);
  };

  const handleEqual = () => {
    if (operator && previousVal !== null) {
      const currentVal = parseFloat(display);
      const result = calculate(parseFloat(previousVal), currentVal, operator);
      setDisplay(String(result));
      setPreviousVal(null);
      setOperator(null);
      setWaitingForNewValue(true);
    }
  };

  const handleClear = () => {
    setDisplay('0');
    setPreviousVal(null);
    setOperator(null);
    setWaitingForNewValue(false);
  };

  const handleDelete = () => {
    if (waitingForNewValue) return;
    setDisplay(display.length > 1 ? display.slice(0, -1) : '0');
  };

  const handleDecimal = () => {
    if (waitingForNewValue) {
      setDisplay('0.');
      setWaitingForNewValue(false);
      return;
    }
    if (!display.includes('.')) {
      setDisplay(display + '.');
    }
  };

  const handleToggleSign = () => {
    setDisplay(String(parseFloat(display) * -1));
  };

  const handlePercentage = () => {
    setDisplay(String(parseFloat(display) / 100));
  };

  return (
    <div className="w-full max-w-sm mx-auto bg-white dark:bg-navy-800 rounded-[2rem] p-6 shadow-2xl border border-gray-100 dark:border-white/10 transition-transform">
      <div className="mb-6 bg-gray-50 dark:bg-navy-900/50 rounded-2xl p-4 text-right overflow-hidden shadow-inner border border-gray-200/50 dark:border-white/5 relative group">
        <div className="absolute right-4 top-2 text-gray-400 dark:text-gray-500 hover:text-red-500 cursor-pointer transition-colors" onClick={handleDelete} title="Backspace" >
           <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 4H8l-7 8 7 8h13a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2z"></path><line x1="18" y1="9" x2="12" y2="15"></line><line x1="12" y1="9" x2="18" y2="15"></line></svg>
        </div>
        <div className="text-gray-500 dark:text-gray-400 text-sm h-5 font-medium pr-8">
          {previousVal !== null && operator ? `${previousVal} ${operator}` : ''}
        </div>
        <div className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mt-1 tracking-tight truncate">
          {display}
        </div>
      </div>
      
      <div className="grid grid-cols-4 gap-3 sm:gap-4">
        <button onClick={handleClear} className="col-span-1 py-4 rounded-2xl font-bold text-lg bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-500/20 active:scale-95 transition-all">C</button>
        <button onClick={handleToggleSign} className="py-4 rounded-2xl font-bold text-lg bg-gray-50 text-gray-700 dark:bg-white/5 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10 active:scale-95 transition-all">+/-</button>
        <button onClick={handlePercentage} className="py-4 rounded-2xl font-bold text-lg bg-gray-50 text-gray-700 dark:bg-white/5 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10 active:scale-95 transition-all">%</button>
        <button onClick={() => handleOperator('÷')} className={`py-4 rounded-2xl font-bold text-2xl active:scale-95 transition-all ${operator === '÷' ? 'bg-accent-purple text-white shadow-lg shadow-accent-purple/30' : 'bg-purple-50 text-accent-purple dark:bg-accent-purple/10 dark:text-accent-purple-light hover:bg-purple-100 dark:hover:bg-accent-purple/20'}`}>÷</button>
        
        {['7', '8', '9'].map(num => (
          <button key={num} onClick={() => handleInput(num)} className="py-4 rounded-2xl font-semibold text-2xl bg-white text-gray-900 border border-gray-100 dark:border-transparent dark:bg-white/5 dark:text-white hover:bg-gray-50 dark:hover:bg-white/10 active:scale-95 transition-all shadow-sm">{num}</button>
        ))}
        <button onClick={() => handleOperator('×')} className={`py-4 rounded-2xl font-bold text-2xl active:scale-95 transition-all ${operator === '×' ? 'bg-accent-purple text-white shadow-lg shadow-accent-purple/30' : 'bg-purple-50 text-accent-purple dark:bg-accent-purple/10 dark:text-accent-purple-light hover:bg-purple-100 dark:hover:bg-accent-purple/20'}`}>×</button>
        
        {['4', '5', '6'].map(num => (
          <button key={num} onClick={() => handleInput(num)} className="py-4 rounded-2xl font-semibold text-2xl bg-white text-gray-900 border border-gray-100 dark:border-transparent dark:bg-white/5 dark:text-white hover:bg-gray-50 dark:hover:bg-white/10 active:scale-95 transition-all shadow-sm">{num}</button>
        ))}
        <button onClick={() => handleOperator('-')} className={`py-4 rounded-2xl font-bold text-3xl active:scale-95 transition-all flex items-center justify-center pb-5 ${operator === '-' ? 'bg-accent-purple text-white shadow-lg shadow-accent-purple/30' : 'bg-purple-50 text-accent-purple dark:bg-accent-purple/10 dark:text-accent-purple-light hover:bg-purple-100 dark:hover:bg-accent-purple/20'}`}>-</button>
        
        {['1', '2', '3'].map(num => (
          <button key={num} onClick={() => handleInput(num)} className="py-4 rounded-2xl font-semibold text-2xl bg-white text-gray-900 border border-gray-100 dark:border-transparent dark:bg-white/5 dark:text-white hover:bg-gray-50 dark:hover:bg-white/10 active:scale-95 transition-all shadow-sm">{num}</button>
        ))}
        <button onClick={() => handleOperator('+')} className={`py-4 rounded-2xl font-bold text-2xl active:scale-95 transition-all ${operator === '+' ? 'bg-accent-purple text-white shadow-lg shadow-accent-purple/30' : 'bg-purple-50 text-accent-purple dark:bg-accent-purple/10 dark:text-accent-purple-light hover:bg-purple-100 dark:hover:bg-accent-purple/20'}`}>+</button>
        
        <button onClick={() => handleInput('0')} className="col-span-2 py-4 rounded-2xl font-semibold text-2xl bg-white text-gray-900 border border-gray-100 dark:border-transparent dark:bg-white/5 dark:text-white hover:bg-gray-50 dark:hover:bg-white/10 active:scale-95 transition-all shadow-sm text-center">0</button>
        <button onClick={handleDecimal} className="py-4 rounded-2xl font-semibold text-3xl pb-5 bg-white text-gray-900 border border-gray-100 dark:border-transparent dark:bg-white/5 dark:text-white hover:bg-gray-50 dark:hover:bg-white/10 active:scale-95 transition-all shadow-sm flex items-center justify-center">.</button>
        <button onClick={handleEqual} className="py-4 rounded-2xl font-bold text-2xl bg-accent-purple text-white hover:bg-accent-purple/90 active:scale-95 transition-all shadow-lg shadow-accent-purple/30">=</button>
      </div>
    </div>
  );
}
