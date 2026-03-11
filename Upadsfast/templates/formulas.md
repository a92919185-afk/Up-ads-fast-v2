# Fórmulas para Google Sheets — Geração Automática de Copy

Este documento contém fórmulas prontas para usar no Google Sheets.
Assumem que as colunas auxiliares estão nas posições indicadas e geram
textos de oferta automaticamente, respeitando os limites de caracteres.

---

## Layout das Colunas Auxiliares (Exemplo)

| Coluna | Campo |
|--------|-------|
| Y | Product_Name |
| Z | Country |
| AA | Language |
| AB | Discount_Value |
| AC | Guarantee_Days |
| AD | Has_Free_Shipping |
| AE | Currency |
| AF | Price |

> Ajuste as letras de coluna conforme sua planilha real.

---

## Fórmulas para Headlines (≤ 30 caracteres)

### H1 — Nome do produto + Site Oficial

```
=LEFT(Y2 & " Official Site", 30)
```

### H2 — Desconto direto

```
=LEFT("Up To " & AB2 & "% Off Today", 30)
```

### H3 — Frete grátis (condicional)

```
=IF(AD2="Yes", LEFT("Free Shipping " & Z2, 30), LEFT("Fast Delivery " & Z2, 30))
```

### H4 — Garantia

```
=LEFT(AC2 & "-Day Money-Back", 30)
```

### H5 — Preço

```
=LEFT("Order Now For $" & AF2, 30)
```

### H6 — Urgência

```
=LEFT("Limited Time " & AB2 & "% Off", 30)
```

### H7 — Claim

```
=LEFT("Claim Your " & AB2 & "% Off", 30)
```

### H8 — Special Offer

```
=LEFT("Special Offer: " & AB2 & "% Off", 30)
```

### H9 — Brand + Desconto

```
=LEFT(Y2 & " - " & AB2 & "% Off Sale", 30)
```

### H10 — Risk-Free

```
=LEFT("Try " & Y2 & " Risk-Free", 30)
```

---

## Fórmulas para Descriptions (≤ 90 caracteres)

### D1 — Oferta completa

```
=LEFT("Get up to " & AB2 & "% off " & Y2 & " today. Free shipping on orders over $74. " & AC2 & "-day guarantee.", 90)
```

### D2 — Garantia + Preço

```
=LEFT("Try " & Y2 & " risk-free with our " & AC2 & "-day money-back guarantee. Order now for $" & AF2 & ".", 90)
```

### D3 — Urgência + Desconto

```
=LEFT("Limited time offer! Claim your " & AB2 & "% discount on " & Y2 & " today. " & Z2 & " delivery.", 90)
```

### D4 — Preço + Garantia + Desconto

```
=LEFT("Buy " & Y2 & " for $" & AF2 & ". Enjoy a " & AC2 & "-day guarantee and up to " & AB2 & "% off today.", 90)
```

---

## Fórmula de Validação (Checar Limite)

Para verificar se um headline está dentro do limite:

```
=IF(LEN(D2)>30, "⚠️ EXCEDE " & LEN(D2) & " chars", "✅ OK")
```

Para descriptions:

```
=IF(LEN(R2)>90, "⚠️ EXCEDE " & LEN(R2) & " chars", "✅ OK")
```

---

## Fórmula para Callouts (≤ 25 caracteres)

```
=LEFT("Up To " & AB2 & "% Off", 25)
=LEFT("Free Shipping Over $74", 25)
=LEFT(AC2 & "-Day Guarantee", 25)
=LEFT("Starting At $" & AF2, 25)
```

---

## Dicas

1. **SEMPRE** use `LEFT(texto, limite)` para garantir que o texto nunca ultrapasse o limite.
2. Use `LEN()` em colunas de validação para conferir visualmente.
3. Use `IF()` para textos condicionais (ex: frete grátis sim/não).
4. Adapte os idiomas trocando os textos fixos (ex: "Up To" → "Até" para pt-BR).
