import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from './pages/Login'
import Cadastro from './pages/Cadastro'
import Dashboard from './pages/Dashboard'
import CadastroVeiculo from './pages/CadastroVeiculo'
import RotaProtegida from './components/RotaProtegida'
import VeiculoDetalhe from './pages/VeiculoDetalhe'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/cadastro" element={<Cadastro />} />
        <Route
          path="/veiculo/:id"
          element={
            <RotaProtegida>
              <VeiculoDetalhe />
            </RotaProtegida>
          }
        />
        <Route 
        path="/cadastro-veiculo" 
        element={
          <RotaProtegida>
            <CadastroVeiculo />
          </RotaProtegida>
        } />
        <Route
          path="/dashboard"
          element={
            <RotaProtegida>
              <Dashboard />
            </RotaProtegida>
          }
        />
      </Routes>
    </BrowserRouter>
  )
}

export default App