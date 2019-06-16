books = [
	{id: 1, title: "The Teachings of Don Juan", author: "Carlos Casteñeda", pages: 288, status: "complete", currentPage: 288},
	{id: 2, title: "You Don't Know JavaScript: Up and Going", author: "Kyle Simpson", pages: 87, status: "complete", currentPage: 87},
	{id: 3, title: "Permaculture: A Designers' Manual", author: "Bill Mollison", pages: 576, status: "toRead", currentPage: 0},
	{id: 4, title: "Atlantis: Insights from a Lost Civilization", author: "Shirley Andrews", pages: 292, status: "inProgress", currentPage: 96},
]                    



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

books.forEach( (book) => {
	createCard(book)
}) 

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

