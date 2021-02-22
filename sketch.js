var gameState = "FORM";
var bg, backgroundImg, bg2, backgroundImg2, startBgSound;
var form, instructions;
var human, human_walking, human_jumping, jumpSound;
var coin, coinImg, coinsGroup, goldCoin, goldCoinImg, goldCoinsGroup, coinSound;
var score = 0;
var invisibleGround;
var clue, clueImg, clue1, clue2, clue3, clue4, clue5, cluesGroup;
var obstacle, obstaclesGroup, obstacle1Img, obstacle2Img, obstacle3Img, obstacle4Img, obstacle5Img, obstacle6Img, obstacle7Img, obstacle8Img, obstacle9Img, obstacleHitSound;
var timer = 300;

// Loading Images & Animations
function preload() {
  human_walking = loadAnimation("../images/walking/man_walking1.png",
    //"../images/walking/man_walking2.png",
    //"../images/walking/man_walking3.png",
    //"../images/walking/man_walking4.gif",
    "../images/walking/man_walking5.gif",
    //"../images/walking/man_walking6.png",
    "../images/walking/man_walking7.png");
  //"../images/walking/man_walking8.png");

  human_jumping = loadAnimation("../images/walking/man_walking4.gif");

  coinImg = loadImage("../images/coin.png");
  goldCoinImg = loadImage("../images/goldcoin.png");

  clueImg = loadImage("../images/clueBox.PNG");

  backgroundImg = loadImage("../images/background/daytime.PNG");
  backgroundImg2 = loadImage("../images/background/daytime.PNG");

  obstacle1Img = loadImage("../images/obstacle/obstacle1.png");
  obstacle2Img = loadImage("../images/obstacle/obstacle2.png");
  obstacle3Img = loadImage("../images/obstacle/obstacle3.png");
  obstacle4Img = loadImage("../images/obstacle/obstacle4.png");
  obstacle5Img = loadImage("../images/obstacle/obstacle5.png");
  obstacle6Img = loadImage("../images/obstacle/obstacle6.png");
  obstacle7Img = loadImage("../images/obstacle/obstacle7.png");
  obstacle8Img = loadImage("../images/obstacle/obstacle8.png");
  obstacle9Img = loadImage("../images/obstacle/obstacle9.png");

  coinSound = loadSound("sounds/coinSound.wav");
  jumpSound = loadSound("sounds/jumpSound.wav");
  startBgSound = loadSound("sounds/backgroundSound.wav");
  obstacleHitSound = loadSound("sounds/obstacleHitSound.wav");

  //getBackgroundImg();
}

function setup() {
  createCanvas(displayWidth, displayHeight);

  form = new Form();
  instructions = new Instructions();

  bg = createSprite(displayWidth / 2, displayHeight / 2);
  bg.addImage(backgroundImg);
  bg.scale = 2;

  bg2 = createSprite(displayWidth * 2, displayHeight / 2);
  bg2.addImage(backgroundImg);
  bg2.scale = 2;

  human = createSprite(displayWidth / 4 - 50, displayHeight - 150, 100, 100);
  human.addAnimation("walking", human_walking);
  human.visible = false;

  invisibleGround = createSprite(displayWidth / 2, displayHeight - 20, displayWidth, 20);
  invisibleGround.visible = false;

  cluesGroup = new Group();
  obstaclesGroup = new Group();
  coinsGroup = new Group();
  goldCoinsGroup = new Group();

  clue1 = new Clue1();

}

function draw() {
  //if (backgroundImg)
    background(0);

  if(gameState === "FORM" || gameState === "INSTRUCTIONS"){
    //startBgSound.loop();
  }
  else{
    //startBgSound.stop();
  }

  localStorage.setItem("name", document.getElementById("play").value);

  if (gameState === "PLAY") {
    bg.velocityX = -10;
    bg2.velocityX = -10;

  /*  if(bg.x < 0 - (displayWidth / 10)){
      bg.x = bg2.x * 4;
    }
    if(bg2.x < 0 - (displayWidth / 10)){
      bg2.x = bg.x * 4;
    } */

    if (frameCount % 30 === 0 && timer > 0) {
      timer--;
    }

   /* if (bg === "images/background/daytime.PNG") {
      textSize(30);
      fill("black");
      stroke("black");
      strokeWeight(2);
      text("Player Name: " + localStorage.getItem("name"), 100, 100);
      text("Coins Collected: " + score, 400, 100);
    }
    else if (bg === "images/background/nighttime.PNG") {
      fill("white");
      stroke("white");
      textSize(30);
      strokeWeight(2);
      text("Player Name: " + localStorage.getItem("name"), 100, 100);
      text("Score: " + score, 400, 100);
    } */

    if (bg.x < 0) {
      bg.x = bg.width / 2;
    }

    if (keyDown("space") && human.y >= displayHeight / 2 + 100) {
      human.velocityY = -20;
      human.changeAnimation("jumping", human_jumping);
      jumpSound.play();
    }

    human.velocityY = human.velocityY + 1;
    human.collide(invisibleGround);

    human.visible = true;

    spawnCoins();
    spawnClues();
    spawnObstacles();

    if (cluesGroup.isTouching(human)) {
      cluesGroup.destroyEach();
      var rand = Math.round(random(1, 4));
      switch (rand) {
        case 1:
          
          break;
      }
    }

    if (coinsGroup.isTouching(human)) {
      score += 10;
      coinsGroup.destroyEach();
      coinSound.play();
    }

    if (goldCoinsGroup.isTouching(human)) {
      score += 50;
      goldCoinsGroup.destroyEach();
    }

    if (obstaclesGroup.isTouching(human)) {
      score -= 10;
      obstaclesGroup.destroyEach();
      obstacleHitSound.play();
    }

    if (score < 0) {
      score = 0;
    }

  }

  if (gameState === "FORM") {
    form.display();
  }
  else if (gameState === "INSTRUCTIONS") {
    instructions.display();
  }

  drawSprites();

  if(gameState === "PLAY"){
    textSize(30);
    fill("black");
    stroke("black");
    strokeWeight(2);
    text("Player Name: " + localStorage.getItem("name"), 100, 100);
    text("Coins Collected: " + score, 400, 100);

    textSize(30);
    fill("black");
    stroke("black");
    strokeWeight(2);
    text("Time Left: " + timer, 600, 200);
  }
}

/*async function getBackgroundImg() {
  var response = await fetch("http://worldtimeapi.org/api/timezone/America/Chicago");
  var responseJSON = await response.json();

  var datetime = responseJSON.datetime;
  var hour = datetime.slice(11, 13);

  if (hour >= 06 && hour <= 19) {
    bg = "images/background/daytime.PNG";
  }
  else {
    bg = "images/background/nighttime.PNG";
    form.title.style("color", "white");
    form.label.style("color", "white");
    form.input.style("background-color", "#999");
    form.input.style("color", "black");
  }

  backgroundImg = loadImage(bg);
}*/

function spawnCoins() {
  if (frameCount % /*Math.round(random(300,500))*/ 300 === 0) {
    coin = createSprite(displayWidth, random(displayHeight / 3, displayHeight / 3 + 50), 100, 100);
    coin.addImage(coinImg);
    coin.scale = 0.2;
    coin.velocityX = -8;
    coin.lifetime = 300;
    coinsGroup.add(coin);
  }
  else if (frameCount % 500 === 0) {
    goldCoin = createSprite(displayWidth, random(displayHeight / 3, displayHeight / 3 + 50), 100, 100);
    goldCoin.addImage(goldCoinImg);
    goldCoin.scale = 0.05;
    goldCoin.velocityX = -10;
    goldCoin.lifeTime = 300;
    goldCoinsGroup.add(goldCoin);
  }
}

function spawnClues() {
  if (score === 5 && frameCount % Math.round(random(200, 400)) === 0) {
    clue = createSprite(displayWidth, 500, 300, 300);
    clue.addImage(clueImg);
    clue.scale = 0.4;
    clue.velocityX = -8;
    cluesGroup.add(clue);
  }
}

function spawnObstacles() {
  if (frameCount % Math.round(random(300, 500)) === 0) {
    obstacle = createSprite(displayWidth, displayHeight - 100, 300, 300);
    obstacle.velocityX = -13;

    var rand = Math.round(random(1, 9));
    switch (rand) {
      case 1: obstacle.addImage(obstacle1Img);
        break;
      case 2: obstacle.addImage(obstacle2Img);
        break;
      case 3: obstacle.addImage(obstacle3Img);
        break;
      case 4: obstacle.addImage(obstacle4Img);
        break;
      case 5: obstacle.addImage(obstacle5Img);
        break;
      case 6: obstacle.addImage(obstacle6Img);
        break;
      case 7: obstacle.addImage(obstacle7Img);
        break;
      case 8: obstacle.addImage(obstacle8Img);
        break;
      case 9: obstacle.addImage(obstacle9Img);
        break;
    }

    obstaclesGroup.add(obstacle);
  }
}