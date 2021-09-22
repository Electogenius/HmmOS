hmm.$=(c,cm)=>{
	let l=hmm.$.token(cm)
	if(l[0]=="")return;
	if(l[0] in hmm.storage.cmd){
		return hmm.storage.cmd[l[0]](c,l.slice(1))
	}else{
		c.err("Command not found")
	}
}
hmm.$.token=(e)=>{
	let l=[""],string=!1
	e.split("").forEach((e,n)=>{
		if(string){
			if(e!='"'||e[n-1]=="\\"){l[l.length-1]+=e}else{
				string=!1
			}
		}else{
			if(e==" "){
				l.push("")
			}else if(e=='"'){
				string=!0
			}else{
				l[l.length-1]+=e
			}
		}
	})
	return l
}
hmm.storage.cmd={
	help(c){
		c.echo(`Commands:
echo: displays text
err: displays an error
open: opens an app`)
	},
	echo(c,e){
		c.echo(e.join(" "))
	},
	err(c,e){
		c.err(e.join(" "))
	},
	open(c,e){
		hmm.openApp(e[0]+".hmm")
	},
	"#"(){},
}
hmm.storage.env=[{
	
}]