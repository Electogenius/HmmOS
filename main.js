var hmm = {
	restart: function(){
		window.location = window.location.href + "?r"
	}
}
hmm.storage = {
	apps:{
		test: {
			title: "test app",
			code: "Hello world <b>yes</b><I>yes</I><h1>Welcome to HmmOS!</h1>why are you here this is terribly made and buggy"
		},
	},
}
function openApp(ap) {
	var app = hmm.storage.apps[ap]
	var node = document.createElement("window")
	var tb = document.createElement("taskbar")
	tb.innerText = app.title
	var cls = document.createElement("close")
	cls.innerText = "✕"
	cls.onclick=()=>{
		event.target.parentNode.parentNode.remove()
		//console.log(event.target.parentNode)
	}
	tb.appendChild(cls)
	node.appendChild(tb)
	var content = document.createElement("windowcontent")
	content.innerHTML = app.code
	node.appendChild(content)
	var position = {x:0,y:0}
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
	
	document.getElementById("windows").appendChild(node)
}