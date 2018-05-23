This is a simple starter project for the [Loopin](https://github.com/koopero/loopin) creative coding system. It includes all the boilerplate and dependencies required to start development of a Loopin application. As well, it includes an example demo, implementing a spinning planet with motion blur and a cartoonishly simple, but expressive, lighting model.

![Sample output of loopin-starter](image/example_planet.jpg)

## Requirements

*Windows is not supported at this time.* This project should work on a properly configured Intel-based Mac or Linux box. For more detailed requirements, see [loopin-native](https://github.com/koopero/loopin-native). As well, to use the `recorder` function of this demo, you will need [ffmpeg](http://www.ffmpeg.org/download.html).

## Installation

``` sh
git clone https://github.com/koopero/loopin-starter.git YOURPROJECT
cd YOURPROJECT
npm install
npm start
```

## Usage

Once the starter project is running, point your browser at [http://localhost:7004](http://localhost:7004/). This will show combined controls and documentation for the planet example.

## Project Layout

Most Loopin development happens by editing files in the project directory, especially the files in the `./preset` and `./shader` directories.

### config/
Contains static configuration files, interpreted by the [config](https://www.npmjs.com/package/config) module. Use the file `default.yaml` to configure the server portion of this project, including the http port and control pages. Not autoloaded.

### control/
Contains **Markdown** control files. These are documents which contain simple, inline codes to wire control data to the application. If files are changed, simply reload in the browser.

### data/
Used by the application to store runtime generated data.

### data/persist.yaml
This is the data file which the [loopin-server](https://github.com/koopero/loopin-server) module uses to save application state between runs. Normally, you should not need to edit this file directly.

### image/
Contains `.jpg` and `.png` [images](https://loopin.tech/ofxLoopin-image.html), which will be autoloaded by default.

### node/
Mostly boilerplate code to get everything up and running. `node/loopin.js` contains Loopin setup, with configuration of defaults such as which directories are autoloaded. The file `node/logic/snapshot.js` contains a simple utility to take screenshots of the application, as an example of using javascript logic in Loopin apps.

### preset/
YAML configuration files which are 'patched' to the Loopin system. By default, *all* presets in this directory are autoloaded.

### shader/
GLSL shaders. To create a new shader, duplicate `shader/base.vert` and/or `shader/base.vert` with a new name.

# Credits

Planet images courtesy of [JHT's Planetary Pixel Emporium](http://planetpixelemporium.com/index.php).

The [Loopin](https://github.com/koopero/loopin) system would not be possible without the support of [HFour Design Studio](http://hfour.ca/).

# Security Warning
The Loopin system intentionally creates a very promiscuous, completely unsecured local web server while this application is running. This server should not be exposed to open web, nor run in an environment where hooliganism is a possibility. For production applications, security *MUST* be implemented at the network layer.
