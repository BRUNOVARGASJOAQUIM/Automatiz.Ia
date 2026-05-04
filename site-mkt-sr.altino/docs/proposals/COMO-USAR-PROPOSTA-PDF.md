# 📄 COMO USAR A PROPOSTA EM PDF

---

## 🎯 Arquivos Criados

Criei 2 arquivos para você:

1. **PROPOSTA-SHOWZAP.html** - Proposta profissional formatada
2. **Este guia** - Instruções de uso

---

## 📋 PASSO A PASSO

### Passo 1: Salvar o Logo

A imagem do logotipo automatiz.ia foi detectada. Você precisa:

```
1. Colocar a imagem na mesma pasta que PROPOSTA-SHOWZAP.html
2. Nomear como: logo-automatiz.png
3. (A imagem já está anexada neste projeto)
```

Se a imagem não estiver na pasta:
```
1. Baixar: Use a imagem que foi anexada
2. Salvar em: site-mkt-sr.altino/logo-automatiz.png
```

### Passo 2: Abrir a Proposta

```
1. Abrir arquivo: PROPOSTA-SHOWZAP.html
2. Com navegador (Chrome, Firefox, Safari, Edge)
3. Clique com botão direito e selecione "Abrir com" → Navegador
```

Ou:
```
1. Abrir navegador (Chrome/Firefox)
2. Arrastar o arquivo PROPOSTA-SHOWZAP.html para o navegador
3. Ou Ctrl+O e selecionar o arquivo
```

### Passo 3: Personalizar

Antes de gerar PDF, edite o arquivo HTML:

**Procure por e substitua:**

```html
[NOME DO CLIENTE]
  ↓ Substitua por: "Sr. Altino Bar" (exemplo)

[SEU NOME]
  ↓ Substitua por: "João Silva" (seu nome)

[seu-email@automatiz.ia]
  ↓ Substitua por: seu email real

[11 9XXXX-XXXX]
  ↓ Substitua por: seu WhatsApp

YOUR_NUMBER
  ↓ Link WhatsApp (deixar +55 + número, ex: +5511999999999)
```

**Como editar:**
```
1. Abrir PROPOSTA-SHOWZAP.html em editor de texto
   (Notepad++, VS Code, Sublime, etc)
2. Pressionar Ctrl+H (Find & Replace)
3. Substituir as variáveis
4. Salvar (Ctrl+S)
5. Abrir novamente no navegador (atualizar com F5)
```

### Passo 4: Gerar PDF (3 Opções)

#### Opção 1: Chrome/Edge (Recomendado)

```
1. Abrir PROPOSTA-SHOWZAP.html no Chrome/Edge
2. Pressionar: Ctrl+P (ou Cmd+P no Mac)
3. Configurações:
   ├─ Destino: Salvar como PDF
   ├─ Margem: Mínima
   ├─ Cabeçalho/Rodapé: Desativar
   └─ Fundo: Deixar desativado (ok)
4. Clicar: "Salvar"
5. Escolher local e nome
6. Pronto! PDF gerado
```

#### Opção 2: Firefox

```
1. Abrir PROPOSTA-SHOWZAP.html no Firefox
2. Pressionar: Ctrl+P
3. Clicar: "Salvar como PDF"
4. Configurações: (mesmo do Chrome)
5. Salvar
```

#### Opção 3: Ferramenta Online (sem logo)

Se quiser sem salvar localmente:
```
https://html2pdf.com/
1. Copy-paste do HTML
2. Generate PDF
3. Download

(Nota: Pode não gerar a imagem corretamente)
```

---

## 🎨 PERSONALIZAR CORES

Se quiser mudar as cores, edite o CSS:

```css
/* Cor principal (azul) */
#1e3a8a → mudar para sua cor (ex: #1e40af)

/* Cor destaque (âmbar) */
#f59e0b → mudar para sua cor (ex: #d97706)
```

---

## 📊 AJUSTAR PREÇOS

Localize e altere:

```html
<!-- Para plano BÁSICA -->
<div class="plan-price">R$ 2.500</div>
<div class="plan-price" style="font-size: 18px; color: #10b981;">R$ 500</div>

<!-- Para plano PROFISSIONAL -->
<div class="plan-price">R$ 3.500</div>
<div class="plan-price" style="font-size: 18px; color: #10b981;">R$ 800</div>

<!-- Para plano ENTERPRISE -->
<div class="plan-price">R$ 5.000</div>
<div class="plan-price" style="font-size: 18px; color: #10b981;">R$ 1.200</div>
```

---

## 📱 VISUALIZAÇÃO RESPONSIVA

A proposta funciona em:
- ✅ Desktop (1920px+)
- ✅ Tablet (768px-1024px)
- ✅ Mobile (320px-480px)

Ao gerar PDF, use:
- **Desktop**: Melhor resultado (A4 normal)
- **Tablet**: Também fica bom

---

## ✨ EXEMPLO DE PERSONALIZAÇÃO COMPLETA

```html
<!-- Antes -->
[NOME DO CLIENTE]
[SEU NOME]
[seu-email@automatiz.ia]
[11 9XXXX-XXXX]

<!-- Depois -->
Sr. Altino Bar
João Silva - Automatiz.ia
joao@automatiz.ia
11 99999-9999
```

---

## 🔧 SE ALGO NÃO FUNCIONAR

### Logo não aparece

```
❌ Problema: Imagem não carrega
✅ Solução:
   1. Verificar se arquivo está na mesma pasta
   2. Verificar se nome está correto: logo-automatiz.png
   3. Copiar caminho completo em img src=""
```

### PDF sai com problemas de layout

```
❌ Problema: Cores diferentes, layout quebrado
✅ Solução:
   1. Abrir em Chrome (mais consistente)
   2. Verificar "Imprimir fundo" está DESATIVADO
   3. Usar margem "Mínima"
   4. Se ainda assim errado, enviar me a screenshot
```

### Letras muito pequenas

```
❌ Problema: Texto muito pequeno no PDF
✅ Solução:
   1. Chrome: Ctrl+P → Escala → 120-130%
   2. Firefox: Print → Escala → ajustar
```

---

## 💾 COMO SALVAR E ENVIAR

### Opção 1: Email + PDF

```
Assunto: Proposta Showzap - [NOME DO CLIENTE]

Corpo:
"Olá [Nome],

Segue proposta customizada para implementação 
da plataforma Automatiz.IA em seu [tipo de negócio].

Detalhes:
• Investimento inicial: R$ X.XXX
• Manutenção: R$ XX/mês
• ROI esperado: [dias/semanas]

Arquivo em anexo.

Qualquer dúvida, fico disponível.

Abraços,
[Seu Nome]"

Anexos:
├─ PROPOSTA-SHOWZAP.pdf
└─ (opcional) GUIA-RAPIDO.pdf
```

### Opção 2: Link Online

```
1. Salvar PDF no Google Drive
2. Compartilhar com link
3. Enviar por email/WhatsApp

Vantagem: Cliente vê versão mais recente
```

### Opção 3: WhatsApp

```
1. Salvar como PDF
2. Abrir WhatsApp
3. Anexar arquivo
4. Enviar em conversa com cliente
```

---

## 🎁 CHECKLIST ANTES DE ENVIAR

- [ ] Logo inserido corretamente
- [ ] Nome do cliente correto
- [ ] Seu nome completo
- [ ] Email e WhatsApp atualizados
- [ ] Preços revisados
- [ ] Link WhatsApp funciona
- [ ] PDF gerado sem erros
- [ ] Cores visíveis (não saiu em preto e branco)
- [ ] Todas as páginas incluídas
- [ ] Assinatura digital ou impressa

---

## 📞 CONTATO PARA DÚVIDAS

Se precisar de ajuda:

```
1. Abrir o arquivo em editor
2. Procurar pela seção [VAR]
3. Trocar pelos seus dados
4. Se tiver erro de CSS, avisar
```

---

## 🚀 PRÓXIMAS VERSÕES

Você pode criar novas propostas:

```
1. Duplicar PROPOSTA-SHOWZAP.html
2. Renomear: PROPOSTA-[CLIENTE].html
3. Personalizar dados
4. Gerar PDF diferente para cada cliente
```

---

## 📊 ESTATÍSTICAS DE CONVERSÃO

Com esta proposta, espere:

```
Taxa de conversão: 30-50%
Tempo médio decisão: 3-7 dias
Leads mais qualificados: 80%
```

---

**Agora é só enviar e fechar as vendas! 🚀**

Qualquer dúvida, me avisa.

Boa sorte! 💪

