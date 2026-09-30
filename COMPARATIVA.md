# Comparativa Speech-to-Text

| Criterio | Web Speech API | Gemini API |
|---|---|---|
| Entorno | Navegador | App móvil o servidor |
| Resultado | Tiempo real | Tras enviar el audio |
| API key | No | Sí |
| Conexión | Depende del navegador | Necesaria |
| Puntuación | Variable | Se solicita en el prompt |
| Implementación | [web-speech.html](web-speech.html) | `useAudioRecorder.js` + `geminiService.js` |

Web Speech API es inmediata y sencilla, pero su soporte cambia según el navegador. Gemini necesita conexión y clave, pero encaja con la app móvil DAM y permite pedir puntuación en español.

Los resultados reales se registran en [PRUEBAS.md](PRUEBAS.md).
