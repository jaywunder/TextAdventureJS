window.addEventListener("keydown", function(e) {
    if([37,38,39,40].indexOf(e.keyCode) > -1) {
        e.preventDefault();
    }
}, false);

var size = 30;
var upperWall = "▄▄";
var floor = "▀▀";
var leftWall = "▌ ";
var rightWall = " ▐";
var space = "  ";
var lightShading = "░░";
var medShading = "▒▒";
var darkShading = "▓▓";
var stones = "▒▒";
var flooring1 = "▞▞";
var flooring2 = "▚▚";
var RIGHTKEY = 124;
var UPKEY = 126;
var LEFTKEY = 123;
var DOWNKEY = 125;

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
        // Make array of arrays (world)
//        for (var i = 0; i < size; i++){
//            world.push(row);
//            world[i][0] = darkShading;
//            world[i][size - 1] = darkShading;
//        }
        //place borders in world
        world[0] = borderRow;
        world[world.length-1] = borderRow;
        return world;
    }

    this.makeTerrain = function(world) {
        var numbers = [-1, -1, 0, 0, 0, 0, 1, 1, 1, 2,];
        for (var i = 0; i < _.random(size / 10, size / 2); i++) {
            var stonesCoord = [_.random(3, size - 3), _.random(3, size - 3)];
            world[stonesCoord[1]][stonesCoord[0]] = stones;
            for (var j = 0; j < _.random(3,9); j++) {
                world[stonesCoord[1] + _.sample(numbers)][stonesCoord[0] + _.sample(numbers)] = stones;
            }
        }
        return world;
}

    this.makeHTML = function(world, div) {
        var finalString = "";
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

function CharacterTools(world, character) {
    this.createCharacter = function(_name, _pos, _head, _body) {
        var newCharacter = {
            "name": _name,
            "pos": _pos,
            "head": _head,
            "body": _body,
            "desc": "the peasant",
            "underHead": lightShading,
            "underBody": lightShading
        }
        return newCharacter;
    }
    this.placeChar = function(world, char) {
        char.underBody = world[char.pos[1]][char.pos[0]];
        char.underHead = world[char.pos[1]-1][char.pos[0]];
        world[char.pos[1]][char.pos[0]] = char.body;
        world[char.pos[1]-1][char.pos[0]] = char.head;
    }

    this.moveLeft = function(world, char) {
        if (char.pos[0] - 1 > 0) {
            world[char.pos[1]][char.pos[0]] = char.underBody;
            world[char.pos[1]-1][char.pos[0]] = char.underHead;
            char.pos[0] -= 1; 
            this.placeChar(world, char);
        }
    }

    this.moveRight = function(world, char) {
        if (char.pos[0] + 1 < size-1) {
            world[char.pos[1]][char.pos[0]] = char.underBody;
            world[char.pos[1]-1][char.pos[0]] = char.underHead;
            char.pos[0] += 1;
            this.placeChar(world, char);
        }
    }

    this.moveUp = function(world, char) {
        if (char.pos[1] - 2 > 0) {
            world[char.pos[1]][char.pos[0]] = char.underBody;
            world[char.pos[1]-1][char.pos[0]] = char.underHead;
            char.pos[1] -= 1; 
            this.placeChar(world, char);
        }
    }

    this.moveDown = function(world, char) {
        if (char.pos[1] + 2 < size - 1) {
            world[char.pos[1]][char.pos[0]] = char.underBody;
            world[char.pos[1]-1][char.pos[0]] = char.underHead;
            char.pos[1] += 1; 
            this.placeChar(world, char);  
        }
    }
    this.move = function(world, char, event) {
        switch(event.keyCode) {
            case 37: // left
                break;
            case 38: // up
                break;
            case 39: // right
                break;
            case 40: // down
                break;
        }
    }
}

function TextAdventure () {
    var world, player, worldWithChar;

    //define tools
    var charTools = new CharacterTools();
    var worldTools = new WorldTools();

    // define objects and stuff
    this.player = charTools.createCharacter("Jacob", [5,5], "╓╖", "╙╜");
    this.world = worldTools.makeWorld();
    charTools.placeChar(this.world, this.player);
    
    //make HTML stuff
    worldTools.makeHTML(this.world, document.getElementById("myspan"));
    
    var world = this.world;
    var player = this.player;
    document.onkeydown = function(e) {
        switch (e.keyCode) {
            case 37: // left
                charTools.moveLeft(world, player);
                worldTools.makeHTML(world, document.getElementById("myspan"));
                break;
            case 38: // up
                charTools.moveUp(world, player);
                worldTools.makeHTML(world, document.getElementById("myspan"));
                break;
            case 39: // right
                charTools.moveRight(world, player);
                worldTools.makeHTML(world, document.getElementById("myspan"));
                break;
            case 40: // down
                charTools.moveDown(world, player);
                worldTools.makeHTML(world, document.getElementById("myspan"));
                break;
        }
    }
}
