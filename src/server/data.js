// This is generally what a yargs command file looks like
exports.commands = [
  {
    command: 'version',
    describe: 'Displays the lando version',
    builder: {
      all: {
        describe: 'Shows additional version information',
        alias: ['-a'],
      },
    },
    run: () => {
      console.log('1.0.0');
    },
  },
  {
    command: 'init',
    describe: 'A more complex init flow',
    builder: {
      recipe: {
        describe: 'Shows additional version information',
        alias: ['-r'],
      },
    },
    run: () => {
      console.log('1.0.0');
    },
  },
];

// Here are some inquirer questions
// Meant to show the amount of function values there are
exports.questions = [
  {
    type: 'confirm',
    name: 'bacon',
    default: () => true,
    message: 'Do you like bacon?',
  },
  {
    type: 'input',
    name: 'favorite',
    message: () => 'Bacon lover, what is your favorite type of bacon?',
    choices: () => (['american', 'thick-cut', 'canadian', 'vegan']),
    when:  answers => {
      return answers.bacon;
    },
  },
  {
    type: 'confirm',
    name: 'pizza',
    message: 'Ok... Do you like pizza?',
    validate: () => true,
  },
  {
    type: 'input',
    name: 'favorite',
    message: 'Whew! What is your favorite type of pizza?',
    filter: input => ([input]),
  },
];
