var SIZE = 100;

var tiles = {
  underwall: "▀▀",
  upperWall: "▄▄",
  leftWall : "▌·",
  rightWall : "·▐",
  space : "··",
  topLeft : "·▄",
  topRight : "▄·",
  bottomLeft : "·▀",
  bottomRight : "▀·",
  lightShading : "░░",
  medShading : "▒▒",
  darkShading : "▓▓",
  stones : ["▒▒"],
  flooring1 :"··",
  flooring2 : "××",
}

var container = "world-span";

function WorldTools() {
  this.makeWorld = function() {
    var world = [], borderRow = [];
    // Make normal rows
    for (var i=0; i < SIZE-1; i++) {
      var row = [];
      for (var j=0; j < SIZE-1; j++) {
        row.push(lightShading);
      }
      row[0] = darkShading;
      row[SIZE-1] = darkShading;
      world.push(row);
    }
    // Make border rows
    for (var i = 0; i < SIZE; i++) {
      borderRow.push(darkShading);
    }
    //place borders in world
    world[0] = borderRow;
    world[world.length-1] = borderRow;
    return world;
  }
  
  this.makeLayeredWorld = function(bottomLayers, entities, upperLayers) {
    var world = bottomLayers[0];
    for (var layer = 1; layer < bottomLayers.length; layer++) {
      
    }
  }
  
  this.getSection = function(world, pos) {
    var charWidth = $("#char-span").width();
    var charHeight = $("#char-span").height();
    var width = $("#content").width();
    var height = $("#content").height();
    var x = pos[0], y = pos[1];
    
    var section = [];
    
    for (var i=0; i < height / charHeight; i++) {
      var row = [];
      for (var j=0; j < width / charWidth - 1; j++) {
        row.push(world[y+i][x+j]);
      }
      section.push(row);
    }
    return section;
  }
  
  this.makeHouse = function(size) {
    var house = Array(size);
    for(var i=0; i < house.length; i++) {
      var row = Array(size);
      switch(i) {
        case 0:
          for(var j=0; j < row.length; j++) {
            row[j] = upperWall;
          }
        case size-1:
          if (i > 0) {
            for(var j=0; j < row.length; j++) {
              row[j] = underwall;
            }
          }
        default:
          if(i > 0 && i < size-1){
            for(var j=0; j < row.length; j++) {
              row[j] = flooring1;
          }
        }
      }
      //place walls
      if (i > 0 && i < size-1) {
        row[0] = rightWall;
        row[size-1] = leftWall;
      }
      //place row into the house
      house[i] = row;
    }
    return house;
  }
  
  this.placeStructure = function(struct, world, pos) {
    var x = pos[0];
    var y = pos[1];
    for (var i=0; i < struct.length; i++) {
      for (var j=0; j < struct[i].length; j++) {
        world[y+i][x+j] = struct[i][j];
      }
    }
    return world;
  }

  this.makeTerrain = function(world) {
    var numbers = [-1, -1, 0, 0, 0, 0, 1, 1, 1, 2,];
    for (var i = 0; i < _.random(size / 10, size / 2); i++) {
      var stonesCoord = [_.random(3, size - 3), _.random(3, size - 3)];
      world[stonesCoord[1]][stonesCoord[0]] = _.sample(stones);
      for (var j = 0; j < _.random(3,9); j++) {
        var newStoneCoord = [stonesCoord[1] + _.sample(numbers), stonesCoord[0] + _.sample(numbers)];
        try {
          if (world[newStoneCoord[1]][newStoneCoord[0]] != darkShading) {
            world[newStoneCoord[1]][newStoneCoord[0]] = _.sample(stones);
          }
        } catch (err) {
          
        }
      }
    }
    return world;  
  }

  this.makeHTML = function(world, div) {
    var para, node, row, h2, br;
    h2 = document.createElement("h2");
    h2 = document.getElementById("world-h2");
    div.appendChild(h2);
    h2.innerHTML = "";
    for (var i = 0; i < world.length; i++) {
      var span = document.createElement("span");
//      span.id = i + ",0";
      for (var j = 1; j < world[i].length; j++) {
        if (world[i][j] == world[i][j-1]) {
          node = document.createTextNode(world[i][j]);
          span.appendChild(node);
          h2.appendChild(span);
        } else {
          var span = document.createElement("span");
          node = document.createTextNode(world[i][j]);
          span.appendChild(node);
          h2.appendChild(span);
        }
      }
      br = document.createElement("br");
      h2.appendChild(br);
    }
  }
}

function Biome(size, type) {
  var size = size;
  var type = type;
  var biome = {
      below: [],
      entities: {},
      objects: {},
      above: []
    }
  var biomeMaker = function() {
    
  }
}