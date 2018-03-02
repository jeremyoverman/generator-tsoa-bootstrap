let Jasmine = require('jasmine');

let j = new Jasmine();

j.loadConfigFile(__dirname + '/support/jasmine.json');
j.configureDefaultReporter({
    showColors: true
});

j.execute();