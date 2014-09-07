dokku-gen
=========

Utility to generate dokku configuration for a docker container. Use this on your server as an alternative to git pushing to dokku remote. Handy for using dokku to front custom docker containers.

Usage: 

    node.js index.js 
      --name=<name of dokku app to create / update> - REQUIRED
      --port=<Port Number of docker app - REQUIRED
      --container=<Container Id of docker container> - REQUIRED

Note: The full container ID is required, not the shortened version. To get the full container ID runn the following commad:

    sudo docker ps --no-trunc
    
