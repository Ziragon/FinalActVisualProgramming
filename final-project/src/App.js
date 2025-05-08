import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainProfile from './MainProfile/RouterConfig.jsx';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/login" element={null} />
          <Route path="/*" element={<MainProfile />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;