# Configuración de IDs de AdMob

## 📍 Ubicaciones de Configuración

### 1. **Ad Unit IDs (Banners, Intersticiales, etc.)**

**Archivo:** `src/constants/ads.ts`

```typescript
export const AD_UNIT_IDS = {
  banner: {
    android: 'TU_ANDROID_BANNER_ID',  // Reemplazar aquí
    ios: 'TU_IOS_BANNER_ID',           // Reemplazar aquí
  },
  // Puedes agregar más tipos:
  // interstitial: {
  //   android: 'TU_ANDROID_INTERSTITIAL_ID',
  //   ios: 'TU_IOS_INTERSTITIAL_ID',
  // },
}
```

**Cómo obtener los IDs:**
1. Ve a [AdMob Console](https://apps.admob.com/)
2. Selecciona tu app
3. Ve a "Anuncios" → "Unidades de anuncio"
4. Crea o selecciona una unidad de anuncio tipo "Banner"
5. Copia el **Ad Unit ID** (formato: `ca-app-pub-XXXXXXXXXXXXXXXX/XXXXXXXXXX`)

---

### 2. **AdMob App ID - Android**

**Archivo:** `android/app/src/main/AndroidManifest.xml`

```xml
<meta-data
    android:name="com.google.android.gms.ads.APPLICATION_ID"
    android:value="ca-app-pub-XXXXXXXXXXXXXXXX~XXXXXXXXXX"  <!-- Reemplazar aquí -->
    tools:replace="android:value"/>
```

**Cómo obtener el App ID:**
1. Ve a [AdMob Console](https://apps.admob.com/)
2. Selecciona tu app Android
3. Ve a "Configuración de la app"
4. Copia el **App ID** (formato: `ca-app-pub-XXXXXXXXXXXXXXXX~XXXXXXXXXX`)

---

### 3. **AdMob App ID - iOS**

**Archivo:** `ios/RadarEconmico/Info.plist`

```xml
<key>GADApplicationIdentifier</key>
<string>ca-app-pub-XXXXXXXXXXXXXXXX~XXXXXXXXXX</string>  <!-- Reemplazar aquí -->
```

**Cómo obtener el App ID:**
1. Ve a [AdMob Console](https://apps.admob.com/)
2. Selecciona tu app iOS
3. Ve a "Configuración de la app"
4. Copia el **App ID** (formato: `ca-app-pub-XXXXXXXXXXXXXXXX~XXXXXXXXXX`)

---

## ⚠️ Importante

1. **Usa siempre IDs de producción reales** - Configura los IDs de tu app en AdMob
2. **Crea las apps en AdMob** con el bundle identifier `com.econnexus.app`
3. **Después de cambiar los IDs**, necesitas hacer un rebuild:
   ```bash
   npx expo prebuild --clean
   npx expo run:android  # o npx expo run:ios
   ```

## 📝 Checklist

- [ ] Crear app Android en AdMob con package `com.econnexus.app`
- [ ] Crear app iOS en AdMob con bundle ID `com.econnexus.app`
- [ ] Obtener App IDs de Android e iOS
- [ ] Obtener Ad Unit IDs de banners (Android e iOS)
- [ ] Configurar en `src/constants/ads.ts` (Ad Unit IDs)
- [ ] Configurar en `android/app/src/main/AndroidManifest.xml` (Android App ID)
- [ ] Configurar en `ios/RadarEconmico/Info.plist` (iOS App ID)

