#!/usr/bin/env node

import clear from 'clear';
import chalk from 'chalk';
import figlet from 'figlet';
import program from 'commander';
import { fetchCities } from './lib';
import { IRegion } from './entities';
const { description, version } = require('../package.json');

clear();
console.log(
    chalk.yellow(
        figlet.textSync('bookmyshow-cli', { horizontalLayout: 'full' })
    )
);

program
    .command('search <cityName>')
    .description('find your city')
    .action(async (cityName: string) => {
        try {
            const res: IRegion[] = await fetchCities();
            const cities: IRegion[] | undefined = res.filter((r) => {
                if (r.alias.search(cityName) > -1 || r.code.search(cityName) > -1 || r.name.search(cityName) > -1)
                    return true;
                else
                    return false;
            });
            if (cities) {
                console.table(cities);
                console.log('Use the exact code, name, alias in place of `cityName` while searching for movies.');
            } else {
                throw new Error('Oops! City not found');
            }
        } catch (err) {
            console.error(err);
        }
    })

program
    .command('movies <city>')
    .description('display lst of movies')
    .action(() => {
        console.log('listing movies ')
    })

// program
//     .description(description)
//     .version(version, '-v, --version')
//     .parse(process.argv)

if (!process.argv.slice(2).length) {
    program.outputHelp()
}