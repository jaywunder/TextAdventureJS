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
            row = world[i].join('');
            node = document.createTextNode(row);
            br = document.createElement("br");
//            para.appendChild(node);
//            para.appendChild(br);
            h2.appendChild(node);
            h2.appendChild(br);
        }
    }
}

function Character(world, name, pos, head, body) {
    //initialize variables
    this.world = world;
    this.pos = pos;
    this.name = name;
    this.head = head;
    this.body = body;
    this.underBody = world[pos[1]][pos[0]];
    this.underHead = world[pos[1]-1][pos[0]];
    
    //put variables in larger scope
    var world = this.world;
    var pos = this.pos;
    var name = this.name;
    var head = this.head;
    var body = this.body;
    var underBody = this.underBody;
    var underHead = this.underHead;
    
    //functions
    this.x = function() {
        return pos[0]
    }
    this.y = function() {
        return pos[1]
    }
    
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
    var world, player, characters = [], worldPos = [0,0];
    
    //define tools
    var worldTools = new WorldTools();

    // define objects and stuff
    this.world = worldTools.makeWorld();
    this.world = worldTools.makeTerrain(this.world);
    this.player = new Character(this.world, "Jacob", [5,5], "╓╖", "╙╜");
    characters.push(this.player);
    var house = worldTools.makeHouse(20);
    this.world = worldTools.placeStructure(house, this.world, [50, 50]);
    
    var worldSection = worldTools.getSection(this.world, worldPos);
    
    //make HTML stuff
    worldTools.makeHTML(worldSection, document.getElementById(container));
    
    var world = this.world;
    var player = this.player;
    var sectionWidth = worldSection[0].length;
    var sectionHeight = worldSection.length;
    
    $(window).on("resize", function(){
        var worldSection = worldTools.getSection(world, worldPos);
        worldTools.makeHTML(worldSection, document.getElementById(container));
    });
    
    document.onkeydown = function(e) {
        var worldSection = worldTools.getSection(world, worldPos);
        var sectionWidth = worldSection[0].length;
        var sectionHeight = worldSection.length;
        try {
            switch (e.keyCode) {
                case 37: // left
                    player.moveLeft(world);
                    if (player.x() < worldPos[0] + (sectionWidth / 6) 
                        && worldPos[0] > 0) {
                        worldPos[0] -= 1;
                    }
                    break;
                case 38: // up
                    player.moveUp(world);
                    if (player.y() < worldPos[1] + (sectionHeight / 6) 
                        && worldPos[1] > 0) {
                        worldPos[1] -= 1;
                    }
                    break;
                case 39: // right
                    player.moveRight(world);
                    if (player.x() > sectionWidth - (sectionWidth / 6) 
                       && worldPos[0] + sectionWidth < world[0].length) {
                        worldPos[0] += 1;
                    }
                    break;
                case 40: // down
                    player.moveDown(world);
                    if (player.y() > sectionHeight - (sectionHeight / 6)
                       && worldPos[1] + sectionHeight < world.length) {
                        worldPos[1] += 1;
                    }
                    break;
            }
        } catch (err) {
            //there won't be an error, this is just to have the
            //"finally" statement, even though I'm using "break"
            //after the arrow keys
        } finally {
            var worldSection = worldTools.getSection(world, worldPos);
            worldTools.makeHTML(worldSection, document.getElementById(container));
            $("#bottom-text").text(worldPos);
        }
    }
}
