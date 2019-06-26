class Model {
	constructor() {
		let storage = JSON.parse(localStorage.getItem('books'))
		this.books = storage || []
		this.url = "https://gentle-panda-86.localtunnel.me/books"
		this.getBooks()
	}

	getBooks() {
		// create a request object
		let xhr = new XMLHttpRequest();
		xhr.withCredentials = true;
		// open request. Arguments are the **method**, **url**, and an optional boolean to determine if the request should be **async**
		xhr.open('GET', this.url, false);
		// listener for the request to be loaded
		xhr.onload = () => {
		    if (xhr.status === 200) {
		    	try {
	        	this.books = JSON.parse(xhr.responseText)
		    	} catch {
		    		this.books = []
		    	}
		    }
		    // error handling
		    else {
	        this.books = [{status: "error"}]
		    }
		};
		// sending the actual request
		xhr.send();
	}


	update(book) {
		let xhr = new XMLHttpRequest();
		xhr.open('PUT', `${this.url}/${book.id}`);
		xhr.withCredentials = true;
		xhr.onload = function() {
		    if (xhr.status === 200) {
		        console.log("success", xhr.responseText)
		    }
		    else if (xhr.status !== 200) {
		       console.log("error", xhr.status)
		    }
		};
		console.log("book:", book)
		console.log("xhr:", xhr)
		xhr.send(JSON.stringify(book));
	}

	find(id) {
		for(var i=0 ; i < this.books.length; i++) {
	    if(this.books[i].id == id) {
	      return this.books[i]
	    }
		}
	}

	delete(book) {
		console.log(book, book.id)
		let xhr = new XMLHttpRequest();
		xhr.open('DELETE', `${this.url}/${book.id}`);
		xhr.withCredentials = true;
		xhr.onload = function() {
		    if (xhr.status === 200) {
		        console.log("success", xhr.responseText)
		    }
		    else if (xhr.status !== 200) {
		       console.log("error", xhr.status)
		    }
		};
		xhr.send();
	}

}

class Controller {
	constructor(model) {
		this.model = model
	}

	createBook(bookData) {
		this.model.addBook(bookData)
	}

	buildCardsFromData(builder) {
		this.model.books.forEach( (book) => {
			builder(book)
		})
	}

	// NOTE: buttons would need to be re-rendered. This is challenging with no framework. Re-rendering based on data becoming updated is EXACTLY what React is going to make easy on us.
	handleNext(event, addToDOM) {
		event.preventDefault()
		let bookCard = event.target.parentElement.parentElement
		let book = this.model.find(bookCard.id) || {}
		switch (event.target.id){
			case "markInProgress":
				book.status = "inProgress"
				addToDOM(bookCard, "inProgress")
				this.model.update(book)
				break;
			case "markComplete":
				book.status = "complete"
				addToDOM(bookCard, "complete")
				this.model.update(book)
				break;
			case "delete":
				this.model.delete(book)
				bookCard.parentNode.removeChild(bookCard)
				break;
		}
	}
}

class View {
	constructor(controller) {
		this.controller = controller
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
}

function start() {
	const model      = new Model()
	const controller = new Controller(model)
	const view       = new View(controller)
}

start()










