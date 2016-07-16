

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

## Notes

### The `noImplicitAny` compiler flag

TypeScript developers disagree about whether the `noImplicitAny` flag should be `true` or `false`. There is no correct answer and you can change the flag later. But your choice now can make a difference in larger projects so it merits discussion.

When the `noImplicitAny` flag is `false` (the default), the compiler silently defaults the type of a variable to `any` if it cannot infer the type based on how the variable is used.

When the `noImplicitAny` flag is `true` and the TypeScript compiler cannot infer the type, it still generates the JavaScript files. But it also reports an error. Many seasoned developers prefer this stricter setting because type checking catches more unintentional errors at compile time.

In this starter kit, the `noImplicitAny` compiler flag is set to `false` to make it easier for beginners. If you want a more stricter environmet, you can change the `noImplicitAny` flag to `true` on the `tsconfig.json` file.

**Source:** https://angular.io/docs/ts/latest/guide/typescript-configuration.html

### TSLint

TSLint checks your TypeScript code for readability, maintainability, and functionality errors, and can also enforce coding style standards.

After each successful compiling of the project, TSLint will parse the TypeScript source files and display a warning for any issues it will find.

This project provides TSLint rules through a `tslint.json` file, which is based on the recommended set of rules from TSLint github repository: https://github.com/palantir/tslint/blob/next/src/configs/recommended.ts

We made some changes to those rules, which we considered necessary and/or relevant to a proper Screeps project:

 - removed the [forin](http://palantir.github.io/tslint/rules/forin/) rule which was forcing `for ( ... in ...)` loops to check if object members were not coming from the class prototype.
 - removed the [interface-name](http://palantir.github.io/tslint/rules/interface-name/) rule that was set to enforce prefixing interfaces with `I`.
 - set the [no-console](http://palantir.github.io/tslint/rules/no-console/) rule to `false`, in order to allow using `console`.
 - in the [variable-name](http://palantir.github.io/tslint/rules/variable-name/) rule, added `allow-leading-underscore`.

**More info about TSLint:** https://palantir.github.io/tslint/

## Special thanks

[Marko Sulamägi](https://github.com/MarkoSulamagi), for the original [Screeps/TypeScript sample project](https://github.com/MarkoSulamagi/Screeps-typescript-sample-project).

[Resi Respati](https://github.com/resir014) for the updated [screeps-starter](https://github.com/resir014/screeps-typescript-starter), and all the help he provided me through Slack
