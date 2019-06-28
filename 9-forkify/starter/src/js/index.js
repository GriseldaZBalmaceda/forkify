import Search from './models/Search';
import * as searchView from './views/searchView'
import * as base from  './views/base'

/**Global state of the app 
 * -Sarch Objectcdscsd
 * -Current recipe object
 * Shopping List object
 * -liked recipes
*/

const state ={};

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
  await state.search.getResults();
  //5 render results on UI 
  base.clearLoader();
searchView.renderResults(state.search.result);

}

}

base.elements.searchForm.addEventListener('submit',e=>{
e.preventDefault();
controlSearch();

})


