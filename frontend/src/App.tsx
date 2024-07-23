import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import SignInSide from './components/SignInSide';
// import Devoluciones from './components/Devoluciones';
import Dashboard from './components/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/signin" element={<SignInSide />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/Dashboard" element={<Dashboard />} />
        </Route>
        <Route path="/" element={<SignInSide />} />
      </Routes>
    </Router>
  );
}

export default App;