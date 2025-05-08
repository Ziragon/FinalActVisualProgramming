import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import MainProfile from './components/MainProfile/RouterConfig.jsx';
import './App.css';
import AuthorizationPage from "./components/pageElement/AuthorizationPage";

function App() {
    return (
        <Router>
            <div className="App">
                <Routes>
                    <Route path="/" element={<Navigate to="/login" replace />} />
                    <Route path="/login" element={<AuthorizationPage/>} />
                    <Route path="/*" element={<MainProfile/>} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;