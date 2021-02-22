const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0)
const vh = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0)
class appWindow {
	constructor(title, content) {
		this.title = title;
		this.content = content;
	}

	display() {
		var node = document.createElement('window');
		let g = document.createElement('taskbar');
		var taskbar = document.createTextNode("X");
		var taskbardiv = document.createElement("close");
		taskbardiv.appendChild(taskbar);
		g.appendChild(taskbardiv);
		g.innerHTML += this.title;
		node.appendChild(g);
		let y = document.createElement('windowcontent');
		y.innerHTML = this.content;
		node.appendChild(y);
		//draggy resizo
		const position = { x: 0, y: 0 };
		const positiona = { x: 0, y: 0 }
		interact(node).draggable({
			allowFrom: "taskbar",
			modifiers: [],
			listeners: {
				start(event) {},
				move(event) {
					position.x += event.dx;
					position.y += event.dy;
					event.target.style.transform = `translate(${position.x}px, ${position.y}px)`;
				}
			}
		})

		interact(node).resizable({
			edges: {
				top: false,
				left: false,
				bottom: true,
				right: true
			}
		}).on('resizemove', event => {
			let { x, y } = event.target.dataset;

			Object.assign(event.target.style, {
				width: `${event.rect.width}px`,
				height: `${event.rect.height}px`
			})

			Object.assign(event.target.dataset, { x, y })
		});
		document.getElementById("windows").appendChild(node); // add to window container
		document.querySelector('close').onclick = function() {
			windowsOpened--;
			this.parentNode.parentNode.remove();
		};
		windowsOpened++
	}
}
//file system
var storage = {
	private: {
		"version.str": "alpha 5.4"
	},
	appData: {
		tempJS: {
			"commands.str": ``
		}
	},
	stored: {
		"text.str": "true",
		"haha.ra": ["hi", "wow"],
		desktop: {
			"yes.str": "yes"
		}
	},
	"wow.str": "clap clap wow"
};
var node = document.createElement("window");
//the boring variable thingies
const errtxt = document.getElementById("popup-text");
const blur = document.getElementById("darken");
const windowContainer = document.getElementById("windows");
var active = "";
var isnotifsopen = false;
var appcodes = {
	/*yay new method*/
	hub: `
<h1>Hub thingy<h1>
<div id='hhtabs'></div>
  `
};
var windowsOpened = 0;
var xOffset, yOffset;
//function defining
function toggleblur() {
	$(".darken").toggle();
}

function togglePopup() {
	toggleblur();
	$(".popup").toggle();
}

function openWindow(appID, custom) {
	//get the code and stuff
	var classCount = 0;
	var windowname;
	var windowcode;
	if (custom == false) {
		windowcode = appcodes[appID];
	} else {
		windowcode = appID;
		windowname = custom;
	}
	var windowname = appID;
	var node = document.createElement("window"); //make a node (for the app)
	//decode the windowcode
	//title bar (named taskbar)
	const position = { x: 0, y: 0 };

	interact(node).draggable({
		allowFrom: "taskbar",
		modifiers: [],
		listeners: {
			start(event) {},
			move(event) {
				position.x += event.dx;
				position.y += event.dy;

				event.target.style.transform = `translate(${position.x}px, ${position.y}px)`;
			}
		}
	})

	interact(node).resizable({
		edges: {
			top: false,
			left: false,
			bottom: true,
			right: true
		}
	}).on('resizemove', event => {
		let { x, y } = event.target.dataset;

		Object.assign(event.target.style, {
			width: `${event.rect.width}px`,
			height: `${event.rect.height}px`
		})

		Object.assign(event.target.dataset, { x, y })
	});

	var taskbar;
	if (!custom) {
		taskbar = document.createTextNode("" + windowname + "");
	} else {
		taskbar = document.createTextNode("");
	}
	var taskbardiv = document.createElement("taskbar");
	taskbardiv.id = "windowId" + windowsOpened + "header";
	taskbardiv.appendChild(taskbar);
	taskbardiv.id = "windowTitle" + windowsOpened;
	node.appendChild(taskbardiv);
	//close
	//dont mind recycling of vars
	taskbar = document.createTextNode("X");
	taskbardiv = document.createElement("close");
	taskbardiv.appendChild(taskbar);
	taskbardiv.onclick = function() {
		windowsOpened--;
		this.parentNode.remove();
	};
	taskbardiv.id = "closeButton" + windowsOpened;

	node.appendChild(taskbardiv);
	//aaa
	var line;
	for (i = 0; i < windowcode.length; i++) {
		line = windowcode[i];
		var textnode = document.createTextNode(line);
		if (i % 2 == 0) {
			var tag = document.createElement(line);
			tag.id = classCount + "of" + appID;
			classCount += 1;
		} else {
			tag.appendChild(textnode);
			node.appendChild(tag);
		} //-if
	} //-for
	windowsOpened++;
	node.id = "windowId" + windowsOpened;
	document.getElementById("windows").appendChild(node); // add to window container
	//add icon to bar
	addToBar(appID, "#fff", appID.charAt(0));
	elmnt = document.getElementById(active);
} //-function
function appendNewElement(ae_name, ae_content, ae_element) {
	var ae_node = newElement(ae_name, ae_content);
	ae_element.appendChild(ae_node);
}

function newElement(ne_tagname, ne_content) {
	var ne_textnode = document.createTextNode(ne_content);
	var ne_node = document.createElement(ne_tagname);
	ne_node.appendChild(ne_textnode);
	return ne_node;
}
$(document).on("click", "taskbar", function() {
	active = this.id;
});

function closewindo() {
	alert("no");
}

function feGetFilesaddElements() {
	feContainer.innerHTML = "";
	var fefile = "";
	for (fefile in feDirectory) {
		var fecurrentfile = feDirectory[fefile];
		//check if folder or file

		if (typeof fecurrentfile == "string") {
			appendNewElement("fefile", fefile, feContainer);
		} else {
			appendNewElement("fefolder", fefile, feContainer);
		}
	}
	$('fefolder').onclick = function() {
		feDirectory = feDirectory[this.innerHTML];
		feGetFilesaddElements();
		feGetFilesaddElements();
	}
	$('fefile').onclick = function() {
		alert(feDirectory[this.innerHTML]);
		feGetFilesaddElements();
	}
}

function addToBar(atb_name, atb_color, atb_iconhtm) {
	document.getElementById("bar").innerHTML +=
		"<baritem>" + atb_iconhtm + "</baritem>";
}
$(document).ready(function() {

	openWindow('settings', false);
});
$('body').bind('contextmenu', function() { //i think it removes the right click menu
	return false;
});
//redirect from Nothing
if (document.referrer.startsWith('https://liimee.github.io') || document.referrer.includes('vercel.app') || document.referrer.includes('bit.ly') || document.referrer.includes('.tinyurl.')) {
	alert("you're already in the best OS, and no HmmOS is not better. And if you came here from bit.ly or vercel.app, NOPE LOL")
	window.history.back();
}
//rickroll for iframes
aaa = window.location.href
if (window.location !== window.parent.location && !aaa.startsWith("http://localhost:")) {
	document.write('<iframe width="420" height="345" src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1" frameborder="0" allowfullscreen></iframe>')
}
//modern app maker
function openApp(code, name) {
	var openwin = new appWindow(name, code);
	openwin.display();
}
function newNotif(heading, body) {
	var node = document.createElement('notif')
	node.innerHTML = '<b class="block">' + heading + '</b>' + body
	document.getElementById('notifs').appendChild(node)
}
$(document).ready(function() {})
document.onclick = function() {
	document.querySelector('audio').play()
	document.onclick = function() {}
	newNotif('Welcome!', 'Hello there, this is the worst OS');
}
window.onload = function() {
	document.querySelector('#start').ondblclick = function() {
		if (!isnotifsopen) {
			$('notif').addClass('open')
		} else {
			$('notif').removeClass('open')
		}
		isnotifsopen = !isnotifsopen
	}
	// "boot"
	var xa = 0;
	setTimeout(function(){
	document.getElementById('darken').onclick = function(){
			setInterval(function(){
				document.querySelector('#darken').style.opacity = 1-xa
					xa += 0.1
				if (false) {
					document.getElementById('darken').style.display = 'none'
				}
			}, 50)
		}
	}, 100)
}
function restart() {
	document.querySelector('#darken').style.display = 'block'
	var xa = 0
	setInterval(function() {
		document.querySelector('#darken').style.opacity = xa
		xa += 0.05
		if (xa = 0) {
			document.querySelector('#darken').style.opacity = 1;
		}
	}, 30)
}
console.log('hello')
