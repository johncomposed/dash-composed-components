/*
For my purposes, I don't need the object assign polyfill
*/
import { transform as _transform } from 'buble'

const opts = {
  objectAssign: 'Object.assign',
  transforms: {
    dangerousForOf: true,
    dangerousTaggedTemplateString: true
  }
}

export default code => _transform(code, opts).code
