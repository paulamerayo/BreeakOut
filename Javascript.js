//Sirve para establecer la altura del contenido y que no se pueda manipular
function pagina1() {
  document.getElementById('primeraPantalla').style.height = "0";
  document.getElementById('segundaPantalla').style.height = "100%";
  document.getElementById("musica").play();
}

//esta funcion nos dará una alerta en caso de que el jugador no indique un nombre de usuario
function pagina2() {
  var player = document.getElementById('player').value;
  if(player == ""){
    alert('Tienes que introducir un nombre de usuario obligatoriamente')
    return false;
    player.focus();
  }
  document.getElementById('segundaPantalla').style.height = "0";
  document.getElementById('pantallaJuego').style.height = "100%";
  document.getElementById('jugador').innerText = player.toUpperCase();

  var canvas = document.getElementById('myCanvas');
  var ctx = canvas.getContext('2d');
  //Indicamos la altura y el ancho de la pantalla
  var ancho = screen.width;
  var alto = screen.height - (screen.height * 0.40);
  canvas.width = ancho;
  canvas.height = 350;
  var ballRadius = 8;
  var x = canvas.width/2;
  var y = canvas.height-30;
  var dx = 7;
  var dy = -7;
  var paddleHeight = 10;
  var paddleWidth = 150;
  var paddleX = (canvas.width - paddleWidth) / 2;
  var rightPressed = false;
  var leftPressed = false;
  var brickWidth = 75;
  var brickPadding = 10;
  var brickRowCount = 22;
  var brickColumnCount = 5;
  var brickHeight = 20;
  var brickOffsetTop = 30;
  var brickOffsetLeft = 30;
  var puntuacion = 0;
  var vidas = 3;

  var bricks = [];
  for (c = 0; c < brickColumnCount; c++) {
    bricks[c] = [];
    for (r = 0; r < brickRowCount; r++) {
      bricks[c][r] = { x: 0, y: 0, status: 1 };
    }
  }

  document.addEventListener("keydown", keyDownHandler, false);
  document.addEventListener("keyup", keyUpHandler, false);
  document.addEventListener("mousemove", mouseMoveHandler, false);

  //sirve para poder jugar con las flechas izquierda o derecha
  function keyDownHandler(e) {
    if (e.keyCode == 39) {
      rightPressed = true;
    } 
    else if (e.keyCode == 37) {
      leftPressed = true;
    }
  }

  function keyUpHandler(e) {
    if (e.keyCode == 39) {
      rightPressed = false;
    } 
    else if (e.keyCode == 37) {
      leftPressed = false;
    }
  }

  //sirve para poder jugar con el raton del ordenador
  function mouseMoveHandler(e) {
    var relativeX = e.clientX - canvas.offsetLeft;
    if(relativeX > 0 && relativeX < canvas.width) {
      paddleX = relativeX - paddleWidth/2;
    }
  }

  function collisionDetection() {
    for (c = 0; c < brickColumnCount; c++) {
      for (r = 0; r < brickRowCount; r++) {
        var b = bricks[c][r];
        if (b.status == 1) {
          if (x > b.x && x < b.x + brickWidth && y > b.y && y < b.y + brickHeight) {
            dy = -dy;
            b.status = 0;
            document.getElementById("pum").play();
            puntuacion++;
            if (puntuacion == brickRowCount * brickColumnCount) {
              alert("YOU WIN, CONGRATS!");
              document.location.reload();
            }
          }
        }
      }
    }
  }

  function drawBall() {
    ctx.beginPath();
    ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
  }

  function drawPaddle() {
    ctx.beginPath();
    ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
  }

  function drawBricks() {
    for (c = 0; c < brickColumnCount; c++) {
      for (r = 0; r < brickRowCount; r++) {
        if (bricks[c][r].status == 1) {
          var brickX = (r * (brickWidth + brickPadding)) + brickOffsetLeft;
          var brickY = (c * (brickHeight + brickPadding)) + brickOffsetTop;
          bricks[c][r].x = brickX;
          bricks[c][r].y = brickY;
          ctx.beginPath();
          ctx.rect(brickX, brickY, brickWidth, brickHeight);
          ctx.fillStyle = "#0095DD";
          ctx.fill();
          ctx.closePath();
        }
      }
    }
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBricks();
    drawBall();
    drawPaddle();
    document.getElementById('puntuacion').innerText = puntuacion;
    document.getElementById('vidas').innerText = vidas;
    collisionDetection();

    if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
      dx = -dx;
    }
    if (y + dy < ballRadius) {
      dy = -dy;
    } 
    else if (y + dy > canvas.height - ballRadius) {
      if (x > paddleX && x < paddleX + paddleWidth) {
        dy = -dy;
      }

    //En caso de que se pierda, el juego te llevará otra vez a la pagina de bienvenida
    else {
      vidas--;
      if (!vidas) {
        alert("GAME OVER");
        document.location.reload();
      }
      else {
        x = canvas.width / 2;
        y = canvas.height - 30;
        dx = 7;
        dy = -7;
        paddleX = (canvas.width - paddleWidth) / 2;
      }
    }
  }

  if (rightPressed && paddleX < canvas.width - paddleWidth) {
    paddleX += 10;
  } 
  else if (leftPressed && paddleX > 0) {
    paddleX -= 10;
  }

  x += dx;
  y += dy;
  requestAnimationFrame(draw);
}

draw();

}