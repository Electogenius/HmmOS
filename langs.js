hmm.storage.i18n = {}
hmm.langNames={
	"English":"en",
	"Compressed Undardese (surknangdārdyizõ)":"cd",
	"toki pona (kepeken sitelen Lasin)":"tok",
	//let it be hidden for now
	//"toki pona (sitelen pona/linja sike)":"toksp"
}
hmm.storage.i18n.en = {
	welcome: "Welcome to HmmOS!",
	menu: {
		"apps-label": "Apps"
	},
	apps: {
		settings: {
			lang: "System language",
			name: "Settings"
		},
		fe:{
			goback:"back",
			addfile:"Create file",
			adddir: "Create folder",
			deletefolder:"Delete current folder",
			alreadyexists:"A file/folder with that name already exists",
			namefile:"Enter a name for your file",
			namedir:"Enter a name for your folder"
		},
		store:{
			download:"Download"
		}
	},
	ui:{ //general ui related things
		cancel:"Cancel",
		ok:"OK",
		save:"Save",
		delete:"Delete",
		yes:"Yes",
		no:"No",
		create:"Create",
		use: "Use %{thing}"
	}
}
hmm.storage.i18n.cd = {
	welcome: "HmmOSk wangõ!",
	menu: {
		"apps-label": "selīng"
	},
	apps: {
		settings: {
			lang: "kãiod moi",
			name: "māthrdhng"
		},
		fe:{
			goback:"pnād",
			addfile:"kōp sey",
			adddir: "kōpure sey",
			deletefolder:"ikōpureyałi",
			alreadyexists:"apērlaor kōplna kōpurærknvērk",
			namefile:"kōpkor pēr thāng",
			namedir:"kōpurekor pēr thāng"
		},
		store:{
			download:"padhyerak"
		}
	},
	ui:{
		cancel:"vænã",
		ok:"ser",
		save:"padhpī",
		delete:"ałi",
		yes:"ā~",
		no:"lle",
		create:"sey"
	}
}
hmm.storage.i18n.tok = {
    welcome: "o kama pona tawa ilo Imosu",
    menu: {
        "apps-label": "ilo"
    },
    apps: {
        settings: {
            lang: "toki",
            name: "ijo pi ante ilo"
        },
        fe: {
            goback: "o tawa pini",
            addfile: "o pali e lipu",
            adddir: "o pali e poki",
            deletefolder: "o pakala e poki ni",
            alreadyexists: "lipu anu poki pi nimi ni li lon. o pana e nimi ante",
            namefile: "o pana e nimi tawa lipu sina",
            namedir: "o pana e nimi tawa poki sina"
        },
        store: {
            download: "o kama jo e ni"
        }
    },
    ui: {
        cancel: "wile ala",
        ok: "pona",
        save: "o awen e ni",
        delete: "o pakala",
        yes: "lon",
        no: "ala",
        create: "o pali"
    }
}
/*
hmm.storage.i18n.toksp = {
    welcome: "kama+pona tawa ilo [_ike+mute_oko+sina_utala]",
    menu: {
        "apps-label": "ilo"
    },
    apps: {
        settings: {
            lang: "toki",
            name: "ijo+tawa ante"
        },
        fe: {
            goback: "o tawa pini",
            addfile: "o pali e lipu",
            adddir: "o pali e poki",
            deletefolder: "o pakala e poki+ni",
            alreadyexists: "lipu anu poki pi nimi+ni li lon. o pana e nimi+ante",
            namefile: "o pana e nimi+tawa lipu+sina",
            namedir: "o pana e nimi+tawa poki+sina"
        },
        store: {
            download: "o lanpan e ni"
        }
    },
    ui: {
        cancel: "wile ala",
        ok: "pona",
        save: "o awen e ni",
        delete: "o pakala",
        yes: "lon",
        no: "ala",
        create: "o pali"
    }
}*/
hmm.switchFont=(url)=>{
	let s=document.createElement('style')
	s.innerHTML=`
	@font-face{
        font-family: cust;
        src:url("${url}");
    }
	*:not(.material-icons){
		font-family: cust, system-ui, sans-serif !important;
	}
	`
	document.body.appendChild(s)
}