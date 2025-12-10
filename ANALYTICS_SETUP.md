# Configuración de Analytics - Resumen de Implementación

## ✅ Implementación Completada

Se ha instrumentado completamente el proyecto con Firebase Analytics siguiendo buenas prácticas y manteniendo una arquitectura limpia y escalable.

## 📦 Dependencias Agregadas

- `expo-firebase-analytics`: ~14.0.0 (agregado a package.json)

## 📁 Estructura Creada

```
src/core/analytics/
├── events.ts              # Definiciones de eventos y tipos
├── analyticsClient.ts     # Cliente que encapsula Firebase Analytics
├── hooks.ts               # Hooks de React para tracking
├── index.ts               # Exportaciones centralizadas
└── README.md              # Documentación del módulo
```

## 🎯 Pantallas Instrumentadas

Todas las pantallas principales ahora trackean screen views:

- ✅ `HomeScreen` - Dashboard principal
- ✅ `IndicatorsScreen` - Lista de indicadores
- ✅ `IndicatorDetailScreen` - Detalle de indicador
- ✅ `QuotesScreen` - Lista de cotizaciones
- ✅ `QuoteDetailScreen` - Detalle de cotización
- ✅ `CryptoDetailScreen` - Detalle de criptomoneda
- ✅ `NewsScreen` - Lista de noticias
- ✅ `AlertsScreen` - Lista de alertas
- ✅ `AlertFormScreen` - Formulario de alertas
- ✅ `ProfileScreen` - Perfil/configuración
- ✅ `LoginScreen` - Login

## 📊 Eventos de Negocio Implementados

### Series/Indicadores
- ✅ `view_series` - Cuando se visualiza una serie
- ✅ `change_series_config` - Cuando se cambia período/agregación

### Cotizaciones
- ✅ `view_quote` - Cuando se visualiza una cotización
- ✅ `change_quote_config` - Cuando se cambia período

### Criptomonedas
- ✅ `view_crypto` - Cuando se visualiza una criptomoneda
- ✅ `change_crypto_config` - Cuando se cambia intervalo de tiempo

### Alertas
- ✅ `toggle_alert` - Activar/desactivar alerta
- ✅ `create_alert` - Crear nueva alerta
- ✅ `update_alert` - Actualizar alerta existente
- ✅ `delete_alert` - Eliminar alerta

### Noticias
- ✅ `open_news_article` - Abrir artículo de noticia

### Navegación
- ✅ `navigate_to_quotes` - Navegar a cotizaciones
- ✅ `navigate_to_indicators` - Navegar a indicadores
- ✅ `navigate_to_news` - Navegar a noticias

### Filtros
- ✅ `filter_by_category` - Filtrar por categoría

## 🔧 Integración con AuthContext

El tracking de usuario está integrado automáticamente:
- Se establece el `userId` cuando el usuario inicia sesión
- Se limpia el `userId` y se resetean los datos de analytics al cerrar sesión
- Se actualiza el `userId` cuando se refresca la información del usuario

## 📝 Configuración Pendiente

### 1. Instalar Dependencias

```bash
npm install
```

### 2. Configurar Firebase

1. Crear proyecto en [Firebase Console](https://console.firebase.google.com/)
2. Agregar apps Android e iOS
3. Descargar archivos de configuración:
   - `google-services.json` → `android/app/google-services.json`
   - `GoogleService-Info.plist` → `ios/RadarEconmico/GoogleService-Info.plist`
4. Obtener los App IDs de Firebase

### 3. Actualizar app.json

Reemplazar los placeholders en `app.json`:

```json
{
  "expo": {
    "plugins": [
      [
        "expo-firebase-analytics",
        {
          "androidAppId": "1:TU_ANDROID_APP_ID",
          "iosAppId": "1:TU_IOS_APP_ID"
        }
      ]
    ]
  }
}
```

### 4. Rebuild del Proyecto

Después de configurar Firebase, es necesario hacer un rebuild:

```bash
# Para Android
npx expo prebuild
npx expo run:android

# Para iOS
npx expo prebuild
npx expo run:ios
```

## ✨ Características Implementadas

- ✅ **Capa centralizada**: Toda la lógica de analytics está en un solo lugar
- ✅ **Tipado completo**: TypeScript con tipos estrictos para todos los eventos
- ✅ **Sin strings mágicas**: Todos los eventos están definidos como constantes
- ✅ **Sanitización automática**: Los parámetros se sanitizan para cumplir restricciones de Firebase
- ✅ **Manejo de errores**: Los errores de analytics no rompen la app
- ✅ **Tracking de usuario**: Integrado automáticamente con el sistema de autenticación
- ✅ **Código limpio**: Los componentes UI no conocen detalles de Firebase

## 📚 Documentación

Ver `src/core/analytics/README.md` para documentación detallada sobre:
- Cómo usar los hooks
- Cómo agregar nuevos eventos
- Lista completa de eventos disponibles
- Arquitectura del módulo

## 🎉 Resultado

El proyecto está completamente instrumentado y listo para medir:
- Uso real de pantallas
- Series y secciones más utilizadas
- Retención básica
- Flujo de navegación
- Interacciones clave de negocio

