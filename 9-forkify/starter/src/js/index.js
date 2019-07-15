import Search from './models/Search';
import * as searchView from './views/searchView'
import * as recipeView from './views/recipeView'
import * as listView from './views/listView'
import * as base from './views/base'
import Recipe from './models/Recipe'
import List from './models/List'

/**Global state of the app 
 * -Sarch Objectcdscsd
 * -Current recipe object
 * Shopping List object
 * -liked recipes
 */

const state = {};

///Search Controller
const controlSearch = async () => {
  //1)get query from view
  const query = searchView.getInput();
  if (query) {
    //2)  new search object and add it to state
    state.search = new Search(query);
    console.log(state.search)
    //3 clear UI 
    searchView.clearInput();
    searchView.clearResults();
    base.renderLoader(base.elements.searchResult)
    //4 search for recipes 
    try {
      await state.search.getResults();
      //5 render results on UI 
      base.clearLoader();
      searchView.renderResults(state.search.result);
    } catch (error) {
      alert('something wrong with search ')
      base.clearLoader();

    }



  }

}

base.elements.searchForm.addEventListener('submit', e => {
  e.preventDefault();
  controlSearch();

})
base.elements.searchResPages.addEventListener('click', e => {
  const btn = e.target.closest('.btn-inline');

  if (btn) {
    const goToPage = parseInt(btn.dataset.goto, 10);
    searchView.clearResults();
    searchView.renderResults(state.search.result, goToPage);
  }



});


/**Recipe Controller */

// const r = new Recipe(47051)
// r.getRecipe();
const controlRecipe = async () => {
  //getting id
  const id = window.location.hash.replace('#', '');
  
  //if id is clicked 
  if (id) {
    recipeView.clearRecipe();
    //prepare ui to changes
    base.renderLoader(base.elements.recipe);
    //highlight selected search item 
    if (state.search) {
      searchView.highlightSelected(id)

    }
    //create new recipe object
    state.recipe = new Recipe(id)

    //get recipe data 
    try {
      await state.recipe.getRecipe();

      state.recipe.parseIngredients();
      //calc servings and time 
      state.recipe.calcTime();
      state.recipe.calcServings();

      base.clearLoader();

      //render recipe 

      recipeView.renderRecipe(state.recipe)

    } catch (err) {
      alert('error processing recipe')
    }
  }
}

// window.addEventListener('hashchange',controlRecipe)
// window.addEventListener('load',controlRecipe);
['hashchange', 'load'].forEach(event => window.addEventListener(event, controlRecipe));


/**
 * List Controller
 */
const controlList=()=>{
  if(!state.list)state.list = new List();
  console.log(state.list)


  //add each ingredient to the lsit 
  state.recipe.ingredients.forEach(el=>{
    const item = state.list.addItem(el.count,el.unit,el.ingredient);
    console.log(item)
    listView.renderItem(item);
  })

}

//handling recipe button clicks 
base.elements.recipe.addEventListener('click', e => {
  if (e.target.matches('.btn-decrease')) {
    state.recipe.updateServings('dec')
  } else if (e.target.matches('.btn-increase')) {
    state.recipe.updateServings('inc')
  }else if (e.target.matches('.recipe__btn--add,.recipe.btn--add *')){
    controlList();
  }

})


