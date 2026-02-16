import { TimeInput, LangPopup } from "./popups.js"

let line = [];
let words;
let cur_word = 0;
let cur_letter = 0;
let total = 0;
let wrong = 0;
let time = 30;
let Timer;
let started = false;

let language = 'english'

let config

const word_delete = 1;
const words_field = document.getElementById('words');
const typingTest = document.getElementById('typingTest');
const input = document.getElementById('wordsInput');
const lang_button = document.querySelector('.languages button')


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


function generate_words(amount) {
	let word
	let temp
	for (let i=0; i < amount; i++) {
		word = words[Math.floor(Math.random() * words.length)];
		temp = '<div class="word">';
		for (const letter of word) {
			temp += `<letter>${letter}</letter>`
		}
		words_field.innerHTML += temp;
	}
	line = Array.from(words_field.children)
}

function next_line() {
	total += line[cur_word].children.length;
	cur_word++
	cur_letter = 0;

	if (cur_word === word_delete) {
		for (let i=0; i < word_delete; i++) {
			line[i].remove()
		}
		line = line.slice(word_delete);
		cur_word = 0;
		generate_words(word_delete)
	}
}

async function sendResult() {
        let cpm = (total - wrong) * 60/time
        const result = {
                'charTotal': total,
                'language': language,
                'mode': 'time',
                'mode2': time,
                'cpm': cpm,
        }

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
        started = false;
        typingTest.classList.add('hidden');
        sendResult()
        //endPopup();
}

function logKey(e) {
	if (!started) {
		started = true;
                Timer = setTimeout(endTest, time*1000)
	}
	let letter
	if (e.key.length === 1 && e.key !== ' ') {
		letter = line[cur_word].children;
		if (cur_letter === letter.length) {
			return
		}
		letter = letter[cur_letter]
		if (letter.innerText === e.key) {
			letter.classList.add('correct');
		} else {
			letter.classList.add('incorrect');
			wrong++;
		}
		cur_letter++
	} else if (e.key === 'Backspace') {
		if (cur_letter !== 0) {
			cur_letter -= 1;
			letter = line[cur_word].children[cur_letter];
			if (letter.innerText !== ' ') {
				if (letter.classList.contains('incorrect')) {
					wrong--
				}
				letter.classList = '';
			}
		} else if (cur_word !== 0){
			cur_word--
			cur_letter = line[cur_word].children.length;
		}
	} else if (e.key === ' ') {
		letter = line[cur_word].children;
		if (cur_letter === letter.length) {
			next_line();
		}
	}
}

let buttons
function handleConfigButtonClick(event) {
	buttons.forEach(button => {
		button.classList.remove('active')
	})

	event.target.classList.add('active')
	if (event.target.innerText !== 'custom') {
		time = parseInt(event.target.getAttribute('timeconfig'))
	}
}

function loadFontSize() {
	typingTest.style['font-size'] = localStorage.getItem('fontSize')+'rem';
}

async function switchLang(lang) {
	for (const word of line) {
		word.remove();
	}

	total = 0;
	wrong = 0;
	clearTimeout(Timer);

	localStorage.setItem('dict', lang);

	let data;
	data = await fetch('/languages/'+lang+'.json');
	data = await data.json();
	words = data['words'];
	generate_words(150);

        language = lang
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

	input.addEventListener('keydown', function () {
		logKey(event)
	});
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

	TimeInput.init();

	LangPopup.switchLang = switchLang;
	LangPopup.init();

	loadFontSize();

	await loadAlph();

	console.log('index loaded');
}

window.onloadFuncs.push(init) 
