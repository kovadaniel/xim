document.addEventListener('DOMContentLoaded', function () {
	console.log('Scripts')

	////////////////////////////////
	// Burger
	document.getElementById('burger').addEventListener('click', function () {
		const menu = document.getElementById('burger-menu')
		menu.classList.toggle('show')
	});

	////////////////////////////////
	// Modal
	const closeModalButtons = document.querySelectorAll('.modal-close');

	for (var i = 0; i < closeModalButtons.length; i++) {
		closeModalButtons[i].addEventListener('click', function () {
			const modal = this.closest('.modal')
			if (modal) {
				modal.style.display = 'none'
			}
		})
	}

	/* */

	const showModalButtons = document.querySelectorAll('.show-modal')

	for (let i = 0; i < showModalButtons.length; i++) {
		showModalButtons[i].addEventListener('click', function () {
			const modalId = this.getAttribute('data-modal')
			const modalElement = document.getElementById(modalId)

			if (modalElement) {
				modalElement.style.display = 'block'
			}
		})
	}


	////////////////////////////////
	// Cookie

	const hideCookieNotification = () => {
		document.getElementById('cookie').style.display = 'none'
	}
	
	const acceptCookie = () => {
		localStorage.setItem('cookieAccepted', true)
		hideCookieNotification()
	}
	
	const closeCookieNotification = () => {
		hideCookieNotification()
	}
	
	if (localStorage.getItem('cookieAccepted') !== 'true') {
		document.getElementById('cookie').style.display = 'flex'
	
		document.getElementById('cookie-ok')
			.addEventListener('click', acceptCookie)

		document.getElementById('cookie-close')
			.addEventListener('click', closeCookieNotification)
	}

	/**/

	// const HEADER = 'header'
	// const COMPACT = HEADER + '_compact'

	// const header = document.querySelector('.' + HEADER)

	// const checkScrollPosition = () => {
	// 	if (
	// 		window.hasOwnProperty('scrollY')
	// 		&& window.scrollY > 90
	// 	)
	// 		header.classList.add(COMPACT)
	// 	else
	// 		header.classList.remove(COMPACT)
	// }

	// checkScrollPosition()
	// window.addEventListener('scroll', checkScrollPosition)


	////////////////////////////////
	// Slider

	class Carousel {
		constructor(carousel) {
			this.carousel = carousel;
			this.carouselWidth = this.carousel.offsetWidth;
			this.carouselContent = carousel.querySelector('.carousel-wrapper')
			this.carouselItems = Array.from(this.carouselContent.children)
			this.carouselItemsCount = this.carouselItems.length
			// this.activeIndex = 0
			this.dragging = false
			this.scrollDiff = 0
			this.scrollX = 0
			this.scrollY = 0
			this.startX = 0
			this.currentTranslate = 0
			this.mouseMove = 0
			this.slideWidth = this.carouselItems[0].offsetWidth
			this.slideHeight = this.carouselItems[0].offsetWidth
			this.sliderFullWidth = this.slideWidth * this.carouselItemsCount
			console.log(this.slideWidth)
			// const children = this.carouselContent.children;
			// for (let i = 0; i < children.length; i++) {
			// 	this.sliderFullWidth += children[i].offsetWidth;
			// }

			this.maxTranslete = this.sliderFullWidth - this.carouselWidth
			this.active = true
			this.isLastSlide = false
			this.isFirsSlide = true

			if (this.sliderFullWidth <= window.innerWidth) {
				this.active = false
				this.carousel.style.cursor = 'initial'
			} else {
				this.timer = setInterval(() => {
					this.nexSlide(true)
				}, 1750)
				this.createNavigationButtons()
			}

			this.handleMouseDown = this.handleMouseDown.bind(this)
			this.handleMouseMove = this.handleMouseMove.bind(this)
			this.handleMouseUp = this.handleMouseUp.bind(this)

			// carousel.addEventListener('mousedown', this.handleMouseDown)
			// carousel.addEventListener('touchstart', this.handleMouseDown)

			// carousel.addEventListener('mousemove', this.handleMouseMove)
			// carousel.addEventListener('touchmove', this.handleMouseMove)

			// carousel.addEventListener('mouseup', this.handleMouseUp)
			// carousel.addEventListener('mouseleave', this.handleMouseUp)
			// carousel.addEventListener('touchend', this.handleMouseUp)
		}

		createNavigationButtons() {
			this.navContainer = document.createElement('div')
			this.navContainer.className = 'carousel-navigation'

			this.prevButton = document.createElement('button')
			this.prevButton.className = 'carousel-prev-button'
			this.prevButton.setAttribute('title', 'Назад')
			this.prevButton.addEventListener('click', () => this.prevSlide())

			this.nextButton = document.createElement('button')
			this.nextButton.className = 'carousel-next-button'
			this.nextButton.setAttribute('title', 'Вперёд')
			this.nextButton.addEventListener('click', () => this.nexSlide())

			this.navContainer.appendChild(this.prevButton)
			this.navContainer.appendChild(this.nextButton)

			this.carousel.appendChild(this.navContainer)
		}

		handleMouseDown(e) {
			if (!this.active) return
			this.dragging = true;

			this.startX = e.clientX || e.touches[0].clientX
			this.startY = e.clientY || e.touches[0].clientY

			this.carousel.classList.add('dragging')

			if (this.timer) {
				clearInterval(this.timer)
				this.timer = null
			}
			this.mouseMove = 0
		}

		handleMouseMove(e) {
			if (!this.active || !this.dragging) return;
		
			e.preventDefault()

			this.scrollX = e.clientX || e.touches[0].clientX || 0
			this.scrollY = e.clientY || e.touches[0].clientY || 0

			const x = Math.abs(this.startX - this.scrollX)
			const y = Math.abs(this.startY - this.scrollY)

			// console.log({x}, {y})

			if (y > 20 && x > 0) {
				this.dragging = false
				this.scrollDiff = 0;
				this.startX = this.scrollX;
				return
			}

			this.scrollDiff = this.scrollX - this.startX;

			this.mouseMove += this.scrollDiff

			this.updateTranslate(this.currentTranslate + this.scrollDiff)
			this.scrollDiff = 0;
			this.startX = this.scrollX;
		}

		updateTranslate(value) {
			debugger
			if (value > 0) {
				value *= 0.78;
			} else if (value < -this.maxTranslete) {
				const overflow = value + this.maxTranslete;
				value = -this.maxTranslete - Math.pow(-overflow, 0.9)
			}

			this.currentTranslate = 0 + value
			this.setTranslate(this.currentTranslate)
			requestAnimationFrame(() => {
				this.translate()
			})
		}

		setTranslate(value) {
			this.currentTranslate = value
			this.translate()
		}
		translate() {
			this.carouselContent.style.transform = `translateX(${this.currentTranslate}px)`
		}

		nexSlide(auto = false) {
			if (!auto) {
				clearInterval(this.timer)
				this.timer = null
			}

			if (this.isFirsSlide)
				this.currentTranslate = 0
			
			const slidePos = Math.floor(this.currentTranslate * -1 / this.slideWidth)

			let newTranslate = this.slideWidth * (slidePos + 1) * -1

			// if (auto && newTranslate < this.maxTranslete * -1 && slidePos == this.carouselItemsCount)
			if (this.isLastSlide) {
				newTranslate = 0
				this.isFirsSlide = true
				this.isLastSlide = false
			} else if (!this.isLastSlide && newTranslate <= this.maxTranslete * -1) {
				this.isLastSlide = true
				this.isFirsSlide = false
				newTranslate = this.maxTranslete * -1
			} else {
				this.isFirsSlide = false
			}

			this.setTranslate(newTranslate)
		}

		prevSlide(auto = false) {
			if (!auto) {
				clearInterval(this.timer)
				this.timer = null
			}
			const slidePos = Math.floor(this.currentTranslate * -1 / this.slideWidth)

			let newTranslate = this.slideWidth * (slidePos - 1) * -1

			if (newTranslate > 0)
				newTranslate = 0

			if (slidePos <= 0 && newTranslate <= 0)
				newTranslate = this.maxTranslete * -1

			console.log({slidePos}, {newTranslate})
			this.setTranslate(newTranslate)
		}

		alignSlides() {
			const slidePos = Math.round(this.currentTranslate * -1 / this.slideWidth)

			const newSlide = (slidePos > this.carouselItemsCount) 
				? 0
				: slidePos * this.slideWidth * -1

			this.setTranslate(newSlide)

			this.mouseMove = 0
			// console.log({slidePos})

		}

		handleMouseUp() {
			if (!this.active || !this.dragging) return

			this.dragging = false;
			this.carousel.classList.remove('dragging')

			if (this.currentTranslate > 0) {
				this.currentTranslate = 0;
			} else if (this.currentTranslate < -this.maxTranslete) {
				this.currentTranslate = -this.maxTranslete;
			} else {

				if (this.mouseMove < 0)
					this.nexSlide()
				else
					this.prevSlide()
			}
			this.setTranslate(this.currentTranslate);
		}

	}

const carousels = document.querySelectorAll('.carousel');

setTimeout(() => {
	carousels.forEach((carousel) => new Carousel(carousel))
}, 1000)


	////////////////////////////////
	// Accordion

	const sections = document.querySelectorAll('.accordion__section')

	if (sections) {

		if (sections.length > 0) {
			sections[0].classList.add('active')
			const firstAnswer = sections[0].querySelector('.accordion__answer')
			firstAnswer.style.maxHeight = firstAnswer.scrollHeight + 'px'
		}
	
		function collapseAllExceptActive(activeSection) {
			sections.forEach((section) => {
				if (section !== activeSection) {
					section.classList.remove('active')
					section.querySelector('.accordion__answer').style.maxHeight = null
				}
			})
		}
	
		function toggleAccordion() {
			const answer = this.nextElementSibling
			const isActive = this.parentNode.classList.contains('active')
		
			collapseAllExceptActive(this.parentNode)
		
			if (isActive) {
				this.parentNode.classList.remove('active')
				answer.style.maxHeight = null
			} else {
				this.parentNode.classList.add('active')
				answer.style.maxHeight = answer.scrollHeight + 'px'
			}
		}
	
		sections.forEach((section) => {
			const question = section.querySelector('.accordion__question')
			question.addEventListener('click', toggleAccordion)
		})
	}


	////////////////////////////////
	// Timer
	// Дата на следующее 5 либо 15 но только чтобы до следующей даты было более двух дней, наверное.

	const timer = document.getElementById('timer')

	if (timer) {

		const getNextDate = () => {
			const currentDate = new Date()
			let currentMonth = currentDate.getMonth()
			let targetDay = 5
		
			if (currentDate.getDate() > 15) {
				targetDay = 15
				currentMonth += 1
			} else if (currentDate.getDate() <= 5) {
				targetDay = 5
			} else {
				const daysTo5 = 5 - currentDate.getDate()
				const daysTo15 = 15 - currentDate.getDate()
				targetDay = daysTo5 < daysTo15 ? 5 : 15
			}
		
			const targetDate = new Date(currentDate.getFullYear(), currentMonth, targetDay)
		
			targetDate.setDate(targetDate.getDate() + 2)
		
			if (targetDate.getTime() - currentDate.getTime() < 2 * 24 * 60 * 60 * 1000) {
				targetDate.setMonth(targetDate.getMonth() + 1)
			}
		
			return targetDate
		}

		const targetDate = new Date(getNextDate()).getTime()

		function startCountdown() {
			const currentDate = new Date().getTime()

			const timeRemaining = targetDate - currentDate

			const daysElement = document.getElementById("days")
			const hoursElement = document.getElementById("hours")
			const minutesElement = document.getElementById("minutes")
			const secondsElement = document.getElementById("seconds")

			let days = Math.floor(timeRemaining / (1000 * 60 * 60 * 24))
			let hours = Math.floor(
				(timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
			)
			let minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60))
			let seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000)

			days = String(days).padStart(2, "0")
			hours = String(hours).padStart(2, "0")
			minutes = String(minutes).padStart(2, "0")
			seconds = String(seconds).padStart(2, "0")

			daysElement.textContent = days
			hoursElement.textContent = hours
			minutesElement.textContent = minutes
			secondsElement.textContent = seconds

		}

		setInterval(startCountdown, 1000)
	}

	function submitForm(event) {
		event.preventDefault();

		const form = event.target;
		const formData = new FormData(form);

		const selectedRadios = form.querySelectorAll('input[type="radio"]:checked');
		selectedRadios.forEach(radio => {
			 formData.append(radio.name, radio.value);
		});

		const selectedCheckboxes = form.querySelectorAll('input[type="checkbox"]:checked');
		selectedCheckboxes.forEach(checkbox => {
			 formData.append(checkbox.name, checkbox.value);
		});

		const constructorForm = document.querySelector('#constructor');
		if (constructorForm) {
			 const constructorFormData = new FormData(constructorForm);

			 constructorFormData.forEach((value, key) => {
				  formData.append(key, value);
			 });
		}
  
		fetch('/form.php', {
			 method: 'POST',
			 body: formData
		})
		.then(response => response.text())
		.then(data => {
			 if (data === 'success') {
				const newElement = document.createElement('p');
				newElement.innerHTML ='<div class="sended">Спасибо за вашу заявку!</div>';
				form.querySelector('input[type="submit"]').insertAdjacentElement('afterend', newElement);
				form.querySelector('input[type="submit"]').remove();
	
			} else {
				alert('Произошла ошибка при отправке формы')
			}
		})
		.catch(error => {
			alert('Произошла ошибка:', error);
		});
	}

	const forms = document.querySelectorAll('form');
	forms.forEach(form => {
		form.addEventListener('submit', submitForm);
	});

	function shuffleImages() {
		const remixElement = document.querySelector('.shuffled');
		if (!remixElement) return
		const imgElements = Array.from(remixElement.querySelectorAll('img'));

		for (let i = imgElements.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[imgElements[i], imgElements[j]] = [imgElements[j], imgElements[i]];
		}

		remixElement.innerHTML = '';
	
		imgElements.forEach((img) => {
		remixElement.appendChild(img);
		});
	}

	shuffleImages();

})
