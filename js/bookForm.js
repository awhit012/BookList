class BookForm {
	constructor() {
		this.loadForm()
		this.url = "https://nervous-dingo-6.localtunnel.me/books"
		this.bookForm.addEventListener("submit", this.handleSubmit)
		this.addBookButton = document.querySelector("#addBook")
		this.addBookButton.addEventListener("click", this.showBookForm)

		this.statusInput.addEventListener("change", this.hideStatus)
	}

	hideStatus(event) {
		if(event.target.options.selectedIndex === 1) {
			currentPageForm.classList.remove("hide")
		} else {
			currentPageForm.classList.add("hide")
		}
	}

	loadForm() {
		this.statusInput      = document.querySelector("#statusInput")
		this.currentPageForm  = document.querySelector("#currentPageForm")
		this.currentPageInput = document.querySelector("#currentPageInput")
		this.titleInput       = document.querySelector("#title")
		this.authorInput      = document.querySelector("#author")
		this.pagesInput       = document.querySelector("#pages")
		this.bookForm         = document.querySelector("#bookForm")
	}

	showBookForm = () => {
		this.bookForm.classList.toggle("hide")
		this.addBookButton.classList.toggle("hide")
	}
		
	handleSubmit = (event) => {
		event.preventDefault();
		let bookData = {
			title: this.titleInput.value,
			author: this.authorInput.value,
			pages: this.pagesInput.value,
			status: this.statusInput.value,
			currentPage: this.currentPageInput.value
		}
		this.postBook(bookData)
	}

	postBook(bookData) {
		let xhr = new XMLHttpRequest();
		xhr.open('POST', this.url);
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
}	

