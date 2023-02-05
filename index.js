const { inquirerMenu, inquirerPause, readInput, listCityMenu } = require('./helpers/inquirer');
const Searchs = require('./models/search');

require('colors')


const main = async() =>{
    let opt;
    const searchs = new Searchs();
    do {
        opt = await inquirerMenu();

        switch( opt ){

            case 1:
                const cityString = await readInput('City: ');
                const cities = await searchs.city(cityString);
                const cityID = await listCityMenu(cities);
                if(cityID === 0) break;
                const selectedCity = cities.find(c => c.id == cityID);
                searchs.addToHistory(selectedCity.name)
                const cityWeather = await searchs.cityWeather(selectedCity.lat, selectedCity.long);
                console.clear();
                console.log(`\nCity Info\n`.green);
                console.log(`City:`, selectedCity.name);
                console.log(`Lat:`, selectedCity.lat);
                console.log(`Long:`, selectedCity.long);
                console.log(`Temp: (°C)`, cityWeather.temp);
                console.log(`Max Temp: (°C)`, cityWeather.max);
                console.log(`Min Temp: (°C)`, cityWeather.min);
                console.log(`Description:`, cityWeather.desc);
            break;

            case 2:
                searchs.capHistory.forEach((city, index) =>{
                    const idx = `${index+1}.`.green;
                    console.log(`${idx} ${city}`);
                })
            break;
        }
    if(opt !== 0) await inquirerPause();
    } while (opt !== 0);
}

main();