# Regras de Copy para Oferta — Google Ads Search RSA

Este documento define as regras de redação publicitária que o agente
DEVE seguir ao gerar copy para anúncios de Rede de Pesquisa.

---

## Princípio Central

> **Toda copy é sobre a OFERTA, nunca sobre o PRODUTO.**

O Google Ads Search é um canal de intenção.
O usuário já está buscando o produto.
Ele quer saber: **quanto custa, quanto economiza, qual a garantia, como recebe.**

---

## O que SEMPRE incluir nos anúncios

### 1. Percentual de Desconto

- É o hook principal. Sempre que existir.
- **Regra:** O desconto SEMPRE deve ser apresentado em **formato percentual (%)**.
- Exemplos: "50% Off Today", "Up To 40% Discount"

### 2. Preço

- Mostrar o preço real na **moeda exata do país** (ex: DKK, €, $, R$).
- **Regra de Coleta:** Extrair o preço diretamente da página enviada (se houver) ou do prompt do usuário. Se não houver preço listado na página ou no prompt, **não invente o preço nem tente adivinhar a moeda**; apenas foque no desconto e nas outras garantias na copy.
- Exemplos: "Only $37", "Starting At $39.95/yr"

### 3. Frete / Entrega

- Se tem frete grátis: "Free Shipping", "Free US Shipping"
- Se é produto digital: "Instant Download", "Digital Delivery"
- Se frete tem condição: "Free Shipping Over $74"

### 4. Garantia

- Sempre mencionar dias + tipo.
- Exemplos: "30-Day Money-Back", "90-Day Guarantee"

### 5. Urgência

- Criar senso temporal.
- Exemplos: "Today Only", "Limited Time", "Ends Soon", "Order Now"

### 6. Localização

- Quando fizer sentido para o mercado-alvo.
- Exemplos: "Ships to US", "Delivery to Canada", "Available in DE"

---

## O que NUNCA incluir nos anúncios

| Proibido | Motivo |
|----------|--------|
| Benefícios do produto ("emagrece", "cura", "protege") | Foge do foco em oferta |
| Claims de saúde | Risco de reprovação no Google Ads |
| Testemunhos / reviews | Não cabe em RSA (usar extensões de avaliação) |
| Linguagem vaga ("o melhor", "incrível") | Não converte em Search |
| Promessas exageradas | Viola políticas do Google |

---

## Padrões de Headlines por Slot

| Slot | Tipo | Padrão |
|------|------|--------|
| H1 | Brand | `{Product} Official Site` |
| H2 | Desconto principal | `{Discount}% Off Today` |
| H3 | Desconto secundário | `Buy 1 Get 1 {Discount}% Off` |
| H4 | Frete | `Free Shipping {Location}` |
| H5 | Garantia | `{Guarantee}-Day Money-Back` |
| H6 | Preço | `Order {Product} For ${Price}` |
| H7 | Urgência | `Limited Time {Discount}% Sale` |
| H8 | CTA | `Claim Your {Discount}% Off` |
| H9 | Oferta | `Special Offer: {Discount}% Off` |
| H10 | Brand + Desconto | `{Product} - {Discount}% Off Sale` |
| H11 | Risk-Free | `Try {Product} Risk-Free` |
| H12 | Frete detalhado | `Free Shipping Over ${Min}` |
| H13 | Bundle | `Exclusive Bundle Price` |
| H14 | CTA segurança | `Secure Your Order Now` |
| H15 | CTA urgência | `Order Today Save {Discount}%` |

---

## Padrões de Descriptions por Slot

| Slot | Padrão |
|------|--------|
| D1 | Oferta completa: desconto + frete + garantia |
| D2 | Garantia + preço |
| D3 | Urgência + desconto + entrega |
| D4 | Preço + garantia + economia |

---

## Adaptação por Idioma (Sistema Vivo de Expansão)

O Upadsfast é um **sistema vivo**. Ele não se limita apenas a linguagens hardcoded, mas expande sua base de conhecimento nativo a cada novo país (como a recente inserção da Dinamarca/da).

Sempre que o usuário jogar uma URL de um **país/idioma inédito**, o agente DEVE agir como um tradutor sênior nativo e adotar os seguintes hooks no novo idioma:

| Hook Universal | en | pt | de | da (Aprendizado Recente) | *Novo Idioma* |
|----------------|----|----|----|-------------------------|---------------|
| Desconto | Off | Desconto | Rabatt | Rabat | *Traduzir Nativo* |
| Frete Grátis | Free Shipping | Frete Grátis | Kostenloser Versand | Fri Fragt / Gratis Fragt | *Traduzir Nativo* |
| Garantia | Guarantee | Garantia | Garantie | Garanti | *Traduzir Nativo* |
| Hoje/Urgência | Today | Hoje | Heute | I Dag | *Traduzir Nativo* |

> **Protocolo de Novo Mercado:** Se o produto for para um mercado não tabelado (ex: Finlândia `fi` ou Suécia `sv`), o agente deve usar seu conhecimento linguístico para descobrir as palavras mais publicitárias daquele país para "Frete", "Garantia", "Desconto" e aplicar as regras de capitalização cultural antes de gerar a planilha.

## Inserções Dinâmicas (DKI e Localização)

O sistema deve usar inserções dinâmicas nativas do Google Ads para aumentar a taxa de clique (CTR) através de alta relevância.

### 1. Inserção de Localização (Personalização Geográfica)

- **Regra:** Usar `{LOCATION(City):Texto Padrão}` ou `{LOCATION(Country):Texto Padrão}` para criar proximidade com o usuário.
- **Aplicações de Frete:** `Free Shipping To {LOCATION(City):Your Area}` / `Hurtig Levering Til {LOCATION(City):Danmark}` (DK).
- **Aplicações de Desconto:** `Special {LOCATION(City):Local} Discount` / `{Discount}% Off In {LOCATION(Country):Your Country}`.

### 2. Inserção de Palavra-chave (DKI)

- **Regra:** Usar `{KeyWord:Nome do Produto}` para espelhar a busca exata do usuário.
- **Aplicação:** `Order {KeyWord:Slimanol} Today` (Se o limite de 30 caracteres estourar, o Google usa o padrão "Slimanol").

---

## Regras de Maiúsculas (Case Capitalization) Cultural

A capitalização das letras nos anúncios deve respeitar RIGOROSAMENTE as regras culturais do idioma alvo. Não aplique *Title Case* cego para todos os países.

| Mercado / Idioma | Títulos (Headlines) | Descrições (Descriptions) | Padrão Esperado |
|------------------|---------------------|---------------------------|-----------------|
| **Anglo-Saxão (en)** | **Title Case** (Todas as Letras Iniciais Maiúsculas) | **Sentence case** ou **Title Case** (depende da agressividade) | `Free Shipping On All Orders Today` |
| **Alemão (de)** | **Sentence case** (Regras GRAMATICAIS alemãs) | **Sentence case** | Apenas Substantivos e Início de frases em maiúsculo: `Kostenloser Versand für alle Bestellungen` |
| **Nórdicos (da, fi, sv, no)** | **Sentence case** (Regras suaves) | **Sentence case** | Apenas início da frase em maiúsculo (evitar Title Case artificial) |
| **Latinos (pt, es, fr, it)** | **Title Case Moderado** ou **Sentence case** | **Sentence case** | `Frete Grátis Para o Brasil` (Títulos), textos corridos nornais nas descrições |

> **Regra Mestra:** Se o anúncio for em Inglês, use Iniciais Maiúsculas em quase tudo para destacar (Title Case). Se não for, siga o princípio de naturalidade linguística do país.

---

## Regra de Software vs. Produto Físico

| Tipo | Frete | Termos a usar |
|------|-------|---------------|
| Produto físico | Free Shipping, Fast Delivery | "Ships to US", "Free Shipping Over $74" |
| Software / Digital | Instant Download, Digital Delivery | "Instant Access", "Download Now" |

---

## Regras de Densidade e Caracteres (Character Utilization)

Para maximizar o espaço visual no leilão do Google e aumentar o CTR, as copys geradas devem preencher o máximo de caracteres possíveis sem ultrapassar o limite da plataforma. Os anúncios mais chamativos são aqueles que entregam o máximo de atributos (desconto, oferta, garantia).

1. **Ocupação Mínima de 70% a 90% para TODOS os Elementos:**
   - **Títulos (Headlines - Max 30 chars):** Entre **21 e 27 caracteres**.
   - **Descrições (Descriptions - Max 90 chars):** Entre **63 e 81 caracteres**.
   - **Sitelinks e Callouts (Max 25/35 chars):** Textos de sitelinks e Callouts (devem ter entre **17 e 23 caracteres**). Descrições extras D1/D2 nos sitelinks (devem ter entre **24 e 31 caracteres**).
   - **Snippets (Max 25 chars):** Devem possuir entre **17 e 22 caracteres**.
   - **Regra de Ouro:** Textos com menos da metade do espaço permitido para *qualquer slot* são expressamente proibidos. Quanto mais completo e dominante for o anúncio em *todas as partes exigidas*, maiores as chances de converter.

2. **Geração de Snippets:**
   - O sistema DEVE gerar **pelo menos 4 Snippets (SnippetValues)** por idioma/produto para garantir a integridade da extensão de anúncio, cumprindo a lei de 70% a 90% do tamanho.
