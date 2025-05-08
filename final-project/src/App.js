import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainProfile from './MainProfile/RouterConfig.jsx';
import './App.css';
import AuthorizationPage from "./pageElement/AuthorizationPage";

function App() {
  return (
      <Router>
        <div className="App">
          <Routes>
            <Route path="/login" element={<AuthorizationPage/>} />
            <Route path="/*" element={<MainProfile />} />
          </Routes>
        </div>
      </Router>
  );
}

export default App;