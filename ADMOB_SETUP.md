# Configuración de AdMob

Esta guía explica cómo configurar Google AdMob en la aplicación Radar Económico.

## 📋 Requisitos Previos

1. Cuenta de Google AdMob: https://apps.admob.com/
2. Aplicación registrada en AdMob
3. Expo SDK 54+ (ya configurado)

## 🚀 Pasos de Configuración

### 1. Crear una App en AdMob

1. Ve a [Google AdMob](https://apps.admob.com/)
2. Inicia sesión con tu cuenta de Google
3. Crea una nueva app o selecciona una existente
4. Selecciona la plataforma (Android/iOS)
5. Ingresa el nombre del paquete:
   - Android: `com.econnexus.app`
   - iOS: `com.econnexus.app`

### 2. Crear Unidades de Anuncio (Ad Units)

1. En el panel de AdMob, ve a "Anuncios" → "Unidades de anuncio"
2. Crea una nueva unidad de anuncio tipo "Banner"
3. Copia el **Ad Unit ID** generado
4. Repite el proceso para cada plataforma (Android e iOS)

### 3. Configurar IDs en la App

Edita el archivo `src/constants/ads.ts` y reemplaza los IDs de prueba con tus IDs reales:

```typescript
export const AD_UNIT_IDS = {
  banner: {
    android: 'TU_ANDROID_AD_UNIT_ID',  // Reemplaza con tu ID real
    ios: 'TU_IOS_AD_UNIT_ID',           // Reemplaza con tu ID real
  },
};
```

### 4. Configurar app.json (Opcional)

Si necesitas configuraciones adicionales, puedes agregar plugins de Expo en `app.json`:

```json
{
  "expo": {
    "plugins": [
      [
        "react-native-google-mobile-ads",
        {
          "androidAppId": "ca-app-pub-XXXXXXXXXXXXXXXX~XXXXXXXXXX",
          "iosAppId": "ca-app-pub-XXXXXXXXXXXXXXXX~XXXXXXXXXX"
        }
      ]
    ]
  }
}
```

**Nota:** Los App IDs se encuentran en la configuración de tu app en AdMob.

### 5. Desarrollo Build

⚠️ **Importante:** `react-native-google-mobile-ads` requiere un **development build** de Expo. No funciona con Expo Go.

#### Crear un Development Build:

```bash
# Para Android
npx expo prebuild
npx expo run:android

# Para iOS
npx expo prebuild
npx expo run:ios
```

O usando EAS Build:

```bash
# Configurar EAS (si no está configurado)
eas build:configure

# Crear build de desarrollo
eas build --profile development --platform android
eas build --profile development --platform ios
```

### 6. IDs de Producción

Los IDs de producción deben configurarse en `src/constants/ads.ts`. Asegúrate de usar los IDs reales de tu app en AdMob.

## 📱 Uso del Componente AdBanner

### Ejemplo Básico

```tsx
import { AdBanner } from '@/components/common';

<AdBanner />
```

### Ejemplo con Configuración Personalizada

```tsx
import { AdBanner } from '@/components/common';
import { BannerAdSize } from 'react-native-google-mobile-ads';

<AdBanner
  size={BannerAdSize.LARGE_BANNER}
  marginVertical="lg"
/>
```

### Props Disponibles

- `size`: Tamaño del banner (por defecto: `BannerAdSize.BANNER`)
- `adUnitId`: ID personalizado de la unidad de anuncio (opcional, usa el ID por defecto si no se proporciona)
- `style`: Estilos personalizados
- `marginVertical`: Margen vertical (`'none' | 'sm' | 'md' | 'lg'`)
- `placement`: Identificador de ubicación para analytics (opcional)

## 📍 Ubicaciones Actuales de Anuncios

Los anuncios están integrados en:

1. **HomeScreen**: Entre las secciones de indicadores y noticias
2. **QuotesScreen**: Después del header y antes de la lista de cotizaciones

Puedes agregar más anuncios en otras pantallas siguiendo el mismo patrón.

## 🔧 Solución de Problemas

### Los anuncios no se muestran

1. Verifica que estés usando un development build (no Expo Go)
2. Confirma que los Ad Unit IDs sean correctos
3. Revisa la consola para errores de AdMob
4. Asegúrate de que la app esté registrada en AdMob

### Error: "AdMob not initialized"

Asegúrate de que `mobileAds().initialize()` se ejecute en `App.tsx` (ya configurado).

### Anuncios no se muestran en producción

Asegúrate de que los Ad Unit IDs en `src/constants/ads.ts` sean los IDs de producción reales de tu app en AdMob.

## 📚 Recursos Adicionales

- [Documentación de react-native-google-mobile-ads](https://github.com/invertase/react-native-google-mobile-ads)
- [Guía de AdMob](https://support.google.com/admob)
- [Políticas de AdMob](https://support.google.com/admob/answer/6128543)

## ⚠️ Consideraciones Importantes

1. **Políticas de AdMob**: Asegúrate de cumplir con las políticas de AdMob
2. **IDs de Producción**: Usa siempre los IDs de producción reales de tu app en AdMob
3. **Performance**: Los anuncios pueden afectar el rendimiento, monitorea la app
4. **UX**: No satures la app con demasiados anuncios

