document.addEventListener('DOMContentLoaded', function () {
	console.log('Scripts')

	////////////////////////////////
	// Burger
	document.getElementById('burger').addEventListener('click', function (e) {
		e.currentTarget.classList.toggle('open');
		const menu = document.getElementById('burger-menu');
		menu.classList.toggle('show');
	});

})
