function createBlocks() {
	const numbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

	let charsArr = []
	const blocks = document.querySelector('.blocks')
	const BLOCKSLENGTH = 5

	for(let i = 0; i < BLOCKSLENGTH; i++) {
		let block = document.createElement('div')
		block.className = 'block'

		let genChar = numbers[Math.floor(Math.random() * (numbers.length - 0) + 0)]
		// check if the array contains the newly created char, if so, generate a new one 
		while(charsArr.includes(genChar)) {
			genChar = numbers[Math.floor(Math.random() * (numbers.length - 0) + 0)]
			if(!charsArr.includes(genChar)) {
				break
			}
		}
		charsArr.push(genChar)

		const text = document.createElement('span')
		text.innerText = genChar
		text.id = genChar
		block.appendChild(text)
		blocks.appendChild(block)
	}

	return charsArr
}

function search(key, charsArr) {
	let numText = document.querySelector('.target__num')
	numText.innerText = key

	let flashingBoxes = [
		{ backgroundColor: '#15E229' },
		{ backgroundColor: '#4C974E', transform: 'scale(1.05)' },
		{ backgroundColor: '#15E229' }
	] // keyframes object

	let pulsingBox = [
		{ backgroundColor: '#15E229'},
		{ backgroundColor: 'yellow', transform: 'scale(1.25)' },
		{ backgroundColor: 'yellow'}
	]

	let btnFadeIn = [
		{ opacity: 0 },
		{ opacity: 1 }
	]

	let searchTiming = {
		duration: 500,
		iterations: 1
	}

	let pulsingTiming = {
		duration: 800,
		iterations: 1
	}

	let myAnims = []

	// find the index of the target
	let index = charsArr.indexOf(key)
	let elems = document.querySelectorAll('.block')
	const searchCount = index >= 0 ? index : elems.length;

	for(let i = 0; i < searchCount; i++) {
		let searchAnim = elems[i].animate(
			flashingBoxes, searchTiming
		)

		searchAnim.pause()
		myAnims.push(searchAnim)
	}

	let lastSrchAnim
	let lastSrchAnimPos
	let searchBtn = document.querySelector('#search__btn')

	if(index != -1) {
		// Add the special 'found' animation to the array
		const targetBlock = elems[index]
		const foundAnim = targetBlock.animate(pulsingBox, pulsingTiming)
		foundAnim.pause()
		foundAnim.onfinish = function () {
			searchBtn.style.visibility = 'visible'
			searchBtn.animate(btnFadeIn, pulsingTiming.duration / 10)
			searchBtn.style.opacity = 1
			targetBlock.style.backgroundColor = 'yellow'
		}
		myAnims.push(foundAnim)
	// Handle Search Status 		
		if(searchCount == 0) {
			setStatus('found', key)
		} else {
			lastSrchAnimPos = myAnims.length - 2
			lastSrchAnim = myAnims[lastSrchAnimPos]
			lastSrchAnim.onfinish = function () {
				setStatus('found', key)
				myAnims[myAnims.length - 1].play()
			}
		}
	} else {
		// if the target was NOT found
		lastSrchAnimPos = myAnims.length - 1
		lastSrchAnim = myAnims[lastSrchAnimPos]
		lastSrchAnim.onfinish = function () {
			searchBtn.style.visibility = 'visible'
			searchBtn.animate(btnFadeIn, pulsingTiming.duration / 10)
			searchBtn.style.opacity = 1
			setStatus('notfound', key)
		}
	}
	
	// Handle all 'onfinish' events for all search animations before the last
	for(let i = 0; i < lastSrchAnimPos; i++) {
		let next = myAnims[i + 1]
		// Animation chaining
		myAnims[i].onfinish = function () {
			next.play()
		}
	}
 
	myAnims[0].play()
}

function init() {
	// Linear search through a JavaScript Set
	let charsArr = createBlocks()
	const MIN = 0
	const MAX = 10
	// random number between 0 and 9
	const target = Math.floor(Math.random() * (MAX - MIN + 1) + MIN)
	search(target, charsArr)	
}

function setStatus(msg, num = "") {
	const statuses = {
		searching: "<p id='status__text'>SEARCHING FOR <span class='target__num'></span></p>",
		found: `FOUND <span class="target__num">${num}</span>`,
		notfound: `COULD NOT FIND <span class="target__num">${num}</span>`
	}
	
	document.querySelector('#status__text').innerHTML = statuses[`${msg}`]
}

function reset() {
	setStatus('searching')
	document.querySelector('.blocks').innerHTML = ""
	let searchBtn = document.querySelector('#search__btn')
	searchBtn.style.opacity = 0
	searchBtn.style.visibility = 'hidden'
}

function newSearch() {
	reset()
	init()
}

init()