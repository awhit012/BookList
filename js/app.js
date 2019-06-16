                    
let item =  `<hr>
						<div class="card p-2 bg-faded">
		          <h5 class="card-title">Item</h5>
		          <p>With supporting text below as a natural lead-in to additional content.</p>
		        </div>`


const addBookButton    = document.querySelector("#addBook")
const bookForm         = document.querySelector("#bookForm")
const statusInput      = document.querySelector("#statusInput")
const currentPageInput = document.querySelector("#currentPageInput")


addBookButton.addEventListener("click", () => {
	bookForm.classList.toggle("hide")
	addBookButton.classList.toggle("hide")
})

statusInput.addEventListener("change", (e) => {
	if(e.target.options.selectedIndex === 1) {
		currentPageInput.classList.toggle("hide")
	}
})
