'use client';

import { useState } from 'react';

export default function Home() {
  const [display, setDisplay] = useState('0');

  const appendNumber = (num: string) => {
    
    setDisplay(prev => prev === '0' ? num : prev + num);
  };

  const handleOperator = (op: string) => {
    
    const lastChar = display.slice(-1);
    if (['+', '-', '*', '/'].includes(lastChar)) return;

    
    const symbolMap: { [key: string]: string } = {
      '+': 'add',
      '-': 'subtract',
      'x': 'multiply',
      '÷': 'divide'
    };

    setDisplay(prev => prev + ` ${op} `);
  };

  const calculate = async () => {
    try {
      
      const parts = display.split(' ');
      if (parts.length < 3) return;

      const num1 = parseFloat(parts[0]);
      const opSymbol = parts[1];
      const num2 = parseFloat(parts[2]);

      const opMap: { [key: string]: string } = {
        '+': 'add',
        '-': 'subtract',
        'x': 'multiply',
        '÷': 'divide'
      };

      const response = await fetch('http://localhost:8000/calculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          num1: num1, 
          num2: num2, 
          operation: opMap[opSymbol] 
        }),
      });

      const data = await response.json();
     
      setDisplay(data.result.toString());
    } catch (err) {
      setDisplay("Error");
    }
  };

  const clear = () => setDisplay('0');


const backspace = () => {
  setDisplay(prev => {
    
    if (prev.length <= 1) return '0';
 
    if (prev.endsWith(' ')) {
      return prev.slice(0, -3);
    }
    
    return prev.slice(0, -1);
  });
};

const handlePercentage = async () => {
 
  if (display === '0' || !display) return;

  try {
    
    const response = await fetch('http://localhost:8000/calculate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        num1: parseFloat(display), 
        num2: 0, 
        operation: 'percent' 
      }),
    });
    
    const data = await response.json();
    
    if (data.status === "success") {
      setDisplay(data.result.toString());
    }
  } catch (error) {
    console.error("Connection to Python failed:", error);
  }
};
  
  return (
    <div className="calc-container">
      
      <div className="calc-screen text-2xl overflow-hidden">{display}</div>
<div className="calc-grid">

  
  <button onClick={clear} className="calc-btn btn-dark-gray">AC</button>
  <button onClick={backspace} className="calc-btn btn-dark-gray">⌫</button>
  <button onClick={handlePercentage} className="calc-btn btn-dark-gray">%</button>
  <button onClick={() => handleOperator('÷')} className="calc-btn btn-orange">÷</button>

  
  <button onClick={() => appendNumber('7')} className="calc-btn btn-gray">7</button>
  <button onClick={() => appendNumber('8')} className="calc-btn btn-gray">8</button>
  <button onClick={() => appendNumber('9')} className="calc-btn btn-gray">9</button>
  <button onClick={() => handleOperator('x')} className="calc-btn btn-orange">×</button>

  <button onClick={() => appendNumber('4')} className="calc-btn btn-gray">4</button>
  <button onClick={() => appendNumber('5')} className="calc-btn btn-gray">5</button>
  <button onClick={() => appendNumber('6')} className="calc-btn btn-gray">6</button>
  <button onClick={() => handleOperator('-')} className="calc-btn btn-orange">-</button>


  <button onClick={() => appendNumber('1')} className="calc-btn btn-gray">1</button>
  <button onClick={() => appendNumber('2')} className="calc-btn btn-gray">2</button>
  <button onClick={() => appendNumber('3')} className="calc-btn btn-gray">3</button>
  <button onClick={() => handleOperator('+')} className="calc-btn btn-orange">+</button>

  <button onClick={() => appendNumber('0')} className="calc-btn btn-gray col-span-2">0</button>
  <button onClick={() => appendNumber('.')} className="calc-btn btn-gray">.</button>
  <button onClick={calculate} className="calc-btn btn-orange">=</button>

 
</div>
    </div>
  );
}