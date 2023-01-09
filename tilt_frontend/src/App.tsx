import React from 'react';
import logo from './logo.svg';
import './App.css';
import ApplianceSelect from './components/ApplianceSelect';

function App() {
  return (
    <div className="App">
      <ApplianceSelect/>
      <div>Your appliances: ...</div>
    </div>
  );
}

export default App;
