/* eslint-env browser */
/* globals zlFetch */

// ========================
// Variables
// ========================
const endpoint = 'https://api.learnjavascript.today/letters'
const lettersElement = document.querySelector('.letters')
const spinner = document.querySelector('.spinner')
const loadMoreButton = document.querySelector('.load-more-button')
const dribbbleSection = document.querySelector('.dribbble-section')

// ========================
// Functions
// ========================
const hideElement = element => {
  element.setAttribute('hidden', true)
}

const showElement = element => {
  element.removeAttribute('hidden')
}

const addLettersToDOM = letters => {
  const fragment = document.createDocumentFragment()
  letters.forEach(letter => {
    const li = document.createElement('li')
    li.innerHTML = `
      <a class="letter" href="${letter.shotUrl}">
        <span>By ${letter.creator}</span>
        <img src="${letter.imageUrl}" alt="Picture of ${letter.letter}" width="400" height="300">
      </a>
    `
    fragment.appendChild(li)
  })
  lettersElement.appendChild(fragment)
}

const fetchLetters = _ => {
  showElement(spinner)
  hideElement(loadMoreButton)

  zlFetch(loadMoreButton.dataset.nextPage).then(response => {
    const { letters, nextPage } = response.body
    addLettersToDOM(letters)

    hideElement(spinner)
    showElement(loadMoreButton)

    if (nextPage) {
      loadMoreButton.dataset.nextPage = nextPage
    } else {
      hideElement(loadMoreButton)
      showElement(dribbbleSection)
    }
  })
}

// ========================
// Execution
// ========================
loadMoreButton.addEventListener('click', fetchLetters)
loadMoreButton.dataset.nextPage = `${endpoint}?limit=6&page=1`
loadMoreButton.click()

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.click()
    }
  })
})

observer.observe(loadMoreButton)
