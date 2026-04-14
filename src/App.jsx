import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import CreateDedication from './pages/CreateDedication';
import ViewDedication from './pages/ViewDedication';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/create" element={<CreateDedication />} />
        <Route path="/love/:id" element={<ViewDedication />} />
      </Routes>
    </Router>
  );
}

export default App;