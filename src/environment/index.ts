import { resolve } from 'path';


//
//
//  !!! This environment should get set as local and default
//  !!! to be extended by others
//
//

export const environment = {
    env: 'local',
    production: false,
    port: process.env.PORT || 3000,
    db: {
        url: 'mongodb://localhost/combinator',
        // rsName: 'rs0'
    },
    bot: {

        // Dev environment
        token: '844657353:AAEcNn9GOQyj-26WgWnLvdA1yz__ETbI0Fg',
        link: 'fifth_combi_bot'


        // Prod environment
        // token: '729577434:AAFyobgZyQM_2bkPZbG-XxUotkzPlNu9iEA'
        // combinatorbot

    }
};