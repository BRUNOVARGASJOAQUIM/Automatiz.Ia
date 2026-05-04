# Implementação Prática: Fluxos WhatsApp + N8N para Sr. Altino

## 1. FLUXO DE AUTOMAÇÃO (N8N)

### 1.1 Trigger: Cliente Escaneia QR Code

```
QR CODE → Formulário Web (nome + WhatsApp)
    ↓
N8N Webhook recebe dados
    ↓
Validação de dados (WhatsApp válido)
    ↓
Verifica se cliente já existe na base
    ↓
Se novo: Dispara fluxo de Boas-vindas
Se retorno: Dispara fluxo de Bem-vindo de Volta
```

### 1.2 Fluxo de Boas-vindas (Novo Cliente)

```
T+0 min: Mensagem Imediata (Confirmação)
T+2 min: Enviar Menu de Ofertas
T+1 hora: Pergunta de Feedback
T+24 horas: Lembrete de Próxima Visita
T+72 horas: Oferta Especial
```

### 1.3 Fluxo de Re-engajamento (Cliente Retorno)

```
Se voltou <7 dias:
  └─ "Que legal! Voltou rápido! Próxima bebida com 10% OFF"

Se voltou 7-30 dias:
  └─ "Saudades seu! Novidade no menu..."

Se não volta há 30+ dias:
  └─ "Sente falta de você... Desconto de R$ 15 exclusive"
```

---

## 2. TEMPLATES DE MENSAGENS WHATSAPP

### 2.1 Mensagem 1: Confirmação Imediata (T+0)

```
📌 Primeiro Contato - CONVERSA

Olá {NOME}! 👋

Bem-vindo ao Sr. Altino! 🍻

Que legal você ter deixado seu contato por aqui! 
A partir de agora você receberá:

✅ Ofertas exclusivas
✅ Dicas de happy hour
✅ Eventos especiais
✅ Promoções surpresa

Nos vemos em breve? 😊

---

👉 PRÓXIMA MENSAGEM: Opções de ofertas
```

**Taxa esperada de abertura:** 95%+  
**Taxa esperada de resposta:** 20-30%

---

### 2.2 Mensagem 2: Menu de Ofertas (T+2)

```
📌 Catálogo - TEMPLATE

Escolha sua promoção para hoje:

🍺 HAPPY HOUR
   2 chopp por R$ 35
   (Seg-Sex 17-19h)

🥃 PETISCO ACOMPANHAMENTO
   Entrada + bebida = R$ 49
   (Terça a quinta)

🎉 CASAL
   2 drinks + entrada = R$ 79
   (Fim de semana)

Qual te interessa? 

---

💡 AÇÃO: Botão "Responda" ou clique em emoji
```

**Taxa esperada de clique:** 15-25%  
**Taxa esperada de conversão:** 8-12%

---

### 2.3 Mensagem 3: Feedback Simples (T+1 hora)

```
📌 Pesquisa Rápida - CONVERSACIONAL

Rápido feedback para a gente:

Como foi sua experiência hoje? 

😍 Perfeito! Voltei!
😊 Muito bom!
😐 Normal
😞 Pode melhorar

---

💡 AÇÃO: Reações emoji ou botões
```

**Taxa de resposta:** 25-35%  
**Valor:** Dados qualitativos para melhoria

---

### 2.4 Mensagem 4: Lembrete de Próxima Visita (T+24h)

```
📌 Retenção - CONVERSACIONAL

Ei {NOME}! 🎯

Ainda curte aquele ambiente? 
Semana que vem tem:

🎸 TERÇA: Music Session
📱 QUARTA: Promoção 2+1
🎉 SEXTA: Mais movimentado

Qual combina com você?

---

Deixa confirmar sua presença para apartar mesa! 📞
```

**Taxa de engajamento:** 20-30%  
**Taxa de retorno:** 40-50% (em 7 dias)

---

### 2.5 Mensagem 5: Oferta Especial (T+72h)

```
📌 Promoção - URGÊNCIA

Psiu, {NOME}! 🤫

Só pra você (e mais poucos):

🎁 PRÓXIMA VISITA COM 15% DE DESCONTO

Válido até domingo! ⏰

*Código: VOLTEI15*

---

Topa? Vem com um amigo e ele ganha 10% também! 👊
```

**Taxa de conversão:** 30-40%  
**Valor:** Altíssima taxa de retorno

---

### 2.6 Mensagem 6: Reengajamento (Inativo 30+ dias)

```
📌 Win-back - APELO EMOCIONAL

Oi {NOME}! 💭

Tempo que não te vejo por aqui... 

O bar tá diferente:
✨ Novo sistema de som
🍹 Drinks especiais do mês
👥 Galera da "época" voltando

Que tal reviver aquele feeling? 

🎯 Desconto especial: R$ 15 OFF em qualquer consumo

Próxima semana? 🍻

---

(Válido só para você!)
```

**Taxa de reativação:** 15-25%  
**Valor:** Recupera clientes dormentes

---

## 3. ESTRUTURA DO FORMULÁRIO (QR CODE)

### 3.1 Formulário Rápido (Máximo 10 segundos)

```html
<!-- Campo 1 (Obrigatório) -->
Nome: ________________

<!-- Campo 2 (Obrigatório) -->
WhatsApp: (__) 99999-9999

<!-- Campo 3 (Opcional) -->
É sua primeira vez aqui?
○ Sim  ○ Não

<!-- CTA -->
[ENVIAR]  [CANCELAR]
```

**Tempo de preenchimento:** 8-12 segundos  
**Taxa de conclusão:** 75-85% (se bem posicionado)

### 3.2 Fluxo Alternativo (Botão Rápido)

```
OPÇÃO A: Código para barra de QR
├─ Versão 1 (Básica): linktr.ee/sralvino
└─ Versão 2 (Customizada): sralvino.app/whatsapp

OPÇÃO B: Número direto
├─ Cliente clica em número
└─ Abre WhatsApp com mensagem pré-salva

OPÇÃO C: Link WhatsApp (N8N + Twilio)
├─ QR aponta para link especial
└─ Automação inicia ao clicar
```

---

## 4. INTEGRAÇÃO N8N - FLUXOGRAMA

### 4.1 Arquitetura Completa

```
┌─────────────────────────────────────────────────────────┐
│                        CLIENTE                         │
│         (Escaneia QR → Preenche Form → Envia)          │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
        ┌──────────────────────────┐
        │   FORMULÁRIO WEB         │
        │   (Google Forms / Airtable│
        │    + validação)          │
        └────────────┬─────────────┘
                     │
                     ▼
   ┌─────────────────────────────────────┐
   │        N8N WEBHOOK TRIGGER          │
   │   (Recebe dados em tempo real)      │
   └────────────┬────────────────────────┘
                │
          ┌─────┴──────┐
          │ Validação  │
          │ de dados   │
          └──────┬─────┘
                 │
          ┌──────┴──────────────┐
          │ Verifica em BD      │
          │ se cliente já existe│
          └──────┬──────────────┘
                 │
         ┌───────┴────────┐
         │                │
    ┌────▼─────┐     ┌────▼─────┐
    │  NOVO    │     │ RETORNO  │
    │ CLIENTE  │     │ CLIENTE  │
    └────┬─────┘     └────┬─────┘
         │                │
    ┌────▼────────────────┴─────┐
    │  ADICIONA À BASE DE DADOS  │
    │  (Airtable / Google Sheet) │
    └────┬─────────────────────┘
         │
    ┌────▼──────────────────────┐
    │  DISPARA AUTOMAÇÃO        │
    │  WhatsApp via Twilio      │
    │  (Mensagem de Bem-vinda)  │
    └────┬──────────────────────┘
         │
    ┌────▼────────────────┐
    │  AGENDA PRÓXIMAS    │
    │  MENSAGENS (24h,3d) │
    └─────────────────────┘
```

### 4.2 Nodes N8N Necessários

```
1. Webhook Trigger
   ├─ Recebe POST de formulário
   └─ Valida estrutura JSON

2. Validação
   ├─ Verifica WhatsApp válido
   ├─ Remove caracteres especiais
   └─ Formata para padrão +55

3. Lookup Airtable
   ├─ Procura cliente na base
   └─ Retorna ID ou novo registro

4. If/Then
   ├─ Se novo: → Novo cliente
   └─ Se retorno: → Cliente retorno

5. Airtable Create/Update
   ├─ Cria ou atualiza registro
   └─ Adiciona timestamp

6. Twilio Send WhatsApp
   ├─ Envia mensagem template
   └─ Log em Airtable

7. Schedule Trigger
   ├─ Agendado para T+24h
   └─ Envia próxima mensagem
```

---

## 5. DADOS ESPERADOS EM AIRTABLE (Base de Clientes)

### 5.1 Estrutura de Tabela

| Campo | Tipo | Exemplo | Obrigatório |
|-------|------|---------|------------|
| ID | AutoIncrement | 001 | ✅ |
| Nome | Texto | João Silva | ✅ |
| WhatsApp | Telefone | +5511987654321 | ✅ |
| Data Primeiro Contato | Data | 2026-04-18 | ✅ |
| Status | Seleção | Novo / Ativo / Inativo | ✅ |
| Última Visita | Data | 2026-04-20 | ⚠️ |
| Visitas Total | Número | 3 | ⚠️ |
| Receita Total | Moeda | R$ 450 | ⚠️ |
| Ticket Médio | Moeda | R$ 150 | 📊 |
| Frequency (visitas/mês) | Número | 2.5 | 📊 |
| Preferência (Happy Hour/Noite) | Seleção | Happy Hour | ⚠️ |
| Mensagens Enviadas | Número | 5 | 📊 |
| Taxa Abertura | % | 92% | 📊 |
| Última Mensagem | Texto | Oferta 15% OFF | 📊 |
| Score Engagement | Número 1-100 | 75 | 📊 |

### 5.2 Fluxos de Status

```
NOVO CLIENTE
    ↓
T+24h → ATIVO (se abrir mensagem)
    ↓ (se não abrir)
T+72h → MORNO (reenviar oferta)
    ↓ (se não retornar em 30d)
T+30d → INATIVO (hibernado)
    ↓ (se retorna)
REATIVADO (oferta especial)
```

---

## 6. MÉTRICAS DE ACOMPANHAMENTO

### 6.1 Dashboard em Tempo Real

```
MÉTRICAS DIÁRIAS
├─ Leads capturados hoje: [X]
├─ Taxa de abertura: [X]%
├─ Conversões hoje: [X]
└─ Receita adicional: R$ [X]

MÉTRICAS SEMANAIS
├─ Total leads: [X]
├─ Taxa conversão: [X]%
├─ Novos clientes: [X]
├─ Receita semanal: R$ [X]
└─ Trending: ↑ / → / ↓

MÉTRICAS MENSAIS
├─ Total leads: [X]
├─ Conversão média: [X]%
├─ Novos clientes: [X]
├─ Receita mensal: R$ [X]
├─ AOV (Avg Order Value): R$ [X]
├─ Frequency: [X] visitas/cliente
└─ Retenção: [X]%
```

### 6.2 Fórmulas em Airtable

```javascript
// Taxa de Conversão
= COUNTA(IF(Status="Ativo")) / COUNTA(ID) * 100

// Receita Total
= SUMIF("Receita Total") 

// AOV (Ticket Médio)
= AVERAGE("Receita Total" / "Visitas Total")

// Frequency
= AVERAGE("Visitas Total" / 
         (TODAY() - "Data Primeiro Contato")) * 30

// Churn (perdas)
= COUNTA(IF(Status="Inativo")) / COUNTA(ID) * 100

// Score Engagement
= (Taxa_Abertura*0.4 + Frequencia*0.3 + 
   Receita*0.2 + Retention*0.1) / 100
```

---

## 7. CHECKLIST DE IMPLEMENTAÇÃO

### SEMANA 1: Setup Técnico

- [ ] **Dia 1-2: Infraestrutura**
  - [ ] Criar conta Airtable (ou Google Sheets)
  - [ ] Criar conta Twilio (ou MessageBird)
  - [ ] Setup N8N (local ou cloud)
  - [ ] Gerar chave de API

- [ ] **Dia 3-4: Formulário**
  - [ ] Criar formulário web (Google Forms ou Typeform)
  - [ ] Testar validação de dados
  - [ ] Gerar QR Code
  - [ ] Preparar materiais impressão

- [ ] **Dia 5-7: Automação**
  - [ ] Criar webhook em N8N
  - [ ] Testar integração Twilio
  - [ ] Programar mensagens template
  - [ ] Testar fluxo completo

---

### SEMANA 2: Teste com Clientes

- [ ] **Dia 1-2: Testes Internos**
  - [ ] 5 pessoas testam QR
  - [ ] Coleta feedback em tempo real
  - [ ] Ajusta mensagens conforme feedback
  - [ ] Valida entrega de mensagens

- [ ] **Dia 3-4: Beta com Clientes Selecionados**
  - [ ] Convida 20 clientes VIP
  - [ ] Monitora taxa de conversão
  - [ ] Documenta problemas
  - [ ] Faz ajustes urgentes

- [ ] **Dia 5-7: Refinamento**
  - [ ] Análise de dados coletados
  - [ ] Otimiza fluxos com maior taxa conversão
  - [ ] Treina staff
  - [ ] Pronto para launch!

---

### SEMANA 3: Launch em Produção

- [ ] **Dia 1-2: Deployment**
  - [ ] Deploy do formulário oficial
  - [ ] Ativa N8N em produção
  - [ ] Confere logs
  - [ ] Monitora 24/7

- [ ] **Dia 3-5: Promoção Interna**
  - [ ] Staff sabe sobre QR
  - [ ] Clientes informados no bar
  - [ ] Cartazes e avisos colocados
  - [ ] Desconto de incentivo pronto (opcional)

- [ ] **Dia 6-7: Monitoramento**
  - [ ] Verifica leads capturados
  - [ ] Taxa de abertura de mensagens
  - [ ] Taxa de conversão
  - [ ] Respostas via chat

---

### SEMANA 4+: Otimização Contínua

- [ ] **Diário**
  - [ ] Verifica novo leads
  - [ ] Responde mensagens (chat)
  - [ ] Log de problemas

- [ ] **Semanal**
  - [ ] Análise de dados
  - [ ] Testa variações de mensagens
  - [ ] Identifica padrões de conversão

- [ ] **Mensal**
  - [ ] Relatório completo de ROI
  - [ ] Decisões de ajuste
  - [ ] Planejamento próximo mês

---

## 8. TROUBLESHOOTING COMUM

### Problema 1: Taxa Captura Baixa (<5%)

```
❌ Sintoma: Poucos leads entram
✅ Causa raiz: QR Code não visível/acessível

Soluções rápidas:
1. Mover QR para local mais visível
2. Adicionar explicação na mesa ("Escaneie para oferta")
3. Treinamento de staff para mencionar
4. Aumentar tamanho do QR
5. Teste: Depois de 1 semana, verificar taxa
```

### Problema 2: Mensagens Não Chegam

```
❌ Sintoma: WhatsApp aparece erro/timeout
✅ Causa raiz: Problema Twilio / Internet

Soluções rápidas:
1. Verificar saldo Twilio
2. Testar conexão internet
3. Relogar em N8N
4. Usar backup (MessageBird)
5. Teste: Enviar mensagem teste
```

### Problema 3: Taxa Conversão Baixa (<2%)

```
❌ Sintoma: Leads não retornam
✅ Causa raiz: Qualidade de mensagem / Timing

Soluções rápidas:
1. A/B testar 2 versões de mensagem
2. Mudar timing (tentar T+6h vs T+24h)
3. Adicionar incentivo (desconto)
4. Simplificar mensagem
5. Teste: 1-2 semanas por mudança
```

### Problema 4: Clientes Não Retornam (Churn)

```
❌ Sintoma: 1ª visita não vira 2ª
✅ Causa raiz: Experiência ruim / Mensagem fraca

Soluções rápidas:
1. Verificar feedback inicial (chat)
2. Revisar experiência no bar
3. Oferta mais agressiva
4. Follow-up mais rápido (3h vs 24h)
5. Teste: Entender raiz do problema
```

---

## 9. TEMPLATES PRONTOS PARA COPIAR

### Template 1: Mensagem Inicial (Copy-Paste)

```
📌 MENSAGEM IMEDIATA

Olá {NOME}! 👋

Bem-vindo ao Sr. Altino! 🍻

Que legal você ter deixado seu contato!
A partir de agora:
✅ Ofertas exclusivas
✅ Promos happy hour
✅ Eventos especiais

Nos vemos em breve? 😊

---
[PRÓXIMA AÇÃO]
```

---

### Template 2: Lembrete Retorno

```
📌 RETORNO (Se voltou <7 dias)

Que rapidinhooo! 🚀

Volta logo pra fechar a taca conosco?

PROMOÇÃO: 2 chopp por R$ 30
(Só pra você, hoje e amanhã)

Topa? 🍻
```

---

### Template 3: Win-Back (Inativo 30+ dias)

```
📌 WIN-BACK

Oi {NOME}! 

Saudades! 💭
Bar tá com novidades:
🎸 Música ao vivo
🍹 Drinks especiais
👥 Galera voltando

DESCONTO: R$ 15 OFF (código VOLTEI)

Semana que vem? 🍻
```

---

## 10. PRÓXIMOS PASSOS

```
IMEDIATO (Esta semana):
└─ Criar fluxo básico N8N
└─ Testar com 3-5 pessoas

CURTO PRAZO (Próximas 2 semanas):
└─ Deploy em produção
└─ Treinar staff
└─ Monitorar 24/7

MÉDIO PRAZO (Próximos 30 dias):
└─ Coletar 200+ dados
└─ Análise de conversão
└─ Otimização baseada em dados

LONGO PRAZO (Próximos 90 dias):
└─ Expandir para Email + SMS
└─ Integração com POS
└─ Dashboard em tempo real
```

---

**Documento preparado para:** Implementação no Sr. Altino  
**Última atualização:** 2026-04-18  
**Responsável:** Showzap Team
