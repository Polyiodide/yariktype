const BasePopup = {
	popup: null,
	popup_menu: null,
	button_selector: null,
	window_selector: null,
	isopen: false,

	init() {
		this.popup_menu = document.querySelector('#popups')
		document.querySelector(this.button_selector).addEventListener('click', function() {this.show()}.bind(this));
		this.createPopup();
	},

	onShow() {},
	show() {
		if (this.isopen) {
			return
		}
		// append popup to screen
		this.popup_menu.innerHTML += this.popup;

		this.onShow();

		document.querySelector(this.window_selector).addEventListener('click', function(event) {
			if(event.target !== event.currentTarget) return;
			this.remove()
		}.bind(this));

		this.isopen = true;
	},

	onRemove() {},
	remove() {
		if (!this.isopen) {
			return
		}

		this.onRemove();

		document.querySelector(this.window_selector).remove()

		this.isopen = false;
	}
}

export const ThemePopup = {
	__proto__: BasePopup,
	button_selector: 'footer .themeChanger',
	window_selector: '.themeChanger',
	switchTheme: null,

	createPopup: async function() {
		// get themes
		const themes = (await this.get_themes())['themes']

		let popup = '<dialog class="themeChanger modalWrapper"><div class="modal"><div class="suggestions">'
		for (const theme of themes) {
			popup += `<div class="theme"><div>${theme}</div></div>`
		}
		popup += '</div></div></dialog>'
		this.popup = popup
	},

	get_themes: async function() {
		let data
		data = await fetch('/list_themes')
		data = await data.json()
		return data
	},

	onShow: function() {
		const suggestions = document.querySelector('#popups .suggestions').children;
		for (const theme of suggestions) {
			theme.addEventListener('click', function () {
				this.switchTheme(theme.innerText)
			}.bind(this))
		}
	},
}

export const TimeInput = {
	__proto__: BasePopup,
	button_selector: '#config .row .time button[timeconfig="custom"]',
	window_selector: '.timeInput',

	createPopup: function() {
		let popup = `
		<dialog class="timeInput modalWrapper">
			<form class="modal">
				<div class='title'>Test duration</div>
				<input value='30' title='test duration' min='0'></input>
				<div class='tip'></div>
				<button>accept</button>
			</form>
		</dialog>
		`
		this.popup = popup
	},
}

export const LangPopup = {
	__proto__: BasePopup,
	button_selector: '#typingTest .languages button',
	window_selector: '.dictChanger',
	switchLang: null,

	createPopup: async function() {
		// get langs
		const langs = (await this.get_langs())['dictonaries'];

		let popup = '<dialog class="dictChanger modalWrapper"><div class="modal"><div class="suggestions">'
		for (const lang of langs) {
			popup += `<div class="dict"><div>${lang}</div></div>`
		}
		popup += '</div></div></dialog>'
		this.popup = popup
	},

	get_langs: async function() {
		let data
		data = await fetch('/list_dicts')
		data = await data.json()
		return data
	},

	onShow: function() {
		const suggestions = document.querySelector('#popups .suggestions').children;
		for (const lang of suggestions) {
			lang.addEventListener('click', async function () {
				await this.switchLang(lang.innerText);
			}.bind(this))
		}
	},
}
