// ============================================================
//  UPADSFAST — Google Ads Script V5 (Corrigido)
//  Documentação: developers.google.com/google-ads/scripts
//  Correções: validação de campanha, ordem correta, tratamento de erros
// ============================================================
//
//  CORREÇÕES IMPLEMENTADAS:
//  1. Validação de existência de campanha antes de criar extensões
//  2. Ordem correta de processamento das abas
//  3. Pausa de 30s após criar campanhas (para propagação)
//  4. Pausa de 10s entre processamentos (evita rate limit)
//  5. Modo DRY-RUN para simulação
//  6. Tratamento de erros robusto com dicas
//  7. Resumo final do processamento
//  8. Cache de campanhas verificadas para performance
// ============================================================

// ─── PASSO 1: Cole aqui a URL da sua Planilha Google ─────────
var SPREADSHEET_URL = 'COLE_A_URL_DA_SUA_PLANILHA_AQUI';

// ─── PASSO 2: Modo de execução ───────────────────────────────
// true  = apenas visualiza, não cria nada (recomendado primeiro)
// false = cria as campanhas de verdade no Google Ads
var PREVIEW_MODE = true;

// ─── PASSO 3: Modo DRY-RUN (simulação extra) ─────────────────
// true  = apenas loga o que seria feito, sem chamar API
// false = executa normalmente (respeita PREVIEW_MODE)
var DRY_RUN = false;

// ─── CONFIGURAÇÕES DE TIMING ─────────────────────────────────
var PAUSA_ENTRE_ABAS = 10000; // 10 segundos entre processamentos
var PAUSA_APOS_CAMPANHAS = 30000; // 30 segundos após criar campanhas

// ─── NÃO ALTERE ABAIXO DESTA LINHA ──────────────────────────

var UPLOAD_OPTIONS = {
  fileLocale:    'en_US',
  moneyInMicros: false
};

// Ordem correta: primeiro cria entidades, depois extensões
var SHEETS_EM_ORDEM = [
  'CAMPANHAS',
  'GRUPOS_ANUNCIOS',
  'ANUNCIOS_SEARCH_RSA',
  'CALLOUTS',
  'SITELINKS',
  'SNIPPETS',
  'PROMOCOES'
];

// Abas que são extensões (dependem de campanhas existentes)
var ABAS_EXTENSOES = ['CALLOUTS', 'SITELINKS', 'SNIPPETS', 'PROMOCOES'];

// Cache de campanhas verificadas
var campanhasVerificadas = {};

function main() {
  var ss;
  try {
    ss = SpreadsheetApp.openByUrl(SPREADSHEET_URL);
  } catch (e) {
    Logger.log('[ERRO CRÍTICO] Não foi possível abrir a planilha: ' + e.message);
    Logger.log('Verifique se a URL está correta e se você tem acesso à planilha.');
    return;
  }

  Logger.log('===========================================================');
  Logger.log('UPADSFAST V5 — Planilha: ' + ss.getName());
  Logger.log('Modo: ' + (PREVIEW_MODE
    ? 'PREVIEW — nenhuma alteração será feita'
    : 'APLICAR — criando campanhas agora'));
  Logger.log('DRY-RUN: ' + (DRY_RUN ? 'SIM (apenas simulação)' : 'NÃO'));
  Logger.log('===========================================================');

  var resumo = [];
  var campanhasCriadas = false;

  for (var i = 0; i < SHEETS_EM_ORDEM.length; i++) {
    var nomeAba = SHEETS_EM_ORDEM[i];
    
    // Verificar se é extensão e se campanhas foram criadas
    if (ABAS_EXTENSOES.indexOf(nomeAba) !== -1 && campanhasCriadas) {
      Logger.log('');
      Logger.log('[PAUSA] Aguardando ' + (PAUSA_APOS_CAMPANHAS/1000) + 's para propagação das campanhas...');
      Utilities.sleep(PAUSA_APOS_CAMPANHAS);
      campanhasCriadas = false; // Reset para não pausar novamente
    }

    var resultado = processarAba(ss, nomeAba);
    resumo.push({ aba: nomeAba, status: resultado });

    // Marca que campanhas foram criadas (para pausar antes das extensões)
    if (nomeAba === 'CAMPANHAS' && resultado === 'OK') {
      campanhasCriadas = true;
    }

    // Pausa entre processamentos
    if (i < SHEETS_EM_ORDEM.length - 1) {
      Logger.log('[PAUSA] Aguardando ' + (PAUSA_ENTRE_ABAS/1000) + 's antes do próximo upload...');
      Utilities.sleep(PAUSA_ENTRE_ABAS);
    }
  }

  // Log do resumo final
  Logger.log('');
  Logger.log('===========================================================');
  Logger.log('RESUMO FINAL:');
  for (var r = 0; r < resumo.length; r++) {
    Logger.log('  ' + resumo[r].aba + ': ' + resumo[r].status);
  }
  Logger.log('===========================================================');
  Logger.log('Processamento concluído.');
  Logger.log('Detalhes em: Ferramentas > Ações em massa > Uploads');
}

function processarAba(ss, nomeAba) {
  var sheet = ss.getSheetByName(nomeAba);

  if (!sheet) {
    Logger.log('[PULAR] "' + nomeAba + '" — aba não encontrada.');
    return 'PULAR (aba não existe)';
  }

  if (sheet.getLastRow() <= 1) {
    Logger.log('[PULAR] "' + nomeAba + '" — sem dados.');
    return 'PULAR (sem dados)';
  }

  // DRY-RUN: apenas simular
  if (DRY_RUN) {
    Logger.log('[DRY-RUN] "' + nomeAba + '" — seria processada (' + (sheet.getLastRow() - 1) + ' linhas).');
    return 'DRY-RUN';
  }

  // Para extensões, verificar se existem campanhas
  if (ABAS_EXTENSOES.indexOf(nomeAba) !== -1) {
    if (!verificarCampanhasExistem(sheet)) {
      Logger.log('[AVISO] "' + nomeAba + '" — nenhuma campanha correspondente encontrada. Pulando.');
      return 'PULAR (sem campanhas)';
    }
  }

  try {
    var upload = AdsApp.bulkUploads().newFileUpload(sheet, UPLOAD_OPTIONS);
    upload.forCampaignManagement();

    if (PREVIEW_MODE) {
      upload.preview();
      Logger.log('[PREVIEW] "' + nomeAba + '" — enviado para visualização.');
      return 'OK (preview)';
    } else {
      upload.apply();
      Logger.log('[OK]      "' + nomeAba + '" — aplicado com sucesso.');
      return 'OK';
    }
  } catch (e) {
    var errorMsg = e.message || e.toString();
    Logger.log('[ERRO]    "' + nomeAba + '" — ' + errorMsg);
    
    // Dicas de solução baseadas no erro
    if (errorMsg.indexOf('No entity corresponds') !== -1) {
      Logger.log('  → DICA: A campanha referenciada não existe. Processe a aba CAMPANHAS primeiro.');
    } else if (errorMsg.indexOf('rate') !== -1 || errorMsg.indexOf('limit') !== -1) {
      Logger.log('  → DICA: Rate limit atingido. Aumente PAUSA_ENTRE_ABAS para 15000 ou mais.');
    }
    
    return 'ERRO: ' + errorMsg;
  }
}

// Verifica se as campanhas referenciadas na aba existem na conta
function verificarCampanhasExistem(sheet) {
  var data = sheet.getDataRange().getValues();
  if (data.length <= 1) return false;

  // Encontrar índice da coluna Campaign (pode variar)
  var headers = data[0];
  var campaignColIndex = -1;
  for (var h = 0; h < headers.length; h++) {
    var header = String(headers[h]).trim().toLowerCase();
    if (header === 'campaign' || header === 'campaign name' || header === 'campanha') {
      campaignColIndex = h;
      break;
    }
  }

  if (campaignColIndex === -1) {
    Logger.log('[AVISO] Coluna de campanha não encontrada na aba. Assumindo que existe.');
    return true;
  }

  // Coletar nomes únicos de campanhas da aba
  var campanhasNaAba = [];
  for (var i = 1; i < data.length; i++) {
    var nomeCampanha = String(data[i][campaignColIndex]).trim();
    if (nomeCampanha && nomeCampanha !== '' && campanhasNaAba.indexOf(nomeCampanha) === -1) {
      campanhasNaAba.push(nomeCampanha);
    }
  }

  if (campanhasNaAba.length === 0) {
    return false;
  }

  // Verificar cada campanha
  var campanhasEncontradas = 0;
  for (var c = 0; c < campanhasNaAba.length; c++) {
    var nome = campanhasNaAba[c];
    
    // Usar cache se já verificado
    if (campanhasVerificadas[nome] === true) {
      campanhasEncontradas++;
      continue;
    }
    if (campanhasVerificadas[nome] === false) {
      continue;
    }

    // Verificar no Google Ads
    try {
      var campaignIterator = AdsApp.campaigns()
          .withCondition('CampaignName = "' + nome.replace(/"/g, '\\\\"') + '"')
          .get();
      
      if (campaignIterator.hasNext()) {
        campanhasVerificadas[nome] = true;
        campanhasEncontradas++;
        Logger.log('  [CHECK] Campanha encontrada: ' + nome);
      } else {
        campanhasVerificadas[nome] = false;
        Logger.log('  [CHECK] Campanha NÃO encontrada: ' + nome);
      }
    } catch (e) {
      Logger.log('  [CHECK] Erro ao verificar campanha "' + nome + '": ' + e.message);
      // Em caso de erro, assume que existe para não bloquear
      campanhasVerificadas[nome] = true;
      campanhasEncontradas++;
    }
  }

  Logger.log('[VALIDAÇÃO] ' + campanhasEncontradas + '/' + campanhasNaAba.length + ' campanhas encontradas.');
  
  // Se pelo menos uma campanha existe, processa a aba
  return campanhasEncontradas > 0;
}

// ============================================================
//  EXEMPLO DE USO
// ============================================================
// 
// 1. Configure a URL da planilha:
//    var SPREADSHEET_URL = 'https://docs.google.com/spreadsheets/d/...';
//
// 2. Primeira execução (PREVIEW_MODE = true):
//    - O script vai simular tudo sem criar nada
//    - Verifique o log para ver se está correto
//
// 3. Execução real (PREVIEW_MODE = false):
//    - O script vai criar as campanhas
//    - Pausa 10s entre cada aba
//    - Pausa 30s após criar campanhas (antes das extensões)
//
// 4. Se tiver problemas de rate limit:
//    - Aumente PAUSA_ENTRE_ABAS para 15000 (15 segundos)
//    - Aumente PAUSA_APOS_CAMPANHAS para 60000 (60 segundos)
//
// 5. Para testar sem chamar a API:
//    - DRY_RUN = true
//    - Útil para verificar se a planilha está acessível
//
// ============================================================
