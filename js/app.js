class Model {
	constructor() {
		let storage = JSON.parse(localStorage.getItem('books'))
		this.books = storage || []
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

	markInComplete = (id) => {
		for(var i=0 ; i < this.books.length; i++) {
	    if(this.books[i].id == id) {
	      this.books[i].status = "inComplete"
	    }
		}
	}
}

class Controller {
	constructor(model) {
		
	}

	buildCardsFromData(builder) {
		model.books.forEach( (book) => {
			builder(book)
		})
	}

	// NOTE: buttons would need to be re-rendered. This is challenging with no framework. Re-rendering based on data becoming updated is EXACTLY what React is going to make easy on us.
	handleNext(event, addToDOM) {
		event.preventDefault()
		let bookCard = event.target.parentElement.parentElement
		switch (event.target.id){
			case "markInProgress":
				model.markInProgress(bookCard.id)
				addToDOM(bookCard, "inProgress")
				break;
			case "markComplete":
				model.markInComplete(bookCard.id)
				addToDOM(bookCard, "complete")
				break;
			case "delete":
				model.removeItemFromArray(bookCard.id)
				bookCard.parentNode.removeChild(bookCard)
				break;
		}
	}
}

class View {
	constructor(controller) {
		this.addBookButton    = document.querySelector("#addBook")
		this.bookForm         = document.querySelector("#bookForm")
		this.statusInput      = document.querySelector("#statusInput")
		this.currentPageForm  = document.querySelector("#currentPageForm")
		this.currentPageInput = document.querySelector("#currentPageInput")
		this.titleInput       = document.querySelector("#title")
		this.authorInput      = document.querySelector("#author")
		this.pagesInput       = document.querySelector("#pages")
		this.createEventListeners()
		controller.buildCardsFromData(this.createCard)
	}

	addToDOM(element, status) {
		let card = document.querySelector(`#${status}`);
		card.appendChild(element);
		card.lastElementChild.lastElementChild.lastElementChild.addEventListener("click", () => { controller.handleNext(event, this.addToDOM) })
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
				id: model.books.length,
				title: view.titleInput.value,
				author: view.authorInput.value,
				pages: view.pagesInput.value,
				status: view.statusInput.value,
				currentPage: view.currentPageInput.value
			}
			model.books.push(bookData)
			localStorage.setItem("books", JSON.stringify(model.books))
			view.createCard(bookData)
		})
	}
}

const model      = new Model()
const controller = new Controller(model)
const view       = new View(controller)








