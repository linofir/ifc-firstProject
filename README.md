# IFC Project

## Getting Started

- Clone the repository and run `npm install`

- adjust file `node_modules/web-ifc-three/IFCLoader.js`, on line 4:
```
import { mergeBufferGeometries } from '../three/examples/jsm/utils/BufferGeometryUtils';
```

- create the bundle with watch:
```
npm run watch
```
- Run the server
``` 
npm start
```

-or

- install VSCode `Live Server` extension  

- right click on `public/index.html` and `Open on Live Server`

## User guide

- the top input is for the ifc file. Do it first.
- The second input is to load a GLTF arquive(3D object).

### Comands

- pass the mouse over the structure to highlight.
- click to select.
- Shift + click to select all objects of that type.
- alt+click to print the props in the console.
- s will return the spatial structure in JSON.

- to move the user(gltf) the arrow in keyboard.

TODO: create a collision test.
