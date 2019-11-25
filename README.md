# js-map-generator

An online tool to generate a custom map with custom rules with an osm dataset in a static website.

## todo

### style

- add favicon

- write a "how to use" in readme and add images

- add good and nice looking example (with links?)

- find other relative small maps and add them as examples and then check in the link if the map is known and then use the known map from ther server instead of an upload

- some images for dataIsBeatiful? (feature: more ways to select node/ways? with regex?)

### bug

- the json error message is shown to often, maybe not as an alert or maybe only later as an alert

- zoomed in 1.7131, changed value -> little jerking in the svg. Some rounding stuff?

- there is an error with no stroke color

### feature

- regex query for ways, e.g. all streets which name begins with an a?

- color -> stroke color, fill color ?

- do I want default values for some drawRule attributes?

- a custom way to draw nodes, maybe a list with points around 0,0

- compress json/string for the url

### testing

- bigger maps and draw only some stuff on a bigger area, too slow?

### other

- code clean up and making everything maintainable

- make code more efficieant, look how often which function is called and maybe if there are bugs calling funcitions to often.
