Parts = {
  noTexture: "xx",
  playerHead: "╓╖",
  playerBody: "╙╜",
}

AI = {
  wander: function() {
    var moveChoices = [moveUp, moveDown, moveRight, moveLeft];
    if (_.random(5) == _.random(5)) {
      var direction = _.sample(moveChoices);
      for (var i=0; i < _.random(4); i++) {
        window.setTimeout(function() { direction() }, 500 * i);
      }
    }
  },
  agro: function() {
    //code for agro AI
  },
}

EntityTypes = {
  orc: {
    id: "orc",
    head: Parts.noTexture,
    body: Parts.noTexture,
    maleNames: [
      "ook",
      "gung",
      "chogga",
    ],
    maleDescriptions: [
      "maimer",
      "violent",
      "hateful",
      "dedicated mother",
    ],
    femaleNames: [
      "ook",
      "gung",
      "chogga",
    ],
    femaleDescriptions: [
      "maimer",
      "violent",
      "hateful",
      "dedicated mother",
    ],
  },
  player: {
    id: "player",
    head: Parts.playerHead,
    body: Parts.playerBody,
  },
  villager: {
    id: "villager",
    head: Parts.playerHead,
    body: Parts.playerBody,
    maleNames: [
      "mark",
      "steve",
      "jeffery",
      "bob",
      "cool guy"
    ],
    maleDescriptions: [
      "baker",
      "salesman",
      "guy",
      "hobo",
      "jerk",
      "stranger",
      "tradesman",
    ],
    femaleNames:[
      "gianna",
      "zoe",
      "jordan",
      "some girls name",
    ],
    femaleDescriptions: [
      "dedicated mother",
      "thot"
    ],
  },
}

function Entity(name, pos, head, body, desc, gender){
  //  instantiate variables
  var name = name;
  var pos = pos;
  var head = head;
  var body = body;
  var desc = desc;
  var gender = gender;
  
  /*  getter functions */
  this.getname = function() {
    return name;
  }
  this.getPos = function() {
    return pos;
  }
  this.getHead = function() {
    return head;
  }
  this.getBody = function() {
    return body;
  }
  this.getX = function() {
    return pos[0];
  }
  this.getY = function() {
    return pos[1];
  }
  this.getDesc = function() {
    return desc;
  }
  this.getGender = function() {
    return gender;
  }
  
  /*  setter functions  */
  this.setName = function(newName) {
    name = newName;
  }
  this.setPos = function(newPos) {
    pos = newPos;
  }
  this.setHead = function(newHead) {
    head = newHead;
  }
  this.setBody = function(newBody) {
    body = newBody;
  }
  this.setX = function(newX) {
    pos[0] = newX;
  }
  this.setY = function(newY) {
    pos[1] = newY;
  }
  this.setDesc = function(newDesc) {
    desc = newDesc;
  }
  this.setGender = function(newGender) {
    gender = newGender;
  }
  
  /*  movement functions  */
  this.moveLeft = function() {
    pos[0] -= 1;
  }
  this.moveRight = function() {
    pos[0] -= 1;
  }
  this.moveUp = function() {
    pos[1] -= 1;
  }
  this.moveDown = function() {
    pos[1] += 1
  }
  /*  move move functions to a larger scope */
  var moveLeft = this.moveLeft;
  var moveRight = this.moveRight;
  var moveUp = this.moveUp;
  var moveDown = this.moveDown;
  
  /*  other functions  */
  this.update = function() {
    //override this if anything is to be done
  }
}

function EntityBuilder(id, pos, gender) {
  var id = id;
  var pos = pos;
  var gender = gender;
  if (gender == "male") {
    var entity = new Entity(
      _.sample(EntityTypes[id].maleNames),
      pos,
      EntityTypes[id].head,
      EntityTypes[id].body,
      _.sample(EntityTypes[id].maleDescriptions),
      gender
    );
  } else if (gender == "female") {
    var entity = new Entity(
      _.sample(EntityTypes[id].femaleNames),
      pos,
      EntityTypes[id].head,
      EntityTypes[id].body,
      _.sample(EntityTypes[id].femaleDescriptions),
      gender
    );
  }
  return entity;
}

function Player(world, name, pos, head, body, gender) {
  //initialize variables
  var pos = pos;
  var name = name;
  var head = head;
  var body = body;
  var gender = gender;
  //make player
  var player = new Entity(name, pos, head, body, );
  //allow player input
  player.update = function(e) {
    try {
      switch (e.keyCode) {
        case 37: // left
          player.moveLeft();
          break;
        case 38: // up
          player.moveUp();
          break;
        case 39: // right
          player.moveRight();
          break;
        case 40: // down
          player.moveDown();
          break;
      }
    } catch (err) {
      //  there won't be an error, this is just to have the
      //  "finally" statement, even though I'm using "break"
      //  after the arrow keys
    } finally {
      //check if the player moved wrongly
      if (player.getX() < 1) {
        player.moveRight();
      }
    }
    return player;
  }
  document.onkeydown = player.update;
}