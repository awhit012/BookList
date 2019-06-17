let storage = JSON.parse(localStorage.getItem('books'))
let books = storage || []


const addBookButton    = document.querySelector("#addBook")
const bookForm         = document.querySelector("#bookForm")
const statusInput      = document.querySelector("#statusInput")
const currentPageForm  = document.querySelector("#currentPageForm")
const currentPageInput = document.querySelector("#currentPageInput")

const titleInput = document.querySelector("#title")
const authorInput = document.querySelector("#author")
const pagesInput = document.querySelector("#pages")

const addToDOM = (element, status) => {
	let card = document.querySelector(`#${status}`);
	card.appendChild(element);
	card.lastElementChild.lastElementChild.lastElementChild.addEventListener("click", handleNext)
}

createPagesMessage = (data) => {
	console.log(data)
	let pagesMessage = document.createElement('small')
	if (data.status === "inProgress") {
			pagesMessage.innerHTML = `<small>
															You have read ${data.currentPage} out of ${data.pages} pages!
														</small>`
	} else {
			pagesMessage.innerHTML = `<small>
															Length: ${data.pages} pages
														</small>`
	}
	return pagesMessage.outerHTML
}

const removeItemFromArray = (id) => {
	for(var i=0 ; i<books.length; i++) {
    if(books[i].id == id) {
      books.splice(i);
    }
	}
}

const markInProgress = (id) => {
	for(var i=0 ; i<books.length; i++) {
    if(books[i].id == id) {
      books[i].status = "inProgress"
    }
	}
}

const markInComplete = (id) => {
	for(var i=0 ; i<books.length; i++) {
    if(books[i].id == id) {
      books[i].status = "inComplete"
    }
	}
}

// NOTE: buttons would need to be re-rendered. This is challenging with no framework. Re-rendering based on data becoming updated is EXACTLY what React is going to make easy on us.
const handleNext = (event) => {
	event.preventDefault()
	let bookCard = event.target.parentElement.parentElement
	switch (event.target.id){
		case "markInProgress":
			markInProgress(bookCard.id)
			addToDOM(bookCard, "inProgress")
			break;
		case "markComplete":
			markInComplete(bookCard.id)
			addToDOM(bookCard, "complete")
			break;
		case "delete":
			removeItemFromArray(bookCard.id)
			bookCard.parentNode.removeChild(bookCard)
			break;
	}
}

const createButton = data => {
	let buttonNext = document.createElement('button')
		buttonNext.classList.add("btn")
	if(data.status === "toRead") {
		buttonNext.classList.add("btn-outline-primary")
		buttonNext.id = "markInProgress"
		buttonNext.innerText = "Mark In Progress"
	} else if (data.status === "inProgress") {
		buttonNext.classList.add("btn-outline-success")
		buttonNext.id = "markComplete"
		buttonNext.innerText = "Mark Complete"
	} else {
		buttonNext.classList.add("btn-outline-danger")
		buttonNext.id = "delete"
		buttonNext.innerText = "Delete"
	}
	return buttonNext.outerHTML;
}

const createCard = (data) => {
	let pagesMessage = createPagesMessage(data)	
	let button       = createButton(data)	

	console.log()				
	let item = `<div id="${data.id}">
								<hr>
								<div class="card p-2 bg-faded">
	                <span class="close right">&times;</span>
				          <h5 class="card-title">${data.title}</h5>
				          <p>By ${data.author}</p>
				          ${pagesMessage}
				          ${button}
				        </div>
				      </div>`
	let element = document.createElement('div'); // is a node
	element.innerHTML = item
	addToDOM(element, data.status)
}

books.forEach( (book) => {
	createCard(book)
}) 

addBookButton.addEventListener("click", () => {
	bookForm.classList.toggle("hide")
	addBookButton.classList.toggle("hide")
})

statusInput.addEventListener("change", (event) => {
	if(event.target.options.selectedIndex === 1) {
		currentPageForm.classList.remove("hide")
	} else {
		currentPageForm.classList.add("hide")
	}
})


bookForm.addEventListener("submit", (event) => {
	event.preventDefault();
	let bookData = {
		id: books.length,
		title: titleInput.value,
		author: authorInput.value,
		pages: pagesInput.value,
		status: statusInput.value,
		currentPage: currentPageInput.value
	}
	books.push(bookData)
	localStorage.setItem("books", JSON.stringify(books))
	createCard(bookData)
})

