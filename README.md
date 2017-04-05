![Monedas y billetes](www/img/icon/icon.png)

# Monedas y Billetes

## Instalacion

### Requisitos

* nodejs y npm (version?)
* SDK de Android (version?)

### Instalación de dependencias

* `npm install`

### Preparación del dispositivo

Como es habitual para probar cualquier aplicación Android.

1. Activar modo desarrollo en el dispositivo android *clickeando 7 veces*
2. Activar depuracion por usb

### Ejecución en el

* Ejecutar `adb devices` y copiar el ID del dispositivo preferido (dispositivo físico o GenyMotion)
* `node_modules/.bin/phonegap run android --target 030f1e2208eb19b7` reemplazando el target por el ID del dispositivo

### Para hacer el release

* `node_modules/.bin/phonegap build android`
