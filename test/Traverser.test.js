import { strictEqual } from 'assert'
import toNT from '@rdfjs/to-ntriples'
import { describe, it } from 'mocha'
import Traverser from '../Traverser.js'
import TraverserExample, {
  backwardStop,
  callbackCall,
  filterCall,
  forwardStop,
  visitOnce,
  visitOnceLevel
} from './support/Example.js'
import rdf from './support/factory.js'

const ns = rdf.namespace('http://example.org/')

describe('Traverser', function () {
  it('should be a constructor', () => {
    strictEqual(typeof Traverser, 'function')
  })

  describe('.forEach', () => {
    it('should be a method', () => {
      const traverser = new Traverser(() => {}, {})

      strictEqual(typeof traverser.forEach, 'function')
    })

    it('should call the filter with quad, level and dataset arguments', () => {
      const example = filterCall()
      const traverser = new Traverser(...example.args)

      traverser.forEach(example, () => {})

      example.checkFilterCalls()
    })

    it('should stop traversing further if the filter returns false', () => {
      const example = forwardStop()
      const traverser = new Traverser(...example.args)

      traverser.forEach(example, () => {})

      example.checkFilterCalls()
    })

    it('should stop backward traversing further if the filter returns false', () => {
      const example = backwardStop()
      const traverser = new Traverser(...example.args)

      traverser.forEach(example, () => {})

      example.checkFilterCalls()
    })

    it('should visit quads only once', () => {
      const example = visitOnce()
      const traverser = new Traverser(...example.args)

      traverser.forEach(example, () => {})

      example.checkFilterCalls()
    })

    it('should visit quads only once unless the level is lower or equal', () => {
      const example = visitOnceLevel()
      const traverser = new Traverser(...example.args)

      traverser.forEach(example, () => {})

      example.checkFilterCalls()
    })

    it('should call the callback with quad, level and dataset arguments', () => {
      const example = callbackCall()
      const traverser = new Traverser(...example.args)

      traverser.forEach(example, example.forEach)

      example.checkForEachCalls()
    })
  })

  describe('.match', () => {
    it('should be a method', () => {
      const traverser = new Traverser(() => {}, {})

      strictEqual(typeof traverser.match, 'function')
    })

    it('should call the filter with quad, level and dataset arguments', () => {
      const example = filterCall()
      const traverser = new Traverser(...example.args)

      traverser.match(example)

      example.checkFilterCalls()
    })

    it('should stop traversing further if the filter returns false', () => {
      const example = forwardStop()
      const traverser = new Traverser(...example.args)

      traverser.match(example)

      example.checkFilterCalls()
    })

    it('should stop backward traversing further if the filter returns false', () => {
      const example = backwardStop()
      const traverser = new Traverser(...example.args)

      traverser.match(example)

      example.checkFilterCalls()
    })

    it('should visit quads only once', () => {
      const example = visitOnce()
      const traverser = new Traverser(...example.args)

      traverser.match(example)

      example.checkFilterCalls()
    })

    it('should visit quads only once unless the level is lower or equal', () => {
      const example = visitOnceLevel()
      const traverser = new Traverser(...example.args)

      traverser.match(example)

      example.checkFilterCalls()
    })

    it('should return a dataset with the matching quads', () => {
      const example = new TraverserExample({
        term: ns.a,
        dataset: [
          [ns.a, ns.p1, ns.b],
          [ns.b, ns.p1, ns.c],
          [ns.c, ns.p2, ns.d]
        ],
        filter: ({ quad }) => quad.predicate.equals(ns.p1),
        match: [
          [ns.a, ns.p1, ns.b],
          [ns.b, ns.p1, ns.c]
        ]
      })

      const traverser = new Traverser(...example.args)

      example.checkMatch(traverser.match(example))
    })

    it('should return a dataset with the backwards matching quads', () => {
      const example = new TraverserExample({
        forward: false,
        backward: true,
        term: ns.d,
        dataset: [
          [ns.a, ns.p2, ns.b],
          [ns.b, ns.p1, ns.c],
          [ns.c, ns.p1, ns.d]
        ],
        filter: ({ quad }) => quad.predicate.equals(ns.p1),
        match: [
          [ns.b, ns.p1, ns.c],
          [ns.c, ns.p1, ns.d]
        ]
      })

      const traverser = new Traverser(...example.args)

      example.checkMatch(traverser.match(example))
    })
  })

  describe('.reduce', () => {
    it('should be a method', () => {
      const traverser = new Traverser(() => {}, {})

      strictEqual(typeof traverser.reduce, 'function')
    })

    it('should call the filter with quad, level and dataset arguments', () => {
      const example = filterCall()
      const traverser = new Traverser(...example.args)

      traverser.reduce(example, () => {})

      example.checkFilterCalls()
    })

    it('should stop traversing further if the filter returns false', () => {
      const example = forwardStop()
      const traverser = new Traverser(...example.args)

      traverser.reduce(example, () => {})

      example.checkFilterCalls()
    })

    it('should stop backward traversing further if the filter returns false', () => {
      const example = backwardStop()
      const traverser = new Traverser(...example.args)

      traverser.reduce(example, () => {})

      example.checkFilterCalls()
    })

    it('should visit quads only once', () => {
      const example = visitOnce()
      const traverser = new Traverser(...example.args)

      traverser.reduce(example, () => {})

      example.checkFilterCalls()
    })

    it('should visit quads only once unless the level is lower or equal', () => {
      const example = visitOnceLevel()
      const traverser = new Traverser(...example.args)

      traverser.reduce(example, () => {})

      example.checkFilterCalls()
    })

    it('should call the callback with quad, result, level and dataset arguments', () => {
      const example = callbackCall()
      const traverser = new Traverser(...example.args)

      traverser.reduce(example, example.reduce)

      example.checkReduceCalls()
    })

    it('should return the last result', () => {
      const example = new TraverserExample({
        term: ns.a,
        dataset: [
          [ns.a, ns.p1, ns.b],
          [ns.b, ns.p1, ns.c],
          [ns.c, ns.p2, ns.d]
        ],
        reduce: ({ quad }, result) => {
          return `${result}${toNT(quad)}\n`
        }
      })

      const traverser = new Traverser(...example.args)

      const result = traverser.reduce(example, example.reduce, '')

      strictEqual(result, toNT(example.dataset))
    })
  })
})
