                    



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
const createCard = (data) => {
	let pagesMessage = createPagesMessage(data)								
	let item = `<hr>
							<div class="card p-2 bg-faded">
                <span class="close right">&times;</span>
			          <h5 class="card-title">${data.title}</h5>
			          <p>By ${data.author}</p>
			          ${pagesMessage}
			        </div>`
	let element = document.createElement('div'); // is a node
	element.innerHTML = item
	addToDOM(element, data.status)
}

addBookButton.addEventListener("click", () => {
	bookForm.classList.toggle("hide")
	addBookButton.classList.toggle("hide")
})

statusInput.addEventListener("change", (event) => {
	if(event.target.options.selectedIndex === 1) {
		currentPageForm.classList.toggle("hide")
	}
})


bookForm.addEventListener("submit", (event) => {
	event.preventDefault();
	let bookData = {
		title: titleInput.value,
		author: authorInput.value,
		pages: pagesInput.value,
		status: statusInput.value,
		currentPage: currentPageInput.value
	}
	createCard(bookData)
})

