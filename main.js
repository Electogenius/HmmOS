function e(query) {
	return document.querySelector(query)
}
window.hmm = {
	testcommand: function () {//runs when in development
		hmm.openApp("terminal.hmm");
		hmm.openApp("fe.hmm")
		hmm.openApp("fe.hmm")
	},
	restart: function () {//refresh page
		window.location = window.location.href
	},
	safe: {},
	hasPerms: (name, filename) => {//deprecated
		return eval("hmm.storage['.pr'].perms." + name).includes(filename + " ")
	},
	l: {},
	t: phrase => {//translates key to current language
		return hmm.l[hmm.storage.opts.lang]?.t(phrase)
	},
	reset() {//restart everything
		hmm.storage = null
		localforage.setItem('hmm-fs', hmm.storage)
		location = location.href
	},
	pathToJs(p) {//evaluates path and returns value
		var cr = hmm.storage;
		(p.match(/\/[^/]+/g) || []).forEach((e) => cr = cr[e.slice(1)])
		return cr
	},
	pathToDot(p) {//returns javascript dot notation as string from path
		return "hmm.storage[atob('" + p.replace(/^\//, "").split('/').map(btoa).join("')][atob('") + "')]"
	},
	mtt: { //empty shell interface
		err() { },
		echo() { }
	},
	ui: { //oh no
		choose(c, def = c[0]) {
			let el = document.createElement('details')
			el.classList.add('hmm-choose')
			let sum = document.createElement('summary')
			Object.defineProperty(el, 'value', {
				set(h) {
					sum.innerText = h
				},
				get() {
					return sum.innerText
				}
			})
			el.value = def
			el.appendChild(sum)
			c.forEach(e => {
				let choice = document.createElement("p")
				choice.innerText = e
				choice.onclick = ev => {
					sum.innerText = ev.target.innerText
					el.dispatchEvent(new Event('change'))
				}
				el.appendChild(choice)
			})
			return el
		}
	},
	popup(html) {
		return new Promise(res => {
			darken.style.display = "block"
			var popup = document.createElement("div")
			popup.classList.add("popup")
			popup.innerHTML = html
			popups.appendChild(popup)
			popup.querySelectorAll("button").forEach(e => e.onclick = () => {
				res({ button: e.id, popup })
				popup.remove()
				darken.style.display = "none"
			})
		})
	},
	lastWin: null
}
hmm.storage = {
	name: "HmmOS",
	version: 0,
	"better-alternative.txt": "Another nothing (https://github.com/liimee/another-nothing) of course.",
	apps: {
		"app.hmm": {
			title: { en: "Test app", cd: "edhō" },
			type: "iframe",
			code: `
<script>
	setTimeout(()=>{
		window.hmmWin.children[0].children[0].innerText=new Date().toString()
	},100)
</script>
`
		},
		"terminal.hmm": {
			title: { en: "Terminal" },
			type: 0,
			code: `ptbye`
		},
		"settings.hmm": {
			title: { en: "settings", cd: "māthrdhng" },
			type: "iframe",
			code: "<script>location='./settings.html'</script>",
		},
		"fe.hmm": {
			title: { en: "Files", cd: "kōpnge" },
			type: "iframe",
			code: `<script>location='./fe.html'</script>`
		},
		"textpad.hmm": {
			title: { en: "TextPad" },
			type: "iframe",
			code: `
			<script>location='./textpad.html'</script>
			`
		},
		"browser.hmm": {
			title: { en: "Browser", cd: "ulāwi" },
			type: "iframe",
			code: `
			<script>location='./browser.html'</script>
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
	},
	".shmm": {
		"app.hmm": {
			title: { en: "Terminal" },
			type: "iframe",
			code: "<script>window.location='./ptbye.html'</script>"
		}
	},
	user: {} //user files
}
//-------------ugh-------------
window.onload = () => {
	localforage.getItem("hmm-fs").then((val) => {
		let init = hmm.storage
		if (null !== val) {
			hmm.storage = val
		} else {
			localforage.setItem('hmm-fs', hmm.storage)
		}
		if (!('version' in hmm.storage)) {
			alert("Say goodbye to your current file system. Migrating to new 'software update' system. Your files will be removed. Hope you don't have anything important on there.")
			hmm.reset()
		}
		for (upd in hmm.updates) {
			if (Number(upd) > hmm.storage.version) {
				//update hmmos
				hmm.updates[upd]().forEach(e => {
					eval(hmm.pathToDot(e) + '=init' + hmm.pathToDot(e).slice(11))
					eval(e.extras || "")
				})
				console.log("Updated HmmOS to version " + upd)
				hmm.storage.version = Number(upd)
			}
		}
		for (lang in hmm.storage.i18n) {
			if (lang.startsWith("_")) continue;
			hmm.l[lang] = new Polyglot({
				locale: lang,
				phrases: hmm.storage.i18n[lang]
			})
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
		var a = new hmm.App("/apps/" + app)
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
		this.code = hmm.pathToJs(name).code
		this.title = hmm.pathToJs(name).title
		this.type = hmm.pathToJs(name).type
		this.filename = name
		this.obj = hmm.storage.apps[name]
		this.baritem = document.createElement("baritem")
		this.baritem.innerText = (this.title[hmm.storage.opts.lang] || this.title.en || this.filename.slice(0, -4))[0]
	}
	open(arg) {
		var node = document.createElement("window")
		var tb = document.createElement("taskbar")
		tb.appendChild(document.createElement("span"))
		tb.children[0].innerText = this.title[hmm.storage.opts.lang] || this.title.en || this.filename.slice(0, -4)
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
			hmm.$$(this.code, hmm.mtt)
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
			n.onload = () => {
				n.contentWindow.arg = arg
				n.contentWindow.hmmWin = node
			}
			this.if = n
		}

		node.appendChild(content)
		var position = { x: 0, y: 0 }
		node.style.zIndex = document.getElementById('windows').childNodes.length + 10
		function draggy() {
			if (node == hmm.lastWin) return
			hmm.lastWin = node
			document.querySelectorAll("window").forEach(e => {
				if(e.style.zIndex>node.style.zIndex)e.style.zIndex--
			})
			node.style.zIndex = document.getElementById('windows').childNodes.length + 10
		}
		interact(node).draggable({
			allowFrom: "taskbar",
			modifiers: [],
			inertia: true,
			listeners: {
				start(event) {
					draggy()
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
		node.addEventListener("mousedown", draggy)
		this.if.contentWindow.addEventListener("focus", draggy)
		draggy()
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
	if (document.referrer.startsWith("http://localhost:") && !(location.href.startsWith("http://localhost:"))) {
		alert("HmmOS denies dominance over another nothing.")
		window.history.back()
	}
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
