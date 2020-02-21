#!/usr/bin/env node

import clear from 'clear';
import chalk from 'chalk';
import figlet from 'figlet';
import program from 'commander';
const { description, version } = require('../package.json')

clear();
console.log(
    chalk.yellow(
        figlet.textSync('bookmyshow-cli', { horizontalLayout: 'full' })
    )
);

program
    .command('cities')
    .description('display list of cities')
    .action((url) => {
        console.log('listing cities')
    })

program
    .command('movies <city>')
    .description('display lst of movies')
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