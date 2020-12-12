//file system
var storage = {
  "private": {
    'version.str': "beta 2",
  },
  "stored": {
    "text.str": "true",
    "haha.ra": ['hi', 'wow'],
    "desktop": {
      'yes.str': 'bruh'
    }
  },
  'wow.str': 'clap clap wow',
}
var node = document.createElement('window');
//the boring variable thingies
const errtxt = document.getElementById("popup-text");
const blur = document.getElementById('darken');
const windowContainer = document.getElementById('windows');
var active = ''
var appcodes = {
  'test': ["button", 'Click me', 'h1', 'wwwwwwwww', 'script', "document.querySelector('window button').onclick = function(){alert('you got hacked LOL'); document.querySelector('*').innerHTML = 'hi'};"],
  "fileExplorer": ['div', '', 'style', `
  fefile{
    display: block;
    font-size: 15px;
    background-color: #333;
  }
  fefolder{
    display: block;
    font-size: 15px;
    background-color: #fa0;
    border-bottom: 1px solid #000;
  }
  `,
  'script',
  `
  var feDirectory = storage
  var feContainer = document.getElementById('0offileExplorer');

feGetFilesaddElements();
$('fefolder').click(function(){
  feDirectory = feDirectory[this.innerHTML];
  feGetFilesaddElements();
  feGetFilesaddElements();
});
$('fefile').click(function(){
  alert(feDirectory[this.innerHTML]);
  feGetFilesaddElements();
})
  `
],
'tempJS': ['p', '', 'form', '', 'script', `
var tjs_form = document.getElementById('1oftempJS');
appendNewElement('input', '', tjs_form);
tjs_form.elements[0].value
document.getElementById('3oftempJS').onclick = function(){
  appendNewElement('script', tjs_form.elements[0].value, document.querySelector('head'))
}
`, 'button', 'Enter']
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
function openWindow(appID, custom){
  //get the code and stuff
  var classCount = 0;
  var windowname;
  var windowcode;
  if (!custom) {
    windowcode = appcodes[appID];
  }else{
    windowcode = appID;
    windowname = '';
  }
  var windowname = appID;
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

  var taskbar = document.createTextNode('' + windowname + '');
  var taskbardiv = document.createElement('taskbar')
  taskbardiv.id = 'windowId' + windowsOpened + "header";
  taskbardiv.appendChild(taskbar);
  taskbardiv.class = "windowTitle" + windowsOpened;
  node.appendChild(taskbardiv)
  //close
  //dont mind recycling of vars
  taskbar = document.createTextNode('X');
  taskbardiv = document.createElement('close');
  taskbardiv.appendChild(taskbar);
  taskbar.addEventListener('click', alert('no'));
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
function appendNewElement(ae_name, ae_content, ae_element) {
  var ae_node = newElement(ae_name, ae_content);
  ae_element.appendChild(ae_node);
}
function newElement(ne_tagname, ne_content) {
  var ne_textnode = document.createTextNode(ne_content)
  var ne_node = document.createElement(ne_tagname)
  ne_node.appendChild(ne_textnode)
  return ne_node;
}
$(document).on("click", 'taskbar', function(){
  active = this.id;

});
function closewindo() {
  alert('no')
}
function feGetFilesaddElements(){
  feContainer.innerHTML = ''
for (fefile in feDirectory) {
  var fecurrentfile = feDirectory[fefile]
  //check if folder or file

  if (typeof fecurrentfile == "string"){
    appendNewElement('fefile', fefile, feContainer);

  }else{
    appendNewElement('fefolder', fefile, feContainer);
  }
}
}
