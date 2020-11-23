const {
  isTraversable,
  createMatcher,
  wrapIterator,
  entries,
} = require('./utils');

/**
 * @typedef {Object} TraverseJsonOptions
 * @prop {Boolean} [opts.recursive] enable/disable nested arrays and objects recursion
 * @prop {Boolean} [opts.nested] also emit nested array or objects
 * @prop {Boolean} [opts.step] the step to increment, default 1
 * @prop {Boolean} [opts.test] regexp, string [minimatch](https://www.npmjs.com/package/minimatch) or function to filter properties
 */

/**
 * @typedef {Object} TraverseIteratorResult
 * @prop {Array<String, any>} value
 * @prop {Boolean} done
 */

/**
 * @callback TraverseIterator
 * @returns {TraverseIteratorResult}
 */

/**
 * Create a function which traverses an object by its keys and values recursively
 *
 * @param {Object} obj
 * @param {TraverseJsonOptions} [opts]
 * @returns {TraverseIterator}
 * @example
 * ```javascript
 * const traverseJson = require('.');
 *
 * const options = {...};
 *
 * const iterator = traverseJson({
 *   foo: 0,
 *   nested: {
 *     depth: 1,
 *     nested: {
 *       depth: 2,
 *       nested: {
 *         depth: 3,
 *         nested: {
 *           depth: 4,
 *         },
 *       },
 *     },
 *   },
 *   bar: 1,
 * }, options);
 *
 * for (;;) {
 *   const { done, value } = iterator();
 *   if (done)
 *      break;
 *    console.log(value);
 * }
 * ```
 * ### Outputs
 * `{}`
 * ```
 * [ '/foo', 0 ]
 * [ '/nested/depth', 1 ]
 * [ '/nested/nested/depth', 2 ]
 * [ '/nested/nested/nested/depth', 3 ]
 * [ '/nested/nested/nested/nested/depth', 4 ]
 * [ '/bar', 1 ]
 * ```
 * `{ nested: true }`
 * ```
 * [ '/foo', 0 ]
 * [ '/nested',
 *   { depth: 1, nested: { depth: 2, nested: [Object] } } ]
 * [ '/nested/depth', 1 ]
 * [ '/nested/nested',
 *   { depth: 2, nested: { depth: 3, nested: [Object] } } ]
 * [ '/nested/nested/depth', 2 ]
 * [ '/nested/nested/nested', { depth: 3, nested: { depth: 4 } } ]
 * [ '/nested/nested/nested/depth', 3 ]
 * [ '/nested/nested/nested/nested', { depth: 4 } ]
 * [ '/nested/nested/nested/nested/depth', 4 ]
 * [ '/bar', 1 ]
 * ```
 * `{ recursive: false }`
 * ```
 * [ '/foo', 0 ]
 * [ '/nested',
 *   { depth: 1, nested: { depth: 2, nested: [Object] } } ]
 * [ '/bar', 1 ]
 * ```
 * `{ step: 2 }`
 * ```
 * [ '/foo', 0 ]
 * [ '/bar', 1 ]
 * ```
 * `{ test: /depth$/ }`
 * ```
 * [ '/nested/depth', 1 ]
 * [ '/nested/nested/depth', 2 ]
 * [ '/nested/nested/nested/depth', 3 ]
 * [ '/nested/nested/nested/nested/depth', 4 ]
 * ```
 * `{ test: /nested$/, nested: true }`
 * ```
 * [ '/nested',
 *   { depth: 1, nested: { depth: 2, nested: [Object] } } ]
 * [ '/nested/nested',
 *   { depth: 2, nested: { depth: 3, nested: [Object] } } ]
 * [ '/nested/nested/nested', { depth: 3, nested: { depth: 4 } } ]
 * [ '/nested/nested/nested/nested', { depth: 4 } ]
 * ```
 * `{ test: "**\/{depth,foo}" }`
 * ```
 * [ '/foo', 0 ]
 * [ '/nested/depth', 1 ]
 * [ '/nested/nested/depth', 2 ]
 * [ '/nested/nested/nested/depth', 3 ]
 * [ '/nested/nested/nested/nested/depth', 4 ]
 * ```
 */
const traverseJson = (obj, opts) => {
  const {
    recursive = true,
    nested = false,
    test = null,
    step = 1,
  } = { ...opts };

  let filter = createMatcher(test);
  let overall = [];
  let cursor = 0;

  const dive = (value, prefix) => {
    const remain = overall.slice(cursor + 1);

    overall = entries(value, prefix);

    for(let i = 0; i < remain.length; i++) {
      overall.push(remain[i]);
    }
    return overall[cursor = 0];
  };

  dive(obj);

  const next = () => {

    if (cursor < overall.length) {
      let entry = overall[cursor];
      if (recursive) {
        const [prefix, value] = entry || [];
        if (isTraversable(value)) {
          dive(value, prefix);
          if (!nested) {
            return next();
          }
        } else {
          cursor += step;
        }
      } else {
        cursor += step;
      }

      if (typeof filter === 'function' && !filter(entry)) {
        return next();
      }

      return { value: entry, done: false };
    }
    return { done: true };
  };

  return next;
};

/**
 *
 * Returns a traverseJson iterable, usefull for use it in a for loop.
 *
 * @param {Object} obj
 * @param {TraverseJsonOptions} [opts]
 * @returns {Iterable}
 *
 * @example
 * ```javascript
 * const { createIterator } = require('traverse-json');
 * const options = {...}
 * const ientries = createIterator({
 *   foo: 0,
 *   nested: {
 *     depth: 1,
 *     nested: {
 *       depth: 2,
 *        nested: {
 *          depth: 3,
 *          nested: {
 *            depth: 4,
 *          },
 *        },
 *      },
 *    },
 *   bar: 1,
 * }, options);
 *
 * for (let [k, v] of ientries) {
 *   console.log(k, v);
 * }
 * ````
 * ### Output
 * ```
 * /foo 0
 * /nested/depth 1
 * /nested/nested/depth 2
 * /nested/nested/nested/depth 3
 * /nested/nested/nested/nested/depth 4
 * /bar 1
 * ```
 */
const createIterator = (obj, opts) => {
  return wrapIterator(traverseJson(obj, opts));
};


module.exports = traverseJson;
module.exports.createIterator = createIterator;
