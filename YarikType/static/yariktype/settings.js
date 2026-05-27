function handleFontSize() {
	const input = document.querySelector('.section[data-config-name="fontSize"] .sectionBody .inputs input');
	input.addEventListener('change', function (event) {
                const val = parseInt(input.value)
                if (isNaN(val) || val <= 0) {
                        return
                }
                localStorage.setItem('fontSize', val);
	});
}

function handleFontButtons() {
	const buttons = document.querySelectorAll('.section[data-config-name="fontFamily"] .sectionBody .buttons button')
	buttons.forEach((button) => button.addEventListener('click', function () {
                const fontfamily = button.getAttribute('data-config-value');
                localStorage.setItem('fontFamily', fontfamily);
                document.documentElement.style.cssText = '--font: ' + fontfamily + ', "Roboto Mono", "Vazirmatn", monospace;';
                console.log(1);
	}));
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

function loadSection(local_var, selector) {
	const val = localStorage.getItem(local_var);
        if (val === null) {
                return
        }
        const objects = document.querySelectorAll(selector)
        return [val, objects]
}

function loadFontSize() {
        const [val, objects] = loadSection('fontSize', "div[data-config-name='fontSize'] .sectionBody .inputs input")
        objects[0].value = val;
}

function loadFontFamily() {
        const [val, objects] = loadSection('fontFamily', "div[data-config-name='fontFamily'] .sectionBody .buttons button");

        for (let i=0; i<objects.length; i++) {
                obj = objects[i]
                if (obj.getAttribute('data-config-value') === val) {
			obj.classList.add('active');
                        break;
                }
        }
}

function init() {
        loadFontSize();
        loadFontFamily();

	handleButtonActive();
	handleFontButtons();
	handleFontSize();
}

window.onloadFuncs.push(init);
