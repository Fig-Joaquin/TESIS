import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import SignInSide from './components/SignInSide';
import Devoluciones from './components/Devoluciones';

function App() {
  return (
    <Router>
        <Routes>
            <Route path="/signin" element={<SignInSide />} />
            <Route path="/devoluciones" element={<Devoluciones />} />
            <Route path="/" element={<SignInSide />} />
        </Routes>
    </Router>
  );
}

export default App;