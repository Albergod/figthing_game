const mensaje = document.querySelector("#mensaje");
const btnreinicio = document.querySelector("#reinicio");
const temporizador = document.querySelector("#tiempo");
const vidaEnemigo = document.querySelector("#vida_enemigo");
const vidaJugador = document.querySelector("#vida_jugador");

const canvas = document.querySelector("canvas"); //seleccionar etiqueta canvas
const teclas = {
  a: {
    presionado: false,
  },
  d: {
    presionado: false,
  },
  ArrowRight: {
    presionado: false,
  },
  ArrowLeft: {
    presionado: false,
  },
};
const gravity = 0.6; //variable que actua como gravedad

const c = canvas.getContext("2d"); //crear contexto en 2d
canvas.width = 1024; //asignarles altos y anchos al marco
canvas.height = 576;

c.fillRect(0, 0, canvas.width, canvas.height); //rectangulo con las dimenciones asignadas

const backGround = new Sprite({
  posicion: { x: 0, y: 0 },
  imgSrc: "./assets/background.png",
});

const tienda = new Sprite({
  posicion: { x: 600, y: 128 },
  imgSrc: "./assets/shop.png",
  scale: 2.75,
  marcos: 6,
});

const jugador = new Perosnaje({
  posicion: { x: 0, y: 0 },
  velocidad: { x: 0, y: 0 },
  color: "blue",
  offset: {
    x: 0,
    y: 0,
  },
  imgSrc: "./assets/samuraiMack/idle.png",
  marcos: 8,
  scale: 2.5,
  offset: {
    x: 215,
    y: 157,
  },
  sprites: {
    idle: {
      imgSrc: "./assets/samuraiMack/Idle.png",
      marcos: 8,
    },
    run: {
      imgSrc: "./assets/samuraiMack/Run.png",
      marcos: 8,
    },
    jump: {
      imgSrc: "./assets/samuraiMack/Jump.png",
      marcos: 2,
    },
    fall: {
      imgSrc: "./assets/samuraiMack/Fall.png",
      marcos: 2,
    },
    atk1: {
      imgSrc: "./assets/samuraiMack/Attack1.png",
      marcos: 6,
    },
    takeHit: {
      imgSrc: "./assets/samuraiMack/Take hit - white silhouette.png",
      marcos: 4,
    },
    death: {
      imgSrc: "./assets/samuraiMack/Death.png",
      marcos: 6,
    },
  },
  ataque: {
    offset: {
      x: -100,
      y: 50,
    },
    width: 135,
    height: 50,
  },
});

const enemigo = new Perosnaje({
  posicion: { x: 965, y: 0 },
  velocidad: { x: 0, y: 0 },
  color: "green",
  offset: {
    x: 50,
    y: 0,
  },
  imgSrc: "./assets/kenji/Idle.png",
  marcos: 4,
  scale: 2.5,
  offset: {
    x: 215,
    y: 167,
  },
  sprites: {
    idle: {
      imgSrc: "./assets/kenji/Idle.png",
      marcos: 4,
    },
    run: {
      imgSrc: "./assets/kenji/Run.png",
      marcos: 8,
    },
    jump: {
      imgSrc: "./assets/kenji/Jump.png",
      marcos: 2,
    },
    fall: {
      imgSrc: "./assets/kenji/Fall.png",
      marcos: 2,
    },
    atk1: {
      imgSrc: "./assets/kenji/Attack1.png",
      marcos: 4,
    },
    takeHit: {
      imgSrc: "./assets/kenji/Take Hit.png",
      marcos: 3,
    },
    death: {
      imgSrc: "./assets/kenji/Death.png",
      marcos: 7,
    },
  },
  ataque: {
    offset: {
      x: 150,
      y: 50,
    },
    width: 135,
    height: 50,
  },
});

addEventListener("load", temporizar);

function animacion() {
  window.requestAnimationFrame(animacion); //loop de animacion repite la misma funcion varias veces

  c.fillStyle = "black"; //fondo negro
  c.fillRect(0, 0, canvas.width, canvas.height); //dimensiones del fondo

  backGround.actualizar();
  tienda.actualizar();
  jugador.actualizar(); //actualizacion jugador
  enemigo.actualizar(); //actualizacion enemigo

  jugador.velocidad.x = 0; //velocidad en x del jugador iniciará en 0
  enemigo.velocidad.x = 0;

  //movimientos del jugador
  jugador.swithSprites("idle");
  if (teclas.a.presionado && jugador.ultimaTecla === "a") {
    jugador.velocidad.x = -5; //cuando la tecla a se precione se moverá en base -x
    jugador.swithSprites("run");
  } else if (teclas.d.presionado && jugador.ultimaTecla === "d") {
    jugador.velocidad.x = 5; // cuando la tecla d se presione se movera en base +x
    jugador.swithSprites("run");
  } else {
    jugador.swithSprites("idle");
  }

  if (jugador.velocidad.y < 0) {
    jugador.swithSprites("jump");
  } else if (jugador.velocidad.y > 0) {
    jugador.swithSprites("fall");
  }

  //movimientos del enemigo
  if (teclas.ArrowLeft.presionado && enemigo.ultimaTecla === "ArrowLeft") {
    enemigo.velocidad.x = -5;
    enemigo.swithSprites("run");
  } else if (
    teclas.ArrowRight.presionado &&
    enemigo.ultimaTecla === "ArrowRight"
  ) {
    enemigo.velocidad.x = 5;
    enemigo.swithSprites("run");
  } else {
    enemigo.swithSprites("idle");
  }

  if (enemigo.velocidad.y < 0) {
    enemigo.swithSprites("jump");
  } else if (enemigo.velocidad.y > 0) {
    enemigo.swithSprites("fall");
  }

  //deteccion de colision
  //jugador
  if (
    colisiones({ jugador: jugador, enemigo: enemigo }) &&
    jugador.atacando &&
    jugador.mascosCurrent === 4
  ) {
    enemigo.takeHit();
    jugador.atacando = false;
    vidaEnemigo.style.width = enemigo.vida + "%";
  }

  //fallar
  if (jugador.atacando && jugador.mascosCurrent === 4) jugador.atacando = false;

  //enemigo
  if (
    colisiones({ jugador: enemigo, enemigo: jugador }) &&
    enemigo.atacando &&
    enemigo.mascosCurrent === 2
  ) {
    jugador.takeHit();
    enemigo.atacando = false;
    vidaJugador.style.width = jugador.vida + "%";
  }
  //fallar
  if (enemigo.atacando && enemigo.mascosCurrent === 2) enemigo.atacando = false;

  //finalizar juego en base a la vida
  if (jugador.vida <= 0 || enemigo.vida <= 0) {
    determinarGanador({ jugador, enemigo, idTiempo });
    btnreinicio.style.display = "flex";
  }
}
animacion();

window.addEventListener("keydown", (e) => {
  if (!jugador.muerto) {
    switch (e.key) {
      case "d":
        teclas.d.presionado = true;
        jugador.ultimaTecla = "d";
        break;
      case "a":
        teclas.a.presionado = true;
        jugador.ultimaTecla = "a";
        break;
      case "w":
        jugador.velocidad.y = -15;
        break;
      case " ":
        jugador.attack();
        break;
    }
  }

  if (!enemigo.muerto) {
    switch (e.key) {
      case "ArrowRight":
        teclas.ArrowRight.presionado = true;
        enemigo.ultimaTecla = "ArrowRight";
        break;
      case "ArrowLeft":
        teclas.ArrowLeft.presionado = true;
        enemigo.ultimaTecla = "ArrowLeft";
        break;
      case "ArrowUp":
        enemigo.velocidad.y = -15;
        break;
      case "ArrowDown":
        enemigo.attack();
        break;
    }
  }
});

window.addEventListener("keyup", (e) => {
  switch (e.key) {
    case "d":
      teclas.d.presionado = false;
      break;
    case "a":
      teclas.a.presionado = false;
      break;
    case "w":
      break;
  }

  //teclas enemigo
  switch (e.key) {
    case "ArrowRight":
      teclas.ArrowRight.presionado = false;

      break;
    case "ArrowLeft":
      teclas.ArrowLeft.presionado = false;

      break;
    case "ArrowUp":
      break;
  }
});

function reiniciar() {
  window.location.reload();
}
