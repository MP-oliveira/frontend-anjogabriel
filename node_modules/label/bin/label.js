#!/usr/bin/env node

var nopt = require('nopt');
var pkg = require('../package.json');
var label = require('../index.js');

var options = {
  'delimiter': String,
  'capitalize': Boolean,
  'help': Boolean
};
var _options = {
  'd': '--delimiter',
  'c': '--capitalize',
  'v': '--version',
  'h': '--help'
};

var args = nopt(options, _options);

if (args.version) {
  console.log(pkg.version);
} else if (args.help) {
  var message = [
    'usage: label [--delimiter|-d <delimiter>] [--capitalize|-c]',
    '             [--help|-h] [--version|-v]'
  ].join('\n');
  console.log(message);
} else {
  console.log(label.generate(args.capitalize, args.delimiter));
}

