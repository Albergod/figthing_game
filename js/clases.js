class Sprite {
  constructor({
    posicion,
    imgSrc,
    scale = 1,
    marcos = 1,
    offset = { x: 0, y: 0 },
  }) {
    this.posicion = posicion;
    this.ancho = 50;
    this.alto = 150;
    this.image = new Image();
    this.image.src = imgSrc;
    this.scale = scale;
    this.Marcos = marcos;
    this.mascosCurrent = 0;
    this.marcosTranscurridos = 0;
    this.marcosMantenidos = 5;
    this.offset = offset;
  }

  dibujar() {
    c.drawImage(
      this.image,
      this.mascosCurrent * (this.image.width / this.Marcos),
      0,
      this.image.width / this.Marcos,
      this.image.height,

      this.posicion.x - this.offset.x,
      this.posicion.y - this.offset.y,
      (this.image.width / this.Marcos) * this.scale,
      this.image.height * this.scale
    );
  }

  animacion() {
    this.marcosTranscurridos++;

    if (this.marcosTranscurridos % this.marcosMantenidos === 0) {
      if (this.mascosCurrent < this.Marcos - 1) {
        this.mascosCurrent++;
      } else {
        this.mascosCurrent = 0;
      }
    }
  }

  actualizar() {
    this.dibujar();
    this.animacion();
  }
}

class Perosnaje extends Sprite {
  constructor({
    posicion,
    velocidad,
    color,
    imgSrc,
    scale = 1,
    marcos = 1,
    offset = { x: 0, y: 0 },
    sprites,
    ataque = { offset: {}, width: undefined, height: undefined },
  }) {
    super({
      imgSrc,
      scale,
      marcos,
      posicion,
      offset,
    });
    //this.posicion = posicion;
    this.velocidad = velocidad;
    this.ancho = 50;
    this.alto = 150;
    this.ultimaTecla;
    this.color = color;
    this.atacando;
    this.vida = 100;
    this.ataque = {
      //el rectangulo de ataque va a seguir la posicion del personaje
      posicion: {
        x: this.posicion.x,
        y: this.posicion.y,
      },
      offset: ataque.offset,
      width: ataque.width,
      height: ataque.height,
    };
    this.mascosCurrent = 0;
    this.marcosTranscurridos = 0;
    this.marcosMantenidos = 5;
    this.sprites = sprites;
    this.muerto = false;

    for (const sprite in this.sprites) {
      sprites[sprite].image = new Image();
      sprites[sprite].image.src = sprites[sprite].imgSrc;
    }

    console.log(this.sprites);
  }

  // dibujar() {
  //   c.fillStyle = this.color;
  //   //                 x               Y          ANCHO        ALTO
  //   c.fillRect(this.posicion.x, this.posicion.y, this.ancho, this.alto); //rectangulo que actua como personaje

  //   if (this.atacando) {
  //     //rectángulo de ataque
  //     c.fillStyle = "white";
  //     c.fillRect(
  //       this.ataque.posicion.x,
  //       this.ataque.posicion.y,
  //       this.ataque.width,
  //       this.ataque.height
  //     );
  //   }
  // }

  actualizar() {
    this.dibujar(); //cada vez que se actualize el rectangulo personaje se pinta

    if (!this.muerto) this.animacion();

    this.ataque.posicion.x = this.posicion.x - this.ataque.offset.x;
    this.ataque.posicion.y = this.posicion.y + this.ataque.offset.y;

    // c.fillRect(    //cajas de ataques
    //   this.ataque.posicion.x,
    //   this.ataque.posicion.y,
    //   this.ataque.width,
    //   this.ataque.height
    // );

    this.posicion.x += this.velocidad.x; //posicion en x sera igual a posicion en x mas velocidad en x
    this.posicion.y += this.velocidad.y; //posicion en y sera igual a posicion en y mas velocidad en y

    if (this.posicion.y + this.alto + this.velocidad.y >= canvas.height - 97) {
      /*cuando la pocision mas el alto mas la velocida en y (personaje) sean igual a la altura del lienzo
        la velocidad en y sera 0, y se detiene en la parte inferior, y si no, la caida sera igual
        a la velodidas en y mas gravedad*/
      this.velocidad.y = 0;
      this.posicion.y = 330;
    } else this.velocidad.y += gravity;
  }

  attack() {
    this.swithSprites("atk1");
    this.atacando = true;
    // setTimeout(() => {
    //   this.atacando = false;
    // }, 1000);
  }

  takeHit() {
    this.vida -= 20;

    if (this.vida <= 0) {
      this.swithSprites("death");
    } else {
      this.swithSprites("takeHit");
    }
  }

  swithSprites(sprite) {
    if (this.image === this.sprites.death.image) {
      if (this.mascosCurrent === this.sprites.death.marcos - 1)
        this.muerto = true;
      return;
    }

    if (
      this.image === this.sprites.atk1.image &&
      this.mascosCurrent < this.sprites.atk1.marcos - 1
    )
      return;

    if (
      this.image === this.sprites.takeHit.image &&
      this.mascosCurrent < this.sprites.takeHit.marcos - 1
    )
      return;
    switch (sprite) {
      case "idle":
        if (this.image !== this.sprites.idle.image) {
          this.image = this.sprites.idle.image;
          this.Marcos = this.sprites.idle.marcos;
          this.mascosCurrent = 0;
        }
        break;
      case "run":
        if (this.image !== this.sprites.run.image) {
          this.image = this.sprites.run.image;
          this.Marcos = this.sprites.run.marcos;
          this.mascosCurrent = 0;
        }
        break;
      case "jump":
        if (this.image !== this.sprites.jump.image) {
          this.image = this.sprites.jump.image;
          this.Marcos = this.sprites.jump.marcos;
          this.mascosCurrent = 0;
        }
        break;
      case "fall":
        if (this.image !== this.sprites.fall.image) {
          this.image = this.sprites.fall.image;
          this.Marcos = this.sprites.fall.marcos;
          this.mascosCurrent = 0;
        }
        break;
      case "atk1":
        if (this.image !== this.sprites.atk1.image) {
          this.image = this.sprites.atk1.image;
          this.Marcos = this.sprites.atk1.marcos;
          this.mascosCurrent = 0;
        }
        break;
      case "takeHit":
        if (this.image !== this.sprites.takeHit.image) {
          this.image = this.sprites.takeHit.image;
          this.Marcos = this.sprites.takeHit.marcos;
          this.mascosCurrent = 0;
        }
        break;
      case "death":
        if (this.image !== this.sprites.death.image) {
          this.image = this.sprites.death.image;
          this.Marcos = this.sprites.death.marcos;
          this.mascosCurrent = 0;
        }
        break;
    }
  }
}
