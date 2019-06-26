class Kanban {
	constructor() {
		let storage = JSON.parse(localStorage.getItem('books'))
		this.books = storage || []
		this.url = "https://nervous-dingo-6.localtunnel.me/books"
		this.getBooks()
		this.buildCardsFromData()
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

	buildCardsFromData = () => {
		this.books.forEach( (book) => {
			let card = new Card(book)
			this.addToDOM(card.element, book.status)
		})
	}

	handleNext(event, addToDOM) {
		event.preventDefault()
		let bookCard = event.target.parentElement.parentElement
		let book = this.find(bookCard.id) || {}
		switch (event.target.id){
			case "markInProgress":
				book.status = "inProgress"
				addToDOM(bookCard, "inProgress")
				this.update(book)
				break;
			case "markComplete":
				book.status = "complete"
				addToDOM(bookCard, "complete")
				this.update(book)
				break;
			case "delete":
				this.delete(book)
				bookCard.parentNode.removeChild(bookCard)
				break;
		}
	}

	addToDOM = (element, status) => {
		console.log(status)
		let card = document.querySelector(`#${status}`);
		card.appendChild(element);
		card.lastElementChild.lastElementChild.lastElementChild.addEventListener("click", () => { this.handleNext(event, this.addToDOM) })
	}
}
