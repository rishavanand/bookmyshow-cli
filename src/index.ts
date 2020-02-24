#!/usr/bin/env node

import clear from 'clear';
import chalk from 'chalk';
import figlet from 'figlet';
import program from 'commander';
import { fetchCities, fetchSingleMovie, fetchAllMovies } from './lib';
const { description, version } = require('../package.json');

clear();
console.log(
    chalk.yellow(
        figlet.textSync('bookmyshow-cli', { horizontalLayout: 'full' })
    )
);

program
    .command('cities <city>')
    .description('find your city')
    .action(async (city: string) => {
        try {
            await fetchCities(city, true);
        } catch (err) {
            console.error(err);
        }
    })

program
    .command('movies <city> [movieId]')
    .description('display list of movies currently running in your city')
    .action(async (city, movieId) => {
        try {
            if (movieId)
                await fetchSingleMovie(city, movieId);
            else
                await fetchAllMovies(city);
        } catch (err) {
            console.error(err);
        }
    })

program
    .description(description)
    .version(version, '-v, --version')
    .parse(process.argv)

if (!process.argv.slice(2).length) {
    program.outputHelp()
}