# js-map-generator

An online tool to generate a custom map with custom rules with an osm dataset in a static website.

## todo

### style

- add favicon

- write a "how to use" in readme and add images

- add good and nice looking example (with links?)

- find other relative small maps and add them as examples and then check in the link if the map is known and then use the known map from ther server instead of an upload

### bug

### feature

- show tags: generate tags from what exactly is visible and not what is possible

- show json errors with middle text

- make fill color better even when the last piece of the polygon is missing... close the polygone automatically?

- the feature to select multiplecolors after to color differently for multiple districts for example

- compress json/string for the url

### testing

- bigger maps and draw only some stuff on a bigger area, too slow?

### current link

<http://0.0.0.0:8000/?f=%5B%7B%0A+%22canvas+size%22%3A+%5B1000%2C1000%5D%2C%0A+%22zoom%22%3A+0.5%2C%0A+%22pan%22%3A+%5B73.3303%2C235.163%5D%0A%7D%2C%0A%7B%0A+%22stroke+color%22%3A+%22%23707070%22%2C%0A+%22line+width%22%3A+2%2C%0A+%22type%22%3A+%22way%22%2C%0A+%22tags%22%3A+%5B%0A++%5B%22highway%22%2C%22primary%22%5D%2C%0A++%5B%22highway%22%2C%22residential%22%5D%2C%0A++%5B%22highway%22%2C%22path%22%5D%0A+%5D%0A%7D%2C%0A%7B%0A+%22stroke+color%22%3A+%22%23a0a0a0%22%2C%0A+%22fill+color%22%3A+%22%23a0a0a0%22%2C%0A+%22line+width%22%3A+2%2C%0A+%22type%22%3A+%22way%22%2C%0A+%22tags%22%3A+%5B%0A+++%5B%22building%22%2C%22*%22%5D%0A+%5D%0A%7D%2C%0A%7B%0A+%22fill+color%22%3A+%22%23008000%22%2C%0A+%22line+width%22%3A+20%2C%0A+%22type%22%3A+%22node%22%2C%0A+%22size%22%3A+10%2C%0A+%22tags%22%3A+%5B%0A++%5B%22natural%22%2C+%22tree%22%5D%0A+%5D%0A%7D%2C%0A%7B%0A+%22stroke+color%22%3A+%22%23ff0000%22%2C%0A+%22line+width%22%3A+5%2C%0A+%22type%22%3A+%22way%22%2C%0A+%22tags%22%3A+%5B%0A++%5B%22railway%22%2C+%22*%22%5D%0A+%5D%0A%7D%2C%0A%7B%0A+%22stroke+color%22%3A+%22%232020a0%22%2C%0A+%22fill+color%22%3A+%22%232020a0%22%2C%0A+%22line+width%22%3A+2%2C%0A+%22type%22%3A+%22way%22%2C%0A+%22tags%22%3A+%5B%0A+++%5B%22place%22%2C%22*%22%5D%0A+%5D%0A%7D%5D%0A>
