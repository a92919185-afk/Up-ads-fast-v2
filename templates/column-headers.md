# Templates de Colunas — Planilha Matriz (Bulk Upload)

Este documento contém os cabeçalhos EXATOS de cada aba da planilha matriz.
Use como referência para criar ou validar sua planilha no Google Sheets.

> **Atualizado:** Inclui coluna `EU political ads` (obrigatória desde Set/2025) e coluna `Action` para extensões.

---

## Aba: Campaigns (Criar campanhas novas)

> **OBRIGATÓRIO** para criar campanhas que ainda não existem na conta Google Ads.

```
Campaign | Campaign type | Networks | Budget | Bid Strategy type | EU political ads | Status
```

### Valores Padrão

| Coluna | Valor | Notas |
|--------|-------|-------|
| Campaign | `Search - {PRODUCT} - {COUNTRY}` | Nome da campanha |
| Campaign type | `Search` | Sempre `Search` para RSA |
| Networks | `Google Search` | Rede de pesquisa |
| Budget | `50` (ou valor desejado) | Orçamento diário na moeda da conta |
| Bid Strategy type | `Maximize clicks` | Estratégia de lance |
| EU political ads | `No` | **OBRIGATÓRIO desde Set/2025** |
| Status | `Enabled` | `Enabled` / `Paused` |

> **⚠️ ATENÇÃO:** Sem a coluna `EU political ads`, a criação da campanha FALHA e causa erro em cascata em todas as outras abas (grupos, anúncios, extensões).

---

## Aba: Ad groups

```
Campaign | Ad group | Status
```

---

## Aba: Ads (RSA)

### Colunas Oficiais (Google Ads)

```
Campaign | Ad group | Final URL | Headline 1 | Headline 2 | Headline 3 | Headline 4 | Headline 5 | Headline 6 | Headline 7 | Headline 8 | Headline 9 | Headline 10 | Headline 11 | Headline 12 | Headline 13 | Headline 14 | Headline 15 | Description 1 | Description 2 | Description 3 | Description 4 | Path 1 | Path 2 | Status
```

### Colunas Auxiliares (Para Fórmulas / Referência Interna)

```
Product_Name | Country | Location_ID | Language | Discount_Value | Guarantee_Days | Has_Free_Shipping | Currency | Price | Account_ID
```

> **Nota:** O Google ignora colunas que não reconhece. As colunas auxiliares servem para fórmulas e organização interna.

---

## Aba: Callouts

```
Campaign | Action | Callout text | Status
```

### Valores de Action

| Action | Quando usar |
|--------|-------------|
| `Add` | Criar callout NOVO (padrão) |
| `Use existing` | Reutilizar callout existente (requer `Item ID`) |
| `Remove` | Remover callout da campanha |

### Limites

- Callout text: ≤ 25 caracteres
- Mínimo: 4 callouts por campanha
- Status: `Enabled` | `Paused` | `Removed`

---

## Aba: Sitelinks

```
Campaign | Action | Sitelink text | Final URL | Description line 1 | Description line 2 | Status
```

### Valores de Action

| Action | Quando usar |
|--------|-------------|
| `Add` | Criar sitelink NOVO (padrão) |
| `Use existing` | Reutilizar sitelink existente (**requer `Item ID`**) |
| `Remove` | Remover sitelink da campanha |

> **⚠️ ATENÇÃO:** Se usar `Use existing` sem `Item ID`, o upload falha com erro: "Incompatible values in 'Asset action: Use existing' and 'Item ID: null'". Para sitelinks NOVOS, usar SEMPRE `Add`.

### Limites

- Sitelink text: ≤ 25 caracteres
- Description line 1: ≤ 35 caracteres
- Description line 2: ≤ 35 caracteres
- Quantidade: exatamente 6 por campanha
- Status: `Enabled` | `Paused` | `Removed`

---

## Aba: Snippets

```
Campaign | Action | Structured snippet header | Structured snippet values | Status
```

### Formato dos Valores

A coluna `Structured snippet values` deve conter os valores separados por **ponto e vírgula (`;`)**.

Exemplo:
```
50% Discount;Free Shipping;30-Day Guarantee;Bundles From $37
```

> **⚠️ ATENÇÃO:** A coluna `Structured snippet values` é OBRIGATÓRIA e NÃO pode ficar vazia. Se vazia, o upload falha com erro: "Missing value in 'Structured snippet values'".

### Headers Válidos (Google Ads aceita APENAS estes)

**Inglês:** `Amenities`, `Brands`, `Courses`, `Degree programs`, `Destinations`, `Featured hotels`, `Insurance coverage`, `Models`, `Neighborhoods`, `Service catalog`, `Shows`, `Styles`, `Types`

**Português:** `Comodidades`, `Cursos`, `Destinos`, `Estilos`, `Hotéis em destaque`, `Marcas`, `Modelos`, `Programas de graduação`, `Bairros`, `Catálogo de serviços`, `Programas`, `Tipos`

### Limites

- Values: manter curtos (≤ 25 caracteres cada)
- Quantidade: mínimo 1 snippet por campanha
- Action: `Add` para novos snippets

---

## Aba: Promotions

```
Campaign | Action | Occasion | Discount type | Percent off | Promotion code | Final URL | Start date | End date | Status
```

### Valores Típicos

- **Action:** `Add` (para promoções novas)
- **Occasion:** `None` (ou tipo de promoção, ex: `Back to school`)
- **Discount type:** `Percent` (sempre para nosso uso)
- **Percent off:** Número inteiro (ex: 50)
- **Promotion code:** Código do cupom (se existir, senão deixar vazio)
- **Start date / End date:** Formato `YYYY-MM-DD` (opcional)
- **Status:** `Enabled`

---

## Referência Rápida de Limites

| Campo | Limite |
|-------|--------|
| Headline (RSA) | ≤ 30 caracteres |
| Description (RSA) | ≤ 90 caracteres |
| Path 1 / Path 2 | ≤ 15 caracteres |
| Callout text | ≤ 25 caracteres |
| Sitelink text | ≤ 25 caracteres |
| Sitelink Description line 1 | ≤ 35 caracteres |
| Sitelink Description line 2 | ≤ 35 caracteres |
| Snippet values | ≤ 25 caracteres cada (recomendado) |

---

## Campos Obrigatórios para Campanhas Novas (Resumo)

| Coluna | Obrigatória | Valor padrão |
|--------|------------|-------------|
| Campaign | Sim | Nome da campanha |
| Campaign type | Sim | `Search` |
| Networks | Sim | `Google Search` |
| Budget | Sim | Orçamento diário |
| Bid Strategy type | Sim | `Maximize clicks` |
| EU political ads | **Sim (desde Set/2025)** | `No` |
| Status | Sim | `Enabled` |
