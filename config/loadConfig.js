// function to return environment configuration loaded from a config.json file

module.exports = function loadConfig(setEnvironment) {

  // load configuration from config.json file and exit in case of any error
  try {
    config = require('./config.json');
  } catch (error) {
    console.log('Error loading configuration.' + error);
    return ({
      error_code: true,
      error_desc: 'Error loading configuration from config.json.'
    });
  }

  // load default values from configuration file default section.
  const defaultConfig = config.default;
  // if no value was passed in setEnvironment to the function, use 'default' value.
  const environment = setEnvironment;
  // load 'environment' values from configuration file to be merged with defaultConfig values.
  const environmentConfig = config[environment];
  // If environment configuration does not exists, log a warning.
  if ( !environmentConfig ) {
    console.log(`${environment} configuration not found, using defaults.`);
  }
  // merge 'default + environment' configuration into finalConfig object.
  const finalConfig = {...defaultConfig, ...environmentConfig};

  // If no configuration was found, return an error
  if (!defaultConfig && !environmentConfig) {
    console.log(`There is no default or ${environment} configuration defined in config.json file, check!`);
    return ({
      error_code: true,
      error_desc: "No configuration defined on config.json file"
    });
  }

  // return configuration object
  return {...finalConfig,error_code: false,error_desc: "Successful load the configuration."};

};