class Card {
	constructor(data) {
		this.data = data
		this.createCard()
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

	createCard = () => {
		let pagesMessage = this.createPagesMessage(this.data)	
		let button       = this.createButton(this.data)	
		let item = `<div id="${this.data.id}">
									<hr>
									<div class="card p-2 bg-faded">
		                <span class="close right">&times;</span>
					          <h5 class="card-title">${this.data.title}</h5>
					          <p>By ${this.data.author}</p>
					          ${pagesMessage}
					          ${button}
					        </div>
					      </div>`
		let element = document.createElement('div'); // is a node
		element.innerHTML = item
		this.element = element
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
}