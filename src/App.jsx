import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import CreateDedication from './pages/CreateDedication';
import ViewDedication from './pages/ViewDedication';

function App() {
  return (
    <Router>
      <Routes>
        {/* 1. Ruta principal (Home) */}
        <Route path="/" element={<Home />} />

        {/* 2. Ruta para CREAR (Donde sale el formulario) */}
        <Route path="/create" element={<CreateDedication />} />

        {/* 3. Ruta para VER (Donde debe salir la sorpresa) */}
        {/* IMPORTANTE: El "path" debe ser exactamente /love/:id */}
        <Route path="/love/:id" element={<ViewDedication />} />

        {/* 4. Ruta de escape: Si el link está mal escrito, manda al home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;