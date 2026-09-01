import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { criarVeiculo } from '../services/api'

function CadastroVeiculo() {
  const [tipo, setTipo] = useState('Hatch')
  const [marca, setMarca] = useState('')
  const [modelo, setModelo] = useState('')
  const [ano, setAno] = useState('')
  const [kmAtual, setKmAtual] = useState('')
  const [erro, setErro] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()
    setErro('')
    setLoading(true)

    try {
      await criarVeiculo({
        tipo,
        marca,
        modelo,
        ano: Number(ano),
        km_atual: Number(kmAtual),
      })
      navigate('/dashboard')
    } catch (err) {
      setErro('Erro ao cadastrar veículo. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center relative overflow-hidden">
      <div className="w-[420px] max-w-[92vw] bg-neutral-900 border border-neutral-800 rounded-2xl p-10">
        <div className="flex items-start justify-between mb-1">
          <h1 className="text-xl font-semibold text-white">Cadastrar veículo</h1>
          <button
            type="button"
            onClick={() => navigate('/dashboard')}
            className="text-neutral-500 hover:text-white transition p-1 -mt-1 -mr-1"
            title="Cancelar"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
        <p className="text-sm text-neutral-500 mb-6">
          Vamos usar isso pra montar seu painel de manutenção.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs text-neutral-500 mb-1.5">Tipo</label>
            <select
              value={tipo}
              onChange={(e) => setTipo(e.target.value)}
              className="w-full bg-neutral-800 border border-neutral-700 text-white text-sm rounded-lg px-3.5 py-3 outline-none focus:border-orange-600 focus:ring-2 focus:ring-orange-600/20"
            >
              <option value="Hatch">Hatch</option>
              <option value="Sedã">Sedã</option>
              <option value="SUV">SUV</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-neutral-500 mb-1.5">Marca</label>
              <input
                type="text"
                value={marca}
                onChange={(e) => setMarca(e.target.value)}
                placeholder="Volkswagen"
                required
                className="w-full bg-neutral-800 border border-neutral-700 text-white text-sm rounded-lg px-3.5 py-3 outline-none focus:border-orange-600 focus:ring-2 focus:ring-orange-600/20"
              />
            </div>
            <div>
              <label className="block text-xs text-neutral-500 mb-1.5">Modelo</label>
              <input
                type="text"
                value={modelo}
                onChange={(e) => setModelo(e.target.value)}
                placeholder="Polo"
                required
                className="w-full bg-neutral-800 border border-neutral-700 text-white text-sm rounded-lg px-3.5 py-3 outline-none focus:border-orange-600 focus:ring-2 focus:ring-orange-600/20"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-neutral-500 mb-1.5">Ano</label>
              <input
                type="number"
                value={ano}
                onChange={(e) => setAno(e.target.value)}
                placeholder="2022"
                required
                className="w-full bg-neutral-800 border border-neutral-700 text-white text-sm rounded-lg px-3.5 py-3 outline-none focus:border-orange-600 focus:ring-2 focus:ring-orange-600/20"
              />
            </div>
            <div>
              <label className="block text-xs text-neutral-500 mb-1.5">KM atual</label>
              <input
                type="number"
                value={kmAtual}
                onChange={(e) => setKmAtual(e.target.value)}
                placeholder="15000"
                required
                className="w-full bg-neutral-800 border border-neutral-700 text-white text-sm rounded-lg px-3.5 py-3 outline-none focus:border-orange-600 focus:ring-2 focus:ring-orange-600/20"
              />
            </div>
          </div>

          {erro && <p className="text-red-500 text-xs">{erro}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-orange-600 hover:brightness-110 disabled:brightness-75 text-black font-semibold text-sm rounded-lg py-3 mt-2 transition"
          >
            {loading ? 'Salvando...' : 'Cadastrar veículo'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default CadastroVeiculo