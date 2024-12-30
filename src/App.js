import './App.css';
import { useState } from 'react';
import {PasswordReveal} from './components';

function App() {
  const [value, setValue] = useState("");
  const handleChange = (e) => setValue(e.target.value);

  return (
    <div className="App">
      <header className="App-header">
        PasswordReveal.js
      </header>
      <div className="App-content">
        <div className="input-container">
          <label>Enter the Password:</label>
          <PasswordReveal 
            id="password-reveal"
            value={value} 
            placeholder={"placeholder"}
            onChange={handleChange}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
