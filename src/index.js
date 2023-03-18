const cocktailURL = "https://www.thecocktaildb.com/api/json/v1/1/"
let tableCount = 0
let compareList = []
let listToggle = false

document.addEventListener('DOMContentLoaded', () => {
    fetch(`${cocktailURL}random.php`)
        .then(resp => resp.json())
        .then(data => {
            console.log(data)
            renderDrink(data.drinks[0], 'random-cocktail', 'drink-thumbnail', false)
        })

    const hide = document.getElementById('hide')
    hide.addEventListener('click', () => {
        toggleRandomCocktail()
    })

    const list = document.getElementById('show-list')
    list.addEventListener('click', () => {
        if (compareList.length === 0) {
            alert('Your Compare List is Empty!\nAdd Cocktails to Your List')
        } else {
            listToggle = !listToggle
            if (listToggle) {
                list.textContent = 'Hide Your Compare List'
                toggleSearch(true)
                showCompareList()
            } else {
                list.textContent = 'Show Your Compare List'
                toggleSearch(false)
                document.getElementById('compare-list').innerHTML = ''
            }
        }
    })

    const form = document.getElementById('form')
    form.addEventListener('submit', event => {
        event.preventDefault()
        if (document.getElementById('clear')) {
            document.getElementById('clear').remove()
        }
        search(event);
    })
})

function renderDrink(drink, placement, imgId, forList) {
    const ingredients = countIngredients(drink)
    const measures = countMeasures(drink)
    let ingList = ''

    const div = document.getElementById(placement)
    const container = document.createElement('div')
    const img = document.createElement('img')
    const h3 = document.createElement('h3')
    const h4 = document.createElement('h4')
    const ing = document.createElement('p')
    const btn = document.createElement('button')
    const p = document.createElement('p')
    const remove = document.createElement('button')

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
    btn.textContent = 'Add to List'
    btn.addEventListener('click', () => {
        if (!compareList.includes(drink)) {
            compareList.push(drink)
            console.log(compareList)
        } else {
            alert('Drink already on List!')
        }
    })
    remove.textContent = 'Remove'
    remove.addEventListener('click', event => {
        compareList = compareList.filter(element => element.idDrink !== drink.idDrink)
        document.getElementById('compare-list').innerHTML = ''
        showCompareList()
        if (compareList.length === 0) {
            toggleSearch(false)
            document.getElementById('show-list').textContent = 'Show Your Compare List'
        }
    }
    )
    p.textContent = drink.strInstructions
    if (!forList) {
        container.appendChild(img)
    }
    container.appendChild(h3)
    container.appendChild(h4)
    for (let i = 0; i < ingredients.length; i++) {
        let measure = measures[i] ? measures[i] : ''
        ingList = ingList + `${measure} ${ingredients[i]}<br>`
    }
    ing.innerHTML = ingList
    container.appendChild(ing)
    if (!forList) {
        container.appendChild(btn)
    }


    if (forList) {
        container.className = 'card'
        container.appendChild(remove)
    }
    container.appendChild(p)
    div.appendChild(container)
}

function toggleSearch(visible) {
    const randomDiv = document.getElementById('random-div')
    const searchDiv = document.getElementById('search-box')
    const cocktailListDiv = document.getElementById('cocktail-list')
    const infoDiv = document.getElementById('information')
    if (visible) {
        randomDiv.style.display = 'none'
        searchDiv.style.display = 'none'
        cocktailListDiv.style.display = 'none'
        infoDiv.style.display = 'none'
    } else {
        randomDiv.style.display = ''
        searchDiv.style.display = ''
        cocktailListDiv.style.display = ''
        infoDiv.style.display = ''
    }
}

function showCompareList() {
    const currentList = compareList.map(x => renderDrink(x, 'compare-list', 'drink-thumbnail', true))
    console.log(compareList)
}

function enlarge(element, id) {
    const img = document.getElementById(id)
    img.src = element.src.slice(0, -8)
    img.style = 'position:fixed; top:0px; left:0px;'
}

function resize(element, id) {
    const img = document.getElementById(id)
    img.src = `${element.src}/preview`
    img.style = ''
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
    const clear = document.createElement('button')
    clear.textContent = 'Clear Results'
    clear.id = 'clear'
    clear.addEventListener('click', () => {
        listDiv.innerHTML = ''
        for (let i = 0; i < 9; i++) {
            document.getElementById(`t-${i + 1}`).innerHTML = ''
        }
        document.getElementById('search-term').value = ''
        clear.remove()
        tableCount = 0
    })
    listDiv.innerHTML = ''
    const ol = document.createElement('ol')
    ol.id = 'scroll-list'
    const p = document.createElement('p')
    p.textContent = 'Click on a drink to see details. (List is scrollable)'
    for (const item of list.drinks) {
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
    document.getElementById('search-box').appendChild(clear)
    listDiv.appendChild(p)
    listDiv.appendChild(ol)

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