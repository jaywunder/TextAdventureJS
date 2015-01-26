var WIDTH = 100;
var HEIGHT = WIDTH / 2;
var AREA = WIDTH * HEIGHT;
/********************************************/
var Tiles = {
  underWall: {
    tile: "▀",
    solid: true,
    color: "#FFFFFF",
    
  },
  upperWall: {
    tile: "▄",
    solid: true,
    color: "#FFFFFF",
    
  },
  leftWall: {
    tile: "▌",
    solid: true,
    color: "#FFFFFF",
    
  },
  rightWall: {
    tile: "▐",
    solid: true,
    color: "#FFFFFF",
    
  },
  space: {
    tile: "·",
    solid: false,
    color: "#FFFFFF",
    
  },
  shadingLight: {
    tile: "░",
    solid: false,
    color: "#FFFFFF",
    
  },
  shadingMed: {
    tile: "▒",
    solid: false,
    color: "#FFFFFF",
    
  },
  shadingDark: {
    tile: "▓",
    solid: true,
    color: "#FFFFFF",
    
  },
  flooring1: {
    tile: "·",
    solid: false,
    color: "#FFFFFF",
    
  },
  flooring2: {
    tile: "×",
    solid: false,
    color: "#FFFFFF",
    
  },
  noTexture: {
    tile: "x",
    solid: false,
    color: "#FFFFFF",
    
  },
};

var BiomeTypes = {
  /******TEMPLATE******/
  template: {
    id: "",
    tiles: {
      base: Tiles.noTexture,
      tex: Tiles.noTexture,
      border: Tiles.noTexture,
    },
    desc: "",
    spawnable: [],
    genFuncs: {},
    generateBelow: function(tiles) {},
    generateAbove: function(tiles) {},
  },
  /******PLAINS******/
  plains: {
    id: "plains",
    tiles: {
      base: Tiles.shadingLight,
      texture: Tiles.shadingMed,
      border: Tiles.shadingDark,
    },
    desc: "Beautiful grassy plains. Maybe you'll find a village!",
    spawnable: [
      "villager",
      "orc",
    ],
    genFuncs: {
      genMap: function(tiles) {
        /* Create blank map with borders */
        var map = [];
        for (var y = 0; y < HEIGHT; y++) {
          var row = [];
          for (var x = 0; x < WIDTH; x++) {
            if (y == 0) {                       //top row
              row.push(tiles.border);
            } else if (y > 0 && y < HEIGHT-1) { //middle stuff
              if (x == 0) {                     //far left
                row.push(tiles.border);
              } else if (x > 0 && x < WIDTH-1) {//middle stuff
                row.push(tiles.base);
              } else if (x == WIDTH-1) {        //far right
                row.push(tiles.border);
              }
            } else if (y == HEIGHT-1) {         //bottom row
              row.push(tiles.border);
            }
          }
          map.push(row);
        }
        return map;
      },
//      genTexture: function(tiles, map) {
//        var map = map;
//        var numbers = [-2, -1, 0, 1, 2];
//        for (var i = 0; i < _.random(WIDTH / 15, WIDTH / 10); i++) {
//          var stonesPos = [_.random(3, WIDTH - 3), _.random(3, WIDTH - 3)];
//          map[stonesPos[1]][stonesPos[0]] = tiles.texture.tile;
//          for (var j = 0; j < _.random(3, 9); j++) {
//            var newStonesPos = [stonesPos[1] + _.sample(numbers), stonesPos[0] + _.sample(numbers)];
//            try {
//                map[newStonesPos[1]][newStonesPos[0]] = tiles.texture.tile;
//              }
//            } catch (err) {
//              //there was a mysterious unknown error that I don't care about finding.
//              //It might not even exist anymore....
//            }
//          }
//        return map
//      }
    },
    generateBelow: function(tiles, genFuncs) {
      var map = genFuncs.genMap(tiles);
//      map = genFuncs.genTexture(tiles, map);
      
      return map;
    },
    generateAbove: function(tiles) {
      return "this is the above map";
    }
  },
  /******ROCKY******/
  rocky: {
    id: "rocky",
    tiles: {
      base: Tiles.shadingLight,
      tex: Tiles.shadingDark,
      border: Tiles.shadingDark,
    },
    desc: "Rocky terrain, perfect for dwarves.",
    spawnable: [
      "orc",
      //dwarf in future
    ],
    genFuncs: {
      genMap: function(tiles) {
        /* Create blank map with borders */
        var map = [];
        for (var y = 0; y < HEIGHT; y++) {
          var row = [];
          for (var x = 0; x < WIDTH; x++) {
            if (y == 0) {                       //top row
              row.push(tiles.border);
            } else if (y > 0 && y < HEIGHT-1) { //middle stuff
              if (x == 0) {                     //far left
                row.push(tiles.border);
              } else if (x > 0 && x < WIDTH-1) {//middle stuff
                row.push(tiles.base);
              } else if (x == WIDTH-1) {        //far right
                row.push(tiles.border);
              }
            } else if (y == HEIGHT-1) {         //bottom row
              row.push(tiles.border);
            }
          }
          map.push(row);
        }
        return map;
      },
    },
    generateBelow: function(tiles) {
      var map = genFuncs.genMap(tiles);
//      map = genFuncs.genTexture(tiles, map);
      
      return map;
    },
    generateAbove: function(tiles) {
      return "the map of the above"
    }
  },
}

/********************************************/
function BiomeBuilder (id) {
  var biome = {
    pos: [0,0],
    entites: {},
    objects: {},
    above: BiomeTypes[id].generateAbove(BiomeTypes[id].tiles, BiomeTypes[id].genFuncs),
    below: BiomeTypes[id].generateBelow(BiomeTypes[id].tiles, BiomeTypes[id].genFuncs),
  };
  return biome;
}

/*
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
}//*/
//This edit is to test slack integration with github