document.addEventListener('contextmenu', ev => {
	if (ev.target != document.getElementById("ctx")) {
		document.getElementById("ctx").style.display = "none"
	}
	hmm.ctx(ev)
	ev.preventDefault()
})
document.addEventListener('touchstart', ev => {
	if (ev.touches[0].target != document.getElementById("ctx")) {
		document.getElementById("ctx").style.display = "none"
	}
	if (ev.touches.length == 2) {
		hmm.ctx(ev.touches[0])
	}
})

hmm.ctx = function(event, ctxs) {
	if(event.target.getAttribute('ctx')===null)return
	const { clientX, clientY } = event
	document.getElementById("ctx").style.display = "block"
	document.getElementById("ctx").style.top = clientY + "px"
	document.getElementById("ctx").style.left = clientX + "px"
	document.getElementById("ctx").innerHTML = (ctxs || hmm.ctxs)[event.target.getAttribute('ctx')] //?? hmm.ctxs.default
}

hmm.ctxs = {
	null: ""
}