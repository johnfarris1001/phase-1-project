const cocktailURL = "https://www.thecocktaildb.com/api/json/v1/1/"

document.addEventListener('DOMContentLoaded', () => {
    fetch(`${cocktailURL}random.php`)
        .then(resp => resp.json())
        .then(data => {
            console.log(data.drinks[0])
            renderDrink(data.drinks[0])
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