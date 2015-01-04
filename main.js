window.addEventListener("keydown", function(e) {
    if([37,38,39,40].indexOf(e.keyCode) > -1) {
        e.preventDefault();
    }
}, false);

var size = 100;
var upperWall = "▄▄";
var underwall = "▀▀";
var leftWall = "▌ ";
var rightWall = " ▐";
var space = "  ";
var lightShading = "░░";
var medShading = "▒▒";
var darkShading = "▓▓";
var stones = ["▒▒"];
//var flooring1 = "▞▞";
//var flooring2 = "▚▚";
var flooring1 ="..";

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
                    for(var j=0; j < row.length; j++) {
                        row[j] = underwall;
                    }
                default:
                    if(i > 0 && i < size-1){
                        for(var j=0; j < row.length; j++) {
                            row[j] = flooring1;
                        }
                    }
                    
            }
            //place walls
            row[0] = rightWall;
            row[size-1] = leftWall;
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
            world[stonesCoord[1]][stonesCoord[0]] = stones;
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

function Character(world, name, pos, head, body) {
    var info;
    this.world = world;
    this.pos = pos;
    this.name = name;
    this.head = head;
    this.body = body;
    this.underBody = lightShading;
    this.underHead = lightShading;
    this.info = {
        "name": name,
        "pos": pos,
        "head": head,
        "body": body,
        "desc": "the peasant",
        "underHead": lightShading,
        "underBody": lightShading
    }
    
    var world = this.world;
    var pos = this.pos;
    var name = this.name;
    var head = this.head;
    var body = this.body;
    var underBody = this.underBody;
    var underHead = this.underHead;
    
    this.placeChar = function(world) {
        underBody = world[pos[1]][pos[0]];
        underHead = world[pos[1]-1][pos[0]];
        world[pos[1]][pos[0]] = body;
        world[pos[1]-1][pos[0]] = head;
    }
    var placeChar = this.placeChar;
    
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
    this.move = function(world, event) {
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
    var world, player;

    //define tools
    var worldTools = new WorldTools();

    // define objects and stuff
    this.player = new Character(this.world, "Jacob", [5,5], "╓╖", "╙╜");
    this.world = worldTools.makeWorld();
    this.world = worldTools.makeTerrain(this.world);
    this.player.placeChar(this.world);
    var house = worldTools.makeHouse(20);
    this.world = worldTools.placeStructure(house,this.world, [50, 50]);
    
    //make HTML stuff
    worldTools.makeHTML(this.world, document.getElementById("myspan"));
    
    var world = this.world;
    var player = this.player;
    document.onkeydown = function(e) {
        switch (e.keyCode) {
            case 37: // left
                window.scrollBy(-20, 0);
                player.moveLeft(world);
                worldTools.makeHTML(world, document.getElementById("myspan"));
                break;
            case 38: // up
                window.scrollBy(0, -35);
                player.moveUp(world);
                worldTools.makeHTML(world, document.getElementById("myspan"));
                break;
            case 39: // right
                window.scrollBy(20, 0);
                player.moveRight(world);
                worldTools.makeHTML(world, document.getElementById("myspan"));
                break;
            case 40: // down
                window.scrollBy(0, 35);
                player.moveDown(world);
                worldTools.makeHTML(world, document.getElementById("myspan"));
                break;
        } 
    }
}
