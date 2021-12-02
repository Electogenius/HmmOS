function e(query) {
	return document.querySelector(query)
}
window.hmm = {
	testcommand: function () {
		hmm.openApp("textpad.hmm", "$open /apps/textpad.hmm/code");
	},
	restart: function () {
		window.location = window.location.href
	},
	safe: {},
	hasPerms: (name, filename) => {
		return eval("hmm.storage['.pr'].perms." + name).includes(filename + " ")
	},
	l: {},
	t: phrase => {
		return hmm.l[hmm.storage.opts.lang]?.t(phrase)
	},
	reset() {
		hmm.storage = null
		localforage.setItem('hmm-fs', hmm.storage)
		location = location.href
	},
	pathToJs(p) {
		var cr = hmm.storage;
		(p.match(/\/[^/]+/g) || []).forEach((e) => cr = cr[e.slice(1)])
		return cr
	},
	pathToDot(p) {
		return "hmm.storage[atob('" + p.replace(/^\//, "").split('/').map(btoa).join("')][atob('") + "')]"
	},
	mtt:{//empty shell interface
		err(){},
		echo(){}
	}
}

hmm.storage = {
	name: "HmmOS (tm)",
	apps: {
		"app.hmm": {
			title: { en: "Test app", cd: "edhō" },
			type: "iframe",
			code: `
<script>
	onload=()=>{
		console.log(window.parent)
	}
</script>
`
		},
		"terminal.hmm": {
			title: { en: "Terminal" },
			type: 0,
			code: `shmm`
		},
		"settings.hmm": {
			title: { en: "settings", cd:"māthrdhng" },
			type: "iframe",
			code: "<script>location='./settings.html'</script>",
		},
		"fe.hmm": {
			title: { en: "Files", cd:"kōpnge" },
			type: "iframe",
			code: `<script id=start>
			window.onmessage=e=>window.arg=e.data
			fetch('./fe.html').then(e=>e.text()).then(e=>{
				document.body.innerHTML=e
				document.querySelectorAll('script:not(#start)').forEach(e=>{eval(e.innerHTML)})
			})
			</script>`
		},
		"textpad.hmm": {
			title: { en: "TextPad" },
			type: "iframe",
			code: `
			<textarea id=t contenteditable=true style="
			font-family:menlo,monospace;
			border:1px solid #fff;
			white-space:nowrap;
			overflow:auto;
			resize:none;
			position:absolute;
			top:0;left:0;
			height:95%;
			width:95%
			"></textarea>
			<script>setTimeout(()=>{if((window.arg||'').startsWith("$open ")){
				t.value=window.parent.hmm.pathToJs(window.arg)
				t.oninput=()=>{
					eval("window.top."+window.parent.hmm.pathToDot(window.arg.slice(6))+"=t.value")
				}
			}},100)</script>
			`
		}
	},
	opts: {
		lang: 'en'
	},
	".pr": {
		perms: {
			iframe: {
				"nosandbox": "vscodish.hmm opts.hmm fe.hmm "
			}
		},
		handlers: {
			'/': 'fe.hmm'
		}
	}
}

window.onload = () => {
	localforage.getItem("hmm-fs").then((val) => {
		if (null !== val) {
			hmm.storage = val
		} else {
			localforage.setItem('hmm-fs', hmm.storage)
		}
		hmm.setup()
	})
}
hmm.bar = document.getElementById("bar")
hmm.bar.toggle = function () {
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
hmm.openApp = function (app, arg) {
	if (app in hmm.storage.apps && app.endsWith(".hmm")) {
		var a = new hmm.App(app)
		a.open(arg)
	}
}
hmm.El = class {
	"#el" = {};
	constructor(tagname, text) {
		this.tagname = tagname
		if (tagname == "script") this.tagname = "div"
		this.text = text
		this["#el"] = document.createElement(tagname)
	}
}
hmm.App = class {
	constructor(name) {
		this.code = hmm.storage.apps[name].code
		this.title = hmm.storage.apps[name].title
		this.type = hmm.storage.apps[name].type
		this.filename = name
		this.obj = hmm.storage.apps[name]
		this.baritem = document.createElement("baritem")
		this.baritem.innerText = (this.title[hmm.storage.opts.lang] || this.filename.slice(0, -4))[0]
	}
	open(arg) {
		var node = document.createElement("window")
		var tb = document.createElement("taskbar")
		tb.appendChild(document.createElement("span"))
		tb.children[0].innerText = this.title[hmm.storage.opts.lang] || this.filename.slice(0, -4)
		var cls = document.createElement("close")
		cls.innerText = "✕"
		cls.onclick = (event) => {
			event.target.parentNode.parentNode.remove()
			this.baritem.remove()
			// console.log(event.target.parentNode)
		}
		tb.appendChild(cls)
		node.appendChild(tb)
		var fs = document.createElement("fullscreen")
		fs.classList.add("material-icons")
		fs.innerHTML = "fullscreen"
		tb.appendChild(fs)
		var me = this
		fs.onclick = function (event) {
			event.target.parentNode.parentNode.style.height = "100%"
			event.target.parentNode.parentNode.style.width = window.innerWidth + "px"
			event.target.parentNode.parentNode.style.transform = "translate(0, 0)"
			me.width = Number(event.target.parentNode.parentNode.style.width.slice(0, -2))
		}
		var content = document.createElement("windowcontent")
		/*if (this.type == "js") {
			var x = new Function("document", "window", "hmm", "$", "with(hmm){" + this.code + "}")
			setTimeout(() => x({}, {}, hmm.hmmVar(content, this.filename), hmm.hmmVar(content, this.filename).el), 100)
		} else */
		if (this.type == 0) {
			hmm.$(this.code,hmm.mtt)
			return
		}
		/*else if (this.type == "egc-canvas") {
			EGCode.setup = "EGCode.resetVals();EGCode.context=cont;EGCode.stdFuns.hmmget=hg"
			let c = document.createElement("canvas")
			new Function("cont", "hg", EGCode.compileToJS(this.code))(c.getContext("2d"), (q) => {
				if (q == "width") return this.width
			})
			c.classList.add("win")

			c.width = window.innerWidth
			c.height = window.innerHeight

			content.style.overflow = "hidden"
			content.appendChild(c)

		} else */
		if (this.type == "iframe") {
			var n = document.createElement("iframe")
			if (!hmm.hasPerms("iframe.nosandbox", this.name)) n.sandbox = "allow-scripts allow-forms allow-presentation allow-modals allow-same-origin"
			n.srcdoc = "<link rel=stylesheet href=style.css /><style>body{overflow:auto}</style>" + this.code
			n.classList.add("win")
			content.style.overflow = "hidden"
			content.appendChild(n)
			setTimeout(() => { n.contentWindow.arg = arg }, 100)
		}

		node.appendChild(content)
		var position = { x: 0, y: 0 }
		interact(node).draggable({
			allowFrom: "taskbar",
			modifiers: [],
			inertia: true,
			listeners: {
				start(event) {
					if (Math.abs(position.y - window.innerHeight) < 30) {
						position.y -= 90
						event.target.style.transform = `translate(${Math.max(0, position.x)}px, ${Math.max(0, position.y)}px)`;
					}
				},
				move(event) {
					position.x = Math.max(position.x + event.dx, 0);
					position.y = Math.max(position.y + event.dy, 0);
					if (position.y > window.innerHeight - 50) {
						position.y = window.innerHeight - 30
					}
					event.target.style.transform = `translate(${Math.max(0, position.x)}px, ${Math.max(0, position.y)}px)`;
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
				width: `${Math.max(event.rect.width, 100)}px`,
				height: `${Math.max(event.rect.height, 100)}px`
			})
			Object.assign(event.target.dataset, { x, y })
			this.width = Number(event.target.style.width.slice(0, -2))
		});
		this.width = Math.min(window.innerWidth, 300)
		document.getElementById("windows").appendChild(node)
		document.getElementById("bar").appendChild(this.baritem)
	}
}
setInterval(e => {
	document.querySelectorAll(".h-time").forEach(e => {
		e.innerText = new Date().toLocaleTimeString(hmm.storage.opts.lang)
	})
	document.querySelectorAll(".h-date").forEach(e => {
		e.innerText = new Date().toLocaleDateString(hmm.storage.opts.lang) //.toLocaleDateString(hmm.storage.opts.lang)
	})
}, 1e3)
hmm.setMenu = () => {
	Object.keys(hmm.storage.apps).sort().forEach(app => {
		let ap = hmm.storage.apps[app]
		var el = document.createElement("t")
		el.classList.add("menu-app")
		el.innerText = ap.title[hmm.storage.opts.lang] || app.slice(0, -4)
		el.filename = app
		el.onclick = e => {
			hmm.openApp(e.target.filename);
			hmm.bar.toggle()
		}
		document.getElementById("apps").appendChild(el)
	})
}
hmm.console = (e, run) => {//TODO: fix this mess
	e.ln = 0
	let p = 1,
		torun = ""
	let term = $(e).terminal((c, t) => {
		let run = e => hmm.$({ echo: t.echo, err: t.error }, e)
		function ask(r) {
			if (r === null) {
				ask();
			} else {
				if (r.endsWith("{") || r.endsWith("[")) p++;
				if (r.startsWith("]") || r.startsWith("}")) p--;
				if (p > 1) {
					torun += r + "\n";
				}
				if (p === 1) {
					if (r !== "}" && r !== "]") {
						run(r);
					} else {
						run(torun + r);
						torun = "";
					}
				}
				if (c.trim() == "clear()") t.clear()
				// ask();
				//t.echo(p)
			}
		}
		ask(c)
	}, {
		greetings: "[[g;white;]HmmOS terminal (useless)\nenter 'help' for help]",
		prompt: "[[bg;#05d;]| ]"
	})
	e.style = "height: 100%; overflow: scroll !important"
	term.css("fontFamily", "ui-monospace,menlo,monospace")
}
// hmm.hmmVar = (c, n) => {
// 	return {
// 		set title(t) {
// 			c.parentNode.children[0].children[0].innerText = t
// 		},
// 		createElement: function(e, f) {
// 			if (e !== "script") return new hmm.El(e, f)
// 		},
// 		el: function(q, m) {
// 			if (m == undefined) return c.querySelector(q)
// 			if (m == "all" || m == "*") return c.querySelectorAll(q)
// 		},
// 		append: function(e) {
// 			c.appendChild(e)
// 		},
// 		wait: (time, fnc) => { setTimeout(fnc, time) }
// 	}
// }
//setup
hmm.setup = () => {
	document.getElementById("menu").innerHTML = `
<close onclick="hmm.bar.toggle()">✕</close>
<h1><span class="h-time"></span><br><span class="h-date"></span></h1>
<h2>${hmm.t("menu.apps-label")}</h2>
<div id="apps">
</div>

`
	hmm.setMenu()
	if (location.href.startsWith("http://localhost:")) {
		hmm.testcommand()
	}
	setInterval(() => { //periodically update localforage
		localforage.setItem('hmm-fs', hmm.storage)
	}, 1000)
}
//very useful BUT BREAKS CODE FOR SOME REASON:
//Object.prototype.with=function(k,v){var x=this;x[k]=v;return x}
//hide menu:
document.getElementById("menu").style.width = "0"

//prevent right click
document.addEventListener('contextmenu', ev => {
	ev.preventDefault()

});