//variaveis

var trex, trexcorre, trexbateu;

var borda;

var solo, chao, soloinsivel;

var nuvens, nuvenzinhas, ceu, sol, soll;

var obstaculos, obstaculo1, obstaculo2, obstaculo3, obstaculo4, obstaculo5, obstaculo6, numeroobstaculos;

var pontuacao = 0;

var estadodejogo = "jogando";

var grupoNuvens, grupoObstaculos;

var sombate, sompula;

var gameover, reiniciar, fimdejogo, botaoreiniciar;

//funçoes

function gerarnuvens() {
  
    if (frameCount % 70 == 0){
      nuvens = createSprite (620,50);
      nuvens.velocityX = -6;
      nuvens.addImage("nuvem", nuvenzinhas);
      nuvens.scale = random(0.2,0.7);
      nuvens.y = Math.round(random (20,300));
      nuvens.depth=1;
      nuvens.lifetime = 320;
      grupoNuvens.add(nuvens);
    }
}

function gerarobstaculos(){
  
  if(frameCount % 120 == 0){
    obstaculos = createSprite (width + 100,height- 60);
    obstaculos.velocityX = -6;
    numeroobstaculos = Math.round(random(1,2));
    obstaculos.scale = 0.3
    obstaculos.lifetime = 430;
    switch(numeroobstaculos){
      case 1: obstaculos.addImage("obstaculos1", obstaculo1);
        obstaculos.scale = 0.5;
        //obstaculos.y = 420;
        break;
      
      case 2: obstaculos.addImage("obstaculos2", obstaculo2);
        obstaculos.scale = 0.6;
        //obstaculos.y = 420;
        break;
      
      /*case 3: obstaculos.addImage("obstaculos3", obstaculo3);
        obstaculos.scale = 0.25;
        break;
      
      case 4: obstaculos.addImage("obstaculos4", obstaculo4);
        obstaculos.scale = 0.25;
        break;*/
        
      default:break;
    }
    grupoObstaculos.add(obstaculos);
  }
}

function resetar(){
  pontuacao = 0;
  estadodejogo = "jogando";
  botaoreiniciar.visible = false;
  fimdejogo.visible = false;
  grupoObstaculos.destroyEach();
  trex.x = 95;
  trex.y = 190;
  trex.changeAnimation("correndo", trexcorre);
  grupoNuvens.destroyEach();
}

function preload(){
  
  //carregando imagens
  
  trexcorre = loadAnimation("trex_1.png", "trex_2.png", "trex_3.png");
  
  trexbateu = loadAnimation("trex_collided.png");
  
  chao = loadImage("ground.png");
  
  nuvenzinhas = loadImage("cloud.png");
  
  obstaculo1 = loadImage("obstacle1.png");
  
  obstaculo2 = loadImage("obstacle2.png");
  
  obstaculo3 = loadImage("obstacle3.png");
  
  obstaculo4 = loadImage("obstacle4.png");
  
  ceu = loadImage("backgroundImg.png");
  
  sombate = loadSound ("collided.wav");
  
  sompula = loadSound ("jump.wav");
  
  gameover = loadImage ("gameOver.png");
  
  reiniciar = loadImage ("restart.png");

  soll = loadImage ("sun.png");
  
}

function setup(){
  
  createCanvas(windowWidth, windowHeight);
    
  //trex criçao
  trex = createSprite(70,height-70,10,10);
  trex.addAnimation("correndo", trexcorre);
  trex.addAnimation("trexmachucado", trexbateu)
  trex.scale = 0.15;
  trex.depth =2; 
  trex.setCollider ("circle",-50,50,50);
  trex.debug = true;

  //chao criaçao
  solo = createSprite(width/2,height,width+500,10);
  solo.addImage ("solo", chao)
  solo.depth = 1;
  solo.x = width/2;

  //solo invisivel
  soloinvisivel = createSprite (width/2,height-60,width,10);
  soloinvisivel.visible = false;
  
  //bordas
  borda = createEdgeSprites();
  
  //pontuaçao
  pontucao = 0;
  
  //grupo de obstaculos
  grupoObstaculos = new Group();
  
  //grupo de nuvens
  grupoNuvens = new Group();

  //sol
  sol = createSprite(width - 80,70,20,20);
  sol.addImage("solzinho", soll);
  sol.scale = 0.5

  //fim de jogo
  fimdejogo = createSprite(width/2,height/2,0,0);
  fimdejogo.addImage("perdedor", gameover);
  fimdejogo.visible = false;
  
  botaoreiniciar = createSprite(width/2,height/2 + 100,0,0);
  botaoreiniciar.addImage("recomeçar", reiniciar)
  botaoreiniciar.scale = 0.2;
  botaoreiniciar.visible = false;

}

function draw(){
 background (ceu);

console.log(solo.x);

  //trex
  trex.collide(soloinvisivel);
  trex.collide(borda[2]);
  
  //gravidade trex
  trex.velocityY = trex.velocityY + 0.5;

  
  //*ESTADO DE JOGO*
  
  //*ESTADO DE JOGO JOGANDO*
  if (estadodejogo == "jogando"){
    
    //t-rex movimentaçao
    if (keyDown ("space")||touches.length>0 && trex.y>390) {
    trex.velocityY = -12;
    sompula.play();
    touches = [];
     }

    //trex morre
    if (trex.isTouching(grupoObstaculos)){
      //trex automatico
      //sompula.play();
      //trex.velocityY = -12;
      
      //trex manual
      estadodejogo = "final";
      sombate.play();
    }
    
    //pontuação
    pontuacao = pontuacao + Math.round(getFrameRate()/60);
    text ("pontuação: " + pontuacao, 500,30);
    
    //chao velocidade
    solo.velocityX = -(6 + 3 * pontuacao/100);
    if(solo.x<0){
      solo.x = solo.width/2;
    }
    
    //obstaculo velocidade
    grupoObstaculos.velocityXEach = -(6+3*pontucao/100);
     
    //nuvens
    gerarnuvens();

    //obstaculos
    gerarobstaculos();
    
  //*FIM DO ESTADO DE JOGO JOGANDO*
  }
  
  //*ESTADO DE JOGO FINAL*
  if (estadodejogo == "final"){
    
    //trex parou
    trex.setVelocity(0,0);
    
    //trex morto
    trex.changeAnimation ("trexmachucado", trexbateu);
    
    //solo paradinho
    solo.setVelocity(0,0);
    
    //obstaculo parado
    grupoObstaculos.setVelocityXEach(0);
    grupoObstaculos.setLifetimeEach(-1);
    
    //nuvens stop
    grupoNuvens.setVelocityXEach(0);
    grupoNuvens.setLifetimeEach(-1);
    
    //final e botoes
    botaoreiniciar.visible = true;
    
    fimdejogo.visible = true;
    
    //botao de reiniciar
    
    if (mousePressedOver(botaoreiniciar)|| touches.length>0){
      resetar();
      touches = [];
    }
    
  //*FIM ESTADO E JOGO FINAL*
  }
  drawSprites();

}
