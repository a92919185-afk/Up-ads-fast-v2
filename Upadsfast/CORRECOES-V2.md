# Correções V2 - Google Ads Scripts

## 1. Problemas Identificados

### 1.1 Erro "No entity corresponds to the campaign"

**Descrição:** Ocorre ao tentar criar anúncios para uma campanha que ainda não foi totalmente processada pelo Google Ads.

**Causa Raiz:**
- O Google Ads API opera de forma assíncrona
- Após criar uma campanha via Bulk Upload, ela pode não estar disponível imediatamente
- Tentativas de criar anúncios antes da campanha estar pronta resultam neste erro

**Sintomas:**
```
GoogleAdsException: No entity corresponds to the campaign with resource_name: "customers/XXX/campaigns/YYY"
```

---

### 1.2 Erro "ID do item: null"

**Descrição:** Itens processados sem ID válido, causando falhas em operações subsequentes.

**Causa Raiz:**
- Dados de entrada incompletos ou mal formatados
- Falha na validação prévia dos dados
- Células vazias na planilha de entrada

**Sintomas:**
```
ID do item: null
Falha ao processar linha: dados insuficientes
```

---

### 1.3 Rate Limit do Google Ads API

**Descrição:** Limite de requisições excedido durante operações em massa.

**Limites Conhecidos:**
- **Bulk Operations:** 100 operações por minuto
- **Mutate Operations:** 10.000 operações por dia
- **Basic Operations:** 1.000 operações por minuto

**Sintomas:**
```
RESOURCE_EXHAUSTED: Quota exceeded for quota metric 'Mutate operations'
Too many requests per minute
```

---

## 2. Correções Aplicadas

### 2.1 Script V5 com Validação de Campanhas

**Arquivo:** `scripts/v5-corrected-bulk-upload.js`

**Melhorias:**
- Validação de existência da campanha antes de criar anúncios
- Retry com backoff exponencial
- Verificação de status da campanha

```javascript
// Exemplo de validação implementada
async function validateCampaignExists(campaignId) {
  const query = `
    SELECT campaign.id, campaign.status
    FROM campaign
    WHERE campaign.id = ${campaignId}
  `;
  const result = AdsApp.search(query);
  return result.hasNext();
}
```

---

### 2.2 Pausa de 30s Após Criar Campanhas

**Implementação:**
```javascript
// Após criar campanha via Bulk Upload
Utilities.sleep(30000); // 30 segundos
```

**Justificativa:**
- Tempo mínimo para propagação da campanha no sistema
- Reduz drasticamente o erro "No entity corresponds"

---

### 2.3 Pausa de 10s Entre Processamentos

**Implementação:**
```javascript
// Entre processamento de itens
for (const item of items) {
  processItem(item);
  Utilities.sleep(10000); // 10 segundos
}
```

**Benefícios:**
- Evita rate limits
- Permite monitoramento entre operações
- Reduz carga no API

---

### 2.4 Modo DRY-RUN para Simulação

**Configuração:**
```javascript
const CONFIG = {
  DRY_RUN: true,  // Ativar modo simulação
  LOG_LEVEL: 'DEBUG'
};
```

**Comportamento:**
- Não executa operações de escrita
- Loga todas as operações que seriam executadas
- Valida dados sem modificar a conta

**Exemplo de Output:**
```
[DRY-RUN] Criaria campanha: "Campanha Teste"
[DRY-RUN] Criaria grupo de anúncios: "Grupo 1"
[DRY-RUN] Criaria anúncio: "Título do Anúncio"
```

---

### 2.5 Truncamento Automático de Textos

**Limites do Google Ads:**
| Campo | Limite |
|-------|--------|
| Título do Anúncio | 30 caracteres |
| Descrição | 90 caracteres |
| Título RS (Responsive) | 30 caracteres |
| Descrição RS | 90 caracteres |

**Implementação:**
```javascript
function truncateText(text, maxLength) {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength - 3) + '...';
}

// Uso
const titulo = truncateText(dados.titulo, 30);
const descricao = truncateText(dados.descricao, 90);
```

---

### 2.6 Coluna Action em Todas as Abas

**Estrutura da Planilha:**

| Coluna | Descrição | Valores |
|--------|-----------|---------|
| Action | Operação a realizar | `CREATE`, `UPDATE`, `REMOVE` |

**Abas Afetadas:**
- Campanhas
- Grupos de Anúncios
- Anúncios
- Palavras-chave
- Extensões

**Exemplo:**
```
Action | Campaign Name | Status
CREATE| Nova Campanha | ENABLED
UPDATE| Campanha Existente | PAUSED
REMOVE| Campanha Antiga | REMOVED
```

---

### 2.7 Coluna EU Political Ads

**Nova Coluna Obrigatória:**

| Coluna | Tipo | Descrição |
|--------|------|-----------|
| eu_political_ads | Boolean | Indica se é anúncio político na UE |

**Valores Aceitos:**
- `TRUE` - Anúncio político na UE
- `FALSE` - Anúncio regular
- (vazio) - Padrão: FALSE

**Implementação:**
```javascript
const euPoliticalAds = row['eu_political_ads'] || 'FALSE';
if (euPoliticalAds === 'TRUE') {
  campaignBuilder.withEuPoliticalAds(true);
}
```

---

## 3. Como Usar

### 3.1 Preparação da Planilha

1. **Baixar template atualizado**
   ```
   templates/bulk-upload-template-v2.xlsx
   ```

2. **Preencher dados**
   - Usar coluna `Action` em todas as abas
   - Preencher `eu_political_ads` quando aplicável
   - Respeitar limites de caracteres

3. **Validar dados**
   - Executar script em modo DRY-RUN primeiro
   - Verificar logs de validação

---

### 3.2 Execução do Script

**Passo a Passo:**

1. **Abrir Google Ads Scripts**
   ```
   Google Ads > Ferramentas > Scripts
   ```

2. **Criar novo script ou editar existente**
   ```javascript
   // Copiar conteúdo de scripts/v5-corrected-bulk-upload.js
   ```

3. **Configurar parâmetros**
   ```javascript
   const CONFIG = {
     SPREADSHEET_ID: 'SEU_ID_AQUI',
     DRY_RUN: false,  // false para execução real
     BATCH_SIZE: 50,
     DELAY_BETWEEN_BATCHES: 10000
   };
   ```

4. **Executar**
   - Clique em "Run" (▶)
   - Monitore logs em tempo real

---

### 3.3 Configurações Recomendadas

| Parâmetro | Valor Recomendado | Descrição |
|-----------|-------------------|-----------|
| `DRY_RUN` | `true` (início) | Sempre testar primeiro |
| `BATCH_SIZE` | `50` | Itens por lote |
| `DELAY_AFTER_CAMPAIGN` | `30000` | 30s após criar campanha |
| `DELAY_BETWEEN_ITEMS` | `10000` | 10s entre itens |
| `MAX_RETRIES` | `3` | Tentativas em caso de erro |

---

### 3.4 Troubleshooting

#### Erro: "No entity corresponds to the campaign"

**Solução:**
1. Aumentar `DELAY_AFTER_CAMPAIGN` para 60000 (60s)
2. Verificar se campanha foi criada corretamente
3. Executar em lotes menores

#### Erro: "Rate limit exceeded"

**Solução:**
1. Aumentar `DELAY_BETWEEN_ITEMS` para 15000
2. Reduzir `BATCH_SIZE` para 25
3. Dividir planilha em múltiplas execuções

#### Erro: "Invalid text length"

**Solução:**
1. Verificar truncamento automático está ativo
2. Revisar textos na planilha
3. Usar função `truncateText()` manualmente

#### Erro: "Missing required field"

**Solução:**
1. Verificar coluna `Action` presente
2. Preencher campos obrigatórios
3. Validar formato dos dados

---

## 4. Referências da Documentação Oficial

### 4.1 Google Ads Scripts

| Recurso | Link |
|---------|------|
| Documentação Principal | https://developers.google.com/google-ads/scripts |
| Referência da API | https://developers.google.com/google-ads/scripts/reference |
| Guia de Introdução | https://developers.google.com/google-ads/scripts/docs/guides |
| Exemplos de Código | https://developers.google.com/google-ads/scripts/docs/examples |

---

### 4.2 Bulk Upload API

| Recurso | Link |
|---------|------|
| Visão Geral | https://developers.google.com/google-ads/api/docs/bulk/overview |
| Formato CSV | https://developers.google.com/google-ads/api/docs/bulk/csv-format |
| Operações Suportadas | https://developers.google.com/google-ads/api/docs/bulk/operations |
| Códigos de Erro | https://developers.google.com/google-ads/api/docs/bulk/error-codes |

---

### 4.3 Mutate Operations

| Recurso | Link |
|---------|------|
| Visão Geral | https://developers.google.com/google-ads/api/docs/mutate/overview |
| Campanhas | https://developers.google.com/google-ads/api/reference/rpc/v15/CampaignService |
| Grupos de Anúncios | https://developers.google.com/google-ads/api/reference/rpc/v15/AdGroupService |
| Anúncios | https://developers.google.com/google-ads/api/reference/rpc/v15/AdGroupAdService |
| Palavras-chave | https://developers.google.com/google-ads/api/reference/rpc/v15/AdGroupCriterionService |

---

### 4.4 Rate Limits e Quotas

| Recurso | Link |
|---------|------|
| Limites de Uso | https://developers.google.com/google-ads/api/docs/best-practices/quotas |
| Rate Limits | https://developers.google.com/google-ads/api/docs/best-practices/rate-limits |
| Tratamento de Erros | https://developers.google.com/google-ads/api/docs/best-practices/error-handling |
| Retry Strategy | https://developers.google.com/google-ads/api/docs/best-practices/retry-strategy |

---

### 4.5 EU Political Ads

| Recurso | Link |
|---------|------|
| Documentação | https://developers.google.com/google-ads/api/docs/policy/eu-political-ads |
| Requisitos | https://support.google.com/google-ads/answer/13257269 |
| Verificação | https://ads.google.com/aw/politicalads |

---

## 5. Histórico de Versões

| Versão | Data | Alterações |
|--------|------|------------|
| V1 | 2024-01 | Versão inicial |
| V2 | 2024-03 | Correções de rate limit e validação |
| V2.1 | 2024-06 | Adicionado modo DRY-RUN |
| V2.2 | 2024-09 | Coluna EU Political Ads |
| V2.3 | 2024-12 | Truncamento automático e Action column |

---

## 6. Checklist de Execução

- [ ] Planilha preenchida corretamente
- [ ] Coluna Action presente em todas as abas
- [ ] Coluna EU Political Ads preenchida
- [ ] Textos dentro dos limites de caracteres
- [ ] Modo DRY-RUN executado com sucesso
- [ ] Logs revisados
- [ ] Execução real autorizada
- [ ] Monitoramento ativo durante execução
- [ ] Verificação pós-execução realizada

---

## 7. Contato e Suporte

Para dúvidas ou problemas não documentados:
1. Consulte a documentação oficial do Google Ads Scripts
2. Verifique os logs de erro detalhados
3. Entre em contato com a equipe de desenvolvimento

---

*Documento atualizado em: Março 2026*
