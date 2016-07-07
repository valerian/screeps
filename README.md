

# Valerian's Screeps Script

> Script for [TypeScript](http://www.typescriptlang.org/)-based [Screeps](https://screeps.com/) AI codes.

Project skeleton based on [screeps-starter](https://github.com/resir014/screeps-typescript-starter) by [Resi Respati](https://github.com/resir014), which is a modified version of the original [Screeps/TypeScript sample project](https://github.com/MarkoSulamagi/Screeps-typescript-sample-project) by [Marko Sulamägi](https://github.com/MarkoSulamagi).

## Project status

This script does not yet interract with the world, and for the moment is mostly an architecture for an AI yet to be done.
It already includes many useful internal features, such as a comprehensive creep blueprint generator, a logging system with log levels and in-memory archiving, a config system, extra console commands, useful core game classes extensions (through prototype alteration), and other little things.  

### Requirements

* [Node.js](https://nodejs.org/en/) (v4.0.0+)
* Gulp - `npm install -g gulp`
* TypeScript - `npm install -g typescript`
* Typings - `npm install -g typings`

### Quick setup

First, create a copy of `config.example.json` and rename it to `config.json`.

```bash
$ cp config.example.json config.json
```

Then change the `username` and `password` properties with your Screeps credentials.

If you want to push your code to another branch, for example, if you have some sort of a staging branch where you test around in Simulation mode, we have left a `branch` option for you to easily change the target branch of the upload process. The `default` branch is set as the default.

**WARNING: DO NOT** commit this file into your repository!

Then run the following the command to install the required npm packages and TypeScript type definitions.

```bash
$ npm install
```

### Running the compiler

```bash
# To compile your TypeScript files on the fly
$ npm start

# To deploy the code to Screeps
$ npm run deploy
```

## Special thanks

[Marko Sulamägi](https://github.com/MarkoSulamagi), for the original [Screeps/TypeScript sample project](https://github.com/MarkoSulamagi/Screeps-typescript-sample-project).

[Resi Respati](https://github.com/resir014) for the updated [screeps-starter](https://github.com/resir014/screeps-typescript-starter), and all the help he provided me through Slack
