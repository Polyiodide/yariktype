function handleFontSize() {
	const input = document.querySelector('.section[data-config-name="fontSize"] .sectionBody .inputs input');
	input.addEventListener('keypress', function (event) {
		if (event.key === 'Enter') {
			localStorage.setItem('fontSize', input.value);
			console.log(localStorage['fontSize'])
		}
	});
}

function handleFontButtons() {
	const buttons = document.querySelectorAll('.section[data-config-name="fontFamily"] .sectionBody .buttons button')
	buttons.forEach((button) => {
		//save font to localStorage
	});
}


function handleButtonActive() {
	const buttons = document.querySelectorAll('.buttons button');
	buttons.forEach((button) => {
		button.addEventListener('click', function (event) {
			buttons.forEach((button) => {button.classList.remove('active')});
			event.target.classList.add('active');
		})
	});
}

function init() {
	handleButtonActive();
	handleFontButtons();
	handleFontSize();
}

window.onloadFuncs.push(init);
