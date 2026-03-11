# Upadsfast - Scripts de Bulk Upload

## Arquivos Disponiveis

```
scripts/
  generate-spreadsheet.py       -> Gera planilha .xlsx para qualquer produto
  upadsfast-single-account.js   -> Script Google Ads para conta unica
  upadsfast-mcc.js              -> Script Google Ads para MCC (multiplas contas)

output/
  {PRODUTO}_{PAIS}_BulkUpload.xlsx  -> Planilhas geradas (uma por produto/país)
```

---

## Script: Gerador de Planilha (Python)

**Arquivo:** `scripts/generate-spreadsheet.py`

### Dependência

```bash
pip install openpyxl
```

### Como Usar

```bash
python3 scripts/generate-spreadsheet.py \
  --product  "CAPNOS" \
  --country  "US" \
  --language "en" \
  --price    "37" \
  --currency "$" \
  --discount "50" \
  --guarantee "30" \
  --ship-min "74" \
  --has-free-shipping yes \
  --url "https://seusite.com"
```

### Parâmetros

| Parâmetro | Obrigatório | Descrição | Exemplo |
|-----------|-------------|-----------|---------|
| `--product` | Sim | Nome do produto | `CAPNOS` |
| `--country` | Sim | País de veiculação | `US`, `BR`, `DE` |
| `--language` | Sim | Idioma da copy | `en`, `pt`, `es`, `de` |
| `--price` | Sim | Preço unitário | `37` |
| `--currency` | Não | Símbolo da moeda | `$` (padrão), `R$`, `€` |
| `--discount` | Sim | % de desconto | `50` |
| `--guarantee` | Sim | Dias de garantia | `30` |
| `--ship-min` | Não | Mínimo para frete grátis | `74` |
| `--has-free-shipping` | Não | Frete grátis? | `yes` (padrão) |
| `--url` | Sim | URL final do anúncio | `https://...` |

### O Que o Script Gera

1. Planilha `.xlsx` em `output/{PRODUTO}_{PAIS}_BulkUpload.xlsx`
2. 5 abas completas com colunas exatas para bulk upload
3. Copy gerada automaticamente com base nos templates por idioma (en/pt/es/de)
4. Validação de todos os limites de caracteres
5. Relatório de validação no terminal

### Idiomas Suportados

| Código | Idioma |
|--------|--------|
| `en` | Inglês |
| `pt` | Português |
| `es` | Espanhol |
| `de` | Alemão |

### Saída Esperada

```
=======================================================
  UPADSFAST — Bulk Upload Generator
=======================================================
  Produto   : CAPNOS
  País      : US  |  Idioma: en
  Campanha  : Search - CAPNOS - US
=======================================================

── Headlines
  H01 [20/30] ✅  CAPNOS Official Site
  H02 [19/30] ✅  Up To 50% Off Today
  ...

✅ Todos os limites respeitados.

📄 Arquivo: output/CAPNOS_US_BulkUpload.xlsx
```

---

---

## Script: Conta Unica

**Arquivo:** `scripts/upadsfast-single-account.js`

### Como Usar

1. Abra o Google Ads da conta desejada
2. Va em **Ferramentas > Acoes em massa > Scripts**
3. Crie um novo script
4. Cole o conteudo de `upadsfast-single-account.js`
5. Troque `SPREADSHEET_URL` pela URL da sua planilha
6. Rode com `PREVIEW_MODE = true` primeiro
7. Verifique o resultado em **Ferramentas > Acoes em massa > Uploads**
8. Se tudo estiver correto, troque para `PREVIEW_MODE = false` e rode novamente

### Configuracao

```javascript
// URL da planilha Google Sheets
var SPREADSHEET_URL = 'COLE_A_URL_DA_SUA_PLANILHA_AQUI';

// Modo de execucao
var PREVIEW_MODE = true;  // true = preview, false = apply
```

### O Que o Script Faz

1. Abre a planilha Google Sheets
2. Le cada aba na ordem:
   - ANUNCIOS_SEARCH_RSA (campanhas + anuncios)
   - CALLOUTS
   - SITELINKS
   - SNIPPETS
   - PROMOCOES
3. Para cada aba, cria um bulk upload via `newCsvUpload()`
4. Envia para preview ou aplica diretamente
5. Registra no log: aba processada, linhas lidas, status

### Log de Exemplo

```
========================================
UPADSFAST - Bulk Upload
Planilha: Upadsfast - CAPNOS
Modo: PREVIEW
========================================
[OK] ANUNCIOS_SEARCH_RSA: 1 linha(s) — PREVIEW enviado
[OK] CALLOUTS: 5 linha(s) — PREVIEW enviado
[OK] SITELINKS: 6 linha(s) — PREVIEW enviado
[OK] SNIPPETS: 1 linha(s) — PREVIEW enviado
[OK] PROMOCOES: 1 linha(s) — PREVIEW enviado

========== RESUMO ==========
ANUNCIOS_SEARCH_RSA: 1 linha(s) | PREVIEW enviado
CALLOUTS: 5 linha(s) | PREVIEW enviado
SITELINKS: 6 linha(s) | PREVIEW enviado
SNIPPETS: 1 linha(s) | PREVIEW enviado
PROMOCOES: 1 linha(s) | PREVIEW enviado
============================
Detalhes em: Ferramentas > Acoes em massa > Uploads
```

---

## Script: MCC (Multiplas Contas)

**Arquivo:** `scripts/upadsfast-mcc.js`

### Diferenca para o Script de Conta Unica

- Usa `AdsManagerApp.accounts()` para iterar sobre todas as contas do MCC
- Filtra linhas pela coluna `Account_ID` em cada aba
- Remove a coluna `Account_ID` do upload (nao eh coluna do Google Ads)
- Normaliza o Account_ID (remove hifens) para comparacao

### Configuracao Adicional

```javascript
// Nome da coluna que identifica a conta
var ACCOUNT_ID_COLUMN = 'Account_ID';
```

### Como Funciona o Filtro

1. Se a aba tem coluna `Account_ID`: filtra apenas linhas daquela conta
2. Se a aba NAO tem coluna `Account_ID`: processa TODAS as linhas para TODAS as contas

### Como Adicionar Account_ID na Planilha

Adicione uma coluna `Account_ID` em cada aba:

```
Campaign | Account_ID | Callout text | Status
CAMP_CAPNOS_US | 123-456-7890 | Up To 50% Off | Enabled
CAMP_VELUFLEX_BR | 098-765-4321 | Ate 40% OFF | Enabled
```

---

## Requisitos da Planilha

### Permissoes

A planilha Google Sheets deve estar acessivel para o Google Ads Script.
Opcoes:
- Compartilhar com "Qualquer pessoa com o link pode visualizar"
- Compartilhar com o email da conta do Google Ads

### Nomes das Abas

Os nomes das abas devem ser EXATAMENTE:
- `ANUNCIOS_SEARCH_RSA`
- `CALLOUTS`
- `SITELINKS`
- `SNIPPETS`
- `PROMOCOES`

### Nomes das Colunas

Os cabecalhos (linha 1 de cada aba) devem corresponder EXATAMENTE
aos nomes de colunas que o Google Ads reconhece no bulk upload.

Exemplos de nomes corretos:
- `Campaign` (nao "Campanha" ou "campaign")
- `Headline 1` (nao "Titulo 1" ou "headline_1")
- `Description 1` (nao "Descricao 1")
- `Callout text` (nao "Texto do callout")
- `Sitelink text` (nao "Texto do sitelink")

### Colunas para Criar Campanhas Novas

Se voce quer que o script CRIE campanhas novas (nao apenas atualize existentes),
adicione estas colunas na aba ANUNCIOS_SEARCH_RSA:

| Coluna | Valor | Obrigatoria para |
|--------|-------|-----------------|
| Campaign type | Search | Campanha nova |
| Budget | 50 | Campanha nova |
| Bid Strategy type | Maximize clicks | Campanha nova |
| Language | en | Segmentacao |
| Location | United States | Segmentacao |

Se as campanhas JA EXISTEM na conta, essas colunas nao sao necessarias.

---

## Snippets: Headers Validos

O Google Ads aceita APENAS headers predefinidos para snippets:

**Ingles:** Amenities, Brands, Courses, Degree programs, Destinations,
Featured hotels, Insurance coverage, Models, Neighborhoods,
Service catalog, Shows, Styles, Types

**Portugues:** Comodidades, Cursos, Destinos, Estilos, Hoteis em destaque,
Marcas, Modelos, Programas de graduacao, Bairros,
Catalogo de servicos, Programas, Tipos

Usar um header invalido causara erro no upload.

---

## Documentacao Oficial

| Recurso | URL |
|---------|-----|
| Conceito de Bulk Upload (Scripts) | https://developers.google.com/google-ads/scripts/docs/concepts/bulk-upload |
| Exemplos de Bulk Upload (Scripts) | https://developers.google.com/google-ads/scripts/docs/examples/bulk-upload |
| Templates de Planilha | https://support.google.com/google-ads/answer/10702525 |
| Introducao a Uploads em Massa | https://support.google.com/google-ads/answer/10702932 |
| Upload e Aplicar Mudancas | https://support.google.com/google-ads/answer/10702433 |
| Limites de Conta e Anuncios | https://support.google.com/google-ads/answer/6372658 |
