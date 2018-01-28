#! /usr/bin/env node
/* global process */

import 'source-map-support/register';
import 'babel-polyfill';
import { Levels } from 'xazure-logger';
import { readConfig } from 'xazure-builder-common';
import build from '..';

const dir = process.argv[2];
const watch = process.argv.includes('-w') || process.argv.includes('--watch');
const debug = process.argv.includes('-d') || process.argv.includes('--debug');
const level = process.argv.find(arg => (arg.match(/^--level=(.*)$/) || [])[1]) || Levels.LOG;
const config = readConfig(dir);

try {
  const configModule = require(`xazure-builder-${config.type}`);
  const builderConfig = configModule.default || configModule;

  build(dir, config, builderConfig, watch, debug ? Levels.DEBUG : level)
    .then(() => console.log('Done'))
    .catch(err => console.error(`Error: ${err}`));
} catch (err) {
  console.error(`Could not import builder config: 'xazure-builder-${config.type}'`);
  console.error(err);
}