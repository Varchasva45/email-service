import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import LoginForm from './components/forms/LoginForm';
import SignUpForm from './components/forms/SignUpForm';
import EmailForm from './components/forms/EmailForm';
import NotFoundForm from './components/forms/NotFoundForm';
import LandingPage from './components/LandingPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/signup" element={<SignUpForm />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/email-page" element={<EmailForm />} />
        <Route path="*" element={<NotFoundForm />} />
      </Routes>
      <ToastContainer />
    </Router>
  );
}

export default App;
