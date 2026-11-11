# Manual de usuario · FitoChat ANUC Zetaquirá

FitoChat ayuda a la ANUC Zetaquirá a detectar a tiempo problemas fitosanitarios en los cultivos de gulupa, granadilla
y maracuyá. Tiene dos partes:

- **El chatbot de WhatsApp**, donde el productor describe el problema y envía fotos.
- **El panel web**, donde el líder técnico y los técnicos revisan los casos, registran el diagnóstico y siguen las
  alertas.

El sistema da una **identificación preliminar automática**: la decisión siempre la toma el técnico. Ni el chatbot ni
el panel recetan tratamientos.

La instalación y la operación técnica están en el **Manual de instalación** (`Back-Panel-FitoChat/docs/MANUAL_INSTALACION.md`).

---

## Parte 1 · Productor: el chatbot de WhatsApp

### 1.1 Antes de empezar

Solo pueden usar el chatbot los productores **registrados y activos en el panel**. Si su número no está registrado o
su cuenta está deshabilitada, el chatbot se lo dice y le pide comunicarse con la ANUC. Un líder técnico registra el
número desde el panel (Parte 2, «Productores»).

### 1.2 Primera vez: el aviso de privacidad

La primera vez, el chatbot explica qué datos guarda (nombre, número, finca con su ubicación, fotos y respuestas), quién
los ve (solo el equipo técnico de la ANUC), cuánto tiempo (hasta que vence el plazo de conservación) y **dónde**
(servidores de Amazon Web Services en Estados Unidos). Debe aceptar para continuar. Si no acepta, no se guarda nada.

### 1.3 Hacer una consulta

1. Escriba cualquier mensaje («hola»).
2. **Finca**: elija una de sus fincas en la lista o toque «Registrar finca nueva» (nombre, vereda y ubicación con el
   botón «Enviar ubicación» de WhatsApp; luego confirme el punto en el mapa).
3. **Lote**: elija el lote o registre uno nuevo (nombre, invernadero o campo abierto, cultivos y ubicación dentro del
   lote).
4. **Especie y zona afectada**: elija la especie con el problema y diga en qué parte del lote está.
5. **Preguntas**: el asistente hace preguntas sobre los síntomas. Responda con sus palabras.
6. **Fotos**: envíe fotos de la planta afectada, de cerca y con buena luz, de las partes donde se vea el problema
   (hasta 12; al menos 1). Si una foto no sirve (borrosa, oscura, que no muestra la planta o que es de otra planta y
   no de gulupa, granadilla o maracuyá), el chatbot le dice por qué y le pide otra; esa foto no se guarda. Cuando
   termine, toque **Listo**.
7. **Resumen**: revise el resumen y toque **Enviar** para mandar la consulta al técnico.

En las preguntas con opciones, toque el botón o la opción de la lista; también puede escribir su número o su nombre.

### 1.4 Después de enviar

El chatbot le avisa cuando:

- un técnico toma su consulta,
- el técnico registra el diagnóstico (le llega su informe),
- la consulta se cierra.

Si pasaron más de 24 horas desde su último mensaje, WhatsApp no deja enviar el aviso en ese momento: le llega la
próxima vez que escriba («Tienes novedades de tu consulta»). Después de las novedades, del informe o del cierre, el
chatbot le pregunta qué quiere hacer: **Abrir caso nuevo**, **Ver mis casos** o **No, gracias**.

### 1.5 Comandos

| Escriba | Para |
|---|---|
| `REINICIAR` (o `salir`, `cancelar`, `terminar`) | Empezar de nuevo. Si tiene una consulta abierta, le pregunta antes de borrarla |
| `LISTO` | Terminar de enviar fotos |
| `AYUDA` | Ver la lista de comandos |

Si deja una consulta sin terminar, el chatbot le avisa a las 48 horas y la descarta a las 72 horas.

---

## Parte 2 · Panel web

### 2.1 Entrar

Abra la dirección del panel en el navegador y entre con su correo y contraseña.

- **Primera vez del sistema**: si todavía no hay líder técnico, el panel muestra **Primer uso** para crearlo.
- **Contraseña temporal**: a un técnico nuevo le llega por correo; al entrar, el panel le pide crear una nueva.
- **¿Olvidó la contraseña?**: en la pantalla de entrada, «¿Olvidaste tu contraseña?» le envía un código al correo
  (revise también la carpeta de spam). Si el correo no tiene cuenta, el panel lo dice y no envía nada. Si la cuenta
  nunca entró, no hay código: le llega otra vez la contraseña temporal.
- **Mi cuenta** (menú con su nombre, arriba a la derecha): cambiar sus datos y su contraseña.

Hay dos roles. El **líder técnico** administra todo el panel y asigna los casos. El **técnico** ve y diagnostica solo
los casos que le asignaron.

### 2.2 Inicio

Resumen del día: casos pendientes, alertas y actividad reciente. El técnico ve sus propios indicadores, los casos por
atender y sus diagnósticos recientes. La **campana** de arriba muestra las notificaciones (caso nuevo, caso asignado,
diagnóstico registrado, alerta confirmada).

### 2.3 Casos

- **Bandeja**: el líder ve todos los casos por pestañas de estado, con búsqueda y filtros; el técnico ve «Mis casos».
- **Asignar técnico** (líder): desde la bandeja o desde el caso, «Asignar técnico» o «Reasignar técnico». El productor
  recibe el aviso por WhatsApp.
- **Detalle del caso**: productor y finca, identificación preliminar automática (porcentaje de coincidencia de
  síntomas por categoría y su explicación), **evidencias fotográficas** (un recuadro por foto; «Ver todas» abre el
  visor, donde las flechas del teclado cambian de foto y Esc cierra), cuestionario del chatbot e historial.
- **Registrar el diagnóstico** (técnico asignado): resultado (confirma la identificación preliminar, otro problema, no
  identificado o requiere visita), categoría, descripción y observaciones. El productor recibe el informe por WhatsApp.
- **Cerrar el caso**: cuando ya tiene diagnóstico. Se fija la fecha de vencimiento de la conservación (6 meses); al
  vencer, el caso y sus fotos se borran.

Estados de un caso: En análisis (el productor aún conversa con el chatbot) → Pendiente de revisión → En revisión →
Registrado (con diagnóstico) → Cerrado. Una consulta que el productor abandona queda Descartada.

### 2.4 Alertas

Cuando se concentran casos confirmados de una misma categoría en una zona y un periodo (según los parámetros
epidemiológicos), el sistema genera una **alerta**. Su mapa (el mismo del mapa de vigilancia) señala la zona
afectada con un círculo del radio y los casos que la forman. El líder la revisa, la confirma o la descarta, y puede redactar el
**mensaje** para los productores y luego una **corrección** si hace falta. El técnico solo las consulta.

### 2.5 Mapa de vigilancia (líder)

Mapa de Zetaquirá (OpenStreetMap) con los casos y las alertas, filtros por categoría, especie y fechas (desde y hasta)
y una capa que muestra dónde se concentran los casos.

### 2.6 Reportes (líder)

Indicadores del periodo y cinco reportes: casos (R1), identificación (R2), alertas (R3), productores (R4) y técnicos
(R5). Cada uno se puede filtrar, exportar a CSV o PDF y guardar como **consulta** para repetirla.

### 2.7 Registros (líder)

- **Productores**: registrar (nombre y celular de WhatsApp), editar, y el interruptor **«Puede consultar por
  WhatsApp»** para habilitar o deshabilitar. Al deshabilitarlo, el chatbot deja de atenderlo desde su siguiente
  mensaje; lo que ya envió al panel sigue su curso y le siguen llegando los avisos de ese caso. También permite
  cambiar el estado de varios productores a la vez y exportar la lista.
- **Fincas y cultivos**: fincas con su ubicación y sus lotes (cultivos y especies). Se pueden registrar y editar aquí o
  desde el chatbot. Al editar la finca se cambian el nombre, el tipo y las especies de cada cultivo; el chatbot usa
  los datos nuevos en el siguiente caso. Una especie que usa algún caso no se puede quitar: el panel muestra los casos
  y el botón «Mantener» para conservarla.
- **Técnicos**: cuentas del panel (líderes y técnicos): registrar con contraseña temporal, editar y activar o
  desactivar. La única cuenta activa de un rol no se puede desactivar. El buscador acepta nombre, correo o celular
  (como en Productores).
- **Productores y fincas de mis casos** (técnico): consulta de los productores y las fincas de sus casos, sin editar.

### 2.8 Parámetros epidemiológicos y documentación (líder)

- **Parámetros**: para cada categoría que genera alertas (hoy Trips), los casos mínimos, el radio en kilómetros y la
  ventana de días entre diagnósticos que la disparan.
- **Documentación**: manual fitosanitario y fichas por categoría en PDF.

---

## Preguntas frecuentes

**Un productor dice que el chatbot no le responde.** Revise en «Productores» que su número esté registrado (con el
indicativo correcto) y que «Puede consultar por WhatsApp» esté activo. Si lo está y aun así no responde, avise al
administrador técnico.

**¿El resultado preliminar es el diagnóstico?** No. Es una estimación automática a partir de las respuestas y las
fotos. El diagnóstico lo registra el técnico.

**¿Cuánto tiempo se guardan los datos?** Seis meses desde el cierre del caso; después se borran de forma definitiva
(fotos incluidas).
