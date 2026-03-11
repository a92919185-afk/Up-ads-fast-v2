---
description: Workflow para montar automação via Google Ads Scripts lendo a planilha matriz e fazendo bulk upload.
---

# Workflow: Automação de Bulk Upload via Google Ads Scripts

## Trigger

O usuário quer automatizar o upload das campanhas/extensões usando Google Ads Scripts, lendo a planilha matriz do Google Drive.

---

## Passo 1 — Definir Nível de Gerenciamento

Perguntar ao usuário:

- **A.** Uma conta Google Ads individual?
- **B.** Um MCC (Manager Account)?
- **C.** Múltiplos MCCs?

---

## Passo 2 — Preparar a Planilha no Google Drive

A planilha matriz deve estar no Google Drive com as abas:

1. `ANUNCIOS_SEARCH_RSA`
2. `CALLOUTS`
3. `SITELINKS`
4. `SNIPPETS`
5. `PROMOCOES`

Cada aba deve conter as colunas oficiais + colunas auxiliares (Product_Name, Country, Language, Discount_Value, etc.).

Se for MCC, incluir obrigatoriamente a coluna `Account_ID`.

---

## Passo 3 — Criar o Script (Conta Individual)

```javascript
function main() {
  var spreadsheetUrl = 'URL_DA_PLANILHA_AQUI';
  var spreadsheet = SpreadsheetApp.openByUrl(spreadsheetUrl);
  var sheet = spreadsheet.getSheetByName('ANUNCIOS_SEARCH_RSA');
  var data = sheet.getDataRange().getValues();

  var upload = AdsApp.bulkUploads().newCsvUpload(
    data[0] // headers
  );

  for (var i = 1; i < data.length; i++) {
    upload.append(data[i]);
  }

  upload.forCampaignManagement();

  // Primeiro preview para validar
  upload.preview();

  // Depois de confirmar, trocar para:
  // upload.apply();
}
```

---

## Passo 4 — Criar o Script (MCC)

```javascript
function main() {
  var spreadsheetUrl = 'URL_DA_PLANILHA_AQUI';
  var spreadsheet = SpreadsheetApp.openByUrl(spreadsheetUrl);
  var sheet = spreadsheet.getSheetByName('ANUNCIOS_SEARCH_RSA');
  var data = sheet.getDataRange().getValues();
  var headers = data[0];
  var accountIdCol = headers.indexOf('Account_ID');

  var accounts = AdsManagerApp.accounts().get();

  while (accounts.hasNext()) {
    var account = accounts.next();
    var accountId = account.getCustomerId();

    AdsManagerApp.select(account);

    var accountRows = data.filter(function(row, idx) {
      return idx === 0 || row[accountIdCol] === accountId;
    });

    if (accountRows.length <= 1) continue;

    var upload = AdsApp.bulkUploads().newCsvUpload(headers);

    for (var i = 1; i < accountRows.length; i++) {
      upload.append(accountRows[i]);
    }

    upload.forCampaignManagement();
    upload.preview();
    // upload.apply();
  }
}
```

---

## Passo 5 — Testar com Preview

Sempre executar primeiro com `upload.preview()`.
Verificar o relatório de erros no Google Ads.
Só trocar para `upload.apply()` após validação.

---

## Passo 6 — Agendar (Opcional)

Configurar o script para rodar periodicamente:

- Diário
- Semanal
- Sob demanda

---

## Notas

- Scripts são genéricos e precisam de ajustes com IDs reais.
- Sempre testar com preview antes de aplicar.
- Para extensões (callouts, sitelinks, etc.), repetir o mesmo padrão com as abas correspondentes.
- Documentação oficial: <https://developers.google.com/google-ads/scripts/docs/concepts/bulk-upload>
