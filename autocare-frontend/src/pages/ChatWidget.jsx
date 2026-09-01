import { useState, useRef, useEffect } from 'react'
import { enviarMensagemChat } from '../services/api'

function ChatWidget({ contexto = '' }) {
  const [aberto, setAberto] = useState(false)
  const [mensagens, setMensagens] = useState([
    { autor: 'bot', texto: 'Oi! Sou o assistente do AutoCare. Pode perguntar sobre manutenção do seu carro.' },
  ])
  const [input, setInput] = useState('')
  const [carregando, setCarregando] = useState(false)
  const fimRef = useRef(null)

  useEffect(() => {
    fimRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [mensagens, aberto])

  async function handleEnviar(e) {
    e.preventDefault()
    const pergunta = input.trim()
    if (!pergunta) return

    setMensagens((prev) => [...prev, { autor: 'user', texto: pergunta }])
    setInput('')
    setCarregando(true)

    try {
      const data = await enviarMensagemChat(pergunta, contexto)
      setMensagens((prev) => [...prev, { autor: 'bot', texto: data.resposta }])
    } catch (err) {
      setMensagens((prev) => [...prev, { autor: 'bot', texto: 'Erro ao responder. Tenta de novo.' }])
    } finally {
      setCarregando(false)
    }
  }

  return (
    <>
      <button
        onClick={() => setAberto((v) => !v)}
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-orange-600 hover:brightness-110 shadow-lg shadow-orange-600/20 flex items-center justify-center transition z-40"
        title="Assistente AutoCare"
      >
        {aberto ? (
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#1a0d05" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#1a0d05" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
          </svg>
        )}
      </button>

      {aberto && (
        <div className="fixed bottom-24 right-6 w-[360px] max-w-[90vw] h-[480px] max-h-[70vh] bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl flex flex-col z-40 overflow-hidden">
          <div className="px-5 py-4 border-b border-neutral-800 bg-neutral-950/50">
            <div className="text-sm font-semibold text-white">Assistente AutoCare</div>
            <div className="text-xs text-neutral-500">Tire dúvidas sobre manutenção</div>
          </div>

          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
            {mensagens.map((m, i) => (
              <div
                key={i}
                className={`flex ${m.autor === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] text-sm px-3.5 py-2.5 rounded-2xl ${
                    m.autor === 'user'
                      ? 'bg-orange-600 text-black font-medium rounded-br-sm'
                      : 'bg-neutral-800 text-neutral-200 rounded-bl-sm'
                  }`}
                >
                  {m.texto}
                </div>
              </div>
            ))}

            {carregando && (
              <div className="flex justify-start">
                <div className="bg-neutral-800 text-neutral-400 text-sm px-3.5 py-2.5 rounded-2xl rounded-bl-sm">
                  Digitando...
                </div>
              </div>
            )}

            <div ref={fimRef} />
          </div>

          <form onSubmit={handleEnviar} className="p-3 border-t border-neutral-800 flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Digite sua dúvida..."
              className="flex-1 bg-neutral-800 border border-neutral-700 text-white text-sm rounded-lg px-3 py-2.5 outline-none focus:border-orange-600"
            />
            <button
              type="submit"
              disabled={carregando}
              className="bg-orange-600 hover:brightness-110 disabled:brightness-75 text-black rounded-lg px-4 transition"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="22" y1="2" x2="11" y2="13"></line>
                <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
              </svg>
            </button>
          </form>
        </div>
      )}
    </>
  )
}

export default ChatWidget