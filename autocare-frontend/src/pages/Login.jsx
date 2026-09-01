import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { login } from '../services/api'
import AutoDoodleBackground from '../components/AutoDoodleBackground'

function Login() {
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [erro, setErro] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()
    setErro('')
    setLoading(true)

    try {
      const data = await login(email, senha)
      localStorage.setItem('token', data.access_token)
      navigate('/dashboard')
    } catch (err) {
      setErro('Email ou senha incorretos')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center relative overflow-hidden">
      <AutoDoodleBackground />

      <div className="w-[400px] max-w-[92vw] bg-neutral-900 border border-neutral-800 rounded-2xl p-10 relative z-10">
        <div className="flex items-center gap-3 mb-7">
          <div className="w-9 h-9 rounded-lg bg-orange-600 flex items-center justify-center">
            <span className="text-xs font-bold text-black">AC</span>
          </div>
          <div>
            <div className="text-sm font-semibold text-white">Carro ta em dia</div>
            <div className="text-xs text-neutral-500 uppercase">Saúde do veículo</div>
          </div>
        </div>

        <h1 className="text-xl font-semibold text-white mb-1">Entrar na conta</h1>
        <p className="text-sm text-neutral-500 mb-6">
          Acompanhe a manutenção do seu carro.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs text-neutral-500 mb-1.5">E-mail</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="voce@email.com"
              required
              className="w-full bg-neutral-800 border border-neutral-700 text-white text-sm rounded-lg px-3.5 py-3 outline-none focus:border-orange-600 focus:ring-2 focus:ring-orange-600/20"
            />
          </div>

          <div>
            <label className="block text-xs text-neutral-500 mb-1.5">Senha</label>
            <input
              type="password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              placeholder="••••••••"
              required
              className="w-full bg-neutral-800 border border-neutral-700 text-white text-sm rounded-lg px-3.5 py-3 outline-none focus:border-orange-600 focus:ring-2 focus:ring-orange-600/20"
            />
          </div>

          {erro && (
            <p className="text-red-500 text-xs">{erro}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-orange-600 hover:brightness-110 disabled:brightness-75 text-black font-semibold text-sm rounded-lg py-3 mt-2 transition"
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
        <p className="text-center text-sm text-neutral-500 mt-6">
          Ainda não tem conta?{' '}
          <Link to="/cadastro" className="text-orange-600 font-semibold hover:underline">
            Criar conta
          </Link>
        </p>
      </div>
    </div>
  )
}

export default Login