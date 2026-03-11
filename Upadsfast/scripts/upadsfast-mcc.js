// ============================================================
//  UPADSFAST — Google Ads Bulk Upload Script
//  Versao: MCC (Multiplas Contas)
// ============================================================

// >>> CONFIGURACAO <<<
// Cole aqui a URL da sua planilha Google Sheets:
var SPREADSHEET_URL = 'COLE_A_URL_DA_SUA_PLANILHA_AQUI';

// >>> MODO DE EXECUCAO <<<
// true  = PREVIEW (apenas visualiza)
// false = APPLY (aplica mudancas)
var PREVIEW_MODE = true;

// Nomes das abas
var SHEET = {
  ADS:        'ANUNCIOS_SEARCH_RSA',
  CALLOUTS:   'CALLOUTS',
  SITELINKS:  'SITELINKS',
  SNIPPETS:   'SNIPPETS',
  PROMOTIONS: 'PROMOCOES'
};

// Nome da coluna que identifica a conta em cada aba.
// Se a aba nao tiver essa coluna, processa todas as linhas para todas as contas.
var ACCOUNT_ID_COLUMN = 'Account_ID';

// ============================================================

function main() {
  var ss = SpreadsheetApp.openByUrl(SPREADSHEET_URL);

  Logger.log('========================================');
  Logger.log('UPADSFAST MCC - Bulk Upload');
  Logger.log('Planilha: ' + ss.getName());
  Logger.log('Modo: ' + (PREVIEW_MODE ? 'PREVIEW' : 'APPLY'));
  Logger.log('========================================');

  var accounts = AdsManagerApp.accounts().get();

  while (accounts.hasNext()) {
    var account = accounts.next();
    AdsManagerApp.select(account);
    var accountId = account.getCustomerId();

    Logger.log('');
    Logger.log('--- Conta: ' + accountId + ' (' + account.getName() + ') ---');

    processSheet(ss, SHEET.ADS, accountId);
    processSheet(ss, SHEET.CALLOUTS, accountId);
    processSheet(ss, SHEET.SITELINKS, accountId);
    processSheet(ss, SHEET.SNIPPETS, accountId);
    processSheet(ss, SHEET.PROMOTIONS, accountId);
  }

  Logger.log('');
  Logger.log('========================================');
  Logger.log('UPADSFAST MCC: Finalizado');
  Logger.log('Detalhes em cada conta: Ferramentas > Acoes em massa > Uploads');
  Logger.log('========================================');
}

function processSheet(ss, sheetName, accountId) {
  var sheet = ss.getSheetByName(sheetName);
  if (!sheet) {
    Logger.log('  [ERRO] ' + sheetName + ': aba nao encontrada.');
    return;
  }

  var data = sheet.getDataRange().getValues();
  if (data.length <= 1) {
    Logger.log('  [AVISO] ' + sheetName + ': sem dados.');
    return;
  }

  var headers = [];
  for (var h = 0; h < data[0].length; h++) {
    headers.push(String(data[0][h]).trim());
  }

  // Verificar se existe coluna Account_ID
  var accountCol = headers.indexOf(ACCOUNT_ID_COLUMN);
  var hasAccountFilter = accountCol >= 0;

  // Montar headers para upload (sem a coluna Account_ID, que nao eh do Google Ads)
  var uploadHeaders = [];
  var uploadIndexes = [];
  for (var h = 0; h < headers.length; h++) {
    if (headers[h] !== '' && headers[h] !== ACCOUNT_ID_COLUMN) {
      uploadHeaders.push(headers[h]);
      uploadIndexes.push(h);
    }
  }

  var upload = AdsApp.bulkUploads().newCsvUpload(uploadHeaders);
  upload.forCampaignManagement();

  var count = 0;
  for (var i = 1; i < data.length; i++) {
    // Filtrar por Account_ID se a coluna existir
    if (hasAccountFilter) {
      var rowAccountId = String(data[i][accountCol]).replace(/-/g, '').trim();
      var targetId = String(accountId).replace(/-/g, '').trim();
      if (rowAccountId !== targetId) {
        continue;
      }
    }

    var row = {};
    var hasData = false;
    for (var j = 0; j < uploadIndexes.length; j++) {
      var val = data[i][uploadIndexes[j]];
      if (val !== '' && val !== null && val !== undefined) {
        row[uploadHeaders[j]] = val;
        hasData = true;
      }
    }

    if (hasData) {
      upload.append(row);
      count++;
    }
  }

  if (count === 0) {
    Logger.log('  [AVISO] ' + sheetName + ': 0 linhas para conta ' + accountId);
    return;
  }

  try {
    if (PREVIEW_MODE) {
      upload.preview();
      Logger.log('  [OK] ' + sheetName + ': ' + count + ' linha(s) — PREVIEW');
    } else {
      upload.apply();
      Logger.log('  [OK] ' + sheetName + ': ' + count + ' linha(s) — APLICADO');
    }
  } catch (e) {
    Logger.log('  [ERRO] ' + sheetName + ': ' + e.message);
  }
}
