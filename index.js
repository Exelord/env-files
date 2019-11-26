'use strict';

const deepMerge = require('lodash.merge');
const fs = require('fs');
const path = require('path');

const defaultConfigFn = function() {
  return {}
};

function isFunction(functionToCheck) {
  return functionToCheck && {}.toString.call(functionToCheck) === '[object Function]';
}

function requireConfig(path) {
  try {
    const config = require(path);
    return isFunction(config) ? config : defaultConfigFn;
  } catch (error) {
    return defaultConfigFn;
  }
}

module.exports = function(options = {}, ...args) {
  options = deepMerge({}, { dir: '/', defaults: '-defaults.js' }, options || {})
  
  const { env, dir, defaults } = options;

  if (!env) throw new Error('\nENV-FILES: You need to specify "env" property!')

  const envsDir = path.resolve(process.cwd(), dir)
  const availableEnvs = fs.readdirSync(envsDir).map(file => file.match(/(?<name>.+)[.].+/).groups.name).filter((name) => {
    return !(/^-/.test(name));
  });

  if (!availableEnvs.includes(env)) {
    throw new Error(`\nENV-FILES: You are trying to use a non-existing environment: "${env}"\n` +
                      `Available environments: ${availableEnvs.join(', ')}`);
  }

  const defaultConfigFn = requireConfig(path.join(envsDir, defaults));
  const configFn = requireConfig(path.join(envsDir, env))

  return deepMerge({}, defaultConfigFn(...args), configFn(...args))
};