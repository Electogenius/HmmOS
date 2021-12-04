hmm.$ = (cm, c) => {
	let l = hmm.$.token(cm)
	if (l[0] == "") return;
	if (l[0] in hmm.storage.cmd) {
		let fn=hmm.storage.cmd[l[0]]
		,e=l.slice(1)
		return eval(fn.slice(fn.indexOf("{")+1,-1))
	} else {
		c.err("Command not found")
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
hmm.storage.cmd = {
	help(c) {
		c.echo(`Commands:
echo: displays text
err: displays an error
open: opens an app`)
	},
	echo(c, e) {
		c.echo(e.join(" "))
	},
	err(c, e) {
		c.err(e.join(" "))
	},
	open(c, e) {
		let fname=e.join` `,h=true
		Object.keys(hmm.storage['.pr'].handlers).forEach(e=>{
			if(fname.endsWith(e)){hmm.openApp(hmm.storage['.pr'].handlers[e],"$open "+fname);h=false}
		})
		if(h)hmm.openApp('textpad.hmm',"$open "+fname)
	},
	"#"() { },
	ptbye(c,e){//like PTY but much worse
		new hmm.App("/.shmm/app.hmm").open("")
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