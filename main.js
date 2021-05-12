function e(query) {
	return document.querySelector(query)
}
var hmm = {
	restart: function() {
		window.location = window.location.href
	},
	opts: {
		lang: "en"
	},
	safe: {}
}
hmm.storage = {
	apps: {
		"test.hmm": {
			title: "testapp",
			type: "js",
			code: "	"
		},
		"cmd.hmm": {
			title: "Terminal",
			type: 0,
			code: ``
		}
	}
}
hmm.bar = document.getElementById("bar")
hmm.bar.toggle = function() {
	if (!hmm.bar.isOpen) {
		anime({
			targets: "#menu",
			width: "99vw",
			opacity: 0.9,
			padding: 1,
			easing: "easeInOutQuad",
			duration: 500,
			fontSize: "20px"
		})
	} else {
		anime({
			targets: "#menu",
			width: 0,
			opacity: 0,
			padding: 0,
			easing: "easeInOutQuad",
			duration: 500,
			fontSize: 0
		})
	}
	hmm.bar.isOpen = !hmm.bar.isOpen
}
hmm.openApp = function(app) {
	if(app in hmm.storage.apps && app.endsWith(".hmm")){
		var a = new hmm.App(app)
		a.open()
	}
}
hmm.App = class {
	constructor(name) {
		this.code = hmm.storage.apps[name].code
		this.title = hmm.storage.apps[name].title
		this.type = hmm.storage.apps[name].type
	}
	open() {
		var node = document.createElement("window")
		var tb = document.createElement("taskbar")
		tb.innerText = this.title
		var cls = document.createElement("close")
		cls.innerText = "✕"
		cls.onclick = (event) => {
			event.target.parentNode.parentNode.remove()
			//console.log(event.target.parentNode)
		}
		tb.appendChild(cls)
		node.appendChild(tb)
		var fs = document.createElement("fullscreen")
		fs.classList.add("material-icons")
		fs.innerHTML = "fullscreen"
		tb.appendChild(fs)
		fs.onclick = function(event) {
			event.target.parentNode.parentNode.style.height = "90vh"
			event.target.parentNode.parentNode.style.width = "95vw"
			event.target.parentNode.parentNode.style.transform = "translate(0, 0)"
			position = { x: 0, y: 0 }
		}
		var content = document.createElement("windowcontent")
		if(this.type === undefined){
			content.innerHTML = this.code
		}else if(this.type="js"){
			var x = new Function("document", "window", this.code)
			setTimeout(()=>x(content, node),100)
		}
		node.appendChild(content)
		var position = { x: 0, y: 0 }
		interact(node).draggable({
			allowFrom: "taskbar",
			modifiers: [],
			listeners: {
				start(event) {},
				move(event) {
					position.x = Math.max(position.x + event.dx, 0);
					position.y = Math.max(position.y + event.dy, 0);
					event.target.style.transform = `translate(${Math.max(0,position.x)}px, ${Math.max(0,position.y)}px)`;
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
				width: `${Math.max(event.rect.width,50)}px`,
				height: `${Math.max(event.rect.height,50)}px`
			})
			Object.assign(event.target.dataset, { x, y })
		});
		document.getElementById("windows").appendChild(node)
	}
}
setInterval(e=>{
	document.querySelectorAll(".h-time").forEach(e=>{
		e.innerText = new Date().toLocaleTimeString(hmm.opts.lang)
	})
	document.querySelectorAll(".h-date").forEach(e=>{
		e.innerText = new Date().toLocaleDateString(hmm.opts.lang)//.toLocaleDateString(hmm.opts.lang)
	})
},1e3)
hmm.setMenu=()=>{
	Object.keys(hmm.storage.apps).sort().forEach(app=>{
		let ap = hmm.storage.apps[app]
		var el = document.createElement("t")
		el.classList.add("menu-app")
		el.innerText = ap.title
		el.filename = app
		el.onclick = e=>{
			hmm.openApp(e.target.filename);
			hmm.bar.toggle()
		}
		document.getElementById("apps")?.appendChild(el)
	})
}
//setup
document.getElementById("menu").innerHTML = `
<close onclick="hmm.bar.toggle()">✕</close>
<h1><span class="h-time"></span><br><span class="h-date"></span></h1>
<h2>Apps</h2>
<div id="apps">
</div>

`
hmm.setMenu()