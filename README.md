# UltimateBravery
A React based static website driven by Riot API and static data, so that it (hopefully) remains more up to date.

# Requirements:

* Node `v6.9.1`
* Ruby `>=2.3.0` with dev tools available.
* A web browser
* Bravery

#How to run:

# Start the dev server

    rake dev:start

Navigate your browser to `localhost:9001/static/index.html`
    
#Deployment

##1. Build the things

    rake clobber
    rake dd:download:everything
    rake node:build
    
##2. Combine assets
Copy the contents of `./node/build` and `./node/static` into `./build`

##3. Deploy
Put the contents of `./build` on your favourite dumb fileserver. I'm using an S3 bucket to host http://bravery.lol/

#Disclaimers and such

UltimateBravery isn't endorsed by Riot Games and doesn't reflect the views or opinions of Riot Games or anyone officially involved in producing or managing League of Legends. League of Legends and Riot Games are trademarks or registered trademarks of Riot Games, Inc. League of Legends © Riot Games, Inc.
