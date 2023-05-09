# Squiggle 1
Open source animation educational software. 

*Frame by frame, day per day.*

### Description

Squiggle 1 is an animation educational software aimed at beginner animation students and their teachers. 

It is a simple exploratory experiment of the phi phenomenon.

### Docker
Create container:
```
docker build -t html-server-image:v1
```

Run
```
docker run -d -p 80:80 html-server-image:v1
```

### Troubles

* My animation won't download. What's happening?

Please allow pop-ups. If you are running squiggle 1 on a local computer, make sure to be running under localhost (gif.js workers are not allowed to work offline)

### Dependencies

Squiggle 1 requires:

* squiggle library (https://github.com/piterwilson/squiggle-library)
* p5.js (https://p5js.org/)
* Tween library (https://github.com/tweenjs/tween.js/)
* FileSaver.js (https://github.com/eligrey/FileSaver.js/)
* require.js
* jquery
* Underscore
* Backbone

### People using Squiggle 1

* Schooltools.at (https://schooltools.at/)

### Developing
Run `npm install` to install dependencies.

#### Sass compile
Run `npm run build-css` to watch the sass file and auto compile css.

Run `npm run watch-css` to watch the sass file and auto compile css.

### Credits

Created by Juan Carlos Ospina Gonzalez

