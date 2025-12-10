# Checklist de Producción - Econnexus

## ❌ PENDIENTE ANTES DE PUBLICAR

### 🔴 CRÍTICO (Bloquea publicación)

#### 1. Firebase Analytics
- [ ] **Configurar Firebase Analytics**
  - Crear proyecto en [Firebase Console](https://console.firebase.google.com/)
  - Agregar apps Android e iOS
  - Descargar `google-services.json` → `android/app/google-services.json`
  - Descargar `GoogleService-Info.plist` → `ios/RadarEconmico/GoogleService-Info.plist`
  - Actualizar `app.json` con App IDs reales (reemplazar `YOUR_ANDROID_APP_ID` y `YOUR_IOS_APP_ID`)

#### 2. AdMob - IDs de Producción
- [ ] **Configurar IDs de producción**
  - Archivo: `src/constants/ads.ts`
  - Configurar IDs reales de AdMob para banners (Android e iOS)
  - Actualizar `android/app/src/main/AndroidManifest.xml` con App ID real de AdMob
  - Actualizar `ios/RadarEconmico/Info.plist` con App ID real de AdMob

#### 3. Android - Keystore de Producción
- [ ] **Generar keystore de producción**
  ```bash
  keytool -genkeypair -v -storetype PKCS12 -keystore econnexus-release.keystore -alias econnexus-key -keyalg RSA -keysize 2048 -validity 10000
  ```
- [ ] **Configurar signing en `android/app/build.gradle`**
  - Agregar `signingConfigs.release` con el keystore
  - Configurar `buildTypes.release` para usar el signing config
  - **NO COMMITEAR** el keystore ni las contraseñas

#### 4. Bundle Identifier / Package Name
- [x] **Bundle identifier cambiado a `com.econnexus.app`** ✅
  - Actualizado en `app.json` (ios.bundleIdentifier, android.package)
  - Actualizado en `android/app/build.gradle` (namespace, applicationId)
  - Actualizado en `ios/RadarEconmico.xcodeproj/project.pbxproj`
  - Actualizado en `ios/RadarEconmico/Info.plist`
  - Archivos Kotlin movidos a nueva estructura de directorios
  - **⚠️ IMPORTANTE:** Debes recrear el proyecto en Firebase/AdMob con el nuevo bundle ID `com.econnexus.app`

#### 5. EAS Build - Configuración de Producción
- [ ] **Actualizar `eas.json`**
  - Cambiar `buildType: "apk"` a `buildType: "aab"` para Android (requerido por Play Store)
  - iOS puede usar `buildType: "archive"` o dejar por defecto

### 🟡 IMPORTANTE (Recomendado antes de publicar)

#### 6. Versión y Build Numbers
- [x] Versión: 1.0.0 ✅
- [x] Android versionCode: 1 ✅
- [ ] iOS CFBundleVersion: Verificar que esté en 1

#### 7. Iconos y Assets
- [x] Icono principal: `assets/icon.png` ✅
- [x] Adaptive icon Android: `assets/adaptive-icon.png` ✅
- [x] Splash screen: `assets/splash.png` ✅
- [ ] **Verificar que los iconos cumplan requisitos:**
  - Android: 1024x1024px, sin transparencia
  - iOS: 1024x1024px, sin transparencia
  - Adaptive icon: 1024x1024px con safe zone

#### 8. Permisos y Privacidad
- [ ] **Revisar permisos en AndroidManifest.xml**
  - Verificar que solo se soliciten los necesarios
- [ ] **Política de Privacidad**
  - Crear política de privacidad (requerida por Play Store y App Store)
  - URL debe estar disponible públicamente
  - Agregar link en `app.json` → `privacy` (iOS)
- [ ] **Términos y Condiciones**
  - Crear términos de uso
  - Agregar link si es necesario

#### 9. Configuración de App Stores

**Play Store:**
- [ ] Screenshots (mínimo 2, recomendado 4-8)
  - Teléfono: 16:9 o 9:16, mínimo 320px, máximo 3840px
  - Tablet: 16:9 o 9:16
- [ ] Descripción corta (80 caracteres)
- [ ] Descripción completa (4000 caracteres)
- [ ] Categoría
- [ ] Contenido calificado (PEGI/ESRB)
- [ ] Contacto del desarrollador
- [ ] Política de privacidad (URL)

**App Store:**
- [ ] Screenshots (requeridos para cada tamaño de dispositivo)
  - iPhone 6.7": 1290 x 2796
  - iPhone 6.5": 1242 x 2688
  - iPhone 5.5": 1242 x 2208
- [ ] Descripción (4000 caracteres)
- [ ] Palabras clave (100 caracteres)
- [ ] Categoría
- [ ] Calificación de edad
- [ ] Información de contacto
- [ ] Política de privacidad (URL requerida)

#### 10. Testing
- [ ] **Probar build de producción localmente**
  ```bash
  # Android
  npx expo run:android --variant release
  
  # iOS
  npx expo run:ios --configuration Release
  ```
- [ ] **Probar con EAS Build**
  ```bash
  eas build --platform android --profile production
  eas build --platform ios --profile production
  ```
- [ ] Verificar que analytics funcione
- [ ] Verificar que ads se muestren correctamente
- [ ] Probar flujos críticos (login, navegación, alertas)

### 🟢 OPCIONAL (Mejoras)

#### 11. Optimizaciones
- [ ] ProGuard rules para Android (minificar código)
- [ ] Optimizar imágenes y assets
- [ ] Revisar tamaño del bundle

#### 12. Monitoreo
- [ ] Configurar Crashlytics (Firebase)
- [ ] Configurar Performance Monitoring (Firebase)
- [ ] Configurar alertas de errores

#### 13. Documentación
- [ ] README actualizado
- [ ] Changelog para futuras versiones
- [ ] Documentación de API (si aplica)

## 📋 Resumen de Estado Actual

### ✅ Completado
- Estructura del proyecto
- Analytics implementado (falta configurar Firebase)
- Ads implementado (falta IDs de producción)
- Navegación y pantallas principales
- Autenticación
- Internacionalización

### ❌ Pendiente Crítico
1. Configurar Firebase Analytics con archivos reales
2. Reemplazar IDs de prueba de AdMob
3. Generar keystore de producción para Android
4. Cambiar buildType a AAB en eas.json
5. Decidir sobre bundle identifier

### ⚠️ Recomendado
1. Crear política de privacidad
2. Preparar screenshots y descripciones
3. Testing exhaustivo de build de producción
4. Configurar monitoreo de errores

## 🚀 Pasos Siguientes

1. **Configurar Firebase y AdMob** (1-2 horas)
2. **Generar keystore y configurar signing** (30 min)
3. **Actualizar eas.json** (5 min)
4. **Testing de producción** (2-4 horas)
5. **Preparar assets para stores** (2-3 horas)
6. **Crear política de privacidad** (1-2 horas)
7. **Build y submit** (1 hora)

**Tiempo estimado total:** 8-13 horas de trabajo

## ⚠️ ADVERTENCIAS

1. **NO publicar con IDs de prueba de AdMob** - Violará políticas de AdMob
2. **NO publicar sin keystore de producción** - No podrás actualizar la app
3. **NO publicar sin política de privacidad** - Requerido por ambos stores
4. **NO cambiar bundle identifier después de publicar** - Requiere crear nueva app

