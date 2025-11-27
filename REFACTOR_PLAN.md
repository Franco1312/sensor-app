# Plan de Refactorización - Radar Económico

## 📋 Análisis Global del Código

### Estructura Actual

#### Navegación
- **Stack Navigator**: Login, MainTabs, Detail screens (Indicator, Quote, Crypto)
- **Bottom Tab Navigator**: Home, Indicators, News, Settings (Profile)
- **Drawer Navigation**: Menú lateral con categorías expandibles
- **Swipeable Tabs**: PagerView para swipe entre tabs principales

#### Pantallas Identificadas
1. **HomeScreen** (296 líneas) - Dashboard con múltiples secciones
2. **QuotesScreen** (218 líneas) - Lista de cotizaciones con categorías
3. **IndicatorsScreen** (163 líneas) - Lista de indicadores con filtros
4. **IndicatorDetailScreen** (354 líneas) - Detalle con gráfico y stats
5. **QuoteDetailScreen** (266 líneas) - Detalle con gráfico y stats
6. **CryptoDetailScreen** (314 líneas) - Detalle con gráfico y stats
7. **NewsScreen** (125 líneas) - Lista de noticias con paginación
8. **LoginScreen** (265 líneas) - Autenticación
9. **ProfileScreen** - Configuración y perfil

#### Componentes Comunes Identificados
- **Layout**: Screen, Header, Section, Container, Row, ListItem
- **UI Base**: Text, Button, Input, Card, Skeleton, Badge
- **Common**: StatCard, ValueHeader, ChartWithLabels, FilterButton, EmptyState, InfoModal, InfoSection, ChangeDisplay, TrendIcon, VerMasButton
- **Features**: CompactIndicatorCard, CompactQuoteCard, CompactCryptoCard, QuoteItem, NewsCard

#### Problemas Identificados

1. **Complejidad y Duplicación**
   - Las 3 pantallas de detalle (Indicator, Quote, Crypto) tienen ~80% de código duplicado
   - Lógica de loading/error repetida en múltiples pantallas
   - Patrones de skeleton loading duplicados
   - Selectores de tiempo/rango duplicados

2. **Textos Hardcodeados**
   - Muchos strings en español directamente en componentes
   - Solo existe `LABELS` parcial, no hay sistema de i18n completo
   - Textos en LoginScreen, HomeScreen, Error messages, etc.

3. **Lógica Mezclada**
   - Lógica de negocio en componentes de UI
   - Transformaciones de datos dentro de componentes
   - Manejo de estado mezclado con presentación

4. **Performance**
   - Algunas listas usan `.map()` en lugar de FlatList optimizado
   - Posibles re-renders innecesarios (falta React.memo en algunos componentes)
   - Hooks con dependencias que podrían optimizarse

5. **Estructura**
   - Componentes comunes mezclados con features
   - Falta separación clara entre UI base y componentes de dominio
   - Hooks y servicios bien organizados, pero podrían mejorarse

---

## 🎯 Plan de Refactorización

### Fase 1: Design System y Reutilización

#### 1.1 Reorganización de Estructura de Carpetas

```
src/
├── design-system/          # NUEVO: Sistema de diseño unificado
│   ├── tokens/
│   │   ├── colors.ts       # Ya existe en theme/
│   │   ├── spacing.ts       # Ya existe en theme/
│   │   ├── typography.ts    # Ya existe en theme/
│   │   ├── radii.ts         # Ya existe en theme/
│   │   └── shadows.ts       # Ya existe en theme/
│   ├── components/          # Componentes atómicos y moleculares
│   │   ├── atoms/           # Componentes básicos
│   │   │   ├── Text.tsx     # Mover desde ui/
│   │   │   ├── Button.tsx   # Mover desde ui/
│   │   │   ├── Input.tsx    # Mover desde ui/
│   │   │   ├── Badge.tsx    # Mover desde ui/
│   │   │   └── Icon.tsx     # Unificar todos los iconos
│   │   ├── molecules/       # Componentes compuestos
│   │   │   ├── Card.tsx     # Ya existe en ui/
│   │   │   ├── Modal.tsx    # Extraer de InfoModal
│   │   │   ├── Skeleton.tsx # Ya existe en ui/
│   │   │   └── EmptyState.tsx # Ya existe en common/
│   │   └── organisms/       # Componentes complejos
│   │       ├── Header.tsx   # Ya existe en layout/
│   │       ├── ListItem.tsx # Ya existe en layout/
│   │       └── StatCard.tsx # Ya existe en common/
│   └── patterns/            # Patrones de layout reutilizables
│       ├── ScreenContainer.tsx
│       ├── DetailScreenLayout.tsx  # NUEVO: Layout común para detail screens
│       ├── ListScreenLayout.tsx    # NUEVO: Layout común para list screens
│       └── LoadingState.tsx        # NUEVO: Estado de carga reutilizable
│
├── components/              # Componentes de dominio/features
│   ├── features/           # Ya existe, mantener
│   ├── navigation/          # Ya existe, mantener
│   └── layout/              # Mover a design-system/patterns
│
├── screens/                 # Pantallas (refactorizar para usar design-system)
├── hooks/                  # Ya está bien organizado
├── services/               # Ya está bien organizado
├── utils/                  # Ya está bien organizado
└── i18n/                   # NUEVO: Sistema de internacionalización
    ├── config.ts
    ├── translations/
    │   ├── es.json
    │   └── en.json
    └── hooks/
        └── useTranslation.ts
```

#### 1.2 Componentes Base del Design System

**Atoms (Componentes básicos)**
- `Text` - Ya existe, mejorar variantes
- `Button` - Ya existe, mejorar variantes
- `Input` - Ya existe, mejorar validación
- `Badge` - Ya existe
- `Icon` - **NUEVO**: Unificar todos los iconos (ChartIcon, TrendIcon, etc.)

**Molecules (Componentes compuestos)**
- `Card` - Ya existe, mejorar variantes
- `Modal` - Extraer de InfoModal, hacer genérico
- `Skeleton` - Ya existe
- `EmptyState` - Ya existe
- `FilterButton` - Ya existe
- `ChangeDisplay` - Ya existe
- `ValueHeader` - Ya existe

**Organisms (Componentes complejos)**
- `StatCard` - Ya existe
- `Header` - Ya existe
- `ListItem` - Ya existe
- `ChartWithLabels` - Ya existe

**Patterns (Patrones de layout)**
- `ScreenContainer` - Wrapper común para todas las pantallas
- `DetailScreenLayout` - **NUEVO**: Layout común para Indicator/Quote/Crypto detail
- `ListScreenLayout` - **NUEVO**: Layout común para listas con filtros
- `LoadingState` - **NUEVO**: Skeleton loading reutilizable
- `ErrorState` - **NUEVO**: Estado de error reutilizable

#### 1.3 Refactorización de Pantallas de Detalle

**Problema**: IndicatorDetailScreen, QuoteDetailScreen y CryptoDetailScreen tienen ~80% de código duplicado.

**Solución**: Crear componente genérico `DetailScreenLayout` que acepte configuración:

```typescript
interface DetailScreenConfig {
  title: string;
  value: string;
  changeLabel: string;
  changeColor: string;
  chartData?: ChartData;
  timeRange?: TimeRange;
  onTimeRangeChange?: (range: TimeRange) => void;
  stats: StatCard[];
  infoSections?: InfoSection[];
  loading: boolean;
  error?: string;
}
```

Cada pantalla de detalle se convierte en un wrapper que:
1. Obtiene datos con hooks
2. Transforma datos a formato común
3. Pasa configuración a `DetailScreenLayout`

---

### Fase 2: Internacionalización (i18n)

#### 2.1 Elección de Librería

**Propuesta**: `react-i18next` + `i18next`
- Estándar de la industria
- Buen soporte para React Native
- Permite lazy loading de traducciones
- Soporte para pluralización y formateo

**Alternativa más ligera**: `i18n-js` + `expo-localization`
- Más simple
- Menos features pero suficiente para este proyecto

**Decisión**: Usar `i18n-js` + `expo-localization` por simplicidad y porque ya está en Expo.

#### 2.2 Estructura de Traducciones

```json
// i18n/translations/es.json
{
  "screens": {
    "home": {
      "title": "Radar Económico",
      "sections": {
        "dailyQuotes": "Cotizaciones del Día",
        "mainIndicators": "Indicadores Principales",
        "featuredNews": "Noticias Destacadas"
      },
      "subsections": {
        "dollar": "Dólar",
        "crypto": "Crypto"
      }
    },
    "quotes": {
      "title": "Cotizaciones",
      "lastUpdate": "Actualizado: {{time}} hs",
      "empty": {
        "title": "No hay cotizaciones disponibles",
        "message": "No se encontraron cotizaciones para esta categoría."
      },
      "error": {
        "title": "Error al cargar cotizaciones",
        "message": "{{error}}"
      }
    },
    "indicators": {
      "title": "Indicadores Económicos"
    },
    "news": {
      "title": "Noticias",
      "empty": {
        "title": "No hay noticias disponibles",
        "message": "No se encontraron noticias en este momento."
      },
      "error": {
        "title": "Error al cargar noticias",
        "message": "{{error}}"
      }
    },
    "login": {
      "title": "Bienvenido de vuelta",
      "subtitle": "Inicia sesión para continuar en Radar Económico",
      "emailLabel": "Email o Usuario",
      "emailPlaceholder": "Ingresa tu email o usuario",
      "passwordLabel": "Contraseña",
      "passwordPlaceholder": "Ingresa tu contraseña",
      "forgotPassword": "¿Olvidaste tu contraseña?",
      "loginButton": "Iniciar Sesión",
      "signUp": {
        "question": "¿No tienes una cuenta?",
        "link": "Regístrate ahora"
      },
      "errors": {
        "emptyFields": "Por favor completa todos los campos",
        "loginFailed": "Error al iniciar sesión",
        "resetFailed": "Error al solicitar recuperación"
      }
    },
    "detail": {
      "historicalEvolution": "Evolución Histórica",
      "lastValue": "Último Valor",
      "monthlyVariation": "Variación Mensual",
      "lastUpdate": "Última Actualización",
      "description": "Descripción",
      "methodology": "Metodología y Notas",
      "source": "Fuente",
      "notFound": {
        "indicator": "Indicador no encontrado",
        "quote": "Cotización no encontrada",
        "crypto": "Criptomoneda no encontrada"
      },
      "error": {
        "message": "No se pudo cargar la información. Por favor, intenta nuevamente."
      }
    }
  },
  "components": {
    "button": {
      "save": "Guardar",
      "cancel": "Cancelar",
      "understood": "Entendido"
    },
    "common": {
      "verMas": "Ver más",
      "updated": "Actualizado",
      "noDescription": "Sin descripción disponible"
    }
  },
  "navigation": {
    "tabs": {
      "home": "Inicio",
      "indicators": "Mercados",
      "news": "Noticias",
      "settings": "Perfil"
    }
  }
}
```

#### 2.3 Implementación

1. Crear `src/i18n/config.ts` con configuración de i18n
2. Crear archivos de traducción `es.json` y `en.json`
3. Crear hook `useTranslation()` para acceder a traducciones
4. Extraer TODOS los textos hardcodeados a archivos de traducción
5. Reemplazar en componentes y pantallas

---

### Fase 3: Reducción de Complejidad

#### 3.1 Extracción de Lógica de Negocio

**Hooks personalizados a crear/mejorar:**

1. `useDetailScreen` - **NUEVO**: Lógica común para pantallas de detalle
   - Manejo de loading/error
   - Transformación de datos
   - Estado de timeRange

2. `useListScreen` - **NUEVO**: Lógica común para pantallas de lista
   - Filtrado
   - Paginación
   - Loading/error states

3. `useScreenLoading` - **NUEVO**: Manejo de estados de carga
   - Skeleton states
   - Error states
   - Empty states

#### 3.2 Simplificación de Condicionales

**Estrategias:**

1. **Reemplazar ifs por mapas de configuración**
   ```typescript
   // Antes
   if (type === 'A') return <ComponentA />;
   if (type === 'B') return <ComponentB />;
   
   // Después
   const componentMap = {
     A: ComponentA,
     B: ComponentB,
   };
   const Component = componentMap[type];
   return <Component />;
   ```

2. **Extraer lógica de renderizado a funciones puras**
   ```typescript
   const renderLoadingState = () => <LoadingSkeleton />;
   const renderErrorState = () => <ErrorState />;
   const renderContent = () => <Content />;
   ```

3. **Usar early returns para reducir anidación**

#### 3.3 Componentes Más Pequeños

**Pantallas grandes a dividir:**

1. **HomeScreen** (296 líneas)
   - Extraer secciones a componentes: `DailyQuotesSection`, `MainIndicatorsSection`, `FeaturedNewsSection`
   - Cada sección < 100 líneas

2. **Detail Screens** (300+ líneas cada una)
   - Usar `DetailScreenLayout` común
   - Cada pantalla < 150 líneas

3. **QuotesScreen** (218 líneas)
   - Extraer lógica de categorías a hook
   - Simplificar renderizado

---

### Fase 4: Optimización de Performance

#### 4.1 Listas

**Problemas identificados:**
- HomeScreen usa `.map()` para listas pequeñas (OK, pero documentar)
- QuotesScreen usa FlatList (correcto)
- NewsScreen usa FlatList (correcto)

**Mejoras:**
- Asegurar `keyExtractor` estables en todas las listas
- Usar `getItemLayout` cuando sea posible
- Considerar `FlashList` de Shopify si las listas crecen mucho

#### 4.2 Re-renders

**Componentes a memoizar:**
- `QuoteItem` - Ya existe, verificar
- `NewsCard` - Agregar React.memo
- `CompactIndicatorCard` - Agregar React.memo
- `CompactQuoteCard` - Agregar React.memo
- `CompactCryptoCard` - Agregar React.memo

**Callbacks a envolver en useCallback:**
- Handlers de navegación en pantallas
- Handlers de filtros
- Handlers de timeRange

**Cálculos pesados a memoizar:**
- Transformaciones de datos de gráficos (ya usan useMemo)
- Filtrados de listas (ya usan useMemo)

#### 4.3 Hooks

**Optimizaciones:**
- Revisar dependencias de useEffect para evitar loops
- Consolidar múltiples useEffect en uno cuando sea posible
- Usar useMemo para valores derivados

---

### Fase 5: Ordenar Estado y Capa de Datos

#### 5.1 Contextos

**Contextos actuales:**
- `AuthContext` - OK
- `DrawerContext` - OK
- `IndicatorsFilterContext` - OK
- `ThemeProvider` - OK

**Mejoras:**
- Considerar usar Zustand para estado global si crece la complejidad
- Por ahora, mantener Context API

#### 5.2 Servicios

**Estructura actual es buena:**
- Separación por dominio (auth-api, crypto-api, quotes-api, etc.)
- Manejo de errores centralizado (ApiError)
- Clientes bien organizados

**Mejoras menores:**
- Agregar tipos más estrictos
- Documentar contratos de API

---

## 📦 Dependencias a Agregar

### Nuevas Dependencias

1. **i18n-js** + **expo-localization**
   ```bash
   npm install i18n-js expo-localization
   ```

2. **Opcional: @shopify/flash-list** (si las listas crecen mucho)
   ```bash
   npm install @shopify/flash-list
   ```

### Dependencias Actuales (mantener)
- React Navigation (ya instalado)
- React Native Gesture Handler (ya instalado)
- React Native Pager View (ya instalado)
- React Native Safe Area Context (ya instalado)
- React Native SVG (ya instalado)

---

## 🗂️ Nueva Estructura de Carpetas (Resumen)

```
src/
├── design-system/          # Sistema de diseño
│   ├── tokens/            # Tokens de diseño (colores, spacing, etc.)
│   ├── components/        # Componentes base (atoms, molecules, organisms)
│   └── patterns/          # Patrones de layout reutilizables
├── components/            # Componentes de dominio/features
│   ├── features/          # Componentes específicos de features
│   └── navigation/        # Componentes de navegación
├── screens/               # Pantallas (refactorizadas)
├── hooks/                 # Hooks personalizados
├── services/              # Servicios de API
├── utils/                 # Utilidades
├── i18n/                  # Internacionalización
│   ├── config.ts
│   ├── translations/
│   └── hooks/
├── context/               # Contextos de React
├── navigation/            # Configuración de navegación
├── theme/                 # Tema (mantener, integrar con design-system)
└── types/                 # Tipos TypeScript
```

---

## 📝 Orden de Implementación

### Etapa 1: Preparación (Sin cambios funcionales)
1. ✅ Crear estructura de carpetas `design-system/`
2. ✅ Mover componentes base a `design-system/components/`
3. ✅ Crear archivos de i18n básicos
4. ✅ Crear `DetailScreenLayout` genérico

### Etapa 2: Design System
1. ✅ Refactorizar componentes base (Text, Button, etc.)
2. ✅ Crear componentes de patrón (LoadingState, ErrorState, etc.)
3. ✅ Crear `DetailScreenLayout`
4. ✅ Crear `ListScreenLayout`

### Etapa 3: i18n
1. ✅ Instalar dependencias
2. ✅ Configurar i18n
3. ✅ Extraer TODOS los textos a archivos de traducción
4. ✅ Reemplazar en componentes y pantallas

### Etapa 4: Reducción de Complejidad
1. ✅ Refactorizar pantallas de detalle para usar `DetailScreenLayout`
2. ✅ Extraer secciones de HomeScreen
3. ✅ Crear hooks personalizados para lógica común
4. ✅ Simplificar condicionales

### Etapa 5: Performance
1. ✅ Agregar React.memo donde corresponda
2. ✅ Envolver callbacks en useCallback
3. ✅ Optimizar listas
4. ✅ Revisar y optimizar hooks

### Etapa 6: Documentación
1. ✅ Crear `ARCHITECTURE.md`
2. ✅ Crear `DESIGN_SYSTEM.md`
3. ✅ Crear `I18N.md`
4. ✅ Crear `PERFORMANCE_NOTES.md`

---

## ✅ Criterios de Éxito

1. **Reducción de complejidad:**
   - Ninguna pantalla > 200 líneas
   - Ningún componente > 150 líneas
   - Reducción de 50%+ en código duplicado

2. **Reutilización:**
   - 80%+ de componentes UI usando design-system
   - Patrones comunes extraídos y reutilizados

3. **i18n:**
   - 100% de textos hardcodeados extraídos
   - Sistema funcional con soporte para múltiples idiomas

4. **Performance:**
   - Listas optimizadas con FlatList/FlashList
   - Re-renders innecesarios eliminados
   - Hooks optimizados

5. **Mantenibilidad:**
   - Código más legible y organizado
   - Documentación completa
   - Mismo comportamiento funcional (no romper nada)

---

## 🚀 Siguiente Paso

Una vez aprobado este plan, comenzaré con la **Etapa 1: Preparación** creando la estructura de carpetas y moviendo componentes sin cambiar funcionalidad.

