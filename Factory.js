import Traverser from './Traverser.js'

class Factory {
  traverser (filter, { backward = false, forward = true } = {}) {
    return new Traverser({ backward, factory: this, filter, forward })
  }
}

Factory.exports = ['traverser']

export default Factory
