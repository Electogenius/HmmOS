document.addEventListener('contextmenu', ev => {
	hmm.ctx(ev)
	ev.preventDefault()
})
document.addEventListener('touchstart', ev=>{
	if(ev.touches.length==2){
		hmm.ctx(ev.touches[0])
	}
})

hmm.ctx=function(ev){
	
}