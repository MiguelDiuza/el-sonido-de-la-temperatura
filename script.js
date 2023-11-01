$(window).on("load", function () {
  var dateWidth = $(".date").width(),
    activeDate = 0,
    noDates = $(".date").length;

  function changeDate(a) {
    if (a < 0) {
      activeDate = 0;
      return;
    }

    if (a > noDates - 1) {
      activeDate = noDates - 1;
      return;
    }

    $(".date").removeClass("active sibling");

    $(".date:nth-child(" + (a + 1) + ")").addClass("active");

    $(".date.active").prev("div").addClass("sibling");

    $(".dates-wrap").css("transform", "translateX(" + -dateWidth * a + "px)");
  }

  $(".date").on("click", function () {
    var chosen = $(this).index();

    if (chosen === activeDate) {
      return;
    }

    activeDate = chosen;
    changeDate(activeDate);
  });

  $(".controls").on("click", function () {
    var direction = parseInt($(this).attr("data-direction"), 10);

    activeDate += direction;
    changeDate(activeDate);
  });

  // Update date images based on their respective years
  $(".date").each(function (index) {
    var year = 1880 + 10 * index; // Calculate the year based on the index
    var imageUrl = "img/" + year + ".png"; // Construct the image URL
    $(this)
      .find(".date-image")
      .css("background-image", "url(" + imageUrl + ")");
  });
});

// Crear un contexto de audio
var audioContext = new (window.AudioContext || window.webkitAudioContext)();

// Frecuencia en Hz que deseas para tu onda sinusoidal
var frecuencia = 600; // Frecuencia inicial (440 Hz es el La central)

// Crear un nodo de ganancia
var gananciaNode = audioContext.createGain();
gananciaNode.gain.value = 0.5; // Establecer el volumen (1 representa el volumen máximo, 0 representa silencio)

// Crear un oscilador
var oscilador = audioContext.createOscillator();
oscilador.type = "sine"; // Tipo de onda sinusoidal
oscilador.frequency.setValueAtTime(frecuencia, audioContext.currentTime); // Establecer la frecuencia inicial

// Conectar el oscilador al nodo de ganancia
oscilador.connect(gananciaNode);

// Conectar el nodo de ganancia al destino de audio (altavoces)
gananciaNode.connect(audioContext.destination);

// Iniciar el oscilador para que suene continuamente
oscilador.start();

// Obtener el elemento del fondo de la interfaz (en este caso, el cuerpo del documento)
var fondoInterfaz = document.body;

// Obtener todos los párrafos en el documento
var elementosAfectados = document.querySelectorAll("p");

// Función para mapear un valor de un rango a otro
function mapear(valor, entradaMin, entradaMax, salidaMin, salidaMax) {
  return (
    ((valor - entradaMin) * (salidaMax - salidaMin)) /
      (entradaMax - entradaMin) +
    salidaMin
  );
}

// Función para actualizar los colores de los elementos afectados basados en la frecuencia
function actualizarColores() {
  var nuevaFrecuencia = oscilador.frequency.value; // Obtén la frecuencia actual del oscilador
  var valorColor = mapear(nuevaFrecuencia, 440, 880, 0, 255);
  var colorTexto = `rgb(${valorColor}, 0, 255)`;
  var colorFondo = `rgb(${255 - valorColor}, ${valorColor}, 255)`; // Fondo en el color complementario

  // Cambia el color de fondo del elemento del fondo de la interfaz
  fondoInterfaz.style.transition = "background-color 0.5s ease"; // Aplica una transición suave al fondo
  fondoInterfaz.style.backgroundColor = colorFondo;

  // Itera sobre los elementos y cambia sus colores
  elementosAfectados.forEach(function (elemento) {
    elemento.style.transition = "color 0.5s ease"; // Aplica una transición suave al color del texto
    elemento.style.color = colorTexto;
  });

  // Solicita el próximo cuadro de animación
  requestAnimationFrame(actualizarColores);
}

// Iniciar la actualización continua de colores
actualizarColores();

// Obtener todos los botones con la clase "cambiarFrecuenciaBtn"
var botones = document.querySelectorAll(".cambiarFrecuenciaBtn");

// Agregar un controlador de eventos a cada botón
botones.forEach(function (boton) {
  boton.addEventListener("click", function () {
    // Obtener la frecuencia del atributo de datos del botón presionado
    var nuevaFrecuencia = parseFloat(boton.getAttribute("data-frecuencia"));

    // Establecer la nueva frecuencia del oscilador
    oscilador.frequency.setValueAtTime(
      nuevaFrecuencia,
      audioContext.currentTime,
    );
  });
});
