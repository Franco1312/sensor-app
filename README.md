# Radar Económico

Aplicación móvil React Native con TypeScript para seguimiento de indicadores económicos y cotizaciones de mercado.

## 🎨 Diseño

Este proyecto está basado en diseños HTML/PNG generados por Stitch, ubicados en la carpeta `design/`. Los colores, espaciados y componentes visuales fueron extraídos de estos diseños para crear una experiencia de usuario consistente.

### Color Principal
- **Primary**: `#F4D35E` (Amarillo)

## 🚀 Inicio Rápido

### Prerrequisitos

- Node.js >= 18
- React Native CLI
- Android Studio (para Android) o Xcode (para iOS)
- CocoaPods (solo iOS)

### Instalación

1. Instalar dependencias:
```bash
npm install
```

2. Para iOS, instalar pods:
```bash
cd ios && pod install && cd ..
```

3. Ejecutar la aplicación:

**Android:**
```bash
npm run android
```

**iOS:**
```bash
npm run ios
```

## 📁 Estructura del Proyecto

```
src/
├── components/          # Componentes reutilizables
│   ├── common/         # Componentes comunes (AppText, AppButton, Card, Tag)
│   └── layout/         # Componentes de layout (ScreenContainer, Header, etc.)
├── screens/            # Pantallas de la aplicación
├── navigation/         # Configuración de navegación (React Navigation)
├── theme/              # Sistema de diseño (colores, spacing, tipografía)
├── hooks/              # Custom hooks
├── services/           # Servicios (API client, etc.)
├── store/              # Estado global (placeholder para futura integración)
├── utils/              # Utilidades y helpers
└── types/              # Tipos TypeScript compartidos
```

## 🎨 Sistema de Diseño

El proyecto incluye un sistema de diseño completo con:

- **Colores**: Tokens de color para light/dark mode
- **Spacing**: Sistema de espaciado basado en 4px
- **Tipografía**: Escala tipográfica con fuente Inter
- **Radii**: Border radius consistentes

### Uso del Theme

```tsx
import {useTheme} from '@/theme/ThemeProvider';

const MyComponent = () => {
  const {theme, isDarkMode, toggleTheme} = useTheme();
  
  return (
    <View style={{backgroundColor: theme.colors.background}}>
      <Text style={{color: theme.colors.textPrimary}}>
        Hello World
      </Text>
    </View>
  );
};
```

## 📱 Pantallas

- **HomeScreen**: Dashboard principal con indicadores y cotizaciones destacadas
- **IndicatorsScreen**: Lista completa de indicadores con filtros
- **IndicatorDetailScreen**: Detalle de indicador con gráfico y estadísticas
- **QuotesScreen**: Lista de cotizaciones por categoría
- **SettingsScreen**: Configuración y ajustes de tema

## 🧭 Navegación

La aplicación usa React Navigation con:
- **Bottom Tabs**: Navegación principal (Home, Indicadores, Cotizaciones, Ajustes)
- **Stack Navigator**: Navegación a pantallas de detalle

## 🌓 Dark Mode

La aplicación soporta modo claro y oscuro:
- Detecta automáticamente la preferencia del sistema
- Permite override manual desde SettingsScreen
- Todos los componentes respetan el tema activo

## 🛠️ Scripts Disponibles

- `npm run android` - Ejecutar en Android
- `npm run ios` - Ejecutar en iOS
- `npm run lint` - Ejecutar linter
- `npm run lint:fix` - Corregir errores de linting automáticamente
- `npm run format` - Formatear código con Prettier
- `npm run type-check` - Verificar tipos TypeScript

## 📦 Dependencias Principales

- **React Native** 0.73.0
- **React Navigation** 6.x
- **TypeScript** 5.3.3
- **React Native Gesture Handler**
- **React Native Safe Area Context**
- **React Native SVG**

## 🔮 Próximos Pasos

- [ ] Integrar librería de gráficos (react-native-chart-kit o victory-native)
- [ ] Integrar iconos (react-native-vector-icons)
- [ ] Conectar con API real
- [ ] Implementar estado global (React Query / Zustand)
- [ ] Agregar animaciones con Reanimated
- [ ] Implementar búsqueda global
- [ ] Agregar notificaciones push

## 📝 Notas

- Los datos actuales son mock data ubicados en `src/utils/mockData.ts`
- Los gráficos son placeholders - integrar librería de gráficos para producción
- Los iconos en tabs son placeholders - usar react-native-vector-icons en producción

## 🤝 Contribuir

Este es un template base diseñado para escalar. La estructura está preparada para:
- Agregar nuevas pantallas en `src/screens/`
- Agregar nuevos componentes reutilizables en `src/components/`
- Integrar APIs en `src/services/`
- Agregar estado global en `src/store/`

## 📄 Licencia

Este proyecto es un template base para desarrollo de aplicaciones React Native.
