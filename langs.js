hmm.storage.i18n = {}
hmm.langNames={
	"English":"en",
	"Compressed Undardese (surknangdārdyizõ)":"cd"
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
			adddir: "Create directory"
		}
	},
	ui:{ //general ui related things
		cancel:"Cancel",
		ok:"OK",
		save:"Save",
		delete:"Delete",
		yes:"Yes",
		no:"No"
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
			addfile:"kōp sei"
		}
	},
	ui:{
		cancel:"vænã",
		ok:"ser",
		save:"padhpī",
		delete:"ałi",
		yes:"ā~",
		no:"lle"
	}
}
for (lang in hmm.storage.i18n) {
	if(lang.startsWith("_"))continue;
	hmm.l[lang] = new Polyglot({
		locale: lang,
		phrases: hmm.storage.i18n[lang]
	})
}
