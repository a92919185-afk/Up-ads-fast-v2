---
description: Workflow completo para gerar anúncios RSA + extensões a partir de uma página de oferta.
---

# Workflow: Gerar Anúncios RSA + Extensões (Bulk Upload)

## Trigger

O usuário envia uma URL ou texto de página de oferta e quer gerar o pacote completo de anúncios para Google Ads (Search).

---

## Passo 1 — Receber Input

**Ação:** O usuário envia uma das seguintes coisas:

- URL da página de oferta
- Texto colado da página de oferta

**Informações opcionais que o usuário pode enviar junto:**

- Idioma (en, pt, es, de, etc.)
- País (US, BR, DE, etc.)
- Frete grátis (Sim/Não)
- Foco prioritário (desconto, garantia, frete, urgência)
- Preço (se quiser forçar um valor)

---

## Passo 2 — Ler e Extrair Variáveis

**Ação:** O agente lê o conteúdo (URL ou texto) e extrai automaticamente:

```
Product_Name     → Nome do produto
Country          → País de veiculação
Language         → Idioma da copy
Price            → Preço
Currency         → Moeda (USD, BRL, EUR, etc.)
Discount_Value   → % de desconto
Guarantee_Days   → Dias de garantia
Has_Free_Shipping → Sim/Não + condição
Final_URL        → URL de destino
```

**Output esperado:** Resumo de extração em formato de lista.

---

## Passo 3 — Perguntas Rápidas (Se Necessário)

**Condição:** Se alguma variável **não puder ser extraída** da página.

**Regra:** No máximo **1 a 2 perguntas** curtas e diretas.

**Exemplos:**

- "Qual % de desconto usar na copy?"
- "Frete grátis sim ou não?"
- "Qual a URL final de destino?"

**Se todas as variáveis estiverem claras:** Pular este passo.

---

## Passo 4 — Gerar as 5 Abas

**Ação:** Gerar automaticamente, respeitando TODOS os limites de caracteres:

### 4.1 — ANUNCIOS_SEARCH_RSA

- 15 Headlines (cada uma ≤ 30 caracteres)
- 4 Descriptions (cada uma ≤ 90 caracteres)
- Path 1 e Path 2 (cada um ≤ 15 caracteres)
- Foco em: desconto, frete, garantia, preço, urgência, localização
- **PROIBIDO:** benefícios do produto

### 4.2 — CALLOUTS

- Mínimo 4 frases de destaque (≤ 25 caracteres cada)
- Foco em oferta direta

### 4.3 — SITELINKS

- Exatamente 6 sitelinks
- Sitelink text ≤ 25 caracteres
- Description line 1 ≤ 35 caracteres
- Description line 2 ≤ 35 caracteres
- Foco em oferta direta

### 4.4 — SNIPPETS

- 1 snippet estruturado por campanha
- Header: "Offers" ou "Promoções" (conforme idioma)
- 3-4 valores curtos (≤ 25 caracteres)

### 4.5 — PROMOCOES

- 1 promoção em %
- Discount type = Percent
- Percent off = valor do desconto extraído

---

## Passo 5 — Validar Limites

**Ação:** Antes de entregar, executar o checklist:

```
□ Headlines ≤ 30 caracteres?
□ Descriptions ≤ 90 caracteres?
□ Callouts ≤ 25 caracteres?
□ Sitelink text ≤ 25 caracteres?
□ Sitelink descriptions ≤ 35 caracteres?
□ Path 1 / Path 2 ≤ 15 caracteres?
□ Copy 100% foco em oferta?
□ Sem benefícios de produto?
□ 6 sitelinks?
□ ≥ 4 callouts?
□ ≥ 1 snippet?
□ ≥ 1 promoção?
```

**Se algum texto ultrapassar o limite:** Encurtar automaticamente e avisar o usuário.

---

## Passo 6 — Entregar em Formato de Tabela

**Ação:** Entregar as 5 abas separadas, cada uma como tabela com cabeçalho exato, pronta para copiar e colar no Google Sheets.

**Formato obrigatório:**

### Aba ANUNCIOS_SEARCH_RSA

```
Campaign | Ad group | Final URL | Headline 1 | ... | Headline 15 | Description 1 | ... | Description 4 | Path 1 | Path 2 | Status
```

### Aba CALLOUTS

```
Campaign | Callout text | Status
```

### Aba SITELINKS

```
Campaign | Sitelink text | Final URL | Description line 1 | Description line 2 | Status
```

### Aba SNIPPETS

```
Campaign | Structured snippet header | Value 1 | Value 2 | Value 3 | Value 4
```

### Aba PROMOCOES

```
Campaign | Occasion | Discount type | Percent off | Promotion code
```

---

## Passo 7 — Confirmar e Aguardar Próxima Oferta

**Ação:** Confirmar que tudo foi entregue e informar que está pronto para receber a próxima URL/texto de oferta.

---

## Notas Importantes

- Este workflow é **repetitivo por design**: cada nova URL = execução completa do fluxo.
- O agente NUNCA deve pedir ao usuário para escrever copy longa.
- O agente SEMPRE se responsabiliza por gerar, validar e formatar tudo.
- Quando houver produto de software (sem frete físico), substituir "Free Shipping" por "Instant Download" ou "Digital Delivery".
