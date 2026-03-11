# Upadsfast - Quick Reference (Limites & Regras)

## Campos Obrigatorios para Campanhas Novas (desde Set/2025)

```
Campaign type       = Search
Budget              = Orcamento diario (ex: 50)
Bid Strategy type   = Maximize clicks
EU political ads    = No          <-- OBRIGATORIO! Sem isso, TUDO falha.
Status              = Enabled
```

## Extensoes: Coluna Action

```
Add            -> Criar extensao NOVA (padrao)
Use existing   -> Reutilizar existente (REQUER Item ID!)
Remove         -> Remover extensao da campanha
```

> NUNCA usar "Use existing" sem fornecer Item ID. Causa erro de upload.

## Limites de Caracteres

| Campo | Limite | Obrigatorio |
|-------|--------|-------------|
| Headline (RSA) | 30 chars | Sim (min 3, max 15) |
| Description (RSA) | 90 chars | Sim (min 2, max 4) |
| Path 1 | 15 chars | Nao |
| Path 2 | 15 chars | Nao |
| Callout text | 25 chars | Min 4 por campanha |
| Sitelink text | 25 chars | 6 por campanha |
| Sitelink Desc line 1 | 35 chars | Nao |
| Sitelink Desc line 2 | 35 chars | Nao |
| Snippet values | ~25 chars cada | Min 3 valores, separados por ; |
| Promotion text | Varia | 1 por campanha |

## Variaveis de Extracao

Sempre extrair da pagina de oferta:

```
Product_Name    -> Nome do produto
Country         -> Pais de veiculacao
Language        -> Idioma (en, pt, es, de)
Price           -> Preco numerico
Currency        -> Moeda (USD, BRL, EUR)
Discount_Value  -> % de desconto (numero)
Guarantee_Days  -> Dias de garantia (numero)
Has_Free_Shipping -> Sim/Nao + condicao
Final_URL       -> URL de destino
```

## Perguntas Rapidas ao Usuario

Fazer NO MAXIMO 1-2 perguntas, apenas quando a info nao estiver na pagina:

1. Idioma/Pais de veiculacao?
2. Foco principal? (desconto / garantia / frete / urgencia)

## Foco da Copy - REGRA ABSOLUTA

```
USAR                          NAO USAR
----                          --------
% de desconto                 Beneficios do produto
Frete gratis / valor          "Emagrece", "Cura"
Garantia (dias)               Linguagem de saude
Preco / moeda                 Promessas vagas
Urgencia (hoje, limitado)     Apelos emocionais
Localizacao (pais/cidade)     Testemunhos no ad
```

## Nomenclatura Padrao

```
Campaign:  Search - {PRODUCT} - {COUNTRY}
Ad Group:  {PRODUCT} - Offer
Path 1:    {PRODUCT} (ou abreviacao)
Path 2:    {DISCOUNT}-Off (ou Sale, Deal)
```

## Abas da Planilha (7 abas — nomes em ingles)

```
1. Campaigns   -> Campaign type, Networks, Budget, EU political ads
2. Ad groups   -> Campaign, Ad group
3. Ads         -> 15 Headlines + 4 Descriptions (RSA)
4. Callouts    -> Action=Add, Callout text
5. Sitelinks   -> Action=Add, Sitelink text + URL + Descs
6. Snippets    -> Action=Add, Header + Values (separados por ;)
7. Promotions  -> Action=Add, Occasion, Percent off
```

## Headers Validos para Snippets (Google Ads - EN)

```
Amenities | Brands | Courses | Degree programs | Destinations
Featured hotels | Insurance coverage | Models | Neighborhoods
Service catalog | Shows | Styles | Types
```

Para ofertas, usar: **Types**

## Headers Validos para Snippets (Google Ads - PT)

```
Comodidades | Cursos | Destinos | Estilos | Hoteis em destaque
Marcas | Modelos | Programas de graduacao | Bairros
Catalogo de servicos | Programas | Tipos
```

Para ofertas, usar: **Tipos**

## Checklist Pre-Entrega

- [ ] Aba Campaigns com EU political ads = No
- [ ] Aba Campaigns com Campaign type, Networks, Budget, Bid Strategy type
- [ ] 15 headlines <= 30 chars cada
- [ ] 4 descriptions <= 90 chars cada
- [ ] 4+ callouts <= 25 chars cada (Action = Add)
- [ ] 6 sitelinks <= 25 chars (text), <= 35 chars (desc lines) (Action = Add)
- [ ] 1 snippet com header valido e Structured snippet values PREENCHIDO
- [ ] 1 promocao em % (Percent) com Action = Add
- [ ] Copy 100% oferta, 0% beneficios
- [ ] Tabelas com colunas exatas para bulk upload
- [ ] Final URL preenchida ou marcada como [FINAL_URL]
