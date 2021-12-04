//HmmOS shell
(() => {
	let tx = 0
		, ty = 0
		, path = true
		, cwd = "/"
		, hmm = window.parent.hmm
		, v = { cmd: "" }
		, lines = []
	const ti = {
		echo(t) {
			tx = 0
			lines.push({
				t,
				fg:'#fff',
				bg:'#000',
				x:tx,
				y:ty
			})
		},
		err(t) {
			tx = 0
			lines.push({
				t,
				fg:'#f00',
				bg:'#000',
				x:tx,
				y:ty
			})
		}
	}
	function r(o) {
		rText(o.t, o.fg, o.bg, o.x, o.y)
	}
	requestAnimationFrame(function draw() {
		clear()
		if (path) {
			tx = 0
			lines[0]=({
				t: cwd + " $",
				fg: "#48f",
				bg: "#000",
				x: tx,
				y: ty
			})
			tx = cwd.length + 3
			lines[1]=({
				t: v.cmd,
				fg: "#fff",
				bg: "#000",
				x: tx,
				y: ty
			})
			tx += v.cmd.length
			lines[2]=({
				t: " ",
				fg: "#000",
				bg: "#fff",
				x: tx,
				y: ty
			})//cursor
		}
		lines.forEach(r)
		requestAnimationFrame(draw)
	})
	window.onkeydown = (ev) => {
		if (path) {
			if (ev.code == "Backspace") {
				v.cmd = v.cmd.slice(0, -1)
			} else if (ev.code == "Enter") {
				path = false
				lines=[]
				hmm.$(v.cmd,ti)
				v.cmd = ''
			} else {
				v.cmd += (ev.key.length == 1) ? ev.key : ''
			}
		}
	}
})()