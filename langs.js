hmm.storage.i18n = {}
hmm.storage.i18n.en = {
	"welcome": "Welcome to HmmOS!",
	"menu": {
		"apps-label": "Apps"
	},
	"apps": {
		"settings": {
			"lang": "System language",
			"name": "Settings"
		},
		"fe":{
			goback:"back",
			addfile:"Create file"
		}
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
	}
}
for (lang in hmm.storage.i18n) {
	if(lang.startsWith("_"))continue;
	hmm.l[lang] = new Polyglot({
		locale: lang,
		phrases: hmm.storage.i18n[lang]
	})
}