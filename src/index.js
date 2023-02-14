const cocktailURL = "https://www.thecocktaildb.com/api/json/v1/1/"

document.addEventListener('DOMContentLoaded', () => {
    fetch(`${cocktailURL}random.php`)
        .then(resp => resp.json())
        .then(data => {
            console.log(data.drinks[0])
            renderDrink(data.drinks[0])
        })

    const hide = document.getElementById('hide')
    hide.addEventListener('click', () => {
        toggleRandomCocktail()
    })

    const form = document.getElementById('form')
    form.addEventListener('submit', event => {
        event.preventDefault()
        search(event);
    })
})

function renderDrink(drink) {
    const ingredients = countIngredients(drink)
    const measures = countMeasures(drink)

    const div = document.getElementById('random-cocktail')
    const img = document.createElement('img')
    const h3 = document.createElement('h3')
    const ing = document.createElement('p')
    let ingList = ''
    const p = document.createElement('p')
    img.src = `${drink.strDrinkThumb}/preview`
    img.alt = 'Drink thumbnail'
    img.id = 'drink-thumbnail'
    img.addEventListener('mouseover', event => {
        enlarge(event.toElement)
    })
    img.addEventListener('mouseout', event => {
        resize(event.fromElement)
    })
    h3.textContent = `${drink.strDrink} (${drink.strAlcoholic})`
    p.textContent = drink.strInstructions
    div.appendChild(img)
    div.appendChild(h3)
    for (let i = 0; i < ingredients.length; i++) {
        let measure = measures[i] ? measures[i] : ''
        ingList = ingList + `${measure} ${ingredients[i]}<br>`
    }
    ing.innerHTML = ingList
    div.appendChild(ing)
    div.appendChild(p)

}

function enlarge(element) {
    const img = document.getElementById('drink-thumbnail')
    img.src = element.src.slice(0, -8)
    img.style = 'position:absolute;top:0px;left:0px;'
}

function resize(element) {
    const img = document.getElementById('drink-thumbnail')
    img.src = `${element.src}/preview`
    img.style = ''
}

function countIngredients(drink) {
    const ingArr = [
        drink.strIngredient1,
        drink.strIngredient2,
        drink.strIngredient3,
        drink.strIngredient4,
        drink.strIngredient5,
        drink.strIngredient6,
        drink.strIngredient7,
        drink.strIngredient8,
        drink.strIngredient9,
        drink.strIngredient10
    ]

    return ingArr.filter(n => n != null)
}

function countMeasures(drink) {
    const meaArr = [
        drink.strMeasure1,
        drink.strMeasure2,
        drink.strMeasure3,
        drink.strMeasure4,
        drink.strMeasure5,
        drink.strMeasure6,
        drink.strMeasure7,
        drink.strMeasure8,
        drink.strMeasure9,
        drink.strMeasure10
    ]
    return meaArr.filter(n => n != null)
}

function toggleRandomCocktail() {
    const randomCocktail = document.getElementById('random-cocktail')
    const hideButton = document.getElementById('hide')
    if (!randomCocktail.style.display) {
        randomCocktail.style.display = 'none'
        hideButton.textContent = 'Show Cocktail'
    } else {
        randomCocktail.style.display = ''
        hideButton.textContent = 'Hide Cocktail'
    }

}

function search(term) {
    console.log(term)
    if (!term.target[0].value) {
        alert('Please enter a search term')
    }
    else if (term.target[1].checked === true) {

    } else if (term.target[2].checked === true) {

    } else {
        alert('Please choose either Name or Ingredient')
    }
}