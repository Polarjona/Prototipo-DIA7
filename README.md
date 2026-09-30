# Speech to Text

Prototipo DAM en React Native/Expo. Graba hasta tres audios `.m4a` y los transcribe con Gemini. La demo [web-speech.html](web-speech.html) muestra la alternativa Web Speech API en tiempo real.

## Uso

```bash
npm install
npx expo start
```

1. Crea una clave en Google AI Studio.
2. Crea `.env.local` con `EXPO_PUBLIC_GEMINI_API_KEY=tu_clave`.
3. Escanea el QR con Expo Go y concede permiso al micrófono.
4. Graba tres frases en español y detén cada grabación.

Para usar la red del hotspot: `npm run start:hotspot`.

## Comparativa

La [Web Speech API](web-speech.html) transcribe en tiempo real y no necesita API key, pero depende del navegador. Gemini procesa el audio completo, necesita conexión y API key, pero está integrado en la app móvil y permite pedir puntuación. Detalle en [COMPARATIVA.md](COMPARATIVA.md).

## Pruebas

Se probaron tres frases en español con ambos métodos:

| Frase | Gemini | Web Speech API |
|---|---|---|
| Hoy hace buen tiempo en Madrid. | Correcta | Correcta |
| Necesito entregar el proyecto antes del viernes. | Correcta | Correcta |
| La aplicación convierte voz en texto con inteligencia artificial. | Correcta | Correcta |

El registro completo está en [PRUEBAS.md](PRUEBAS.md).

## Archivos

- `App.js`: interfaz principal.
- `hooks/` y `services/`: grabación y petición a Gemini.
- `components/`: controles y tarjetas.
- [web-speech.html](web-speech.html): prueba Web Speech API.
- [COMPARATIVA.md](COMPARATIVA.md): comparación de métodos.
- [PRUEBAS.md](PRUEBAS.md): registro de las tres pruebas.

La clave se usa desde el cliente solo para este prototipo. En producción debe protegerse mediante un servidor.
