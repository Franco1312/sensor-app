# Analytics Module

Módulo centralizado de analytics para Firebase Analytics. Proporciona una capa de abstracción limpia y tipada para trackear eventos y vistas de pantalla.

## Instalación

1. Instalar el paquete de Firebase Analytics para Expo:
```bash
npm install expo-firebase-analytics
```

2. Configurar Firebase en tu proyecto:
   - Crea un proyecto en [Firebase Console](https://console.firebase.google.com/)
   - Agrega las apps Android e iOS
   - Descarga los archivos de configuración:
     - `google-services.json` para Android (colocar en `android/app/`)
     - `GoogleService-Info.plist` para iOS (colocar en `ios/RadarEconmico/`)
   - Actualiza `app.json` con los App IDs de Firebase

3. Actualizar `app.json`:
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

## Uso

### Screen Tracking

Cada pantalla debe usar el hook `useScreenTracking`:

```typescript
import { useScreenTracking, SCREEN_NAMES } from '@/core/analytics';

export const MyScreen: React.FC = () => {
  useScreenTracking(SCREEN_NAMES.DASHBOARD_HOME);
  
  // ... resto del componente
};
```

### Event Tracking

Para trackear eventos de negocio, usa el hook `useAnalytics`:

```typescript
import { useAnalytics, EVENT_NAMES } from '@/core/analytics';

export const MyComponent: React.FC = () => {
  const { trackEvent } = useAnalytics();
  
  const handleAction = () => {
    trackEvent(EVENT_NAMES.VIEW_SERIES, {
      series_code: 'INDEC_IPC',
      series_name: 'IPC',
      source: 'home',
      category: 'INDEC',
    });
  };
  
  // ... resto del componente
};
```

## Eventos Disponibles

### Screen Names
- `DASHBOARD_HOME` - Pantalla principal/home
- `SERIES_LIST` - Lista de indicadores
- `SERIES_DETAIL` - Detalle de indicador
- `QUOTES_LIST` - Lista de cotizaciones
- `QUOTE_DETAIL` - Detalle de cotización
- `CRYPTO_DETAIL` - Detalle de criptomoneda
- `NEWS_LIST` - Lista de noticias
- `ALERTS_LIST` - Lista de alertas
- `ALERT_FORM` - Formulario de alertas
- `PROFILE` - Perfil/configuración
- `LOGIN` - Login
- `REGISTER` - Registro

### Event Names
- `VIEW_SERIES` - Ver una serie/indicador
- `CHANGE_SERIES_CONFIG` - Cambiar configuración de serie (período, etc.)
- `VIEW_QUOTE` - Ver una cotización
- `VIEW_CRYPTO` - Ver una criptomoneda
- `TOGGLE_ALERT` - Activar/desactivar alerta
- `CREATE_ALERT` - Crear alerta
- `UPDATE_ALERT` - Actualizar alerta
- `DELETE_ALERT` - Eliminar alerta
- `OPEN_NEWS_ARTICLE` - Abrir artículo de noticia
- `FILTER_BY_CATEGORY` - Filtrar por categoría
- `NAVIGATE_TO_QUOTES` - Navegar a cotizaciones
- `NAVIGATE_TO_INDICATORS` - Navegar a indicadores
- `NAVIGATE_TO_NEWS` - Navegar a noticias

## Arquitectura

- **events.ts**: Define todos los nombres de eventos y tipos de parámetros
- **analyticsClient.ts**: Cliente que encapsula las llamadas a Firebase Analytics
- **hooks.ts**: Hooks de React para facilitar el uso en componentes
- **index.ts**: Exportaciones centralizadas

## Características

- ✅ Tipado completo con TypeScript
- ✅ Sin strings mágicas - todos los eventos están definidos como constantes
- ✅ Sanitización automática de parámetros (cumple restricciones de Firebase)
- ✅ Manejo de errores silencioso (no rompe la app si analytics falla)
- ✅ Tracking automático de usuario (se integra con AuthContext)
- ✅ Reset de analytics en logout

## Extender

Para agregar un nuevo evento:

1. Agrega el nombre del evento en `events.ts`:
```typescript
export const EVENT_NAMES = {
  // ... eventos existentes
  MY_NEW_EVENT: 'my_new_event',
} as const;
```

2. Define el tipo de parámetros:
```typescript
export interface MyNewEventParams {
  param1: string;
  param2?: number;
}
```

3. Usa el evento en tu componente:
```typescript
trackEvent(EVENT_NAMES.MY_NEW_EVENT, {
  param1: 'value',
  param2: 123,
});
```

