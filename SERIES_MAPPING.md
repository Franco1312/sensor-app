# Mapeo de Series a Lenguaje Humano

Este documento centraliza todos los mapeos de códigos técnicos de series, cotizaciones y criptomonedas a sus nombres legibles que se muestran al usuario.

## 📊 Series de Indicadores Económicos

### BCRA (Banco Central de la República Argentina)

| Código Técnico | Nombre para el Usuario | Formato | Ejemplo |
|---------------|------------------------|---------|---------|
| `BCRA_BASE_MONETARIA_TOTAL_ARS_BN_D` | Base Monetaria | Billones ARS | `$33.0B` |
| `BCRA_RESERVAS_USD_M_D` | Reservas Internacionales | Millones USD | `U$S 40.356M` |
| `BCRA_CIRCULANTE_PUBLICO_ARS_BN_D` | Billetes y monedas en manos del público | Billones ARS | `$21.4B` |
| `BCRA_TC_OFICIAL_A3500_PESOSxUSD_D` | Tipo de Cambio Oficial | Pesos por Dólar | `$1,450` |

### INDEC (Instituto Nacional de Estadística y Censos)

| Código Técnico | Nombre para el Usuario | Formato | Ejemplo |
|---------------|------------------------|---------|---------|
| `INDEC_IPC_VARIACION_MENSUAL_PCT_M` | IPC Mensual | Porcentaje | `2.3%` |
| `INDEC_IPC_VARIACION_INTERANUAL_PCT_M` | IPC Interanual | Porcentaje | `150.5%` |
| `INDEC_EMAE_ORIGINAL_IDX_M` | EMAE Original | Índice | `152.10` |
| `INDEC_EMAE_DESESTACIONALIZADA_IDX_M` | EMAE Desestacionalizada | Índice | `153.63` |
| `INDEC_EMAE_TENDENCIA_CICLO_IDX_M` | EMAE Tendencia-Ciclo | Índice | `153.00` |
| `INDEC_EMAE_ORIGINAL_VARIACION_INTERANUAL_PCT_M` | EMAE Variación Interanual | Porcentaje | `5.0%` |

## 💵 Cotizaciones (Dólares)

### Series de Cotizaciones USD (projections-consumer-api)

Las cotizaciones de dólares ahora se obtienen desde `projections-consumer-api` usando el formato estándar de series, en lugar de `cotizaciones-api-connectors`.

| Código Técnico | Nombre para el Usuario | Tipo | Formato | Ejemplo |
|---------------|------------------------|------|---------|---------|
| `USD_OFICIAL_COMPRA_PESOSxUSD_D` | Dólar Oficial (Compra) | Compra | Pesos por Dólar | `$1.450,50` |
| `USD_OFICIAL_VENTA_PESOSxUSD_D` | Dólar Oficial (Venta) | Venta | Pesos por Dólar | `$1.450,50` |
| `USD_MAYORISTA_COMPRA_PESOSxUSD_D` | Dólar Mayorista (Compra) | Compra | Pesos por Dólar | `$1.450,50` |
| `USD_MAYORISTA_VENTA_PESOSxUSD_D` | Dólar Mayorista (Venta) | Venta | Pesos por Dólar | `$1.450,50` |
| `USD_TARJETA_COMPRA_PESOSxUSD_D` | Dólar Tarjeta (Compra) | Compra | Pesos por Dólar | `$1.450,50` |
| `USD_TARJETA_VENTA_PESOSxUSD_D` | Dólar Tarjeta (Venta) | Venta | Pesos por Dólar | `$1.450,50` |
| `USD_BOLSA_COMPRA_PESOSxUSD_D` | Dólar Bolsa (MEP) Compra | Compra | Pesos por Dólar | `$1.450,50` |
| `USD_BOLSA_VENTA_PESOSxUSD_D` | Dólar Bolsa (MEP) Venta | Venta | Pesos por Dólar | `$1.450,50` |
| `USD_CONTADOCONLIQUI_COMPRA_PESOSxUSD_D` | Dólar Contado con Liquidación (CCL) Compra | Compra | Pesos por Dólar | `$1.450,50` |
| `USD_CONTADOCONLIQUI_VENTA_PESOSxUSD_D` | Dólar Contado con Liquidación (CCL) Venta | Venta | Pesos por Dólar | `$1.450,50` |
| `USD_BLUE_COMPRA_PESOSxUSD_D` | Dólar Blue (Compra) | Compra | Pesos por Dólar | `$1.450,50` |
| `USD_BLUE_VENTA_PESOSxUSD_D` | Dólar Blue (Venta) | Venta | Pesos por Dólar | `$1.450,50` |
| `USD_CRIPTO_COMPRA_PESOSxUSD_D` | Dólar Cripto (Compra) | Compra | Pesos por Dólar | `$1.450,50` |
| `USD_CRIPTO_VENTA_PESOSxUSD_D` | Dólar Cripto (Venta) | Venta | Pesos por Dólar | `$1.450,50` |

**Nota:** Las cotizaciones se agrupan en pares (compra/venta) para crear objetos `Quote` con `buyPrice` (compra) y `sellPrice` (venta). Todas las series de USD se obtienen desde `projections-consumer-api` usando el mismo formato estándar que los indicadores.

## 🪙 Criptomonedas

| Símbolo Técnico | Nombre para el Usuario | Formato | Ejemplo |
|----------------|------------------------|---------|---------|
| `BTCUSDT` | Bitcoin | Dólares por Token | `$45,234.56` |
| `ETHUSDT` | Ethereum | Dólares por Token | `$2,345.67` |
| `BNBUSDT` | Binance Coin | Dólares por Token | `$312.45` |
| `ADAUSDT` | Cardano | Dólares por Token | `$0.45` |
| `SOLUSDT` | Solana | Dólares por Token | `$98.76` |
| `XRPUSDT` | Ripple | Dólares por Token | `$0.52` |
| `DOGEUSDT` | Dogecoin | Dólares por Token | `$0.08` |
| `DOTUSDT` | Polkadot | Dólares por Token | `$6.78` |
| `MATICUSDT` | Polygon | Dólares por Token | `$0.89` |
| `AVAXUSDT` | Avalanche | Dólares por Token | `$34.56` |

## 📝 Notas sobre Formatos

### Series BCRA/INDEC

- **Billones ARS**: Valores en millones de pesos convertidos a billones (ej: 33,019,446 millones = $33.0B)
- **Millones USD**: Valores en millones de dólares (ej: 40,356 millones = U$S 40.356M)
- **Porcentaje**: Variación porcentual con 1 decimal (ej: 2.3%)
- **Índice**: Valor índice con 2 decimales (ej: 152.10)

### Cotizaciones

- **Formato**: Pesos argentinos por dólar
- **Formato local**: Punto para miles, coma para decimales (ej: $1.450,50)

### Criptomonedas

- **Formato**: Dólares estadounidenses (USDT)
- **Decimales**: Hasta 8 decimales para valores pequeños, 2 para valores grandes

## 🔍 Ubicación en el Código

- **Series de Indicadores**: `src/constants/series.ts` → `SERIES_METADATA`
- **Cotizaciones USD**: `src/constants/series.ts` → `SERIES_METADATA` (formato estándar de series)
- **Transformación USD a Quotes**: `src/utils/usdSeriesToQuotes.ts` → `fetchUsdQuotesFromSeries()`
- **Criptomonedas**: `src/constants/crypto.ts` → `CRYPTO_NAMES`

## 📚 Referencias

- Transformaciones de series: `src/utils/seriesTransform.ts`
- Transformación de series USD a Quotes: `src/utils/usdSeriesToQuotes.ts`
- Transformaciones de cotizaciones (legacy): `src/utils/quotesTransform.ts` (solo para referencia, ya no se usa para USD)
- Helpers de criptomonedas: `src/utils/cryptoHelpers.ts`

## 🔄 Migración a Formato de Series

**Nota importante:** Las cotizaciones de USD ahora se obtienen desde `projections-consumer-api` usando el formato estándar de series, en lugar de `cotizaciones-api-connectors`. Esto permite un manejo unificado de todos los datos económicos usando la misma estructura de series.

