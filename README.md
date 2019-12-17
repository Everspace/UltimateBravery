# This is all lies

I need to redo all this.

# UltimateBravery
A React based static website driven by Riot API and static data, so that it (hopefully) remains more up to date, and people can bravely go where few have gone before in League of Legends

Things are currently highly experimental and probably very broken until a `0.2` release.

# Requirements:

* Node `^7.0.0`
* npm `^5.0.0`
* Ruby `>=2.3.0`
* A web browser
* A heart full of **BRAVERY**

# How to run:

## Init

    git clone <this repo>
    cd UltimateBravery
    bundle install

## Start the dev server

(note that this takes a while to set up the dev server due to downloading the dragontail tarball for quicker iteration time and not being as greedy downloading from datadragon all the time)

    rake dev:start

Navigate your browser to `localhost:9001`

## Deployment

### 1. Build the things

    rake clean // (or rake clobber)
    rake package

### 2. Combine assets
Copy the contents of `./node/build` and `./node/static` into `./build`

### 3. Deploy
Put the contents of `./build` on your favourite dumb fileserver. I'm using an S3 bucket to host http://bravery.lol/

#Disclaimers and such

UltimateBravery isn't endorsed by Riot Games and doesn't reflect the views or opinions of Riot Games or anyone officially involved in producing or managing League of Legends. League of Legends and Riot Games are trademarks or registered trademarks of Riot Games, Inc. League of Legends © Riot Games, Inc.
