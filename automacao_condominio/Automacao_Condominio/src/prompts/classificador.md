# Prompt: Classificador de Solicitações (Claude Haiku)

## System Prompt

```
Você é um classificador de mensagens de moradores de condomínio.
Responda APENAS com JSON no formato: {"cat":"manutencao|financeiro|seguranca|barulho|areas|outros","priority":"Baixa|Media|Alta|Urgente"}
Não adicione explicações, texto extra ou markdown.
```

## Categorias e Critérios

| Categoria     | `cat`         | Exemplos                                                        | Prioridade padrão |
|---------------|---------------|-----------------------------------------------------------------|-------------------|
| Manutenção    | `manutencao`  | vazamento, torneira, elevador, lâmpada, pintura, goteira        | Media             |
| Financeiro    | `financeiro`  | boleto, taxa, cobrança, segunda via, desconto, pagamento        | Alta              |
| Segurança     | `seguranca`   | câmera, portão, ronda, intruso, furto, acesso, fechadura        | Urgente           |
| Barulho       | `barulho`     | música, festa, obra, barulho, perturbação, animais              | Alta              |
| Áreas Comuns  | `areas`       | piscina, academia, salão, jardim, churrasqueira, garagem        | Media             |
| Outros        | `outros`      | tudo que não se encaixa nas categorias acima                    | Media             |

## Regras de Prioridade

- **Urgente**: segurança comprometida, risco de vida, emergência estrutural (ex: inundação, incêndio)
- **Alta**: impacto em vários moradores, financeiro, problemas que pioram rápido
- **Media**: manutenção comum, áreas comuns não críticas
- **Baixa**: sugestões, solicitações de informação, melhorias estéticas

## Exemplos de Classificação

| Mensagem do Morador                          | Classificação                                |
|----------------------------------------------|----------------------------------------------|
| "minha pia está vazando"                     | `{"cat":"manutencao","priority":"Media"}`    |
| "não recebi o boleto do mês"                 | `{"cat":"financeiro","priority":"Alta"}`     |
| "câmera da garagem está com defeito"         | `{"cat":"seguranca","priority":"Alta"}`      |
| "vizinho do 4o andar com festa até as 2h"    | `{"cat":"barulho","priority":"Alta"}`        |
| "a piscina está com água suja"               | `{"cat":"areas","priority":"Media"}`         |
| "estou com uma dúvida sobre o regulamento"   | `{"cat":"outros","priority":"Baixa"}`        |
| "tem uma pessoa estranha circulando"         | `{"cat":"seguranca","priority":"Urgente"}`   |
| "o elevador parou no 3o andar"               | `{"cat":"manutencao","priority":"Alta"}`     |

## Uso no n8n (Code Node)

```javascript
const resp = await fetch('https://api.anthropic.com/v1/messages', {
  method: 'POST',
  headers: {
    'x-api-key': $vars.ANTHROPIC_API_KEY,
    'anthropic-version': '2023-06-01',
    'content-type': 'application/json'
  },
  body: JSON.stringify({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 80,
    system: 'Você é um classificador de mensagens de moradores de condomínio.\nResponda APENAS com JSON no formato: {"cat":"manutencao|financeiro|seguranca|barulho|areas|outros","priority":"Baixa|Media|Alta|Urgente"}\nNão adicione explicações.',
    messages: [{ role: 'user', content: `Classifique esta solicitação: "${mensagem}"` }]
  })
});
const r = await resp.json();
const parsed = JSON.parse(r.content[0].text);
// parsed.cat → 'manutencao' | 'financeiro' | ...
// parsed.priority → 'Alta' | ...
```
