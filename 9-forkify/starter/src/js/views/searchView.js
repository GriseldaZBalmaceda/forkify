import {
    elements
} from './base'
export const clearInput = () => elements.searchInput.value = "";
export const clearResults = () => elements.searchResultList.innerHTML = "";
export const getInput = () => elements.searchInput.value;

const limitRecipeTitle = (title, limit = 17) => {
    const newTitle = []
    if (title.length > limit) {
        title.split(' ').reduce((acc, curr) => {
            if (acc + curr.length <= limit) {
                newTitle.push(curr);
            }
            return acc + curr.length;
        }, 0)
        return `${newTitle.join(' ')}...`
    }
    return title;
}
const renderRecipe = recipe => {
    console.log(recipe)
    const markup = ` 
<li>
    <a class="results__link" href="#${recipe.recipe_id}">
    <figure class="results__fig">
        <img src="${recipe.image_url}" alt="${recipe.title}">
    </figure>
    <div class="results__data">
        <h4 class="results__name">${limitRecipeTitle(recipe.title)}</h4>
        <p class="results__author">${recipe.publisher}</p>
    </div>
    </a>
</li>`;
    elements.searchResultList.insertAdjacentHTML('beforeend', markup)
}

export const renderResults = (recipes, page, resPerPage = 10) => {
    console.log(recipes)
    const start = (page-1)*resPerPage;
    const end = page * resPerPage;

    recipes.slice(start, end).forEach(renderRecipe);
}