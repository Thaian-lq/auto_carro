import os
from google import genai
from dotenv import load_dotenv

load_dotenv()

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

PROMPT_SISTEMA = """Você é o assistente de manutenção do AutoCare, especialista em mecânica automotiva.

Responda de forma direta e prática, em português do Brasil. Foque em:
- Explicar pra que serve cada componente do carro
- Tirar dúvidas sobre manutenção preventiva
- Interpretar os dados de troca que o usuário já tem registrados

Se não souber algo com certeza, diga isso claramente em vez de inventar. Não dê diagnósticos definitivos de problemas graves — recomende procurar um mecânico nesses casos."""


def gerar_resposta(pergunta: str, contexto: str = "") -> str:
    prompt_completo = f"{PROMPT_SISTEMA}\n\n"
    if contexto:
        prompt_completo += f"Contexto do veículo do usuário:\n{contexto}\n\n"
    prompt_completo += f"Pergunta do usuário: {pergunta}"

    resposta = client.models.generate_content(
        model="gemini-2.5-flash-lite",
        contents=prompt_completo,
    )
    return resposta.text