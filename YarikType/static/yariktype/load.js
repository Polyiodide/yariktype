window.onloadFuncs = [];

function init() {
	for (const init of window.onloadFuncs) {
		init();
	}
}

window.onload = init;
