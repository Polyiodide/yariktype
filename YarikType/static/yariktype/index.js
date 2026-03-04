import { TimeInput, LangPopup } from "./popups.js"

let current_test = null;
const word_delete = 1;
const words_field = document.getElementById('words');
const typingTest = document.getElementById('typingTest');
const main = typingTest.parentElement;
const input = document.getElementById('wordsInput');
const lang_button = document.querySelector('.languages button')

class Test {
        started = false;
        cur_word = 0;
        cur_letter = 0;
        total = 0;
        wrong = 0;
        line = null;
        timer = null;
        #time;

        constructor(lang, words, time, shuffle) {
                this.language = lang
                this.words = words;
                this.shuffle = shuffle;
                if (shuffle === false) {
                        this.word_idx = 0;
                }

                this.generate_words(150);
                this.#time = time;
        }

        set time(time) {
                if (this.#time !== 0) {
                        this.#time = time
                }
        }

        get time() {
                return this.#time
        }

        generate_words(amount) {
                let word, temp
                for (let i=0; i < amount; i++) {
                        if (this.shuffle === true) {
                                word = this.words[Math.floor(Math.random() * this.words.length)];
                        } else {
                                word = this.words[this.word_idx];
                                this.word_idx++
                        }
                        temp = '<div class="word">';
                        for (const letter of word) {
                                temp += `<letter>${letter}</letter>`
                        }
                        words_field.innerHTML += temp;
                }
                this.line = Array.from(words_field.children);
        }

        next_line() {
                this.total += this.line[this.cur_word].children.length;
                this.cur_word++
                this.cur_letter = 0;

                if (this.cur_word === word_delete) {
                        for (let i=0; i < word_delete; i++) {
                                this.line[i].remove()
                        }
                        this.line = this.line.slice(word_delete);
                        this.cur_word = 0;
                        this.generate_words(word_delete)
                }
        }

        logKey(e) {
                if (!this.started) {
                        this.started = true;
                        if (this.time !== 0) {
                                this.timer = setTimeout(endTest, this.time*1000)
                        }
                }
                let letter
                if (e.key.length === 1 && e.key !== ' ') {
                        letter = this.line[this.cur_word].children;
                        if (this.cur_letter === letter.length) {
                                return
                        }
                        letter = letter[this.cur_letter]
                        if (letter.innerText === e.key) {
                                letter.classList.add('correct');
                        } else {
                                letter.classList.add('incorrect');
                                this.wrong++;
                        }
                        this.cur_letter++
                } else if (e.key === 'Backspace') {
                        if (this.cur_letter !== 0) {
                                this.cur_letter--
                                letter = this.line[this.cur_word].children[this.cur_letter];
                                if (letter.innerText !== ' ') {
                                        if (letter.classList.contains('incorrect')) {
                                                this.wrong--
                                        }
                                        letter.classList = '';
                                }
                        } else if (this.cur_word !== 0){
                                this.cur_word--
                                this.cur_letter = this.line[this.cur_word].children.length;
                        }
                } else if (e.key === ' ') {
                        letter = this.line[this.cur_word].children;
                        if (this.cur_letter === letter.length) {
                                this.next_line();
                        }
                }
        }

        getResult() {
                const cpm = (this.total - this.wrong) * 60/this.time
                const result = {
                        'charTotal': this.total,
                        'charIncorrect': this.wrong,
                        'language': this.language,
                        'mode': 'time',
                        'mode2': this.time,
                        'cpm': cpm,
                }
                return result
        }
}

function getCookie(name) {
        let cookieValue = null;
        if (document.cookie && document.cookie !== '') {
                const cookies = document.cookie.split(';');
                for (let i = 0; i < cookies.length; i++) {
                        const cookie = cookies[i].trim();
                        // Does this cookie string begin with the name we want?
                        if (cookie.substring(0, name.length + 1) === (name + '=')) {
                                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                                break;
                        }
                }
        }
        return cookieValue;
}
const csrftoken = getCookie('csrftoken');

function showResult(result) {
        typingTest.classList.add('hidden');

        const html = `<div id="result"><div class="stats"><div class="cpm"><div class="top"><div class="text">cpm</div></div><div class="bottom">${result['charTotal']}</div></div></div><div class="stats detailedstats"><div class="testType"><div class="top"><div>test type</div></div><div class="bottom">${result['mode']} ${result['mode2']}<br>${result['language']}</div></div><div class="chars"><div class="top"><div>characters</div></div><div class="bottom" aria-label="correct/incorrect">${result['charTotal']-result['charIncorrect']}/${result['charIncorrect']}</div></div><div class="testTime"><div class="top"><div>time</div></div><div class="bottom">${result['mode2']}</div></div></div>`
        main.innerHTML += html;
}

async function sendResult(result) {
	const response = await fetch('/update_records', {
                method: "POST",
                credentials: 'same-origin',
                    headers:{
                        'Accept': 'application/json',
                        'X-Requested-With': 'XMLHttpRequest',
                        'X-CSRFToken': csrftoken,
                },
                body: JSON.stringify(result)
        });
}

function endTest() {
        const result = current_test.getResult();
        showResult(result);
        if (result['language'] === 'english') {
                sendResult(result);
        }
}

let buttons
function handleConfigButtonClick(event) {
	buttons.forEach(button => {
		button.classList.remove('active')
	})

	event.target.classList.add('active')
	if (event.target.innerText !== 'custom') {
		current_test.time = parseInt(event.target.getAttribute('timeconfig'))
	}
}

function loadFontSize() {
	typingTest.style['font-size'] = localStorage.getItem('fontSize')+'rem';
}

async function switchLang(lang) {
        if (current_test !== null) {
                for (const word of current_test.line) {
                        word.remove();
                }
        }
	//clearTimeout(Timer);

	localStorage.setItem('dict', lang);

	let data;
	data = await fetch(`/languages/${lang}.json`);
	data = await data.json();

        console.log(data);

        let time
        if (data['time'] === false) {
                time = 0;
                //hide config time buttons
        } else {
                time = 30;
        }

        current_test = new Test(data['name'], data['words'], time, data['shuffle']);
	lang_button.innerText = lang;
	input.focus();
}

async function loadAlph() {
	let lang = localStorage.getItem('dict')
	if (!lang) {
		localStorage.setItem('dict', 'english')
		lang = 'english'
	}	
	await switchLang(lang);
}

async function init() {
	buttons = document.querySelectorAll('.configButton')
	buttons.forEach(button => {button.addEventListener('click', handleConfigButtonClick)})

	input.addEventListener('focus', function () {
			words_field.classList.remove('blurred')
	})
	input.addEventListener('focusout', function () {
			words_field.classList.add('blurred')
	})
	document.getElementById('wordsWrapper').addEventListener('click', function() {
		input.focus();
	});

        //config = JSON.parse(localStorage.getItem('config'))
        //console.log(config)

	await loadAlph();

	TimeInput.init();
        TimeInput.current_test = current_test;

	LangPopup.switchLang = switchLang;
	LangPopup.init();

	loadFontSize();

	input.addEventListener('keydown', function () {
		current_test.logKey(event)
	});
}

window.onloadFuncs.push(init) 
