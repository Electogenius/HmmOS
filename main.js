function e(query) {
	return document.querySelector(query)
}
window.hmm = {
	testcommand: function() {
		hmm.openApp("app.hmm")
		/*var x = new hmm.El("div", "hello")
		try{
			window.onerror = (e,f,g,h,i,j,k)=>console.log([e,f,g,h,i,j,k])
			console.log(x)
			
		}catch(e){console.log(e)}*/
	},
	restart: function() {
		window.location = window.location.href
	},
	opts: {
		lang: "en"
	},
	safe: {},
	perms: {
		iframe: {
			"nosandbox": "vscodish.hmm opts.hmm "
		}
	},
	hasPerms: (name, filename) => {
		return eval("hmm.perms." + name).includes(filename + " ")
	},
	l: {},
	t: phrase => {
		return hmm.l[hmm.opts.lang]?.t(phrase)
	}
}
hmm.l.en = new Polyglot({
	locale: "en",
	phrases: {
		"welcome": "Welcome to HmmOS!",
		"menu": {
			"apps-label": "Apps"
		},
		"apps": {
			"settings": {
				"lang": "System language",
				"name": "Settings"
			}
		}
	}
})
hmm.l.cd = new Polyglot({
	locale: "cd",
	phrases: {
		welcome: "HmmOSk wangõ!",
		menu: {
			"apps-label": "selīng"
		},
		apps: {
			settings: {
				lang: "kãiod moi",
				name: "māthrdhng"
			}
		}
	}
})
hmm.storage = {
	apps: {
		"app.hmm": {
			title: "testapp",
			type: "egc-canvas",
			code: `
log(YES)
var x 0
var frame do {
after(1000){
cset fillStyle(#fff)
var e[hmmget( width )]
var y[$x / 2]
cdo fillText [$e] [$y] [$x]
$x + 10
frame()
}
}
frame()
`
		},
		"cmd.hmm": {
			title: "Terminal",
			type: 0,
			code: ``
		},
		"vscodish.hmm": {
			title: "VSCode (ish)",
			type: "iframe",
			code: "<script>location='https://github1s.com/Electogenius/HmmOS'</script>"
		},
		"opts.hmm": {
			title: "settings",
			type: "iframe",
			code: "<script>location = './settings.html'</script>",
		},
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
	if (app in hmm.storage.apps && app.endsWith(".hmm")) {
		var a = new hmm.App(app)
		a.open()
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
	}
	open() {
		var node = document.createElement("window")
		var tb = document.createElement("taskbar")
		tb.appendChild(document.createElement("span"))
		tb.children[0].innerText = this.title
		var cls = document.createElement("close")
		cls.innerText = "✕"
		cls.onclick = (event) => {
			event.target.parentNode.parentNode.remove()
			// console.log(event.target.parentNode)
		}
		tb.appendChild(cls)
		node.appendChild(tb)
		var fs = document.createElement("fullscreen")
		fs.classList.add("material-icons")
		fs.innerHTML = "fullscreen"
		tb.appendChild(fs)
		var me = this
		fs.onclick = function(event) {
			event.target.parentNode.parentNode.style.height = "100%"
			event.target.parentNode.parentNode.style.width = window.innerWidth + "px"
			event.target.parentNode.parentNode.style.transform = "translate(0, 0)"
			me.width = Number(event.target.parentNode.parentNode.style.width.slice(0, -2))
		}
		var content = document.createElement("windowcontent")
		if (this.type == "js") {
			var x = new Function("document", "window", "hmm", "$", "with(hmm){" + this.code + "}")
			setTimeout(() => x({}, {}, hmm.hmmVar(content, this.filename), hmm.hmmVar(content, this.filename).el), 100)
		} else if (this.type == 0) {
			var n = document.createElement("div")
			content.appendChild(n)
			content.style.backgroundColor = "black"
			hmm.console(n)

		} else if (this.type == "egc-canvas") {
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

		} else if (this.type == "iframe") {
			var n = document.createElement("iframe")
			if (!hmm.hasPerms("iframe.nosandbox", "vscodish.hmm")) n.sandbox = "allow-scripts allow-forms allow-presentation allow-modals"
			n.srcdoc = this.code
			n.classList.add("win")
			content.style.overflow = "hidden"
			content.appendChild(n)
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
				width: `${Math.max(event.rect.width,100)}px`,
				height: `${Math.max(event.rect.height,100)}px`
			})
			Object.assign(event.target.dataset, { x, y })
			this.width = Number(event.target.style.width.slice(0, -2))
		});
		this.width = Math.min(window.innerWidth, 300)
		document.getElementById("windows").appendChild(node)
	}
}
setInterval(e => {
	document.querySelectorAll(".h-time").forEach(e => {
		e.innerText = new Date().toLocaleTimeString(hmm.opts.lang)
	})
	document.querySelectorAll(".h-date").forEach(e => {
		e.innerText = new Date().toLocaleDateString(hmm.opts.lang) //.toLocaleDateString(hmm.opts.lang)
	})
}, 1e3)
hmm.setMenu = () => {
	Object.keys(hmm.storage.apps).sort().forEach(app => {
		let ap = hmm.storage.apps[app]
		var el = document.createElement("t")
		el.classList.add("menu-app")
		el.innerText = ap.title
		el.filename = app
		el.onclick = e => {
			hmm.openApp(e.target.filename);
			hmm.bar.toggle()
		}
		document.getElementById("apps").appendChild(el)
	})
}
hmm.console = (e, run) => {
	$(e).terminal((c, t) => {
		if (c == "help") {
			t.echo("Valid commands:\n")
			t.echo(["help", "run"])
		}
	}, {
		greetings: "HmmOS terminal (broken)",
		prompt: "|"
	})
	e.style = "height: 100%; overflow: scroll !important"
}
hmm.hmmVar = (c, n) => {
	return {
		set title(t) {
			c.parentNode.children[0].children[0].innerText = t
		},
		createElement: function(e, f) {
			if (e !== "script") return new hmm.El(e, f)
		},
		el: function(q, m) {
			if (m == undefined) return c.querySelector(q)
			if (m == "all" || m == "*") return c.querySelectorAll(q)
		},
		append: function(e) {
			c.appendChild(e)
		},
		wait: (time, fnc) => { setTimeout(fnc, time) }
	}
}
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
	if (location.href.startsWith("http://localhost:7700")) {
		hmm.testcommand()
	}
}
//very useful BUT BREAKS CODE FOR SOME REASON:
//Object.prototype.with=function(k,v){var x=this;x[k]=v;return x}