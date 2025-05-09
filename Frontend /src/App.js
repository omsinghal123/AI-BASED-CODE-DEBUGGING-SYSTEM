import React, { useState } from 'react';
import './App.css';

function App() {
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('python');
  const [fixedCode, setFixedCode] = useState('');
  const [explanation, setExplanation] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFixedCode("Loading...");
    setExplanation("Loading...");
    setLoading(true);

    const res = await fetch('http://localhost:5000/debug', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code, language }),
    });

    const data = await res.json();
    setFixedCode(data.fixed_code || 'No result.');
    setExplanation(data.explanation || 'No explanation.');
    setLoading(false);
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>🧠 AI Code Debugger</h1>
        <p>
          Instantly debug and fix your code using the power of AI. Paste your code,
          choose a language, and let the magic happen!
        </p>
      </header>

      <form onSubmit={handleSubmit} className="debug-form">
        <label htmlFor="language">Select Language:</label>
        <select id="language" value={language} onChange={(e) => setLanguage(e.target.value)}>
          <option value="python">Python</option>
          <option value="javascript">JavaScript</option>
          <option value="c">C</option>
          <option value="cpp">C++</option>
          <option value="java">Java</option>
        </select>

        <textarea
          rows="10"
          placeholder="Paste your code here..."
          value={code}
          onChange={(e) => setCode(e.target.value)}
        />

        <button type="submit" disabled={loading}>
          {loading ? 'Debugging...' : 'Debug Code'}
        </button>
      </form>

      <div className="result">
        <h3>🛠 Fixed Code</h3>
        <pre className="code-block">{fixedCode}</pre>
      </div>

      <div className="result">
        <h3>💡 Explanation</h3>
        <pre className="explanation">{explanation}</pre>
      </div>
    </div>
  );
}

export default App;
