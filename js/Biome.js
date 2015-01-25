var SIZE = 100;
var Tiles = {
  underwall: "▀▀",
  upperWall: "▄▄",
  leftWall: "▌·",
  rightWall: "·▐",
  space: "··",
  topLeft: "·▄",
  topRight: "▄·",
  bottomLeft: "·▀",
  bottomRight: "▀·",
  shadingLight: "░░",
  shadingMed: "▒▒",
  shadingDark: "▓▓",
  stones: ["▒▒"],
  flooring1:"··",
  flooring2: "××",
  noTexture: "xx",
}
var BiomeTypes = {
  template: {
    id: "",
    tiles: {
      base: Tiles.noTexture,
      tex: Tiles.noTexture,
      border: Tiles.noTexture,
    },
    desc: "",
    spawnable: [],
    generate: function(tiles) {},
  },
  plains: {
    id: "plains",
    tiles: {
      base: Tiles.shadingLight,
      tex: Tiles.shadingMed,
      border: Tiles.shadingDark,
    },
    desc: "Beautiful grassy plains. Maybe you'll find a village!",
    spawnable: [
      "villager",
      "orc",
    ],
    generate: function(tiles) {
      var map = [];
      //MAKE BASE MAP
      for (var y = 0; i < SIZE; i++) {
        var row = [];
        for (var x = 0; j < SIZE; j++) {
          /*I'm using if-else statments because of performance.
            Switch statements are aparently thirty times slower than 
            if-else on chrome, and it would be nice to have good performance,
            even if that means sacrificing readability */
          if (x == 0) { // far left side
            row[x] = tiles.border;
          } else if (x < SIZE){ // walkable terrain
            if (x == 0) { //top row
              row[x] = tiles.border;
            } else if () { //middle
              row[x] = tiles.base;
            } else { //bottom row
              row[x] = tiles.border;
            }
          } else if (x == SIZE) { // far right side
            row[x] = tiles.border;
          }
        }
        map.push(row);
      }
      //TEXTURE MAP
      var numbers = [-1, -1, 0, 0, 0, 0, 1, 1, 1, 2,];
      for (var i = 0; i < _.random(SIZE / 10, SIZE / 2); i++) {
        var stonesPos = [_.random(3, SIZE - 3), _.random(3, SIZE - 3)];
        map[stonesPos[1]][stonesPos[0]] = tiles.tex;
        for (var j = 0; j < _.random(3, 9); j++) {
          var newStonesPos = [stonesPos[1] + _.sample(numbers), stonesPos[0] + _.sample(numbers)];
          try {
              map[newStonesPos[1]][newStonesPos[0]] = tiles.tex;
            }
          } catch (err) {

          }
        }
      return map
      },
    },
  },
  rocky: {
    id: "rocky",
    tiles: {
      base: Tiles.shadingLight,
      tex: Tiles.shadingDark,
      border: Tiles.shadingDark,
    },
    desc: "Rocky terrain, difficult to walk on",
    spawnable: [
      "orc",
      //dwarf in future
    ],
    generate: function(tiles) {
      var map = [];
      //MAKE BASE MAP
      for (var y = 0; i < SIZE; i++) {
        var row = [];
        for (var x = 0; j < SIZE; j++) {
          /*I'm using if-else statments because of performance.
            Switch statements are aparently thirty times slower than 
            if-else on chrome, and it would be nice to have good performance,
            even if that means sacrificing readability */
          if (x == 0) { // far left side
            row[x] = tiles.border;
          } else if (x < SIZE){ // walkable terrain
            if (x == 0) { //top row
              row[x] = tiles.border;
            } else if () { //middle
              row[x] = tiles.base;
            } else { //bottom row
              row[x] = tiles.border;
            }
          } else if (x == SIZE) { // far right side
            row[x] = tiles.border;
          }
        }
        map.push(row);
      }
      //TEXTURE MAP
      var numbers = [-1, -1, 0, 0, 0, 0, 1, 1, 1, 2,];
      for (var i = 0; i < _.random(SIZE / 10, SIZE / 2); i++) {
        var stonesPos = [_.random(3, SIZE - 3), _.random(3, SIZE - 3)];
        map[stonesPos[1]][stonesPos[0]] = tiles.tex;
        for (var j = 0; j < _.random(3, 9); j++) {
          var newStonesPos = [stonesPos[1] + _.sample(numbers), stonesPos[0] + _.sample(numbers)];
          try {
              map[newStonesPos[1]][newStonesPos[0]] = tiles.tex;
            }
          } catch (err) {

          }
        }
      return map
    },
  },
}

function BiomeBuilder (id, pos) {
  var biome = {
    pos: pos,
    entites: {},
    objects: {},
    above: [],
    below: BiomeTypes[id].generate(BiomeTypes[id].tiles),
  };
  return biome;
}

function WorldTools() {
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
//This edit is to test slack integration with github