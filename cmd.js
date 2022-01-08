hmm.$$ = (cm, c) => {//run more than 1 command
	return new Promise(res => {
		let i = 0;
		(function run() {
			hmm.$((cm.split`\n`[i] || "#"), c).then(() => {
				if (cm.length == i) { res(); return }
				i++
				run()
			})
		})()
	})
}
hmm.$ = (cm, c) => {
	let l = hmm.$.token(cm)
	if (l[0] == "") return new Promise(r => r());
	if (l[0] in hmm.storage.cmd) {
		let fn = hmm.storage.cmd[l[0]]
			, e = l.slice(1)
		return eval(fn.slice(fn.indexOf("{") + 1, -1)) || new Promise(r => r())
	} else {
		c.err("Command not found")
		return new Promise(res => res())
	}
}
hmm.$.token = (e) => {
	let l = [""], string = !1
	e.split("").forEach((e, n) => {
		if (string) {
			if (e != '"' || e[n - 1] == "\\") { l[l.length - 1] += e } else {
				string = !1
			}
		} else {
			if (e == " ") {
				l.push("")
			} else if (e == '"') {
				string = !0
			} else {
				l[l.length - 1] += e
			}
		}
	})
	return l
}
hmm.pathToPath = (p, cwd) => {
	if (p == '/') return p
	if (p.startsWith('~')) return '/user' + p.slice(1)
	if (!p.startsWith('/')) return (cwd == '/' ? cwd : cwd + '/') + p
	return p
}
hmm.storage.cmd = {
	help() {/* (shows help for one or all command(s)) */
		if (e.length) {
			let v=e.join` `
			if(!/\/\* \(.*\) \*\//.test(hmm.storage.cmd[v])){
				c.err("help not found for command")
			}else{
				c.echo(e + ': ' + hmm.storage.cmd[v].match(/\/\* \(.*\) \*\//)[0].slice(4, -4))
			}
		} else {
			Object.keys(hmm.storage.cmd).forEach(e => {
				if (!/\/\* \(.*\) \*\//.test(hmm.storage.cmd[e])) return
				c.echo(e + ': ' + hmm.storage.cmd[e].match(/\/\* \(.*\) \*\//)[0].slice(4, -4))
			})
		}
		
	},
	echo() {/* (displays text) */
		c.echo(e.join(" "))
			, 0
	},
	err() {/* (displays an error) */
		c.err(e.join(" "))
			, 0
	},
	open() {/* (opens a file or directory) */
		let fname = hmm.pathToPath(e.join` `, (c ? c.eval('cwd') : '/')), h = true
		if(fname.startsWith("/.pr/handlers/")){hmm.openApp('textpad.hmm', "$open " + fname);}else{
		Object.keys(hmm.storage['.pr'].handlers).forEach(e => {
			if (fname.endsWith(e)) { hmm.openApp(hmm.storage['.pr'].handlers[e], "$open " + fname); h = false }
		})
		if (h) hmm.openApp('textpad.hmm', "$open " + fname)
	}
	},
	"#"() { },
	ptbye() {//like PTY but much worse/* (opens a terminal window) */
		new hmm.App("/.shmm/app.hmm").open("")
	},
	wait() {/* (wait a certain amount of milliseconds) */
		new Promise(r => setTimeout(r, Number(e[0])))
	},
	cd() {/* (change current directory) */
		c.eval('cwd=atob("' + btoa(hmm.pathToPath(e.join``, c.eval('cwd'))) + '")')
			, 0
	},
	ls() {/* (lists folders and files in the current directory) */
		var f = hmm.pathToJs(hmm.pathToPath(e.join``, c.eval('cwd')))
		Object.keys(f).sort().forEach(c.echo)
			, 0
	},
	clear() {/* (clears the screen) */ c.eval('lines=[];ty=-1;yOffset=0'), 0 },
	$() {/* (runs a $ script) */
		hmm.$$(hmm.pathToJs(hmm.pathToPath(e.join``, c.eval('cwd'))), c)
	},
	rm() {/* (delete a file or folder) */
		eval("delete " + hmm.pathToDot(hmm.pathToPath(e.join``, c.eval('cwd'))))
			, 0
	}
}
for (const cmd in hmm.storage.cmd) {
	hmm.storage.cmd[cmd] = String(hmm.storage.cmd[cmd])
}
// window.onmessage = (ev) => {
// 	if ('_AppName' in ev.source) {
// 		console.log(ev.source)
// 	}
// }