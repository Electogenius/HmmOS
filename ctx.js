document.addEventListener('contextmenu', ev => {
	if (ev.target != document.getElementById("ctx")) {
		document.getElementById("ctx").style.display = "none"
	}
	hmm.ctx(ev,eval("window.ctxs"))
	ev.preventDefault()
})
document.addEventListener('touchstart', ev => {
	setTimeout(()=>{
	if (ev.touches.length == 2) {
		hmm.ctx(ev.touches[0], eval("window.ctxs"))
	}else
	if (ev.touches[0].target != document.getElementById("ctx")) {
		document.getElementById("ctx").style.display = "none"
	}
	},500)
})

hmm.ctx = function(event, ctxs) {
	if(event.target.getAttribute('ctx')===null)return
	const { pageX, pageY } = event
	document.getElementById("ctx").style.display = "block"
	document.getElementById("ctx").style.top = pageY + "px"
	document.getElementById("ctx").style.left = pageX + "px"
	document.getElementById("ctx").innerHTML = (ctxs || hmm.ctxs)[event.target.getAttribute('ctx')] //?? hmm.ctxs.default
}

{
	let e=document.createElement("div")
	e.id="ctx"
	document.body.appendChild(e)
}