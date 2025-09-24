import { ThemePopup } from "./popups.js"

function switchTheme(theme) {
	localStorage.setItem('theme', theme)
	const link = document.getElementById('currentTheme')
	link.href = `/static/yariktype/themes/${theme}.css`
	document.querySelector('.themeChanger .text').innerText = theme;
}

function init() {
	let theme = localStorage.getItem('theme')

	// set default theme
	if (!theme) {
		localStorage.setItem('theme', 'classic')
		theme = 'classic'
	}	
	switchTheme(theme)

	ThemePopup.switchTheme = switchTheme
	ThemePopup.init()

	console.log('theme changer loaded')
}

window.onloadFuncs.push(init);
