// ============================================================
//  UPADSFAST — Google Ads Bulk Upload Script
//  Versao: Conta Unica
// ============================================================

// >>> CONFIGURACAO <<<
// Cole aqui a URL da sua planilha Google Sheets:
var SPREADSHEET_URL = 'COLE_A_URL_DA_SUA_PLANILHA_AQUI';

// >>> MODO DE EXECUCAO <<<
// true  = PREVIEW (apenas visualiza, nao aplica mudancas)
// false = APPLY (aplica mudancas diretamente na conta)
var PREVIEW_MODE = true;

// Nomes das abas (devem corresponder exatamente aos nomes na planilha)
var SHEET = {
  ADS:        'ANUNCIOS_SEARCH_RSA',
  CALLOUTS:   'CALLOUTS',
  SITELINKS:  'SITELINKS',
  SNIPPETS:   'SNIPPETS',
  PROMOTIONS: 'PROMOCOES'
};

// ============================================================

function main() {
  var ss = SpreadsheetApp.openByUrl(SPREADSHEET_URL);

  Logger.log('========================================');
  Logger.log('UPADSFAST - Bulk Upload');
  Logger.log('Planilha: ' + ss.getName());
  Logger.log('Modo: ' + (PREVIEW_MODE ? 'PREVIEW' : 'APPLY'));
  Logger.log('========================================');

  // Ordem importa: campanhas/anuncios primeiro, extensoes depois.
  // Extensoes referenciam campanhas que precisam existir na conta.
  var results = [];
  results.push(processSheet(ss, SHEET.ADS));
  results.push(processSheet(ss, SHEET.CALLOUTS));
  results.push(processSheet(ss, SHEET.SITELINKS));
  results.push(processSheet(ss, SHEET.SNIPPETS));
  results.push(processSheet(ss, SHEET.PROMOTIONS));

  Logger.log('');
  Logger.log('========== RESUMO ==========');
  for (var i = 0; i < results.length; i++) {
    var r = results[i];
    Logger.log(r.sheet + ': ' + r.rows + ' linha(s) | ' + r.status);
  }
  Logger.log('============================');
  Logger.log('Detalhes em: Ferramentas > Acoes em massa > Uploads');
}

function processSheet(ss, sheetName) {
  var result = { sheet: sheetName, rows: 0, status: '' };

  var sheet = ss.getSheetByName(sheetName);
  if (!sheet) {
    result.status = 'ERRO: aba nao encontrada';
    Logger.log('[ERRO] ' + sheetName + ': aba nao encontrada.');
    return result;
  }

  var data = sheet.getDataRange().getValues();
  if (data.length <= 1) {
    result.status = 'VAZIA';
    Logger.log('[AVISO] ' + sheetName + ': sem dados.');
    return result;
  }

  // Ler cabecalhos e limpar espacos
  var headers = [];
  for (var h = 0; h < data[0].length; h++) {
    headers.push(String(data[0][h]).trim());
  }

  // Filtrar headers vazios
  var validHeaders = [];
  var validIndexes = [];
  for (var h = 0; h < headers.length; h++) {
    if (headers[h] !== '') {
      validHeaders.push(headers[h]);
      validIndexes.push(h);
    }
  }

  var upload = AdsApp.bulkUploads().newCsvUpload(validHeaders);
  upload.forCampaignManagement();

  var count = 0;
  for (var i = 1; i < data.length; i++) {
    var row = {};
    var hasData = false;

    for (var j = 0; j < validIndexes.length; j++) {
      var val = data[i][validIndexes[j]];
      if (val !== '' && val !== null && val !== undefined) {
        row[validHeaders[j]] = val;
        hasData = true;
      }
    }

    if (hasData) {
      upload.append(row);
      count++;
    }
  }

  if (count === 0) {
    result.status = 'VAZIA (sem dados validos)';
    Logger.log('[AVISO] ' + sheetName + ': nenhuma linha valida.');
    return result;
  }

  result.rows = count;

  try {
    // >>> Para trocar de PREVIEW para APPLY, mude a variavel PREVIEW_MODE no topo <<<
    if (PREVIEW_MODE) {
      upload.preview();
      result.status = 'PREVIEW enviado';
    } else {
      upload.apply();
      result.status = 'APLICADO';
    }
    Logger.log('[OK] ' + sheetName + ': ' + count + ' linha(s) — ' + result.status);
  } catch (e) {
    result.status = 'ERRO: ' + e.message;
    Logger.log('[ERRO] ' + sheetName + ': ' + e.message);
  }

  return result;
}

// ============================================================
// >>> ADAPTACAO PARA MCC (futuro) <<<
//
// Para rodar em nivel de MCC, substituir main() por:
//
// function main() {
//   var ss = SpreadsheetApp.openByUrl(SPREADSHEET_URL);
//   var accounts = AdsManagerApp.accounts().get();
//
//   while (accounts.hasNext()) {
//     var account = accounts.next();
//     AdsManagerApp.select(account);
//     var accountId = account.getCustomerId();
//     Logger.log('--- Conta: ' + accountId + ' ---');
//
//     // Se a planilha tiver coluna Account_ID, filtrar linhas aqui
//     processSheet(ss, SHEET.ADS);
//     processSheet(ss, SHEET.CALLOUTS);
//     processSheet(ss, SHEET.SITELINKS);
//     processSheet(ss, SHEET.SNIPPETS);
//     processSheet(ss, SHEET.PROMOTIONS);
//   }
// }
//
// Para filtrar por Account_ID, adicionar parametro accountId em
// processSheet() e pular linhas onde Account_ID != accountId.
// ============================================================
