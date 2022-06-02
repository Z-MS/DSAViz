function createBlocks() {
	const numbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]

	let charsArr = []
	const blocks = document.querySelector('.blocks')
	const BLOCKSLENGTH = 6

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
		{ backgroundColor: '#4C974E' },
		{ backgroundColor: '#15E229' }
	] // keyframes object

	let pulsingBox = [
		{ backgroundColor: '#15E229'},
		{ backgroundColor: 'yellow', transform: 'scale(1.25)' },
		{ backgroundColor: 'yellow'}
	]

	let pulsingTiming = {
		duration: 1000,
		iterations: 1
	} // timing object

	let myAnims = []

	// find the index of the target
	let index = charsArr.indexOf(key)
	let elems = document.querySelectorAll('.block')
	const searchCount = index >= 0 ? index : elems.length;

	for(let i = 0; i < searchCount; i++) {
		let searchAnim = elems[i].animate(
			flashingBoxes, pulsingTiming
		)

		searchAnim.pause()
		myAnims.push(searchAnim)
	}

	let lastSrchAnim
	let lastSrchAnimPos

	if(index != -1) {
		// Add the special 'found' animation to the array
		const targetBlock = elems[index]
		const foundAnim = targetBlock.animate(pulsingBox, pulsingTiming)
		foundAnim.pause()
		foundAnim.onfinish = function () {
			targetBlock.style.backgroundColor = 'yellow'
		}
		myAnims.push(foundAnim)
	// Handle Search Status 		
		if(searchCount == 0) {
			document.querySelector('#status__text').innerHTML = `FOUND <span class="target__num">${key}</span>`
		} else {
			lastSrchAnimPos = myAnims.length - 2
			lastSrchAnim = myAnims[lastSrchAnimPos]
			lastSrchAnim.onfinish = function () {
				document.querySelector('#status__text').innerHTML = `FOUND <span class="target__num">${key}</span>`
				myAnims[myAnims.length - 1].play()
			}
		}
	} else {
		// if the target was NOT found
		lastSrchAnimPos = myAnims.length - 1
		lastSrchAnim = myAnims[lastSrchAnimPos]
		lastSrchAnim.onfinish = function () {
			document.querySelector('#status__text').innerHTML = `COULD NOT FIND <span class="target__num">${key}</span>`
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
	const MAX = 9
	// random number between 0 and 9
	const target = Math.floor(Math.random() * (MAX - MIN + 1) + MIN)
	search(target, charsArr)	
}

init()