//HmmOS shell
(() => {
	let tx = 0
		, ty = -1
		, path = true
		, cwd = "/"
		, hmm = window.parent.hmm
		, v = { cmd: "", pathY: 0 }
		, lines = []
		, yOffset = 0
	const ti = {//terminal interface
		echo(t) {
			tx = 0
			ty++
			lines.push({
				t,
				fg: '#fff',
				x: tx,
				y: ty
			})
		},
		err(t) {
			tx = 0
			ty++
			lines.push({
				t,
				fg: '#f00',
				x: tx,
				y: ty
			})
		},
		eval(c) { return eval(c) }
	}
	function r(o) {
		rText(o.t, o.fg, o.bg, o.x, o.y + yOffset)
	}
	requestAnimationFrame(function draw() {
		clear()
		if (path) {
			tx = 0
			lines[0] = ({
				t: cwd + " $",
				fg: "#48f",
				x: tx,
				y: ty + 1
			})
			tx = cwd.length + 3
			lines[1] = ({
				t: v.cmd,
				fg: "#fff",
				x: tx,
				y: ty + 1
			})
			tx += v.cmd.length
			lines[2] = ({
				t: " ",
				fg: "#000",
				bg: "#fff",
				x: tx,
				y: ty + 1
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
				//run command
				path = false
				tx = 0
				lines.push({
					t: cwd + " $",
					fg: "#48f",
					x: tx,
					y: ty + 1
				})
				tx = cwd.length + 3
				lines.push({
					t: v.cmd,
					fg: "#fff",
					x: tx,
					y: ty + 1
				})
				tx = 0
				ty++
				lines[2].bg = "#333"
				hmm.$(v.cmd, ti)
					.then(e => {
						path = true
					})
				v.cmd = ''
			} else {
				v.cmd += (ev.key.length == 1) ? ev.key : ''
			}
		}
	}
	window.onwheel = window.onmousewheel = (ev) => {
		yOffset -= ev.deltaY / 15
		if (yOffset > 0) yOffset = 0
		if (yOffset < -ty-1) yOffset = -ty-1
	}
})()