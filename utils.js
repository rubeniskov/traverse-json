const { isPlainObject } = require('is-plain-object');
const minimatch = require('minimatch');

const JSONPATH_SEP = '/';

const isTraversable = (value) => Array.isArray(value) || isPlainObject(value);

const createMatcher = (test) => {
  if (typeof test === 'function') {
    return test;
  }
  if (test && test.length) {
    const [pattern, opts] = !Array.isArray(test) ? [test] : test;
    test = ([path]) => minimatch(path, pattern,opts);
  }

  return test && test.test ? ([path]) => test.test(path) : test;
};

const formatJsonPath = (...args) => (JSONPATH_SEP + args.filter(Boolean).join(JSONPATH_SEP)).replace(new RegExp(`[${JSONPATH_SEP}]+`), JSONPATH_SEP);

const parseJsonPath = (path) => path.split(new RegExp(`[${JSONPATH_SEP}]+`)).filter(Boolean);

/**
 * Wraps a function iteratior to become an iterable
 * @param {Function} next
 * @returns {Iterable}
 */
const wrapIterator = (next) => ({
  next,
  [Symbol.iterator]: function() { return this; },
});

const entries = (nested, prefix) => {
  const target = [];
  const entries = nested && typeof nested === 'object' ? Object.entries(nested) : [];
  let i, len;
  for(len = entries.length, i = 0; i < len; i++) {
    const path = formatJsonPath(prefix, entries[i][0]);
    const value = entries[i][1];
    const entry = [path, value];
    target.push(entry);
  }

  return target;
};

const parseOptions = (opts) => typeof opts !== 'object' ? ({ test: opts }) : { ...opts };

module.exports = {
  isTraversable,
  createMatcher,
  wrapIterator,
  formatJsonPath,
  entries,
  parseOptions,
  parseJsonPath,
};
