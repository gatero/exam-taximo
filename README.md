taximo
========

[![LoopBack](https://github.com/strongloop/loopback-next/raw/master/docs/site/imgs/branding/Powered-by-LoopBack-Badge-(blue)-@2x.png)](http://loopback.io/)

### Overview

This proyect was developed using `docker`, `postgresql`, `nodejs` and `loopback`, and was published at [heroku](https://exam-taximo.herokuapp.com/)

### About the data model

I used LoopBack, an API REST Framework developed by IBM, is a framework based on the MVC dessign pattern, this means that each  layer in the program is separated of each others, it provides a CLI which automates and standarize the development flow.

I used `Logical Data Model(LDM)` for every logical part of the application, since environment configuration until the params validation and formating layers.

The `Physical Data Model(PDM)` was defined by loopback, this means that every part of data is handled using the ORM, and the injection patterns  provided by loopback.

Dessign pattern

Loopback MVC
There are a lot of ORMs software which we can use for this purpose,  but those frameworks let the developer a bunch of ways to generate destructurated code. Loopback offers just one way to do the things, and it has preconfigured and ready all the tools that you could need, preventing the installation of a lot of extra libraries which are commonly imported just to use one or two functions and increassing our proyect size.

### How to....

#### Running the proyect

- You need to have docker installed and running in your machine
- Make sure that you are not using the port 3000 on your machine
- The name of the services are `api` and `postgres`

~~~sh
# first you'll need clone this repository
git clone git@github.com:gatero/exam-taximo.git

# then you need to run docker-compose(I prefer to start docker in detached mood with -d)
docker-compose up # -d for detached mode
~~~

#### Showing containers
~~~sh
# If you need, you can list the containers
docker ps -a

CONTAINER ID        IMAGE               COMMAND                  CREATED             STATUS              PORTS                    NAMES
627498b38d63        node:12.14.1        "docker-entrypoint.s…"   50 minutes ago      Up 50 minutes       0.0.0.0:3000->3000/tcp   api
77cfa35d426b        postgres:12.2       "docker-entrypoint.s…"   50 minutes ago      Up 50 minutes       5432/tcp                 postgres
~~~

#### Getting the logs from containers
~~~sh
#  From api service
docker logs -f api

# from postgres
docker logs -f postgres
~~~

#### Accesing to the database service
~~~sh
# You can se the database configuration depending on your environment 
cat $EXAM_TAXIMO/src/datasources/postgres.datasource.config.ts 

# The password for development is root
docker exec -it postgres psql -d taximo -h postgres -p 5432 -U admin -W
~~~

#### Running the tests for shopping_synchronous
~~~sh
#  With the containers running you can run the test suite for the `shopping_synchronous` endpoint
docker exec -it api yarn test --reporter nyan --watch
~~~

## Once you have the project running

You could go to localhost:3000 and will see the explorer interface to make tests on the endpoint, by doing click on `try it out` you will be able to test the endpoint with the explorer user interface.

Or... you can test the services with curl as follows:

~~~sh
# data for first test:
# 5 5 5
# 1 1
# 1 2
# 1 3
# 1 4
# 1 5
# 1 2 10
# 1 3 10
# 2 4 10
# 3 5 10
# 4 5 10

# heroku
curl -v -X POST 'https://exam-taximo.herokuapp.com/shopping_synchronous' -d 'username=taximo_api_user&parameters=5,5,5&shopping_centers=1,1-1,2-1,3-1,4-1,5&roads=1,2,10-1,3,10-2,4,10-3,5,10-4,5,10&checksum=cd7ced88fb72ee862940d5664555251f9ba044d8478a71a7b70b04bd708c2796' -H 'Content-Type: application/x-www-form-urlencoded'

# localhost
curl -v -X POST 'http://localhost:3000/shopping_synchronous' -d 'username=taximo_api_user&parameters=5,5,5&shopping_centers=1,1-1,2-1,3-1,4-1,5&roads=1,2,10-1,3,10-2,4,10-3,5,10-4,5,10&checksum=cd7ced88fb72ee862940d5664555251f9ba044d8478a71a7b70b04bd708c2796' -H 'Content-Type: application/x-www-form-urlencoded'
~~~

~~~sh
# data for second test:
# 6 10 3
# 2 1 2
# 1 3
# 0
# 2 1 3
# 1 2
# 1 3
# 1 2 572
# 4 2 913
# 2 6 220
# 1 3 579
# 2 3 808
# 5 3 298
# 6 1 927
# 4 5 171
# 1 5 671
# 2 5 463

# heroku
curl -v -X POST 'https://exam-taximo.herokuapp.com/shopping_synchronous' -d 'username=taximo_api_user&parameters=6,10,3&shopping_centers=2,1,2-1,3-0-2,1,3-1,2-1,3&roads=1,2,572-4,2,913-2,6,220-1,3,579-2,3,808-5,3,298-6,1,927-4,5,171-1,5,671-2,5,463&checksum=cd7ced88fb72ee862940d5664555251f9ba044d8478a71a7b70b04bd708c2796' -H 'Content-Type: application/x-www-form-urlencoded'

# localhost
curl -v -X POST 'http://localhost:3000/shopping_synchronous' -d 'username=taximo_api_user&parameters=6,10,3&shopping_centers=2,1,2-1,3-0-2,1,3-1,2-1,3&roads=1,2,572-4,2,913-2,6,220-1,3,579-2,3,808-5,3,298-6,1,927-4,5,171-1,5,671-2,5,463&checksum=cd7ced88fb72ee862940d5664555251f9ba044d8478a71a7b70b04bd708c2796' -H 'Content-Type: application/x-www-form-urlencoded'
~~~
