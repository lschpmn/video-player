# Video Player

Basic Chromecast streaming application. Allows you to stream compatible movies to Chromecast. Also allows you to control 
anything currently streaming to the chosen Chromecast, even streaming Apps like Hulu or Netflix. 

## Installation

- `git clone https://github.com/lschpmn/video-player.git`
- `npm i`

## Usage

On startup will look for the first Chromecast it finds on the local network and connect to it. If you already have something 
streaming on that Chromecast, this application will give you basic media controls of whatever is streaming. The application 
also allows you to stream your own content to Chromecast. The content needs to already be compatible with Chromecast, (mp4
almost always works, other file types are hit-and-miss). The application starts up a mini server that exposes the file you 
want to play, sending a url of that to Chromecast. 
