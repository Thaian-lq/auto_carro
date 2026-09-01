import axios from 'axios'

const api = axios.create({
  baseURL: 'http://127.0.0.1:8000',
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export async function login(email, senha) {
  const response = await api.post('/auth/login', { email, senha })
  return response.data
}

export async function registrar(nome, email, senha) {
  const response = await api.post('/auth/registro', { nome, email, senha })
  return response.data
}

export async function criarVeiculo(dados) {
  const response = await api.post('/veiculos/', dados)
  return response.data
}

export async function listarVeiculos() {
  const response = await api.get('/veiculos/')
  return response.data
}

export async function deletarVeiculo(id) {
  const response = await api.delete(`/veiculos/${id}`)
  return response.data
}

export async function editarVeiculo(id, dados) {
  const response = await api.put(`/veiculos/${id}`, dados)
  return response.data
}

export async function listarComponentesPorArea(area) {
  const response = await api.get(`/veiculos/componentes/${area}`)
  return response.data
}

export async function registrarTroca(veiculoId, dados) {
  const response = await api.post(`/veiculos/${veiculoId}/trocas`, dados)
  return response.data
}

export async function listarTrocas(veiculoId) {
  const response = await api.get(`/veiculos/${veiculoId}/trocas`)
  return response.data
}

export async function enviarMensagemChat(pergunta, contexto = '') {
  const response = await api.post('/chat/', { pergunta, contexto })
  return response.data
}

export default api