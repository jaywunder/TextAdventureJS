window.addEventListener("keydown", function(e) {
  if([37,38,39,40].indexOf(e.keyCode) > -1) {
    e.preventDefault();
  }
}, false);

function TextAdventure () {
  var world, player; 
  var characters = []; 
  var worldPos = [0,0];
  
  //  define tools
  var worldTools = new WorldTools();

  //  make world
  this.world = worldTools.makeWorld();
  this.world = worldTools.makeTerrain(this.world);
  
  //  make characters
  this.player = new Player(this.world, "Jacob", [5,5], "╓╖", "╙╜");
  var npc1 = new NPC(this.world, "npc1", [12,12], "╓╖", "╙╜");
  characters.push(npc1);
  
  //  make structures
  var house = worldTools.makeHouse(20);
  this.world = worldTools.placeStructure(house, this.world, [50, 50]);
  
  //  make HTML
  var worldSection = worldTools.getSection(this.world, worldPos);
  worldTools.makeHTML(worldSection, document.getElementById(container));
  
  //  put into bigger scope for other functions
  var world = this.world;
  var player = this.player;
  var sectionWidth = worldSection[0].length;
  var sectionHeight = worldSection.length;
  function updateCharacters() {
    for (i in characters) {
      characters[i].update(world);
    }
    var worldSection = worldTools.getSection(world, worldPos);
    worldTools.makeHTML(worldSection, document.getElementById(container));
  }
  window.setInterval(updateCharacters, 300);
  
  $(window).on("resize", function(){
    var worldSection = worldTools.getSection(world, worldPos);
    worldTools.makeHTML(worldSection, document.getElementById(container));
    npc1.moveDown(world)
  });
  
  function updateHTML() {
    var worldSection = worldTools.getSection(world, worldPos);
    worldTools.makeHTML(worldSection, document.getElementById(container));
  }
  window.setInterval(updateHTML, 10);
}