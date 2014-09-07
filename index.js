var parseArgs = require('minimist');
var mustache = require('mustache');
var path = require('path');
var fs = require('fs');

var argv = parseArgs(process.argv.slice(2), {});

var dokkuPath = '/home/dokku';
var vhostFile = path.join(dokkuPath, 'VHOST');

var templateParams;

function showUsage() {
  console.log('');
  console.log('dokku-gen: Utility module to generate dokku configuration for a docker container. Use this on your server as an alternative to git pushing to dokku remote. Handy for using dokku to front custom docker containers.')
  console.log('');
  console.log('Usage: node.js index.js ');
  console.log('  --name=<name of dokku app to create / update> - REQUIRED');
  console.log('  --port=<Port Number of docker app - REQUIRED');
  console.log('  --container=<Container Id of docker container> - REQUIRED'); 
  console.log('  --vhost=<dokku virtual host> - OPTIONAL. If omitted, the value of /home/dokku/VHOST will be used');
  console.log('');
}

function validateArgs() {
  if(!argv.name || ! argv.port || !argv.container) {
    console.log('Invaid arguments');
    showUsage();
    process.exit(1);
  }

  if(!fs.existsSync(vhostFile)) {
    console.log('ERROR: vhost file (' + vhostFile + ') not found');
    console.log('Please ensure dokku is installed and that the VHOST file has been defined.')
    showUsage();
    process.exit(1); 
  }
} 

function prepareTemplateParams() {
  
  var vhostFile = path.join(dokkuPath, 'VHOST');
  vhost = fs.readFileSync(vhostFile, {encoding:'utf-8'});
  
  templateParams = {
    name: argv.name,
    port: argv.port,
    container: argv.container,
    vhost: vhost
  }
}

function createDokkuDir() {
  var dokkuDir = path.join(dokkuPath, templateParams.name);

  if(! fs.existsSync(dokkuDir) ) {
    fs.mkdirSync(dokkuDir);
  }
}

function generateFile(templateName) {
  var templatePath = path.join(__dirname, 'templates', templateName);
  var templateFile = fs.readFileSync(templatePath, {encoding:'utf-8'});
  var outputFile = mustache.render(templateFile, templateParams);
  fs.writeFileSync(path.join(dokkuPath, templateParams.name, templateName), outputFile);
}

function main() {
  validateArgs();

  prepareTemplateParams();

  createDokkuDir();

  generateFile('nginx.conf');
  generateFile('URL');
  generateFile('PORT');
  generateFile('CONTAINER');

  console.log('Finished generating new dokku app. Please restart nginx to pick up new app');
}

main();