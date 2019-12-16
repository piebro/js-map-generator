# js-map-generator

An online tool to generate a custom map with custom rules with an osm dataset in a static website.

## todo

### style

- add favicon

- write a "how to use" in readme and add images

- add good and nice looking example (with links?)

- some images for dataIsBeatiful?

### bug

- save as pdf with zoom != 1 doesnt work

### feature

- rework my translation of the coordinates. have a better overview with them. make it easier to understand and maintain.

- only draw when something substanial changed?
  only update the nodes and ways which chnaged?
  delete the stuff that changed, and redraw that stuff again
  canvas change only change viewport?

- only draw if it not drawn right now? and then draw? a draw button if there are to many ways and nodes

- a "drawing right now" loading screen

- del grid postion setting

- ? line with and map zoom. should the affect each other?

- ? save the link somehow extra to the map

- allgemein beim speichern check ob die linie oder node gezeichnet werden müssen und nur wenn sie sichtbar sind zeichnen

- ? dynamically load the save librarys only when they are needed

- new ui. with better popup windows. some framework needed with the possibilty for pwa

### testing

- bigger maps and draw only some stuff on a bigger area, too slow?

### other

[//]: # (links: https://geoffboeing.com/2017/03/urban-form-figure-ground/)

### example links

### usefull cmds

```bash
# svg to pdf
inkscape map.svg --export-pdf=map2.pdf

# pdf to pdf with a3 format
pdfjam --papersize '{29.7cm,42.0cm}' -o map2-a3.pdf map2.pdf
```
