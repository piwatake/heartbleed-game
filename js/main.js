/*
 * entry point, glue code
 * K. Delaney
 * R. Murrer
 */

var sounds = ["/sounds/key1.mp3","/sounds/key2.mp3","/sounds/key3.mp3","/sounds/key4.mp3","/sounds/key5.mp3"];

$(document).ready(function() {
  //generate addresses
  // make sure it is high enough so that it takes up 4 hex places (could add padder?)
  var address = 4500 + Math.floor(Math.random() * 50000);   
  var formatter = function(x) { return "<p>0x" + x.toString(16) + "</p>";  };

  // start column1
  var abuffer = "";
  for (var i=0; i<17; i++)
  {
    abuffer += formatter(address);
    address += 96; // 12 chars * 8 bits
  }
  $('#addresses-1').html(abuffer);


  // start column2 
  abuffer = "";
  for (var i=0; i<17; i++)
  {
    abuffer += formatter(address);
    address += 96; // 12 chars * 8 bits
  }
  $('#addresses-2').html(abuffer);
    
  //init components
  var display = new view_module.MemoryDisplay('#terminal-container');
  var messageBox = new view_module.MessageBox('#console');
  var soundManager = new soundmanager_module.SoundManager(sounds);
  var memory = new game_module.MemoryContents();
  var game = new game_module.HeartbleedGame(memory, soundManager);
  
  //attach handlers
  $('#power').click(function(){
    game.reset();
  });
  game.onMessage = $.proxy(messageBox.add, messageBox);
  memory.onChange = $.proxy(display.change, display);
  memory.onReset = $.proxy(display.reset, display);
  game.onReset = $.proxy(messageBox.clear, messageBox);
  display.onSelection = $.proxy(game.tryItem, game);
  display.onHover = function() {
    soundManager.play("key1");
  }
  
  //set up simple gui elements
  var triesBox = $('#tries');  
  game.onTriesChange = function(num) {
    var blocks = "";
    for(var i = 0; i < num; i++) {
      blocks += "# ";
    }
    triesBox.html('<span id="number-attempts">'+num+'</span> ATTEMPT(S) LEFT: <span id="blocks">'+blocks+'</span>');
  }
  
  //begin
  game.reset();
});
