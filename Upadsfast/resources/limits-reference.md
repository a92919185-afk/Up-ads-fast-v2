# Referência de Limites — Google Ads (Atualizado 2026)

Referência rápida de todos os limites relevantes para geração de anúncios
de Rede de Pesquisa (Search) com Responsive Search Ads (RSA).

Fonte oficial: <https://support.google.com/google-ads/answer/6372658>

---

## Limites de RSA (Responsive Search Ads)

| Campo | Limite | Observação |
|-------|--------|------------|
| Headlines por RSA | Máximo 15 | Mínimo 3 obrigatório |
| Descriptions por RSA | Máximo 4 | Mínimo 2 obrigatório |
| Caracteres por Headline | ≤ 30 | Incluindo espaços |
| Caracteres por Description | ≤ 90 | Incluindo espaços |
| Path 1 | ≤ 15 caracteres | Exibido na URL visível |
| Path 2 | ≤ 15 caracteres | Exibido na URL visível |

---

## Limites de Extensões

| Extensão | Campo | Limite |
|----------|-------|--------|
| Callout | Texto | ≤ 25 caracteres |
| Sitelink | Texto do link | ≤ 25 caracteres |
| Sitelink | Description line 1 | ≤ 35 caracteres |
| Sitelink | Description line 2 | ≤ 35 caracteres |
| Snippet Estruturado | Valor individual | Sem limite rígido (recomendado ≤ 25) |
| Promoção | Percent off | Número inteiro |

---

## Limites de Conta

| Item | Limite |
|------|--------|
| Campanhas por conta | 10.000 |
| Ad groups por campanha | 20.000 |
| Anúncios por ad group | 3 RSAs (recomendado) |
| Keywords por ad group | ~20.000 |
| Keywords negativas por campanha | 5.000 |
| Extensões de callout por conta | 20 |
| Extensões de sitelink por conta | 20 |

---

## Limites de Bulk Upload

| Item | Limite |
|------|--------|
| Tamanho máximo do arquivo | 500 MB |
| Linhas por upload | Sem limite documentado |
| Formato aceito | CSV, Google Sheets (XLSX) |

---

## Campos Obrigatórios para Campanhas Novas (desde Set/2025)

| Coluna | Valor padrão | Obrigatória |
|--------|-------------|-------------|
| Campaign | Nome da campanha | Sim |
| Campaign type | `Search` | Sim |
| Budget | Orçamento diário | Sim |
| Bid Strategy type | `Maximize clicks` | Sim |
| EU political ads | `No` | **Sim (obrigatório desde Set/2025)** |
| Status | `Enabled` | Sim |

> **⚠️ REGRA CRÍTICA:** A coluna `EU political ads` é obrigatória para TODA campanha nova desde setembro de 2025. Sem ela, o upload inteiro falha em cascata.

---

## Coluna Action para Extensões (Assets)

| Valor | Quando usar |
|-------|-------------|
| `Add` | Criar extensão NOVA (usar sempre por padrão) |
| `Use existing` | Reutilizar extensão existente (requer `Item ID`) |
| `Remove` | Remover extensão da campanha |

> **⚠️ NUNCA** usar `Use existing` sem fornecer `Item ID`. Causa erro: "Incompatible values".

---

## Políticas de Aprovação (Relevantes para Copy)

| Regra | Descrição |
|-------|-----------|
| Capitalização | Não usar ALL CAPS em textos completos (exceto siglas) |
| Pontuação | Sem exclamação excessiva (máx 1 por headline/desc) |
| Símbolos | Evitar emojis e caracteres especiais desnecessários |
| Claims | Não fazer promessas de saúde, financeiras ou garantias não comprováveis |
| Superlativos | "Best" / "Melhor" requer comprovação de terceiros |
| Marca registrada | Usar ® ou ™ apenas se o anunciante tiver direito |

---

## Notas

- Esses limites são os mais recentes conforme documentação oficial do Google Ads (verificado em 2026).
- Sempre consultar <https://support.google.com/google-ads/answer/6372658> para atualizações.
- Limites podem variar por tipo de campanha (estes são especificamente para Search).
