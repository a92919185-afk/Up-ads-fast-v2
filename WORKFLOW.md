# Upadsfast - Workflow Automatizado

## Diagrama de Fluxo

```
USUARIO                          AGENTE
  |                                |
  |-- Cola URL ou texto ---------> |
  |                                |-- Extrai variaveis automaticamente
  |                                |-- Identifica: produto, preco, desconto,
  |                                |   garantia, frete, moeda, pais
  |                                |
  |                                |-- Faltam dados?
  |                                |   SIM -> Faz 1-2 perguntas rapidas
  |                                |   NAO -> Vai direto pra geracao
  |                                |
  | <-- Perguntas (se necessario)  |
  |-- Respostas rapidas ---------> |
  |                                |
  |                                |-- Gera 7 abas completas:
  |                                |   1. Campaigns (EU political ads=No)
  |                                |   2. Ad groups
  |                                |   3. Ads (15H + 4D)
  |                                |   4. Callouts (min 4, Action=Add)
  |                                |   5. Sitelinks (6, Action=Add)
  |                                |   6. Snippets (1, valores preenchidos)
  |                                |   7. Promotions (1, Action=Add)
  |                                |
  |                                |-- Valida TODOS os limites de chars
  |                                |-- Encurta automaticamente se exceder
  |                                |
  | <-- Tabelas prontas p/ colar   |
  |                                |
  |-- (Opcional) Pede planilha --> |
  |                                |-- Gera .xlsx com 5 abas
  | <-- Arquivo .xlsx              |
```

## Etapas Detalhadas

### ETAPA 1: Recebimento
- Usuario envia URL ou texto colado da pagina de oferta
- Nenhuma outra informacao eh necessaria neste momento

### ETAPA 2: Extracao Automatica
O agente le o conteudo e preenche a tabela de variaveis:

| Variavel | O que extrair | Onde procurar na pagina |
|----------|---------------|------------------------|
| Product_Name | Nome do produto | Titulo, H1, meta title |
| Country | Pais de venda | Mencoes de shipping, localizacao |
| Language | Idioma do conteudo | Idioma do texto da pagina |
| Price | Preco do produto | Secao de pricing, botoes de compra |
| Currency | Moeda | Simbolo ($, R$, EUR) junto ao preco |
| Discount_Value | % de desconto | Banners, badges, textos promocionais |
| Guarantee_Days | Dias de garantia | Rodape, secao de garantia, badges |
| Has_Free_Shipping | Frete gratis? | Header, banners, shipping info |
| Final_URL | URL de destino | URL fornecida ou extraida |

### ETAPA 3: Perguntas Rapidas
- SO perguntar se a info NAO estiver na pagina
- MAXIMO 2 perguntas
- Formato: opcoes de selecao rapida (nao texto livre)

Perguntas possiveis:
1. "Idioma/pais?" (opcoes: en/US, en/UK, pt/BR, es/MX...)
2. "Foco?" (opcoes: desconto, garantia, frete, urgencia)

### ETAPA 4: Geracao Automatica
Gerar as 7 abas COM colunas exatas:

**Aba 1 - Campaigns (criar campanha nova):**
```
Campaign | Campaign type | Networks | Budget | Bid Strategy type | EU political ads | Status
```
> **OBRIGATORIO:** `EU political ads = No` (exigido desde Set/2025)

**Aba 2 - Ad groups:**
```
Campaign | Ad group | Status
```

**Aba 3 - Ads (RSA):**
```
Campaign | Ad group | Final URL | Headline 1..15 | Description 1..4 | Path 1 | Path 2 | Status
```

**Aba 4 - Callouts:**
```
Campaign | Action | Callout text | Status
```
> `Action = Add` para extensoes novas

**Aba 5 - Sitelinks:**
```
Campaign | Action | Sitelink text | Final URL | Description line 1 | Description line 2 | Status
```
> `Action = Add` para sitelinks novos. NUNCA `Use existing` sem `Item ID`.

**Aba 6 - Snippets:**
```
Campaign | Action | Structured snippet header | Structured snippet values | Status
```
> Valores separados por `;`. NUNCA deixar `Structured snippet values` vazio.

**Aba 7 - Promotions:**
```
Campaign | Action | Occasion | Discount type | Percent off | Promotion code | Final URL | Start date | End date | Status
```
> `Action = Add` para promocoes novas.

### ETAPA 5: Validacao (automatica, antes de entregar)
- Checar TODOS os limites de caracteres
- Se algum texto exceder: encurtar + avisar usuario
- Confirmar que copy eh 100% oferta (sem beneficios)

### ETAPA 6: Entrega
- Entregar em tabelas markdown (para colar no Google Sheets)
- Opcionalmente gerar arquivo .xlsx se o usuario pedir

### ETAPA 7: Gerar Planilha .xlsx (Automatizado)
- Rodar o script Python para gerar o arquivo pronto:
```bash
python3 scripts/generate-spreadsheet.py \
  --product  "{PRODUCT}" \
  --country  "{COUNTRY}" \
  --language "{LANGUAGE}" \
  --price    "{PRICE}" \
  --currency "{CURRENCY}" \
  --discount "{DISCOUNT}" \
  --guarantee "{GUARANTEE}" \
  --ship-min "{SHIP_MIN}" \
  --budget   "{BUDGET}" \
  --url "{FINAL_URL}"
```
- Saida em: `output/{PRODUCT}_{COUNTRY}_BulkUpload.xlsx`
- Ver documentacao completa em `SCRIPTS-REFERENCE.md`

---

## Regras de Copy por Idioma

### Ingles (en)
- "Up to X% Off" / "Save X%" / "X% Off Today"
- "Free Shipping" / "Free US Shipping"
- "X-Day Money-Back Guarantee" / "Risk-Free"
- "Limited Time" / "Ends Soon" / "Today Only"
- "From Just $X" / "Starting at $X"

### Portugues (pt)
- "Ate X% OFF" / "Desconto de X%"
- "Frete Gratis" / "Envio Gratis"
- "Garantia de X Dias" / "X Dias de Garantia"
- "Tempo Limitado" / "So Hoje" / "Ultimas Unidades"
- "A partir de R$X" / "Por Apenas R$X"

### Espanhol (es)
- "Hasta X% de Descuento" / "Ahorra X%"
- "Envio Gratis" / "Envio Sin Costo"
- "Garantia de X Dias"
- "Tiempo Limitado" / "Solo Hoy" / "Oferta Exclusiva"
- "Desde $X" / "Por Solo $X"

### Alemao (de)
- "Bis zu X% Rabatt" / "X% Sparen"
- "Kostenloser Versand" / "Gratis Versand"
- "X Tage Geld-zuruck-Garantie"
- "Nur Heute" / "Zeitlich Begrenzt"
- "Ab nur X EUR" / "Schon ab X EUR"

---

## Padroes de Nomenclatura

### Campanhas
```
Search - {PRODUCT} - {COUNTRY}
```
Exemplos:
- Search - CAPNOS - US
- Search - Slimanol - BR
- Search - VeluFlex - DE

### Ad Groups
```
{PRODUCT} - Offer
```
Exemplos:
- CAPNOS - Offer
- Slimanol - Offer

### Path 1 / Path 2
```
Path 1: {PRODUCT} ou abreviacao (max 15 chars)
Path 2: {DISCOUNT}-Off, Sale, Deal, Promo (max 15 chars)
```
