# FX Entretaiment Dance para Windows

La app puede ejecutarse en una ventana de escritorio sin abrirla en un navegador. Los datos que guarda en el almacenamiento local quedan en el perfil de la aplicación de Electron.

## Ejecutar durante el desarrollo

1. Instala Node.js.
2. Desde esta carpeta ejecuta `npm install`.
3. Ejecuta `npm start`.

## Crear instalador

Ejecuta `npm run dist`. El instalador aparece en `release/FX Entretaiment Dance Setup 1.0.1.exe` (el nombre refleja la versión actual en `package.json`).

Para crear el ejecutable portable usa `npm run dist:portable`.

## Actualizaciones automáticas desde GitHub Releases

La app instalada busca actualizaciones al abrirse y las descarga en segundo plano. Si hay una versión nueva descargada, se instala cuando el usuario cierra la app normalmente; no se fuerza el cierre ni se vuelve a abrir automáticamente.

El repositorio configurado en `package.json` es `https://github.com/ferxame6-creator/FX-Entretaiment`. Para cada actualización, aumenta `version` en `package.json` y publica con `npm run dist:publish` usando `GH_TOKEN` en la máquina/CI que publica. El token solo sirve para publicar; los usuarios no necesitan uno. El comando crea/actualiza la GitHub Release y sube los metadatos de actualización junto con el instalador NSIS. No publiques instaladores portables para este mecanismo: las actualizaciones automáticas están configuradas para NSIS.

Hasta que exista el repositorio y una Release publicada, las instalaciones no podrán encontrar actualizaciones. Los instaladores que ya se distribuyeron antes de incorporar `electron-updater` tampoco recibirán este mecanismo: habrá que entregarles una nueva versión inicializada con esta configuración.

Electron Builder firmará los ejecutables cuando se proporcione un certificado Authenticode de Windows. No guardes el certificado ni su contraseña en el proyecto. Ejecuta `powershell -ExecutionPolicy Bypass -File .\build-signed.ps1`; el script te pedirá la ruta del `.pfx`/`.p12` y su contraseña de forma oculta, compilará y borrará las variables temporales al terminar. Sin un certificado válido, no se puede generar una firma oficial.

## Instalar como app desde Microsoft Edge (Windows)

Esta alternativa no usa un instalador `.exe` y se abre en su propia ventana. Necesita Node.js solo para el primer acceso, instalarla y traer futuras actualizaciones.

1. Desde esta carpeta ejecuta `npm run pwa`.
2. En Microsoft Edge abre `http://127.0.0.1:4174`.
3. En el menú `⋯`, elige **Aplicaciones > Instalar este sitio como una aplicación**.
4. Después de instalarla, podrás abrir **FX Dance** desde Inicio. El servidor local debe estar activo para cargar actualizaciones; la app cachea su interfaz para poder abrirla sin conexión después de la primera carga.

## Usar en un teléfono o tableta

La interfaz se adapta a pantallas táctiles y admite arrastrar bailarines con el dedo. Para instalarla en un móvil, primero hay que publicar estos archivos en un sitio web con HTTPS; `127.0.0.1` solo sirve en el mismo dispositivo y el servidor de desarrollo local no es accesible desde el teléfono. La instalación PWA y el modo sin conexión requieren un contexto seguro como HTTPS. Después de publicar:

- **Android:** abre el enlace en Chrome o Edge y elige **Instalar aplicación** o **Añadir a pantalla de inicio**.
- **iPhone/iPad:** abre el enlace en Safari, toca **Compartir > Añadir a pantalla de inicio**.

Al entrar por primera vez con internet, se guardará la interfaz para abrirla sin conexión. Los proyectos se guardan en el almacenamiento del navegador del dispositivo y no se sincronizan automáticamente con otros equipos.
