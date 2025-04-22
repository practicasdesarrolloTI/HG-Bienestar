import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import SurveyTable from "./pages/SurveyTable";
import MedicationsTable from "./pages/MedicationsTable";


const Usuarios = () => <h2>Página de Usuarios</h2>;

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<SurveyTable />} />
          <Route path="/medicamentos" element={<MedicationsTable />} />
          <Route path="/usuarios" element={<Usuarios />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
