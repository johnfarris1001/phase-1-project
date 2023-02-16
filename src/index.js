const cocktailURL = "https://www.thecocktaildb.com/api/json/v1/1/"
let tableCount = 0

document.addEventListener('DOMContentLoaded', () => {
    fetch(`${cocktailURL}random.php`)
        .then(resp => resp.json())
        .then(data => {
            console.log(data)
            renderDrink(data.drinks[0], 'random-cocktail', 'drink-thumbnail')
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

function renderDrink(drink, placement, imgId) {
    const ingredients = countIngredients(drink)
    const measures = countMeasures(drink)

    const div = document.getElementById(placement)
    const img = document.createElement('img')
    const h3 = document.createElement('h3')
    const h4 = document.createElement('h4')
    const ing = document.createElement('p')
    let ingList = ''
    const p = document.createElement('p')
    img.src = `${drink.strDrinkThumb}/preview`
    img.alt = 'Drink thumbnail'
    img.id = imgId
    img.addEventListener('mouseover', event => {
        enlarge(event.toElement, img.id)
    })
    img.addEventListener('mouseout', event => {
        resize(event.fromElement, img.id)
    })
    h3.textContent = `${drink.strDrink} (${drink.strAlcoholic})`
    h4.textContent = drink.strGlass
    p.textContent = drink.strInstructions
    div.appendChild(img)
    div.appendChild(h3)
    div.appendChild(h4)
    for (let i = 0; i < ingredients.length; i++) {
        let measure = measures[i] ? measures[i] : ''
        ingList = ingList + `${measure} ${ingredients[i]}<br>`
    }
    ing.innerHTML = ingList
    div.appendChild(ing)
    div.appendChild(p)

}

function enlarge(element, id) {
    const img = document.getElementById(id)
    img.src = element.src.slice(0, -8)
    img.style = 'position:fixed;top:0px;left:0px;'
}

function resize(element, id) {
    const img = document.getElementById(id)
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
        hideButton.textContent = 'Show Random Cocktail'
    } else {
        randomCocktail.style.display = ''
        hideButton.textContent = 'Hide Random Cocktail'
    }

}

function search(term) {
    let searchBy = ''
    if (!term.target[0].value) {
        alert('Please enter a search term')
    }
    else if (term.target[1].checked === true) {
        searchBy = 'name'
        fetch(`${cocktailURL}search.php?s=${term.target[0].value}`)
            .then(resp => resp.json())
            .then(data => renderCocktailList(data))

    } else if (term.target[2].checked === true) {
        searchBy = 'ingredient'
        fetch(`${cocktailURL}filter.php?i=${term.target[0].value}`)
            .then(resp => resp.json())
            .then(data => renderCocktailList(data))
            .catch(error => alert('No drinks with that ingredient!'))
    } else {
        alert('Please choose either Name or Ingredient')
    }
}

function renderCocktailList(list) {
    if (!list['drinks']) {
        alert('No drinks by that name!')
        return
    }
    const listDiv = document.getElementById('cocktail-list')
    listDiv.innerHTML = ''
    const ol = document.createElement('ol')
    for (const item of list.drinks) {
        console.log(item)
        const li = document.createElement('li')
        li.textContent = item.strDrink
        li.style = 'text-align:left;'
        li.addEventListener('click', () => {
            tableCount++
            if (item.strAlcoholic) {
                renderDrink(item, `t-${tableCount}`, `drink-${tableCount}`)
            } else {
                fetch(`${cocktailURL}lookup.php?i=${item.idDrink}`)
                    .then(resp => resp.json())
                    .then(data => {
                        renderDrink(data.drinks[0], `t-${tableCount}`, `drink-${tableCount}`)
                    })
            }
        })
        ol.appendChild(li)
    }
    listDiv.appendChild(ol)
}