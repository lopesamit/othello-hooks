import './App.css';
import { Board } from './components/Board';
import React from 'react';

function App() {
  return (
    <div className="App">
      <Board key="board" />
    </div>
  );
}

export default App;
