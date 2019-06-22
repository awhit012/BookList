class Model {
	constructor() {
		let storage = JSON.parse(localStorage.getItem('books'))
		this.books = storage || []
		this.getBooks()
	}

	getBooks() {
		// create a request object
		let xhr = new XMLHttpRequest();

		// open request. Arguments are the **method**, **url**, and an optional boolean to determine if the request should be **async**
		xhr.open('GET', 'https://ugly-newt-55.localtunnel.me/books', false);
		// listener for the request to be loaded
		xhr.onload = () => {
		    if (xhr.status === 200) {
		        this.books = JSON.parse(xhr.responseText)
				console.log(this.books)
		    }
		    // error handling
		    else {
		        this.books = [{status: "error"}]
		    }
		};
		// sending the actual request
		xhr.send();
	}

	addBook(bookData) {
		let xhr = new XMLHttpRequest();
		xhr.open('POST', 'https://ugly-newt-55.localtunnel.me/books');
		// xhr.setRequestHeader('Content-Type', 'application/json');
		xhr.onload = function() {
		    if (xhr.status === 200) {
		        console.log("success", xhr.responseText)
		    }
		    else if (xhr.status !== 200) {
		       console.log("error", xhr.status)
		    }
		};
		xhr.send(JSON.stringify(bookData));
	}

	removeItemFromArray(id) {
		for(var i=0 ; i < this.books.length; i++) {
	    if(this.books[i].id == id) {
	      this.books.splice(i);
	    }
		}
	}

	markInProgress(id) {
		for(var i=0 ; i < this.books.length; i++) {
	    if(this.books[i].id == id) {
	      this.books[i].status = "inProgress"
	    }
		}
	}

	markComplete = (id) => {
		for(var i=0 ; i < this.books.length; i++) {
	    if(this.books[i].id == id) {
	      this.books[i].status = "complete"
	    }
		}
	}
}

class Controller {
	constructor(model) {
		this.model = model
	}

	createBook(bookData) {
		bookData.id = this.model.books.length
		this.model.addBook(bookData)
	}

	buildCardsFromData(builder) {
		console.log(this.model)
		this.model.books.forEach( (book) => {
			builder(book)
		})
	}

	// NOTE: buttons would need to be re-rendered. This is challenging with no framework. Re-rendering based on data becoming updated is EXACTLY what React is going to make easy on us.
	handleNext(event, addToDOM) {
		event.preventDefault()
		let bookCard = event.target.parentElement.parentElement
		switch (event.target.id){
			case "markInProgress":
				this.model.markInProgress(bookCard.id)
				addToDOM(bookCard, "inProgress")
				break;
			case "markComplete":
				this.model.markComplete(bookCard.id)
				addToDOM(bookCard, "complete")
				break;
			case "delete":
				this.model.removeItemFromArray(bookCard.id)
				bookCard.parentNode.removeChild(bookCard)
				break;
		}
		localStorage.setItem("books", JSON.stringify(this.model.books))
		location.reload()
	}
}

class View {
	constructor(controller) {
		this.controller = controller
		this.addBookButton    = document.querySelector("#addBook")
		this.bookForm         = document.querySelector("#bookForm")
		this.statusInput      = document.querySelector("#statusInput")
		this.currentPageForm  = document.querySelector("#currentPageForm")
		this.currentPageInput = document.querySelector("#currentPageInput")
		this.titleInput       = document.querySelector("#title")
		this.authorInput      = document.querySelector("#author")
		this.pagesInput       = document.querySelector("#pages")
		this.createEventListeners()
		this.controller.buildCardsFromData(this.createCard)
	}

	addToDOM = (element, status) => {
		console.log(status)
		let card = document.querySelector(`#${status}`);
		card.appendChild(element);
		card.lastElementChild.lastElementChild.lastElementChild.addEventListener("click", () => { this.controller.handleNext(event, this.addToDOM) })
	}

	createPagesMessage = (data) => {
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

	createButton(data) {
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

	createCard = (data) => {
		let pagesMessage = this.createPagesMessage(data)	
		let button       = this.createButton(data)	
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
		this.addToDOM(element, data.status)
	}

	createEventListeners = () => {
		this.addBookButton.addEventListener("click", () => {
			this.bookForm.classList.toggle("hide")
			this.addBookButton.classList.toggle("hide")
		})

		this.statusInput.addEventListener("change", (event) => {
			if(event.target.options.selectedIndex === 1) {
				currentPageForm.classList.remove("hide")
			} else {
				currentPageForm.classList.add("hide")
			}
		})

		this.bookForm.addEventListener("submit", (event) => {
			event.preventDefault();
			let bookData = {
				title: this.titleInput.value,
				author: this.authorInput.value,
				pages: this.pagesInput.value,
				status: this.statusInput.value,
				currentPage: this.currentPageInput.value
			}
			this.controller.createBook(bookData)
			this.createCard(bookData)
		})
	}
}

function start() {
	const model      = new Model()
	const controller = new Controller(model)
	const view       = new View(controller)
}

start()










