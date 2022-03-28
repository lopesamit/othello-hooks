import './App.css';
import { Board } from './components/Board';
import { Background } from './components/Background';
import React from 'react';

function App() {
  return (
    <div className="App">
      <Board key="board" />
      <Background key="background" />
    </div>
  );
}

export default App;
