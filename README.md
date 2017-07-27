# node-shop-cat

copy the spreaddy into the root dir, you will also need a local psql db (see database.js for config) and then:

Initalise the database:
`npm run schema`

First you will need to populate the shopify products:-
`HEROKU_API_TOKEN=?? STAGE=dev CCY=UK npm run loadshop`

Then you can slurp the spreadsheet:-
`STAGE=dev CCY=UK npm run slurp`

The idea would then be to run promote to take the changes between dev & qa:-
node src/index -p=dev,qa

Initially until the database is fully populated it will perform PUT's when slurping and pushing through the environments.
To avoid this you can simply initialise the database after the first load with all the environments:
`UPDATE PRODUCT SET env = array_append(env, $1);`

I tried this out on the dev shop so it approximately works... but you could replicate the same logic in groovy - I lifted all the code from the groovy and pretty much translated ok.

# Benefits
Obvious benefits of this approach are that changes are versioned.
Only real changes are promoted (reducing time and number of calls).
Also I merge the metafields together so we don't have to delete them and recreate them each time we do a change.
Also I use the heroku api to get the config for the shops - so we don't need many parameters to get the thing up and running.

# What else?

I guess obvious improvements would be testing (but the existing solution is light on that too).
Make the thing into a web app - so that we can deploy it somewhere.
Dont' parse the spreadsheet instead react to RESTful calls (ie post the json of the spreaddy to an endpoint).
I tried to remove as much of the promise / callback hell with this new async / await functionality it make the code more typically imperative style but probably I would consider breaking up some of the larger functions to make it more obvious what the intent is.
