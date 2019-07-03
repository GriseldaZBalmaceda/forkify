import Search from './models/Search';
import * as searchView from './views/searchView'
import * as recipeView from './views/recipeView'
import * as base from  './views/base'
import Recipe from './models/Recipe'

/**Global state of the app 
 * -Sarch Objectcdscsd
 * -Current recipe object
 * Shopping List object
 * -liked recipes
*/

const state ={};
///Search Controller
const controlSearch = async ()=>{
//1)get query from view
const query = searchView.getInput();
if(query){
  //2)  new search object and add it to state
  state.search = new Search(query);
  //3 clear UI 
  searchView.clearInput();
  searchView.clearResults();
  base.renderLoader(base.elements.searchResult)
  //4 search for recipes 
  try{
   await state.search.getResults();
  //5 render results on UI 
  base.clearLoader();
  searchView.renderResults(state.search.result); 
  }catch(error){
    alert('something wrong with search ')
    base.clearLoader();

  }
  


}

}

base.elements.searchForm.addEventListener('submit', e=>{
e.preventDefault();
controlSearch();

})
base.elements.searchResPages.addEventListener('click', e=>{
const btn = e.target.closest('.btn-inline');

if(btn){
  const goToPage=parseInt(btn.dataset.goto,10);
  searchView.clearResults();
  searchView.renderResults(state.search.result,goToPage);
}



});


/**Recipe Controller */

// const r = new Recipe(47051)
// r.getRecipe();
const controlRecipe= async()=>{
  //getting id
const id = window.location.hash.replace('#','');
console.log(id)
//if id is clicked 
if(id){
//prepare ui to changes
base.renderLoader(base.elements.recipe);
//create new recipe object
state.recipe=new Recipe(id)

//get recipe data 
try{
 await state.recipe.getRecipe();

 state.recipe.parseIngredients();
//calc servings and time 
state.recipe.calcTime();
state.recipe.calcServings();

 base.clearLoader();

//render recipe 

recipeView.renderRecipe(state.recipe)

console.log(state.recipe) 
}
catch(err){
  alert('error processing recipe')
}
}
}

// window.addEventListener('hashchange',controlRecipe)
// window.addEventListener('load',controlRecipe);
['hashchange','load'].forEach(event=>window.addEventListener(event,controlRecipe));