let tiempo = 61;
let idTiempo;

function colisiones({ jugador, enemigo }) {
  return (
    jugador.ataque.posicion.x + jugador.ataque.width >= enemigo.posicion.x &&
    jugador.ataque.posicion.x <= enemigo.posicion.x + enemigo.ancho &&
    jugador.ataque.posicion.y + jugador.ataque.height >= enemigo.posicion.y &&
    jugador.ataque.posicion.y <= enemigo.posicion.y + enemigo.alto
  );
}

function determinarGanador({ jugador, enemigo, idTiempo }) {
  clearTimeout(idTiempo);
  if (jugador.vida === enemigo.vida) {
    mensaje.innerHTML = "empate";
  } else if (jugador.vida > enemigo.vida) {
    mensaje.innerHTML = "Jugador 1 gana";
  } else if (jugador.vida < enemigo.vida) {
    mensaje.innerHTML = "jugador 2 gana";
  }
}

function temporizar() {
  if (tiempo > 0) {
    idTiempo = setTimeout(temporizar, 1000);
    tiempo--;
    temporizador.innerHTML = tiempo;
  }

  if (tiempo === 0) {
    determinarGanador({ jugador, enemigo, idTiempo });
  }
}
