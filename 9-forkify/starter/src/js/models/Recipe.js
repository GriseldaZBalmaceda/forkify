import axios from 'axios';
import {
    key,
    proxy
} from '../config'
import {
    isBuffer
} from 'util';

export default class Recipe {
    constructor(id) {

        this.id = id
    }
    async getRecipe() {
        try {
            const res = await axios(`${proxy}https://www.food2fork.com/api/get?key=${key}&rId=${this.id}`);
            this.title = res.data.recipe.title;
            this.author = res.data.recipe.publisher;
            this.img = res.data.recipe.image_url;
            this.url = res.data.recipe.url;
            this.publisher = res.data.publisher;
            this.ingredients = res.data.recipe.ingredients;
        } catch (error) {
            console.log(error)
        }

    }
    calcTime() {
        //estimating the amount of time by the amount of ingredients 
        const numIng = this.ingredients.length;
        const periods = Math.ceil(numIng / 3)
        this.time = periods * 15
    }
    calcServings() {
        this.servings = 4
    }
    parseIngredients() {
        const unitLong = ['tablespoons', 'tablespoon', 'ounces', 'ounce', 'teaspoons', 'teaspoon', 'cups', 'pounds'];
        const unitShort = ['tbsp', 'tbsp', 'oz', 'oz', 'tsp', 'tsp', 'cup', 'pound']
        const newIngredients = this.ingredients.map(el => {
            //uniform units
            let ingredient = el.toLowerCase();
            unitLong.forEach((unit, i) => {
                ingredient = ingredient.replace(unit, unitShort[i])
            })
            //remove parantheses

            ingredient = ingredient.replace(/ *\([^)]*\) */g, ' ');
            //parse ingredients into count unit and ingredient 

            const arrIng = ingredient.split(' ');
            const unitIndex = arrIng.findIndex(el2 => unitShort.includes(el2))
            let objIng
            if (unitIndex > -1) {
                //there is a unit 
                const arrCount = arrIng.slice(0,unitIndex);
                let count;
                if(arrCount.length === 1){
                    count = eval(arrIng[0].replace('-','+'))
                }else{
                    count = eval(arrIng.slice(0,unitIndex).join('+'));
                }
                objIng={
                    count,
                    unit:arrIng[unitIndex],
                    ingredient:arrIng.slice(unitIndex + 1).join(' ')
                }
            } else if (parseInt(arrIng[0], 10)) {
                //there is a No Unit, but 1st element is a umber 
                objIng = {
                    count: parseInt(arrIng[0], 10),
                    unit: '',
                    ingredient: arrIng.slice(1).join(' ')
                }
            } else if (unitIndex === -1) {
                //there is no unit, and no number in 1st position 
                objIng = {
                    count: 1,
                    unit: '',
                    ingredient
                }
            }
            return objIng;
        })
        this.ingredients = newIngredients;
    }
}