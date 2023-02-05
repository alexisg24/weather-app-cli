const inquirer = require('inquirer');
require('colors');

const questions = [
    {
        type: 'list',
        name: 'option',
        message: 'What do you want to do?',
        choices: [
            {
                name: `${`1.`.green} Search City`,
                value: 1
            },
            {
                name: `${`2.`.green} Search History`,
                value: 2
            },
            {
                name: `${`0.`.green} Exit`,
                value: 0
            }
        ]
    }
]
const inquirerMenu = async() =>{
    console.clear();
    console.log('==========================='.green);
    console.log('      Select an option     '.white);
    console.log('===========================\n'.green);

    const { option } = await inquirer.prompt(questions);
    return option
}

const inquirerPause = async() =>{
    console.log('\n');
    return await inquirer.prompt([{type: 'input', name: 'pause', message: 'Press ENTER to continue'}])
}

const readInput = async( message ) =>{
    const question = [
        {
            type: 'input',
            name: 'desc',
            message,
            validate( value ){
                if(value.length === 0){
                    return 'Please insert a value'
                }
                return true
            }
        }
    ]

    const {desc} = await inquirer.prompt(question)
    return desc
}


const listCityMenu = async (cities = []) =>{
    const choices = cities.map((city, index) =>{
        return {
            name: `${`${index+1}`.green} ${city.name}`,
            value: city.id
        }
    })

    choices.unshift({
        value: 0,
        name: `${'0.'.green} Cancel`
    })

    const questions = {
        type: 'list',
        name: 'id',
        message: 'Select a city: ',
        choices
    }

    const { id } = await inquirer.prompt(questions);
    return id
}


const confirm = async(message) =>{
    const question = {
        type: 'confirm',
        name: 'ok',
        message
    }

    const { ok } = await inquirer.prompt(question)
    return ok;
}

module.exports = {
    inquirerMenu,
    inquirerPause,
    readInput,
    listCityMenu,
    confirm
}