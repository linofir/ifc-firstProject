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

- install VSCode `Live Server` extension  

- right click on `public/index.html` and `Open on Live Server`

TODO: adjust path to be able to run with http-server