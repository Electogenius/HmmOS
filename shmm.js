//HmmOS shell
(() => {
	let tx = 0
		, ty = 0
		, path = true
		, cwd = "/"
		, hmm = window.parent.hmm
		,v ={cmd:""}
	requestAnimationFrame(function draw() {
		clear()
		if (path) {
			tx=0
			rText(cwd + " $", "#48f", "#000", tx, ty)
			tx=cwd.length+3
			rText(v.cmd,"#FFF","#000",tx,ty)
			tx+=v.cmd.length
			render(" ","#000","#fff",tx,ty)//cursor
		}
		requestAnimationFrame(draw)
	})
	window.onkeydown=(ev)=>{
		if(path){
			if(ev.code=="Backspace"){
				v.cmd=v.cmd.slice(0,-1)
			}else if(ev.code="Enter"){
				
			}else{
				v.cmd+=(ev.key.length==1)?ev.key:''
			}
		}
	}
})()