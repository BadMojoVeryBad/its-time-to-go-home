![Hero Image](https://raw.githubusercontent.com/BadMojoVeryBad/its-time-to-go-home/master/marketing/promo_cover_alt.png)


# It's Time to Go Home
A game about enjoying the journey. [You can play it for free here.](https://badmojoverybad.itch.io/its-time-to-go-home)

## Synopsis
Play as an astronaut stuck on the Moon, looking for a way back to Earth.

The music is composed by John Oestmann. [Check out his work here.](https://www.youtube.com/channel/UC_i11eAdIZUMqPG3dKrhd7g)

## Overview
This game is built using [Phaser 3](https://phaser.io) and
[Typescript](https://www.typescriptlang.org/). Through my experience learning this framework,
I found the examples created by the community an amazing resource to learn from. With
this in mind, I've made the code open source here in the hopes that it helps someone else
learn the framework also. It's not pretty, but maybe it'll help!

This game is finished/released and is not in active development.

## Prerequisites
To run this game from source, you'll need:
* Node 10.x.x
* NPM
* Yarn

## Installation
Clone the repo:
```
git clone https://github.com/BadMojoVeryBad/its-time-to-go-home.git
cd its-time-to-go-home
rm -rf .git
```

Download assets:
```
yarn
yarn post-install
```

Compile code in an electron app:
```
yarn dist
```

Or compile code into a web page:
```
yarn web-build
```
