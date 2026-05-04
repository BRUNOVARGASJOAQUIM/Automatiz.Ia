# Prompt para Geração de Apresentação PPT — site-mkt-sr.altino

## Instrução para o Claude

Crie uma apresentação PowerPoint profissional com base no conteúdo abaixo. Use `python-pptx` para gerar o arquivo `.pptx`. A apresentação é para o projeto **Sr. Altino — Automatiz.Ai** e deve ter visual moderno, dark theme (fundo escuro #1A1A2E, destaque #E94560, texto branco). Cada slide deve ter título, conteúdo principal e, quando indicado, dados visuais (tabelas, bullets, ícones textuais).

**Gere o código Python completo e execute para produzir o arquivo `apresentacao-sr-altino.pptx`.**

---

## Identidade Visual

| Elemento | Valor |
|---|---|
| Fundo principal | `#1A1A2E` (azul-escuro) |
| Cor de destaque | `#E94560` (vermelho-rosa) |
| Cor secundária | `#0F3460` (azul médio) |
| Texto principal | `#FFFFFF` |
| Texto secundário | `#B0B0C0` |
| Fonte títulos | Montserrat Bold (ou Calibri Bold fallback) |
| Fonte corpo | Open Sans (ou Calibri fallback) |
| Formato | 16:9 (widescreen) |

---

## Slides

---

### Slide 1 — Capa

**Layout:** Capa centralizada  
**Título:** `Sr. Altino`  
**Subtítulo:** `De Bar a Ecossistema Digital`  
**Linha inferior:** `WhatsApp Automation · Marketing Digital · Dashboard Proprietário`  
**Rodapé:** `Automatiz.Ai · Abril 2026`

---

### Slide 2 — O Problema

**Título:** `O Problema: 98% dos Clientes Somem`

**Conteúdo (bullets):**
- ✗ 98% dos clientes saem sem deixar contato
- ✗ Sem follow-up = sem conversão
- ✗ Crescimento estagnado: apenas 2–3 novos clientes/mês
- ✗ Zero dados sobre o perfil dos clientes
- ✗ Campanhas manuais, lentas, ineficientes

**Destaque lateral (caixa):**
> "Custo por lead = ∞  
> (porque simplesmente não captura)"

---

### Slide 3 — O Cliente

**Título:** `Sr. Altino Bar & Eventos`

**Conteúdo (dois blocos lado a lado):**

Bloco esquerdo — Contexto:
- Segmento: Bar e eventos, Zona Oeste — SP
- Mercado competitivo com bares similares
- Público: frequentadores regulares + eventos

Bloco direito — Situação inicial:
- Taxa de captura de leads: 2–5%
- Taxa de conversão: < 1%
- Novos clientes/mês: 2–3
- Ferramentas: zero automação

---

### Slide 4 — A Solução

**Título:** `A Solução: Ecossistema de Automação`

**Conteúdo (3 pilares em colunas):**

| Frontend | Automação | Infraestrutura |
|---|---|---|
| Site público (index.html) | n8n (orquestração) | Netlify (deploy) |
| Login seguro (JWT) | Twilio (WhatsApp API) | Docker + Nginx |
| Dashboard proprietário | Airtable/Sheety (dados) | GitHub (CI/CD) |
| QR Code de captura | Webhooks automáticos | SSL + Security Headers |

---

### Slide 5 — Fluxo de Funcionamento

**Título:** `Como Funciona — Do QR ao Cliente Fidelizado`

**Conteúdo (fluxo linear com setas):**

```
Cliente escaneia QR Code na mesa
        ↓
Preenche formulário (10 segundos)
        ↓
n8n recebe e valida os dados
        ↓
Salva automaticamente no Airtable
        ↓
Twilio dispara WhatsApp < 1 minuto
        ↓
Follow-up automático: 24h · 3 dias · 7 dias
        ↓
Cliente fidelizado ✓
```

**Nota de rodapé:** Tempo total do processo: < 60 segundos. Sem intervenção humana.

---

### Slide 6 — Funcionalidades do Frontend

**Título:** `Frontend — 4 Páginas, 1 Experiência`

**Conteúdo (lista descritiva):**

- **index.html** — Página principal com formulário VIP e reservas, QR Code e fila offline (funciona sem internet)
- **login.html** — Autenticação com rate limiting (5 tentativas → bloqueio 15 min)
- **proprietario.html** — Dashboard com abas: Resumo · Indicadores · Leads · Campanhas
- **confirmar.html** — Confirmação de cadastro e agradecimento ao cliente

**Destaques de segurança:**
- JWT com expiração 30 min + refresh automático
- SessionStorage (nunca localStorage)
- Proteção contra acesso direto a rotas protegidas
- Sincronização de logout entre abas

---

### Slide 7 — Automação WhatsApp (n8n)

**Título:** `Automação — n8n + Twilio + WhatsApp`

**Conteúdo (dois blocos):**

Bloco esquerdo — O que está configurado:
- Webhook receptor de leads
- Validação e normalização de dados
- Integração Twilio (WhatsApp Business)
- Sequência de follow-up (24h, 3d, 7d)
- Campanhas em massa (throttle 5 msg/seg)

Bloco direito — Mensagens automáticas:
- Boas-vindas imediata (< 1 min)
- Oferta especial após 24h
- Lembrete de retorno em 3 dias
- Pesquisa de satisfação em 7 dias
- Campanhas segmentadas (VIP vs. reserva)

---

### Slide 8 — Resultados Esperados

**Título:** `Impacto: Antes × Depois`

**Tabela comparativa:**

| Métrica | Antes | Depois | Crescimento |
|---|---|---|---|
| Leads/semana | 5–15 | 50–75 | **5–7×** |
| Taxa de conversão | < 1% | 7% | **7×+** |
| Novos clientes/mês | 2–3 | 15–20 | **6–8×** |
| Receita adicional/ano | R$ 0 | R$ 31.600 | **∞** |
| Frequência de retorno | base | +30–40% | **+35%** |

**Nota:** Projeções conservadoras baseadas em benchmarks do setor.

---

### Slide 9 — Case Financeiro

**Título:** `ROI: Payback em 4 Meses`

**Conteúdo (3 blocos):**

Bloco 1 — Investimento inicial:
- Setup n8n: R$ 2.000–3.000
- WhatsApp API (Twilio): R$ 500–1.000
- QR Codes físicos: R$ 200
- Treinamento: R$ 1.000
- **Total: R$ 5.000**

Bloco 2 — Custo recorrente (mensal):
- WhatsApp Business: R$ 500–800
- Servidor n8n: R$ 300–500
- Gestão e manutenção: R$ 500
- **Total/mês: R$ 1.600**

Bloco 3 — Resultado:
- Lucro incremental/mês: **R$ 2.633**
- Payback: **Mês 4**
- ROI Ano 1: **65%**
- ROI Ano 2+: **> 100%**

---

### Slide 10 — Comparação de Alternativas

**Título:** `Por Que WhatsApp + n8n?`

**Tabela comparativa:**

| Canal | Investimento | ROI Ano 1 | Payback | Complexidade |
|---|---|---|---|---|
| Google Ads | R$ 5.000 | 20% | 12 meses | Média |
| Social Media Ads | R$ 3.000 | 15% | 14 meses | Média |
| Influencer | R$ 10.000 | 25% | 10 meses | Alta |
| Email Marketing | R$ 2.000 | 10% | 18 meses | Baixa |
| Fidelização Manual | R$ 3.000 | 30% | 8 meses | Alta |
| **WhatsApp + n8n** | **R$ 5.000** | **65%** | **4 meses** | **Baixa** |

**Destaque:** WhatsApp + n8n é a melhor relação custo-benefício disponível.

---

### Slide 11 — Timeline de Implementação

**Título:** `Implementação: 3 Semanas para o Ar`

**Conteúdo (linha do tempo horizontal):**

| Semana 1 | Semana 2 | Semana 3 | Semana 4+ |
|---|---|---|---|
| Setup técnico | Testes com VIPs | Launch oficial | Monitoramento |
| n8n + Twilio + Airtable | Beta com 20 clientes | Deploy em produção | A/B testing |
| Configuração webhooks | Ajustes de mensagens | QR Codes posicionados | Otimização contínua |
| Deploy Netlify | Validação de fluxos | Treinamento equipe | Relatórios semanais |

---

### Slide 12 — Stack Tecnológico

**Título:** `Tecnologia Usada`

**Conteúdo (grid de tecnologias):**

Frontend:
- HTML5 + CSS3 + JavaScript (vanilla)
- Netlify (deploy estático, CI/CD automático)
- JWT (autenticação frontend)

Automação:
- n8n (orquestração de workflows)
- Twilio (WhatsApp Business API)
- Airtable / Sheety (banco de dados)

Infraestrutura:
- Docker + Nginx (containerização)
- GitHub (versionamento, 4 versões rastreadas)
- Let's Encrypt (SSL automático)

---

### Slide 13 — Roadmap

**Título:** `Próximas Etapas`

**Conteúdo (3 horizontes):**

Curto prazo (próximas 2 semanas):
- Conectar Netlify ao domínio do Sr. Altino
- Implementar backend Node.js para JWT assinado
- Ativar integrações n8n em produção

Médio prazo (próximos 2 meses):
- 2FA com Google Authenticator
- Rate limiting no servidor (bcrypt + Redis)
- Integração com email marketing
- Analytics avançado (Google Analytics 4)

Longo prazo (3–6 meses):
- Integração CRM (Hubspot ou Pipedrive)
- IA para personalização de mensagens
- Expansão para SMS
- Logs centralizados e auditoria

---

### Slide 14 — Proposta Comercial

**Título:** `Planos Disponíveis`

**Tabela de planos:**

| | Básico | Profissional | Enterprise |
|---|---|---|---|
| Implementação | R$ 2.500 | R$ 4.000 | R$ 6.000 |
| Manutenção/mês | R$ 500 | R$ 900 | R$ 1.500 |
| Total Ano 1 | R$ 8.500 | R$ 14.800 | R$ 24.000 |
| Formulários | 2 | 3+ | Ilimitado |
| Suporte/mês | 5h | 10h | Prioritário 24h |
| Dashboard KPIs | Básico | Avançado | Completo + IA |
| Campanhas auto | Não | Sim | Sim |
| CRM Integration | Não | Não | Sim |

**Oferta de lançamento:** 15% off na implementação + 1º mês 50% off (válido até 30/04/2026)

---

### Slide 15 — Encerramento / CTA

**Layout:** Capa (igual ao slide 1, mas com CTA)  
**Título:** `Pronto para Triplicar sua Base de Clientes?`  
**Subtítulo:** `Começamos esta semana.`

**Conteúdo (3 passos):**
1. Agendar demo (30 min)
2. Setup em 2–3 semanas
3. Resultados no mês 1

**Rodapé:**
- Automatiz.Ai
- bruno.vargas.joaquim@gmail.com
- GitHub: BRUNOVARGASJOAQUIM/automatiz-showzap-sr-altino

---

## Notas de Design para o Claude

1. **Slide de capa e encerramento:** fundo totalmente escuro com título grande centralizado, sem grade.
2. **Slides de conteúdo:** barra lateral ou header colorido (`#E94560`) com o título, fundo `#1A1A2E`.
3. **Tabelas:** linhas alternadas `#0F3460` e `#1A1A2E`, cabeçalho `#E94560`.
4. **Bullets:** use marcadores `·` ou `▸` em vez de bolinhas padrão.
5. **Fluxo (Slide 5):** use caixas retangulares conectadas por setas, tudo em texto simples se não houver suporte a shapes.
6. **Números de impacto:** destacar em tamanho maior e cor `#E94560` (ex.: `5–7×`, `65%`, `4 meses`).
7. **Rodapé em todos os slides:** `Automatiz.Ai · Confidencial · Abril 2026` em texto pequeno cinza.
8. **Total de slides:** 15

---

## Comando Sugerido para Executar

```
Crie e execute um script Python usando python-pptx que gere a apresentação
"apresentacao-sr-altino.pptx" com os 15 slides definidos acima. 
Aplique o tema dark (#1A1A2E / #E94560 / #0F3460). 
Salve o arquivo na pasta atual.
```
