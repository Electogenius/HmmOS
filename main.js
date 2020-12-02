//the boring variable thingies
const errtxt = document.getElementById("popup-text");
const blur = document.getElementById('darken');
const windowContainer = document.getElementById('windows');

var appnames = ['test', 'test2'];
var appcodes = {
  0: ["button", 'Click me', 'script', "document.querySelector('window button').onclick = function(){alert('you got hacked LOL'); document.querySelector('*').innerHTML = 'hi'};"],
}
var elmnt;
var active = 'window #1';
var windowsOpened = 0;
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
  var taskbar = document.createTextNode(windowname + '\n');
  var taskbardiv = document.createElement('taskbar')
  taskbardiv.id = 'window #' + windowsOpened + "header";
  taskbardiv.appendChild(taskbar);
  node.appendChild(taskbardiv)
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
  node.id = 'window #' + windowsOpened;
  document.getElementById('windows').appendChild(node); // add to window container
  dragElement(document.getElementById(active));
  elmnt = document.getElementById(active);
}//-function


//setup idk
//dragElement(document.getElementById("window #1"));
//
function dragElement(elmnt) {
  elmnt = elmnt;
  var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
  if (document.getElementById(elmnt.id + "header")) {
    // if present, the header is where you move the DIV from:
    document.getElementById(elmnt.id + "header").onmousedown = dragMouseDown;
  } else {
    // otherwise, move the DIV from anywhere inside the DIV:
    elmnt.onmousedown = dragMouseDown;
  }
}
function dragMouseDown(e) {
    e = e || window.event;
    e.preventDefault();
    // get the mouse cursor position at startup:
    pos3 = e.clientX;
    pos4 = e.clientY;
    document.onmouseup = closeDragElement;
    // call a function whenever the cursor moves:
    document.onmousemove = elementDrag;
}
function elementDrag(e) {
    e = e || window.event;
    e.preventDefault();
    // calculate the new cursor position:
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;
    // set the element's new position:
    elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
    elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
  }
  function closeDragElement() {
      // stop moving when mouse button is released:
      document.onmouseup = null;
      document.onmousemove = null;
    }
//aaaa
$(document).on('mousedown', 'window', function(){
  active = this.id;
  //dragElement(document.getElementById(activeWindow));

  elmnt = document.getElementById(active);
});
//
