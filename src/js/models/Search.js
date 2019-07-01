import axios from 'axios';
import {key,proxy} from '../config'
export default class Search {
    constructor(query) {
        this.query = query;
    }
    async getResults() {
        const proxy = "https://cors-anywhere.herokuapp.com/"
        const key = '5fbe3d9d89b61fea9f0d266fbf317410'
        try {
            const res = await axios(`${proxy}https://www.food2fork.com/api/search?key=${key}&q=${this.query}`)
            this.result = res.data.recipes;
            console.log(this.result)
        } catch (error) {
            alert(error)
        }
    }
}
