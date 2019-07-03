import axios from 'axios';
import {key,proxy} from '../config'

export default class Recipe {
    constructor(id) {

        this.id = id
    }
    async getRecipe() {
        try {
            const res = await axios(`${proxy}https://www.food2fork.com/api/get?key=${key}&rId=${this.id}`);
            this.title=res.data.recipe.title;
            this.author=res.data.recipe.publisher;
            this.img = res.data.recipe.image_url;
            this.url=res.data.recipe.url;
            this.publisher=res.data.publisher;
            this.ingredients=res.data.recipe.ingredients;
        } catch (error) {
            console.log(error)
        }
       
    }
    calcTime(){
        //estimating the amount of time by the amount of ingredients 
        const numIng = this.ingredients.length;
        const periods=Math.ceil(numIng/3)
        this.time= periods*15
    }
    calcServings(){
        this.servings = 4
    }
    parseIngredients(){
        const unitLong=['tablespoons','tablespoon','ounces','ounce','teaspoons','teaspoon','cups','pounds'];
        const unitShort=['tbsp','tbsp','oz','oz','tsp','tsp','cup','pound']
        const newIngredients = this.ingredients.map(el=>{
            //uniform units
let ingredient=el.toLowerCase();
unitLong.forEach((unit,i)=>{
ingredient=ingredient.replace(unit,unitShort[i])
})
            //remove parantheses

ingredient=ingredient.replace(/ *\([^)]*\) */g,' ');


            //parse ingredients into count unit and ingredient 
return ingredient;
        })
        this.ingredients=newIngredients;
    }
}