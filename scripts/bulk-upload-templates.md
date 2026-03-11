# Google Ads Script — Bulk Upload de Campanhas (Template)

Este arquivo contém templates de scripts genéricos para automação de
bulk upload via Google Ads Scripts, lendo dados de uma planilha Google Sheets.

**IMPORTANTE:** Estes scripts são templates. Substitua URLs e IDs pelos reais.

Fonte oficial:

- <https://developers.google.com/google-ads/scripts/docs/concepts/bulk-upload>
- <https://developers.google.com/google-ads/scripts/docs/examples/bulk-upload>

---

## Script 1: Conta Individual — Upload de RSA

```javascript
function main() {
  var SPREADSHEET_URL = 'https://docs.google.com/spreadsheets/d/SEU_ID_AQUI/edit';
  var SHEET_NAME = 'ANUNCIOS_SEARCH_RSA';

  var spreadsheet = SpreadsheetApp.openByUrl(SPREADSHEET_URL);
  var sheet = spreadsheet.getSheetByName(SHEET_NAME);
  var data = sheet.getDataRange().getValues();
  var headers = data[0];

  var upload = AdsApp.bulkUploads().newCsvUpload(headers);

  for (var i = 1; i < data.length; i++) {
    upload.append(data[i]);
  }

  upload.forCampaignManagement();
  upload.preview(); // Trocar por upload.apply() após validar
}
```

---

## Script 2: MCC — Upload Filtrado por Account_ID

```javascript
function main() {
  var SPREADSHEET_URL = 'https://docs.google.com/spreadsheets/d/SEU_ID_AQUI/edit';
  var SHEET_NAME = 'ANUNCIOS_SEARCH_RSA';

  var spreadsheet = SpreadsheetApp.openByUrl(SPREADSHEET_URL);
  var sheet = spreadsheet.getSheetByName(SHEET_NAME);
  var data = sheet.getDataRange().getValues();
  var headers = data[0];
  var accountIdCol = headers.indexOf('Account_ID');

  var accounts = AdsManagerApp.accounts().get();

  while (accounts.hasNext()) {
    var account = accounts.next();
    var accountId = account.getCustomerId();

    AdsManagerApp.select(account);

    var accountRows = [];
    for (var i = 1; i < data.length; i++) {
      if (String(data[i][accountIdCol]).replace(/-/g, '') === accountId.replace(/-/g, '')) {
        accountRows.push(data[i]);
      }
    }

    if (accountRows.length === 0) continue;

    var upload = AdsApp.bulkUploads().newCsvUpload(headers);

    for (var j = 0; j < accountRows.length; j++) {
      upload.append(accountRows[j]);
    }

    upload.forCampaignManagement();
    upload.preview(); // Trocar por upload.apply() após validar

    Logger.log('Preview criado para conta: ' + accountId + ' (' + accountRows.length + ' linhas)');
  }
}
```

---

## Script 3: Upload de Extensões (Callouts/Sitelinks)

```javascript
function main() {
  var SPREADSHEET_URL = 'https://docs.google.com/spreadsheets/d/SEU_ID_AQUI/edit';

  var sheets = ['CALLOUTS', 'SITELINKS', 'SNIPPETS', 'PROMOCOES'];

  for (var s = 0; s < sheets.length; s++) {
    var spreadsheet = SpreadsheetApp.openByUrl(SPREADSHEET_URL);
    var sheet = spreadsheet.getSheetByName(sheets[s]);

    if (!sheet) {
      Logger.log('Aba não encontrada: ' + sheets[s]);
      continue;
    }

    var data = sheet.getDataRange().getValues();
    var headers = data[0];

    var upload = AdsApp.bulkUploads().newCsvUpload(headers);

    for (var i = 1; i < data.length; i++) {
      upload.append(data[i]);
    }

    upload.forCampaignManagement();
    upload.preview();

    Logger.log('Preview criado para aba: ' + sheets[s] + ' (' + (data.length - 1) + ' linhas)');
  }
}
```

---

## Fluxo Recomendado

1. **Preparar planilha** com as 5 abas no Google Drive
2. **Rodar scripts com `.preview()`** para ver erros
3. **Verificar no Google Ads** > Bulk Actions > Preview
4. **Corrigir erros** na planilha se houver
5. **Trocar para `.apply()`** quando tudo estiver validado
6. **Agendar** (opcional) para rodar periodicamente

---

## Dicas

- Sempre testar com `.preview()` antes de `.apply()`
- O Google Ads mostra erros detalhados no preview (coluna, linha, campo inválido)
- Para planilhas grandes, considere dividir em uploads por aba
- Account_ID deve estar no formato `123-456-7890` ou `1234567890`
