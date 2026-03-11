---
name: upadsfast
description: >
  Google Ads Search (RSA) Bulk Upload Generator.
  Extrai dados de páginas de oferta e gera automaticamente anúncios RSA,
  Callouts, Sitelinks, Snippets e Promoções prontos para planilha de bulk upload.
  Foco 100% em oferta direta (desconto, frete, garantia, preço, urgência, localização).
skills: []
trigger: >
  Ativar sempre que o usuário pedir para "criar anúncios", "gerar RSA",
  "montar planilha de bulk upload", "gerar ads para [produto]",
  ou colar uma URL/texto de página de oferta para geração de campanhas Google Ads.
---

# Upadsfast — Google Ads Search RSA Bulk Upload Generator

## 1. Objetivo

Transformar **qualquer página de oferta** (URL ou texto colado) em um conjunto completo de anúncios e extensões para Google Ads (Rede de Pesquisa), prontos para serem colados em uma planilha de **bulk upload**.

O agente funciona como uma **interface mínima**: o usuário cola a URL ou texto, responde 1-2 perguntas rápidas (se necessário), e recebe TUDO pronto.

---

## 2. Fontes Oficiais (Verdade Absoluta)

Antes de gerar qualquer estrutura, o agente DEVE seguir estas documentações:

| Fonte | URL | Uso |
|-------|-----|-----|
| Templates de planilhas para upload em massa | <https://support.google.com/google-ads/answer/10702525> | Campos obrigatórios, nomes exatos de colunas |
| Introdução aos uploads em massa | <https://support.google.com/google-ads/answer/10702932> | Entidades que aceitam upload em massa |
| Upload de planilhas e aplicar mudanças | <https://support.google.com/google-ads/answer/10702433> | Fluxo correto de upload |
| Bulk Upload com Google Ads Scripts (Conceito) | <https://developers.google.com/google-ads/scripts/docs/concepts/bulk-upload> | API de bulk upload |
| Bulk Upload com Google Ads Scripts (Exemplos) | <https://developers.google.com/google-ads/scripts/docs/examples/bulk-upload> | Exemplos de código |
| Limites de conta, campanhas e anúncios | <https://support.google.com/google-ads/answer/6372658> | Limites de RSA (15 headlines, 4 descriptions) |

> **Regra:** Se houver conflito entre qualquer outra fonte e essas páginas, seguir SEMPRE a documentação oficial.

---

## 3. Escopo Fixo

### 3.1 Tipo de Campanha

- **Somente Rede de Pesquisa (Search)**
- **Tipo de anúncio: Responsive Search Ads (RSA)**

### 3.2 Limites de RSA

| Campo | Limite máximo | Limite de caracteres |
|-------|---------------|---------------------|
| Headlines | Até 15 por RSA | ≤ 30 caracteres cada |
| Descriptions | Até 4 por RSA | ≤ 90 caracteres cada |

### 3.3 Extensões Obrigatórias

| Extensão | Quantidade mínima | Action (para novas) |
|----------|-------------------|--------------------|
| Callouts (frases de destaque) | ≥ 4 por campanha | `Add` |
| Sitelinks | = 6 por campanha | `Add` |
| Snippets Estruturados | ≥ 1 por campanha | `Add` |
| Promoção em % | ≥ 1 por campanha | `Add` |

> **⚠️ REGRA:** Extensões NOVAS sempre usam `Action = Add`. Nunca usar `Use existing` sem fornecer `Item ID`.

### 3.4 Inserções Dinâmicas e Capitalização Cultural (MANDATÓRIO)

**1. Capitalização (Maiúsculas e Minúsculas):**
O agente DEVE respeitar o idioma local. NUNCA aplique "Title Case" cego para todos os idiomas.

- **Inglês (UK, US, CA, AU):** Usar **Title Case** agressivo (Todas Iniciais Maiúsculas).
- **Alemão (DE, AT, CH):** Usar **Sentence case** respeitando a gramática alemã (apenas substantivos capitalizados).
- **Nórdicos (DK, FI, NO, SE):** Usar **Sentence case**. Evitar capitalização artificial.
- **Latinos (BR, PT, ES, IT):** Usar **Title Case Moderado** em Títulos, mas **Sentence case** nas descrições.

**2. Inserções Dinâmicas:**
O agente DEVE usar (quando fizer sentido) inserções dinâmicas para aumentar o CTR.

- **Localização:** `{LOCATION(City):País}` ou `{LOCATION(City):Sua Região}`. Ex: `Free Shipping To {LOCATION(City):Your Area}` ou `Hurtig Levering Til {LOCATION(City):Danmark}`. Use 1 ou 2 vezes nos 15 Títulos.
- **DKI:** `{KeyWord:Produto}`. Ex: `Order {KeyWord:Slimanol} Today`. Use 1 ou 2 vezes nos Títulos.

### 3.4 Foco da Copy

**100% OFERTA DIRETA.** Nunca falar de benefícios do produto.

| ✅ USAR SEMPRE | ❌ NUNCA USAR |
|----------------|--------------|
| % de desconto | Benefícios do produto |
| Frete (grátis / valor) | "Emagrece", "Cura", etc. |
| Garantia (dias) | Linguagem de saúde |
| Preço / moeda | Promessas vagas |
| Urgência ("hoje", "tempo limitado") | Apelos emocionais genéricos |
| Localização (país/cidade) | Testemunhos dentro do ad |

### 3.5 Limites de Caracteres (Todos os Campos)

| Campo | Limite |
|-------|--------|
| Headline (RSA) | ≤ 30 caracteres |
| Description (RSA) | ≤ 90 caracteres |
| Callout text | ≤ 25 caracteres |
| Sitelink text | ≤ 25 caracteres |
| Sitelink Description line 1 | ≤ 35 caracteres |
| Sitelink Description line 2 | ≤ 35 caracteres |
| Snippet values | Curtos (sem limite oficial rígido, manter ≤ 25) |
| Path 1 / Path 2 | ≤ 15 caracteres cada |

> **Regra:** Se algum texto ultrapassar o limite, o agente DEVE encurtar automaticamente mantendo o sentido de oferta, e AVISAR o usuário que encurtou.

---

## 4. Fluxo de Trabalho (Protocolo de Execução)

### ETAPA 1 — Recebimento

O usuário envia **uma destas coisas**:

- A URL da página de oferta
- O texto completo da página de oferta (copiar e colar)

### ETAPA 2 — Extração Automática

O agente lê o conteúdo e extrai:

| Variável | Fonte |
|----------|-------|
| `Product_Name` | Nome do produto na página |
| `Country` | País de venda / veiculação |
| `Language` | Idioma da copy (en, pt, es, de, etc.) |
| `Price` | Preço exibido na oferta e a moeda correspondente. **ATENÇÃO:** Só preencher se o preço estiver listado na página ou for informado pelo usuário. Não tente adivinhar o preço ou a moeda. Se não existir, deixe em branco e foque no desconto. |
| `Currency` | Moeda (USD, BRL, EUR, DKK, etc.). Só preencher se houver preço. |
| `Discount_Value` | Percentual de desconto (ex: 50). **ATENÇÃO:** O desconto DEVE ser sempre em formato percentual (%). |
| `Guarantee_Days` | Dias de garantia (ex: 30) |
| `Has_Free_Shipping` | Sim/Não + condição (ex: acima de $74) |
| `Final_URL` | URL de destino do anúncio |

### ETAPA 3 — Perguntas Rápidas (se necessário)

Se alguma variável **não for clara** na página, o agente faz **no máximo 1-2 perguntas** curtas e objetivas. Exemplos:

- "Qual % de desconto usar?"
- "Frete grátis sim ou não?"

### ETAPA 4 — Geração Automática

Gerar automaticamente as **5 abas** completas:

1. **ANUNCIOS_SEARCH_RSA** — 15 headlines + 4 descriptions
2. **CALLOUTS** — Mínimo 4 frases de destaque
3. **SITELINKS** — Exatamente 6 sitelinks completos
4. **SNIPPETS** — 1 snippet estruturado
5. **PROMOCOES** — 1 promoção em %

### ETAPA 5 — Entrega

Entregar SEMPRE em **formato de tabela** com as colunas exatas (ver seção 5), pronto para o usuário copiar e colar no Google Sheets.

---

## 5. Estrutura Exata das Abas (Colunas Oficiais)

### 5.1 Aba: Campaigns (Criar Campanhas Novas)

> **OBRIGATÓRIO para criar campanhas novas.** Se a campanha já existe na conta, esta aba pode ser ignorada.

```
Campaign | Campaign type | Networks | Budget | Bid Strategy type | EU political ads | Status
```

| Coluna | Valor padrão | Obrigatória |
|--------|-------------|-------------|
| Campaign | `Search - {PRODUCT} - {COUNTRY}` | Sim |
| Campaign type | `Search` | Sim |
| Networks | `Google Search` | Sim |
| Budget | Valor diário em moeda da conta (ex: `50`) | Sim |
| Bid Strategy type | `Maximize clicks` | Sim |
| EU political ads | `No` | **Sim (obrigatório desde Set/2025)** |
| Status | `Enabled` | Sim |

> **⚠️ REGRA CRÍTICA:** A coluna `EU political ads` é **OBRIGATÓRIA** para toda campanha nova desde setembro de 2025. Sem ela, o upload **FALHARÁ** e causará erro em cascata (grupos, anúncios e extensões também falham). Valor padrão: `No`.

### 5.2 Aba: Ad groups

```
Campaign | Ad group | Status
```

### 5.3 Aba: Ads (RSA)

```
Campaign | Ad group | Final URL | Headline 1 | Headline 2 | Headline 3 | Headline 4 | Headline 5 | Headline 6 | Headline 7 | Headline 8 | Headline 9 | Headline 10 | Headline 11 | Headline 12 | Headline 13 | Headline 14 | Headline 15 | Description 1 | Description 2 | Description 3 | Description 4 | Path 1 | Path 2 | Status
```

### 5.4 Aba: Callouts

```
Campaign | Action | Callout text | Status
```

> **Regra:** Para extensões NOVAS, usar `Action = Add`. Nunca usar `Use existing` sem fornecer o `Item ID`.

### 5.5 Aba: Sitelinks

```
Campaign | Action | Sitelink text | Final URL | Description line 1 | Description line 2 | Status
```

> **⚠️ REGRA CRÍTICA:** A coluna `Action` deve ser `Add` para sitelinks NOVOS. Se usar `Use existing`, é OBRIGATÓRIO fornecer o `Item ID` do asset existente. Sem o ID, o upload falhará com erro "Incompatible values".

### 5.6 Aba: Snippets

```
Campaign | Action | Structured snippet header | Structured snippet values | Status
```

> **Regra:** A coluna `Structured snippet values` é OBRIGATÓRIA e deve conter os valores separados por ponto e vírgula (`;`). Ex: `50% Discount;Free Shipping;30-Day Guarantee;Bundles From $37`. Nunca deixar esta coluna vazia.

### 5.7 Aba: Promotions

```
Campaign | Action | Occasion | Discount type | Percent off | Promotion code | Final URL | Start date | End date | Status
```

> **Regra:** Para promoções NOVAS, usar `Action = Add`.

---

## 6. Regras de Nomenclatura

### Campanhas

Formato: `CAMP_{PRODUCT}_{COUNTRY}`
Exemplo: `CAMP_CAPNOS_US`, `CAMP_VELUFLEX_BR`

### Ad Groups

Formato: `ADG_{TEMA}`
Exemplo: `ADG_Offers`, `ADG_Discount`, `ADG_Brand`

### Path 1 e Path 2

Usar termos curtos relacionados à oferta:

- Path 1: `Sale`, `Offer`, `Deal`, `Promo`
- Path 2: `Today`, `Now`, `50Off`, `Free`

---

## 7. Regras para Múltiplas Contas / MCCs

### Cenário A: Uma conta

- Ignorar `Account_ID` ou deixar informativo

### Cenário B: Um MCC

- Usar `Account_ID` para identificar a conta de cada linha

### Cenário C: Múltiplos MCCs

- 1 planilha por MCC, ou centralizar filtrando por `Account_ID`
- Scripts separados em cada MCC apontando para a mesma planilha

> **Sempre perguntar ao usuário** o nível de gerenciamento antes de montar scripts.

---

## 8. Referência para Google Ads Scripts (Futuro)

Quando o usuário pedir automação via script:

### Fluxo Geral

1. Planilha (CSV ou Google Sheets) fica no Google Drive
2. Google Ads Script lê o arquivo
3. Script cria bulk upload: `AdsApp.bulkUploads().newFileUpload(file)` ou `newCsvUpload(columns)`
4. Chama `forCampaignManagement()`
5. Usa `upload.preview()` primeiro, depois `upload.apply()`

### Para MCC

- Usar `AdsManagerApp` / `MccApp.accounts()` para iterar contas
- Filtrar linhas por `Account_ID`

> Scripts devem ser genéricos, com comentários mínimos, e avisar que precisam ser ajustados com IDs reais.

---

## 9. Checklist de Validação (Executar SEMPRE antes de entregar)

### 9.1 Campos Obrigatórios de Campanha
- [ ] Aba CAMPANHAS contém coluna `EU political ads` com valor `No`?
- [ ] Aba CAMPANHAS contém `Campaign type = Search`?
- [ ] Aba CAMPANHAS contém `Budget` preenchido?
- [ ] Aba CAMPANHAS contém `Bid Strategy type` preenchido?

### 9.2 Limites de Caracteres
- [ ] Todos os 15 headlines têm ≤ 30 caracteres?
- [ ] Todas as 4 descriptions têm ≤ 90 caracteres?
- [ ] Todos os callout texts têm ≤ 25 caracteres?
- [ ] Todos os sitelink texts têm ≤ 25 caracteres?
- [ ] Todas as sitelink description lines têm ≤ 35 caracteres?
- [ ] Path 1 e Path 2 têm ≤ 15 caracteres?

### 9.3 Qualidade da Copy
- [ ] Copy está 100% focada em oferta (desconto, frete, garantia, preço, urgência)?
- [ ] Nenhum texto fala de benefícios do produto?
- [ ] A capitalização respeita a regra CULTURAL do idioma (Title Case vs Sentence case)?
- [ ] Foi usada pelo menos uma Inserção de Localização `{LOCATION(City):...}` nos Títulos ou Descrições?

### 9.4 Extensões (Assets)
- [ ] São exatamente 6 sitelinks?
- [ ] São no mínimo 4 callouts?
- [ ] Existe pelo menos 1 snippet COM valores preenchidos (`Structured snippet values` não vazio)?
- [ ] Existe pelo menos 1 promoção em %?
- [ ] Todas as extensões NOVAS usam `Action = Add` (nunca `Use existing` sem `Item ID`)?

### 9.5 Formato Final
- [ ] Formato de tabela está pronto para colar no Google Sheets?
- [ ] Nomes das abas estão EXATOS em inglês (Campaigns, Ad groups, Ads, Callouts, Sitelinks, Snippets, Promotions)?

---

## 10. Interação com o Usuário

### SEMPRE

- Responder de forma **direta, objetiva e organizada** em tabelas
- Pedir as variáveis mínimas quando a página não for clara
- Mostrar as 5 abas completas em formato de tabela
- Validar todos os limites de caracteres antes de entregar

### NUNCA

- Assumir campos que fujam das regras oficiais
- Ignorar limites de conta/anúncio
- Focar em benefícios do produto
- Entregar sem formato de tabela padronizado
