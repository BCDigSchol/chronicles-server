# chronicles-server

*Chronicles Projects @ Boston College - Server API*

* Maia McAleavey, Principal Investigator
* Anastasia Prussakova, Research Assistant
* David J. Thomas, Developer
* Ashlyn Stewart, Project Manager

---

Full Stack (MySQL ExpressJS Angular NodeJS) app.

---

## Installation

Current installation is on a Docker setup.

Install docker, and docker-compose locally. Then clone this repo and move inside the directory. Finally, fetch the submodule, which contains the seeder data.

``` sh
git clone https://github.com/BCDigSchol/chronicles-server.git
cd chronicles-server
git submodule update --init --recursive
```

Thenm, modify the following files with your desired accounts/passwords/ports

``` sh
# most crucial, for setting account passwords
/docker-compose.yml
# you must change the server_name and redirect to have the url to which you are deploying
/nginx/nginx.conf
```

Now, launch the docker containers with `docker compose up -d`.

The run command in our `docker-compose.yml` should have gotten the SSL certifictes for us already.

After docker is up... use `docker exec` to shell into the server container...

``` sh
# run to get list of docker container names, look for server
docker ps
# shell into the server container
docker exec -it SERVER_CONTAINER_NAME sh
# run the server seeders
source migrate.sh
# exit out of container shell
exit
```

If you are running in a Windows environment, instead of running migrate.sh, run the following commands instead...

``` sh
./node_modules/.bin/sequelize db:create
./node_modules/.bin/sequelize db:migrate
./node_modules/.bin/sequelize db:seed:all
```

Now, set the certbot to autorenew.

``` sh
docker compose run --rm certbot renew
```

Then, stop the webserver, and output the dhparam key

``` sh
docker compose stop webserver
sudo openssl dhparam -out /home/YOUR_USERNAME/chronicles-server/dhparam/dhparam-2048.pem 2048
```

Finally, modify the `nginx/nginx.conf` file and uncomment the lower server block. MAKE SURE to replace values with your domains. Then restart the server with `docker compose restart`.

That's it, the server should be up and running.

If you have problems and the docker container keeps restarting, the certbot might not have run correctly. To fix this, first, bring down the container with `docker compose down`. Then, re-comment out the SSH lines in your `nginx/nginx.conf` file. Now, bring the image back up with `docker compose up -d`. Then run the command `docker compose run --rm certbot certonly --webroot --webroot-path /var/www/html/ --email sample@your_domain --agree-tos --no-eff-email -d your_domain -d www.your_domain`. Once it is complete, un-comment out the `nginx/nginx.conf` file and `docker compose up -d` to get it started.

## Local Development

To develop locally, if you want to use docker, comment out the lines indicated for local development in `docker-compose.yml`. Then launch with `docker compose up -d`.

For vanilla npm operation, move inside the server directory and start the app. First, however, you must have MySql installed locally, and have set up a database, preferably named `chronicles`, and created a user with full privileges on it named `chroniclesowner` with the password `password`.

 ``` sh
 cd server
npm start
```

To run testing...

``` sh
# move into the docker shell
docker exec -it NAME_OF_YOUR_CONTAINER sh
# run tests
npm test
```

That's it!
