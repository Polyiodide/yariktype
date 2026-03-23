const tbody = document.querySelector('.leaderboardsPage .table table tbody');

async function createTable(time) {
	const users = (await getlist(time))['users'];
	let table = '';
        for (let i=0; i<users.length; i++) {
                let idx = users[i]
		table += `<tr>
				<td>${i+1}</td>
				<td class='avatarName'>
					<div class='avatar'></div>
					<a href='/profile/${idx['username']}'>${idx['username']}</a>
				</td>
				<td>${idx['cpm']}</td>
				<td>100%</td>
			</tr>`;
	}
	tbody.innerHTML = table;
}

async function getlist(time) {
	let data
	data = await fetch(`/list_users?time=${time}`);
	data = await data.json()
	return data
}

function handleButtonActive() {
	const buttons = document.querySelectorAll('.buttons button');
	buttons.forEach((button) => {
		button.addEventListener('click', function (event) {
			buttons.forEach((button) => {
				button.classList.remove('active')
			});
			event.target.classList.add('active');
			createTable(button.getAttribute('mode'))
		})
	});
}

function init() {
	handleButtonActive();
        document.quertSelector('.buttons button[mode="30"]').click();
        createTable(30);

}

window.onloadFuncs.push(init);
