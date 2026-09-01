import { useState, useEffect } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { listarVeiculos, listarComponentesPorArea, registrarTroca, listarTrocas } from '../services/api'
import ChatWidget from '../pages/ChatWidget'
import AutoDoodleBackground from '../components/AutoDoodleBackground'

const LABELS_AREA = {
  motor: 'Motor',
  rodas: 'Pneus e rodas',
  freios: 'Freios',
  eletrica: 'Elétrica',
}

function VeiculoDetalhe() {
  const { id } = useParams()
  const navigate = useNavigate()
  const location = useLocation()

  const [veiculo, setVeiculo] = useState(location.state?.veiculo || null)
  const [areaSelecionada, setAreaSelecionada] = useState(null)
  const [hover, setHover] = useState(null)

  const [componentes, setComponentes] = useState([])
  const [trocas, setTrocas] = useState([])
  const [carregandoArea, setCarregandoArea] = useState(false)

  const [registrando, setRegistrando] = useState(null)
  const [dataTroca, setDataTroca] = useState('')
  const [kmTroca, setKmTroca] = useState('')
  const [salvando, setSalvando] = useState(false)

  const [historico, setHistorico] = useState(null)

  useEffect(() => {
    if (!veiculo) {
      listarVeiculos().then((lista) => {
        const encontrado = lista.find((v) => v.id === Number(id))
        setVeiculo(encontrado || null)
      })
    }
  }, [id, veiculo])

  useEffect(() => {
    if (!areaSelecionada) return

    setCarregandoArea(true)
    Promise.all([
      listarComponentesPorArea(areaSelecionada),
      listarTrocas(id),
    ])
      .then(([comps, todasTrocas]) => {
        setComponentes(comps)
        setTrocas(todasTrocas)
      })
      .catch((err) => console.error('Erro ao carregar área', err))
      .finally(() => setCarregandoArea(false))
  }, [areaSelecionada, id])

  function ultimaTroca(componenteId) {
    const doComponente = trocas.filter((t) => t.componente_id === componenteId)
    if (doComponente.length === 0) return null
    return doComponente.reduce((mais, atual) =>
      new Date(atual.data_troca) > new Date(mais.data_troca) ? atual : mais
    )
  }

  function trocasDoComponente(componenteId) {
    return trocas
      .filter((t) => t.componente_id === componenteId)
      .sort((a, b) => new Date(b.data_troca) - new Date(a.data_troca))
  }

  function abrirRegistro(componente) {
    setRegistrando(componente)
    setDataTroca(new Date().toISOString().slice(0, 10))
    setKmTroca(veiculo?.km_atual || '')
  }

  async function handleSalvarTroca(e) {
    e.preventDefault()
    setSalvando(true)
    try {
      const nova = await registrarTroca(id, {
        componente_id: registrando.id,
        data_troca: new Date(dataTroca).toISOString(),
        km_na_troca: Number(kmTroca),
      })
      setTrocas((prev) => [...prev, nova])
      setRegistrando(null)
    } catch (err) {
      console.error('Erro ao registrar troca', err)
    } finally {
      setSalvando(false)
    }
  }

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      <AutoDoodleBackground />

      <header className="relative z-10 flex items-center gap-4 px-8 py-5 border-b border-neutral-800 bg-black/40 backdrop-blur-sm">
        <button
          onClick={() => navigate('/dashboard')}
          className="text-neutral-500 hover:text-white transition p-1"
          title="Voltar"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
        </button>
        <div>
          <div className="text-sm font-semibold">
            {veiculo ? `${veiculo.marca} ${veiculo.modelo}` : 'Carregando...'}
          </div>
          <div className="text-xs text-neutral-500">
            {veiculo && `${veiculo.tipo} · ${veiculo.ano} · ${veiculo.km_atual.toLocaleString('pt-BR')} km`}
          </div>
        </div>
      </header>

      <div className="relative z-10 flex items-center justify-center py-14 px-6 border-b border-neutral-800 bg-gradient-to-b from-neutral-950/60 to-black/60">
        <svg viewBox="0 0 600 260" className="w-full max-w-2xl">
          <ellipse cx="300" cy="225" rx="230" ry="14" fill="#000" opacity="0.5" />

          <path
            d="M60 175 L60 150 Q60 130 90 118 L150 100 Q175 70 230 65 L370 65 Q420 68 445 100 L500 118 Q535 128 535 150 L535 175 Z"
            fill="#3a3a3a" stroke="#525252" strokeWidth="2"
          />
          <path
            d="M172 100 Q190 74 232 70 L340 70 Q380 73 405 100 Z"
            fill="#1c1c1c" stroke="#525252" strokeWidth="1.5"
          />
          <line x1="290" y1="70" x2="290" y2="100" stroke="#525252" strokeWidth="1.5" />

          <path
            d="M60 150 L60 150 Q60 130 90 118 L150 100 L172 100 L172 150 Z"
            fill={hover === 'motor' || areaSelecionada === 'motor' ? '#ff6a1a' : '#4a4a4a'}
            stroke="#525252" strokeWidth="1.5"
            className="cursor-pointer transition-colors duration-150"
            onMouseEnter={() => setHover('motor')}
            onMouseLeave={() => setHover(null)}
            onClick={() => setAreaSelecionada('motor')}
          />

          <path
            d="M405 100 L428 100 L500 118 Q535 128 535 150 L535 150 L405 150 Z"
            fill={hover === 'eletrica' || areaSelecionada === 'eletrica' ? '#ff6a1a' : '#4a4a4a'}
            stroke="#525252" strokeWidth="1.5"
            className="cursor-pointer transition-colors duration-150"
            onMouseEnter={() => setHover('eletrica')}
            onMouseLeave={() => setHover(null)}
            onClick={() => setAreaSelecionada('eletrica')}
          />
          <rect x="518" y="128" width="10" height="16" rx="2" fill="#d93030" opacity="0.85" pointerEvents="none" />
          <rect x="66" y="128" width="10" height="16" rx="2" fill="#f5d76e" opacity="0.9" pointerEvents="none" />

          <g
            className="cursor-pointer"
            onMouseEnter={() => setHover('rodas')}
            onMouseLeave={() => setHover(null)}
            onClick={() => setAreaSelecionada('rodas')}
          >
            <circle cx="160" cy="178" r="30" fill="#111" stroke={hover === 'rodas' || areaSelecionada === 'rodas' ? '#ff6a1a' : '#525252'} strokeWidth="4" />
            <circle cx="160" cy="178" r="12" fill="#3a3a3a" pointerEvents="none" />
          </g>

          <g
            className="cursor-pointer"
            onMouseEnter={() => setHover('rodas')}
            onMouseLeave={() => setHover(null)}
            onClick={() => setAreaSelecionada('rodas')}
          >
            <circle cx="435" cy="178" r="30" fill="#111" stroke={hover === 'rodas' || areaSelecionada === 'rodas' ? '#ff6a1a' : '#525252'} strokeWidth="4" />
            <circle cx="435" cy="178" r="12" fill="#3a3a3a" pointerEvents="none" />
          </g>

          <circle
            cx="160" cy="178" r="19"
            fill="none"
            stroke={hover === 'freios' || areaSelecionada === 'freios' ? '#ff6a1a' : '#6b6b6b'}
            strokeWidth="3" strokeDasharray="3 3"
            className="cursor-pointer"
            onMouseEnter={() => setHover('freios')}
            onMouseLeave={() => setHover(null)}
            onClick={() => setAreaSelecionada('freios')}
          />
        </svg>

        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 text-xs text-neutral-600">
          clique em uma parte do carro para ver os componentes
        </div>
      </div>

      <main className="relative z-10 max-w-2xl mx-auto px-6 py-8">
        {!areaSelecionada ? (
          <div className="text-center text-neutral-500 mt-10">
            <p className="text-sm">Selecione uma área do veículo acima para ver os detalhes de manutenção.</p>
          </div>
        ) : (
          <div>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-semibold">{LABELS_AREA[areaSelecionada]}</h2>
              <button
                onClick={() => setAreaSelecionada(null)}
                className="text-xs text-neutral-500 hover:text-white transition"
              >
                Fechar
              </button>
            </div>

            {carregandoArea ? (
              <p className="text-sm text-neutral-500">Carregando...</p>
            ) : (
              <div className="space-y-3">
                {componentes.map((c) => {
                  const ultima = ultimaTroca(c.id)
                  return (
                    <div
                      key={c.id}
                      className="bg-neutral-900 border border-neutral-800 rounded-xl p-5 flex items-center justify-between"
                    >
                      <div>
                        <h3 className="text-sm font-semibold">{c.nome}</h3>
                        <p className="text-xs text-neutral-500 mt-0.5">
                          Recomendado {c.intervalo_km ? `a cada ${c.intervalo_km.toLocaleString('pt-BR')} km` : ''}
                          {c.intervalo_km && c.intervalo_meses ? ' ou ' : ''}
                          {c.intervalo_meses ? `${c.intervalo_meses} meses` : ''}
                        </p>
                        {ultima ? (
                          <p className="text-xs text-orange-500/80 mt-1">
                            Última troca: {new Date(ultima.data_troca).toLocaleDateString('pt-BR')} · {ultima.km_na_troca.toLocaleString('pt-BR')} km
                          </p>
                        ) : (
                          <p className="text-xs text-neutral-600 mt-1">Sem registro</p>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setHistorico(c)}
                          disabled={!ultima}
                          title={ultima ? 'Ver histórico' : 'Nenhuma troca registrada ainda'}
                          className="text-xs bg-neutral-800 hover:bg-neutral-700 disabled:opacity-40 disabled:hover:bg-neutral-800 text-neutral-300 font-medium rounded-lg px-3 py-2 transition"
                        >
                          Histórico
                        </button>

                        <button
                          onClick={() => abrirRegistro(c)}
                          className="text-xs bg-orange-600 hover:brightness-110 text-black font-semibold rounded-lg px-3 py-2 transition"
                        >
                          + Registrar troca
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}
      </main>

      {registrando && (
        <div
          className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
          onClick={() => setRegistrando(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-[380px] max-w-full bg-neutral-900 border border-neutral-800 rounded-2xl p-8"
          >
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-semibold">Registrar troca</h2>
              <button
                type="button"
                onClick={() => setRegistrando(null)}
                className="text-neutral-500 hover:text-white transition p-1"
                title="Fechar"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>

            <p className="text-sm text-neutral-400 mb-5">{registrando.nome}</p>

            <form onSubmit={handleSalvarTroca} className="space-y-4">
              <div>
                <label className="block text-xs text-neutral-500 mb-1.5">Data da troca</label>
                <input
                  type="date"
                  value={dataTroca}
                  onChange={(e) => setDataTroca(e.target.value)}
                  required
                  className="w-full bg-neutral-800 border border-neutral-700 text-white text-sm rounded-lg px-3.5 py-3 outline-none focus:border-orange-600"
                />
              </div>
              <div>
                <label className="block text-xs text-neutral-500 mb-1.5">KM no momento da troca</label>
                <input
                  type="number"
                  value={kmTroca}
                  onChange={(e) => setKmTroca(e.target.value)}
                  required
                  className="w-full bg-neutral-800 border border-neutral-700 text-white text-sm rounded-lg px-3.5 py-3 outline-none focus:border-orange-600"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setRegistrando(null)}
                  className="flex-1 border border-neutral-700 text-neutral-300 text-sm rounded-lg py-3 hover:bg-neutral-800 transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={salvando}
                  className="flex-1 bg-orange-600 hover:brightness-110 disabled:brightness-75 text-black font-semibold text-sm rounded-lg py-3 transition"
                >
                  {salvando ? 'Salvando...' : 'Salvar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {historico && (
        <div
          className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
          onClick={() => setHistorico(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-[420px] max-w-full bg-neutral-900 border border-neutral-800 rounded-2xl p-8 max-h-[80vh] flex flex-col"
          >
            <div className="flex items-center justify-between mb-1">
              <h2 className="text-lg font-semibold">Histórico</h2>
              <button
                type="button"
                onClick={() => setHistorico(null)}
                className="text-neutral-500 hover:text-white transition p-1"
                title="Fechar"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>

            <p className="text-sm text-neutral-400 mb-5">{historico.nome}</p>

            <div className="space-y-2 overflow-y-auto">
              {trocasDoComponente(historico.id).map((t, index) => (
                <div
                  key={t.id}
                  className="bg-neutral-800/60 border border-neutral-800 rounded-lg px-4 py-3 flex items-center justify-between"
                >
                  <div>
                    <p className="text-sm font-medium">
                      {new Date(t.data_troca).toLocaleDateString('pt-BR')}
                    </p>
                    <p className="text-xs text-neutral-500">{t.km_na_troca.toLocaleString('pt-BR')} km</p>
                  </div>
                  {index === 0 && (
                    <span className="text-[10px] uppercase tracking-wide text-orange-500 font-semibold">
                      Mais recente
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <ChatWidget
        contexto={
          veiculo
            ? `Veículo: ${veiculo.marca} ${veiculo.modelo} ${veiculo.ano}, ${veiculo.km_atual} km. ${
                areaSelecionada ? `Área selecionada: ${LABELS_AREA[areaSelecionada]}` : ''
              }`
            : ''
        }
      />
    </div>
  )
}

export default VeiculoDetalhe