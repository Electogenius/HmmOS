var hmm = {
	restart: function() {
		window.location = window.location.href
	}
}
hmm.storage = {
	apps: {
		test: {
			title: "testapp",
			code: "Hello world <b>yes</b><I>yes</I><h1>Welcome to HmmOS!</h1>why are you here this is terribly made and buggy"
		},
		
	},
}
hmm.openApp = function(app) {
	var a = new hmm.App(app)
	a.open()
}
hmm.App = class {
	constructor(name) {
		this.code = hmm.storage.apps[name].code
		this.title = hmm.storage.apps[name].title
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
			console.log("fullscreen");
			event.target.parentNode.parentNode.style.height = "90vh"
			event.target.parentNode.parentNode.style.width = "95vw"
			event.target.parentNode.parentNode.style.transform = "translate(0, 0)"
			position = {x:0,y:0}
		}
		var content = document.createElement("windowcontent")
		content.innerHTML = this.code
		node.appendChild(content)
		var position = { x: 0, y: 0 }
		interact(node).draggable({
			allowFrom: "taskbar",
			modifiers: [],
			listeners: {
				start(event) {},
				move(event) {
					position.x = Math.max(position.x+event.dx, 0);
					position.y = Math.max(position.y+event.dy, 0);
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