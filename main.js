window.addEventListener("keydown", function(e) {
    if([37,38,39,40].indexOf(e.keyCode) > -1) {
        e.preventDefault();
    }
}, false);

var size = 100;
var upperWall = "▄▄";
var underwall = "▀▀";
var leftWall = "▌·";
var rightWall = "·▐";
var space = "··";
var corners = ["·▄", "▄·", "·▀", "▀·"];
var lightShading = "░░";
var medShading = "▒▒";
var darkShading = "▓▓";
var stones = ["▒▒"];
//var flooring1 = "▞▞";
//var flooring2 = "▚▚";
var flooring1 ="··";
var flooring2 = "××";

var container = "content";

function WorldTools() {
    this.makeWorld = function () {
        var world = [], borderRow = [];
        // Make normal rows
        for (var i=0; i < size-1; i++) {
            var row = [];
            for (var j=0; j < size-1; j++) {
                row.push(lightShading);
            }
            row[0] = darkShading;
            row[size-1] = darkShading;
            world.push(row);
        }
        // Make border rows
        for (var i = 0; i < size; i++) {
            borderRow.push(darkShading);
        }
        //place borders in world
        world[0] = borderRow;
        world[world.length-1] = borderRow;
        return world;
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
        para = document.createElement("p");
        div.appendChild(h2);
        h2.appendChild(para);
        for (var i = 0; i < world.length; i++) {
            row = world[i].join('');
            node = document.createTextNode(row);
            br = document.createElement("br");
            para.appendChild(node);
            para.appendChild(br);
        }
        div.innerHTML = "";
        div.appendChild(h2);
    }
}

function Character(world, name, pos, head, body) {
    //initialize variables
    this.world = world;
    this.pos = pos;
    this.name = name;
    this.head = head;
    this.body = body;
    this.underBody = lightShading;
    this.underHead = lightShading;
    
    //put variables in larger scope
    var world = this.world;
    var pos = this.pos;
    var name = this.name;
    var head = this.head;
    var body = this.body;
    var underBody = this.underBody;
    var underHead = this.underHead;
    
    //functions
    this.placeChar = function(world) {
        underBody = world[pos[1]][pos[0]];
        underHead = world[pos[1]-1][pos[0]];
        world[pos[1]][pos[0]] = body;
        world[pos[1]-1][pos[0]] = head;
    }
    var placeChar = this.placeChar;
    
    //place self
    this.placeChar(this.world);
    
    this.moveLeft = function(world) {
        if (pos[0] - 1 > 0) {
            world[pos[1]][pos[0]] = underBody;
            world[pos[1]-1][pos[0]] = underHead;
            pos[0] -= 1; 
            placeChar(world);
        }
    }

    this.moveRight = function(world) {
        if (pos[0] + 1 < size-1) {
            world[pos[1]][pos[0]] = underBody;
            world[pos[1]-1][pos[0]] = underHead;
            pos[0] += 1;
            placeChar(world);
        }
    }

    this.moveUp = function(world) {
        if (pos[1] - 2 > 0) {
            world[pos[1]][pos[0]] = underBody;
            world[pos[1]-1][pos[0]] = underHead;
            pos[1] -= 1; 
            placeChar(world);
        }
    }

    this.moveDown = function(world) {
        if (pos[1] + 2 < size - 1) {
            world[pos[1]][pos[0]] = underBody;
            world[pos[1]-1][pos[0]] = underHead;
            pos[1] += 1; 
            placeChar(world);
        }
    }
}

function TextAdventure () {
    var world, player, characters = [];
    
    //define tools
    var worldTools = new WorldTools();

    // define objects and stuff
    this.world = worldTools.makeWorld();
    this.world = worldTools.makeTerrain(this.world);
    this.player = new Character(this.world, "Jacob", [5,5], "╓╖", "╙╜");
    characters.push(this.player);
    var house = worldTools.makeHouse(20);
    this.world = worldTools.placeStructure(house, this.world, [50, 50]);
    
    //make HTML stuff
    worldTools.makeHTML(this.world, document.getElementById(container));
    
    var world = this.world;
    var player = this.player;
    function moveCharacters() {
        for (var i in characters) {
            characters.move();
        }
    }
    document.onkeydown = function(e) {
        try {
            switch (e.keyCode) {
                case 37: // left
                    player.moveLeft(world);
                    break;
                case 38: // up
                    player.moveUp(world);
                    break;
                case 39: // right
                    player.moveRight(world);
                    break;
                case 40: // down
                    player.moveDown(world);
                    break;
            }
        } catch (err) {
            //there won't be an error, this is just to have the
            //"finally" statement, even though I'm using "break"
            //after the arrow keys
        } finally {
            worldTools.makeHTML(world, document.getElementById(container));
        }
    }
}
