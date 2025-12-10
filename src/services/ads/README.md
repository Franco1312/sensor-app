# Ads Service - Guía de Eliminación

Este directorio contiene toda la lógica relacionada con AdMob de forma centralizada.

## Para eliminar completamente AdMob:

1. **Eliminar este directorio completo:**
   ```bash
   rm -rf src/services/ads
   ```

2. **Eliminar el hook:**
   ```bash
   rm src/hooks/useAdMob.ts
   ```

3. **En `App.tsx`:**
   - Eliminar: `import { useAdMob } from '@/hooks/useAdMob';`
   - Eliminar: `useAdMob();`

4. **En `src/components/common/AdBanner.tsx`:**
   - Eliminar el componente completo o reemplazarlo con un componente vacío

5. **En `package.json`:**
   - Eliminar: `"react-native-google-mobile-ads": "^16.0.0"`

6. **En `android/app/src/main/AndroidManifest.xml`:**
   - Eliminar la línea con `com.google.android.gms.ads.APPLICATION_ID`

7. **Buscar y eliminar todos los usos de `<AdBanner />` en el código**

8. **Ejecutar:**
   ```bash
   npm install
   ```

## Nota

Esta estructura está diseñada para que AdMob funcione solo en development builds y falle silenciosamente en Expo Go. Cuando quieras eliminar AdMob completamente, solo necesitas eliminar estos archivos centralizados.

