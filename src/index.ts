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
            await fetchCities(cityName);
        } catch (err) {
            console.error(err);
        }
    })

program
    .command('movies <city>')
    .description('display list of movies currently running in your city')
    .action(() => {
        console.log('listing movies ')
    })

program
    .description(description)
    .version(version, '-v, --version')
    .parse(process.argv)

if (!process.argv.slice(2).length) {
    program.outputHelp()
}