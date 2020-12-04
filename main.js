//file system
var storage = {
  "private": {

  }
}
var node = document.createElement('window');
//the boring variable thingies
const errtxt = document.getElementById("popup-text");
const blur = document.getElementById('darken');
const windowContainer = document.getElementById('windows');
var active = ''
var appnames = ['test', 'test2'];
var appcodes = {
  0: ["button", 'Click me', 'h1', 'wwwwwwwww', 'script', "document.querySelector('window button').onclick = function(){alert('you got hacked LOL'); document.querySelector('*').innerHTML = 'hi'};"],
}
var elmnt;
var windowsOpened = 0;
var xOffset, yOffset;
//function defining
function toggleblur() {
  $(".darken").toggle();
};

function togglePopup() {
  toggleblur();
  $(".popup").toggle();
};

function openWindow(appID){
  //get the code and stuff
  var classCount = 0;
  var windowcode = appcodes[appID];
  var windowname = appnames[appID];
  var node = document.createElement("window"); //make a node (for the app)
  //decode the windowcode
  //title bar (named taskbar)
  const position = { x: 0, y: 0 }



interact(node).draggable({
      allowFrom: 'taskbar',
      modifiers: [

      ],
      listeners: {
        start (event) {

        },
        move (event) {
          position.x += event.dx
          position.y += event.dy

          event.target.style.transform =
            `translate(${position.x}px, ${position.y}px)`
        },
      }
    })

  var taskbar = document.createTextNode(windowname + '');
  var taskbardiv = document.createElement('taskbar')
  taskbardiv.id = 'windowId' + windowsOpened + "header";
  taskbardiv.appendChild(taskbar);
  taskbardiv.class = "windowTitle" + windowsOpened;
  node.appendChild(taskbardiv)
  //close
  taskbar = document.createTextNode('X');
  taskbardiv = document.createElement('close');
  taskbardiv.appendChild(taskbar);
  taskbardiv.id = "closeButton" + windowsOpened;

  node.appendChild(taskbardiv);
  //aaa
  var line;
  for (i = 0; i < windowcode.length; i++){
    line = windowcode[i];
    var textnode = document.createTextNode(line)
    if (i % 2 == 0){

      var tag = document.createElement(line);
      tag.id = classCount + 'of' + appID;
      classCount+= 1;
    }else {
      tag.appendChild(textnode);
      node.appendChild(tag);
    };//-if

  };//-for
  windowsOpened++;
  node.id = 'windowId' + windowsOpened;
  document.getElementById('windows').appendChild(node); // add to window container

  elmnt = document.getElementById(active);
}//-function

// Gettervar disabled = $( "hi" ).draggable( "option", "disabled" );

// Setter$( "hi" ).draggable( "option", "disabled", true );

//setup idk
//dragElement(document.getElementById("window #1"));

$(document).on("click", 'taskbar', function(){
  active = this.id;
  //dragElement(document.getElementById(activeWindow));

});
