/*
For my purposes, I don't need the object assign polyfill
*/
import { transform as _transform } from 'buble'
// import assign from 'core-js/fn/object/assign'
import {} from 'ramda'


// export const _poly = { assign }

const opts = {
  // objectAssign: '_poly.assign',
  transforms: {
    dangerousForOf: true,
    dangerousTaggedTemplateString: true
  }
}

export default code => _transform(code, opts).code
