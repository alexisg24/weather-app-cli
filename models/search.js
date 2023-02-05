const fs = require('fs');
const axios = require('axios');
require('dotenv').config();
class Searchs {
    history = [];
    dbPath = './db/database.json'

    constructor(){
        //TODO: leer db si existe

    }

    get paramsMapBox(){
        return {
            'access_token': process.env.MAPBOX_KEY,
            'limit': 5
        }
    }

    get capHistory(){
        this.readDB();
        return this.history.map(city =>{
            return city.split(' ').map(word => {
                const res = word.split('');
                res[0] = res[0].toUpperCase();
                return res.join('')
            }).join(' ');
        })
    }

    paramsOpenWeather( lat, long ){
        return {
            'lat': lat,
            'lon': long,
            'appid': process.env.OPEN_WEATHER,
            'units': 'metric'
        }
    }

    async city ( search='' ){
        try {

            const instance = axios.create({
                baseURL: `https://api.mapbox.com/geocoding/v5/mapbox.places/${ search }.json`,
                params: this.paramsMapBox
            });
            const { data } = await instance.get()
            const cities = data.features.map(city =>({
                id: city.id,
                name: city.place_name,
                long: city.center[0],
                lat: city.center[1]
            }))
            return cities
            
        } catch (error) {
            console.log(error);
            return []
        }
    }

    async cityWeather( lat, long ){
        try {
            const instance = axios.create({
                baseURL: `https://api.openweathermap.org/data/2.5/weather`,
                params: this.paramsOpenWeather(lat, long)
            })
            const { data } = await instance.get();
            const {weather, main} = data;
            return {
                desc: weather[0].description,
                temp: main.temp,
                min: main.temp_min,
                max: main.temp_max
            }
        } catch (error) {
            console.log(error);
        }
    }

    addToHistory ( search ){

        if(this.history.includes(search.toLocaleLowerCase())){
            return
        }
        this.history = this.history.splice(0,5)
        this.history.unshift( search.toLocaleLowerCase() );
        this.saveDB();
    }

    saveDB(){
        const payload = {
           history: this.history
        }
        fs.writeFileSync(this.dbPath, JSON.stringify(payload))
    }

    readDB(){
        if(!fs.existsSync(this.dbPath)) return []
        const info = JSON.parse(fs.readFileSync(this.dbPath, {encoding: 'utf-8'}));
        this.history = [...info.history];
    }
}

module.exports = Searchs