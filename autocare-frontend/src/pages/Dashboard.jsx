import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { listarVeiculos, deletarVeiculo, editarVeiculo } from '../services/api'
import AutoDoodleBackground from '../components/AutoDoodleBackground'

function Dashboard() {
  const [veiculos, setVeiculos] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [editando, setEditando] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    async function carregar() {
      try {
        const dados = await listarVeiculos()
        setVeiculos(dados)
      } catch (err) {
        console.error('Erro ao buscar veículos', err)
      } finally {
        setCarregando(false)
      }
    }
    carregar()
  }, [])

  function handleLogout() {
    localStorage.removeItem('token')
    navigate('/')
  }

  async function handleDeletar(id) {
    const confirmar = window.confirm('Tem certeza que quer remover este veículo?')
    if (!confirmar) return

    try {
      await deletarVeiculo(id)
      setVeiculos((prev) => prev.filter((v) => v.id !== id))
    } catch (err) {
      console.error('Erro ao deletar veículo', err)
    }
  }

  async function handleSalvarEdicao(e) {
    e.preventDefault()
    try {
      const atualizado = await editarVeiculo(editando.id, {
        tipo: editando.tipo,
        marca: editando.marca,
        modelo: editando.modelo,
        ano: Number(editando.ano),
        km_atual: Number(editando.km_atual),
      })
      setVeiculos((prev) => prev.map((v) => (v.id === atualizado.id ? atualizado : v)))
      setEditando(null)
    } catch (err) {
      console.error('Erro ao editar veículo', err)
    }
  }

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      <AutoDoodleBackground />

      <header className="relative z-10 flex items-center justify-between px-8 py-5 border-b border-neutral-800 bg-black/40 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-orange-600 flex items-center justify-center">
            <span className="text-xs font-bold text-black">AC</span>
          </div>
          <div>
            <div className="text-sm font-semibold">Carro ta em dia</div>
            <div className="text-xs text-neutral-500 uppercase">Painel do veículo</div>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="text-sm text-neutral-400 hover:text-red-500 transition"
        >
          Sair
        </button>
      </header>

      <main className="relative z-10 p-8">
        <div className="max-w-2xl mx-auto flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold">Meus veículos</h2>
          {veiculos.length > 0 && (
            <button
              onClick={() => navigate('/cadastro-veiculo')}
              className="flex items-center gap-2 bg-orange-600 hover:brightness-110 text-black font-semibold text-sm rounded-lg py-2.5 px-4 transition"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
              Adicionar veículo
            </button>
          )}
        </div>

        {carregando ? (
          <p className="text-center text-neutral-500 mt-16">Carregando...</p>
        ) : veiculos.length === 0 ? (
          <div className="max-w-md mx-auto bg-neutral-900 border border-neutral-800 rounded-2xl p-8 text-center mt-16">
            <h2 className="text-lg font-semibold mb-2">Nenhum veículo cadastrado</h2>
            <p className="text-sm text-neutral-500 mb-6">
              Cadastre seu carro pra começar a acompanhar a manutenção.
            </p>
            <button
              onClick={() => navigate('/cadastro-veiculo')}
              className="bg-orange-600 hover:brightness-110 text-black font-semibold text-sm rounded-lg py-3 px-6 transition"
            >
              Cadastrar veículo
            </button>
          </div>
        ) : (
          <div className="max-w-2xl mx-auto space-y-4">
            {veiculos.map((v) => (
              <div
                key={v.id}
                onClick={() => navigate(`/veiculo/${v.id}`, { state: { veiculo: v } })}
                className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 flex items-center justify-between cursor-pointer hover:border-orange-600/40 transition"
              >
                <div>
                  <h3 className="text-base font-semibold">{v.marca} {v.modelo}</h3>
                  <p className="text-sm text-neutral-500">
                    {v.tipo} · {v.ano} · {v.km_atual.toLocaleString('pt-BR')} km
                  </p>
                </div>

                <div className="flex items-center gap-1 ml-auto">
                  <button
                    onClick={(e) => { e.stopPropagation(); setEditando(v) }}
                    className="text-neutral-500 hover:text-orange-500 transition p-2"
                    title="Editar veículo"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                    </svg>
                  </button>

                  <button
                    onClick={(e) => { e.stopPropagation(); handleDeletar(v.id) }}
                    className="text-neutral-500 hover:text-red-500 transition p-2"
                    title="Remover veículo"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="3 6 5 6 21 6"></polyline>
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                      <line x1="10" y1="11" x2="10" y2="17"></line>
                      <line x1="14" y1="11" x2="14" y2="17"></line>
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {editando && (
        <div
          className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
          onClick={() => setEditando(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-[420px] max-w-full bg-neutral-900 border border-neutral-800 rounded-2xl p-8"
          >
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-semibold">Editar veículo</h2>
              <button
                onClick={() => setEditando(null)}
                className="text-neutral-500 hover:text-white transition p-1"
                title="Fechar"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>

            <form onSubmit={handleSalvarEdicao} className="space-y-4">
              <div>
                <label className="block text-xs text-neutral-500 mb-1.5">Tipo</label>
                <select
                  value={editando.tipo}
                  onChange={(e) => setEditando({ ...editando, tipo: e.target.value })}
                  className="w-full bg-neutral-800 border border-neutral-700 text-white text-sm rounded-lg px-3.5 py-3 outline-none focus:border-orange-600"
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
                    value={editando.marca}
                    onChange={(e) => setEditando({ ...editando, marca: e.target.value })}
                    className="w-full bg-neutral-800 border border-neutral-700 text-white text-sm rounded-lg px-3.5 py-3 outline-none focus:border-orange-600"
                  />
                </div>
                <div>
                  <label className="block text-xs text-neutral-500 mb-1.5">Modelo</label>
                  <input
                    type="text"
                    value={editando.modelo}
                    onChange={(e) => setEditando({ ...editando, modelo: e.target.value })}
                    className="w-full bg-neutral-800 border border-neutral-700 text-white text-sm rounded-lg px-3.5 py-3 outline-none focus:border-orange-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-neutral-500 mb-1.5">Ano</label>
                  <input
                    type="number"
                    value={editando.ano}
                    onChange={(e) => setEditando({ ...editando, ano: e.target.value })}
                    className="w-full bg-neutral-800 border border-neutral-700 text-white text-sm rounded-lg px-3.5 py-3 outline-none focus:border-orange-600"
                  />
                </div>
                <div>
                  <label className="block text-xs text-neutral-500 mb-1.5">KM atual</label>
                  <input
                    type="number"
                    value={editando.km_atual}
                    onChange={(e) => setEditando({ ...editando, km_atual: e.target.value })}
                    className="w-full bg-neutral-800 border border-neutral-700 text-white text-sm rounded-lg px-3.5 py-3 outline-none focus:border-orange-600"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setEditando(null)}
                  className="flex-1 border border-neutral-700 text-neutral-300 text-sm rounded-lg py-3 hover:bg-neutral-800 transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-orange-600 hover:brightness-110 text-black font-semibold text-sm rounded-lg py-3 transition"
                >
                  Salvar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default Dashboard