var WIDTH = 100;
var HEIGHT = WIDTH / 2;
var AREA = WIDTH * HEIGHT;
/********************************************/
var Tiles = {
  underWall: {
    tile: "▀",
    solid: true,
  },
  upperWall: {
    tile: "▄",
    solid: true,
  },
  leftWall: {
    tile: "▌",
    solid: true,
  },
  rightWall: {
    tile: "▐",
    solid: true,
  },
  space: {
    tile: "·",
    solid: false,
  },
  shadingLight: {
    tile: "░",
    solid: false,
  },
  shadingMed: {
    tile: "▒",
    solid: false,
  },
  shadingDark: {
    tile: "▓",
    solid: true,
  },
  flooring1: {
    tile: "·",
    solid: false,
  },
  flooring2: {
    tile: "×",
    solid: false,
  },
  noTexture: {
    tile: "x",
    solid: false,
  },
};
/********************************************/
var BiomeTypes = {
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
      genMap: function() {
        /* Create blank map with borders */
        var map = [];
        for (var y = 0; y < HEIGHT; y++) {
          var row = [];
          for (var x = 0; x < WIDTH; x++) {
            if (y == 0) {                       //top row
              row.push(tiles.border.tile);
            } else if (y > 0 && y < HEIGHT-1) { //middle stuff
              if (x == 0) {                     //far left
                row.push(tiles.border.tile);
              } else if (x > 0 && x < WIDTH-1) {//middle stuff
                row.push(tiles.base.tile);
              } else if (x == WIDTH-1) {        //far right
                row.push(tiles.border.tile);
              }
            } else if (y == HEIGHT-1) {         //bottom row
              row.push(tiles.border.tile);
            }
          }
          map.push(row);
        }
        return map;
      },
      genTexture: function(map) {
        var map = map;
        var numbers = [-2, -1, 0, 1, 2];
        for (var i = 0; i < _.random(WIDTH / 15, WIDTH / 10); i++) {
          var stonesPos = [_.random(3, WIDTH - 3), _.random(3, WIDTH - 3)];
          map[stonesPos[1]][stonesPos[0]] = tiles.texture.tile;
          for (var j = 0; j < _.random(3, 9); j++) {
            var newStonesPos = [stonesPos[1] + _.sample(numbers), stonesPos[0] + _.sample(numbers)];
            try {
                map[newStonesPos[1]][newStonesPos[0]] = tiles.texture.tile;
              }
            } catch (err) {
              //there was a mysterious unknown error that I don't care about finding.
              //It might not even exist anymore....
            }
          }
        return map
      }
    },
    generateBelow: function(tiles, genFuncs) {
      var map = genFuncs.genMap();
      map = genFuncs.genTexture(map);
      
      return map;
    },
    generateAbove: function(tiles) {
      return "this is the above map";
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

