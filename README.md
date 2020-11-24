# traverse-json

[![Build Status](https://travis-ci.org/rubeniskov/traverse-json.svg?branch=master)](https://travis-ci.org/rubeniskov/traverse-json)
![npm-publish](https://github.com/rubeniskov/traverse-json/workflows/npm-publish/badge.svg)
[![Downloads](https://img.shields.io/npm/dw/traverse-json)](https://www.npmjs.com/package/traverse-json)

A complete traverse json function with `iterable` interface.

## Motivation

Many time I've encontered with the difficult task of traverse a object with nested properties by filtering some of them using a single function, so a `traverse-json` solves this using multiple options for traversing.


## Mutation

For mutation this library is part of [mutant-json](https://github.com/rubeniskov/mutant-json) which wraps this `traverse-json` to take the advantages of filtering options.

## Installation

### Npm:
```shell
npm install traverse-json --save
```
### Yarn:
```shell
yarn add traverse-json
```
## Functions

<dl>
<dt><a href="#traverseJson">traverseJson(obj, [opts])</a> ⇒ <code><a href="#TraverseIterator">TraverseIterator</a></code></dt>
<dd><p>Creates a function which traverses an object by its keys and values recursively,
returning the iterator result with the full path and its value.</p>
<p>By default options will be parsed as { test: opts } if string detected</p>
</dd>
<dt><a href="#createIterator">createIterator(obj, [opts])</a> ⇒ <code>Iterable</code></dt>
<dd><p>Returns a traverseJson iterable, usefull for use it in a for loop.</p>
</dd>
</dl>

## Typedefs

<dl>
<dt><a href="#TraverseJsonOptions">TraverseJsonOptions</a> : <code>Object</code></dt>
<dd></dd>
<dt><a href="#TraverseJsonEntry">TraverseJsonEntry</a> : <code>Array.&lt;String, any&gt;</code></dt>
<dd></dd>
<dt><a href="#TraverseIteratorResult">TraverseIteratorResult</a> : <code>Object</code></dt>
<dd></dd>
<dt><a href="#TraverseIterator">TraverseIterator</a> ⇒ <code><a href="#TraverseIteratorResult">TraverseIteratorResult</a></code></dt>
<dd><p>Function iterator, <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Generator/next">see</a>
<a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Iterators_and_Generators#Advanced_generators">examples</a></p>
</dd>
</dl>

<a name="traverseJson"></a>

## traverseJson(obj, [opts]) ⇒ [<code>TraverseIterator</code>](#TraverseIterator)
Creates a function which traverses an object by its keys and values recursively,
returning the iterator result with the full path and its value.

By default options will be parsed as { test: opts } if string detected

**Kind**: global function  

| Param | Type |
| --- | --- |
| obj | <code>Object</code> | 
| [opts] | <code>String</code> \| [<code>TraverseJsonOptions</code>](#TraverseJsonOptions) | 

**Example**  
```javascript
const traverseJson = require('traverse-json');

const options = {...};

const iterator = traverseJson({
  foo: 0,
  nested: {
    depth: 1,
    nested: {
      depth: 2,
      nested: {
        depth: 3,
        nested: {
          depth: 4,
        },
      },
    },
  },
  bar: 1,
}, options);

for (;;) {
  const { done, value } = iterator();
  if (done)
     break;
   console.log(value);
}
```
## Outputs

### [Default options](#traversejsonoptions--object)

__{}__
```
[ '/foo', 0 ]
[ '/nested/depth', 1 ]
[ '/nested/nested/depth', 2 ]
[ '/nested/nested/nested/depth', 3 ]
[ '/nested/nested/nested/nested/depth', 4 ]
[ '/bar', 1 ]
```


### Return eather the nested and flatten values

__{ [nested](#traversejsonoptions--object): true }__
```
[ '/foo', 0 ]
[ '/nested',
  { depth: 1, nested: { depth: 2, nested: [Object] } } ]
[ '/nested/depth', 1 ]
[ '/nested/nested',
  { depth: 2, nested: { depth: 3, nested: [Object] } } ]
[ '/nested/nested/depth', 2 ]
[ '/nested/nested/nested', { depth: 3, nested: { depth: 4 } } ]
[ '/nested/nested/nested/depth', 3 ]
[ '/nested/nested/nested/nested', { depth: 4 } ]
[ '/nested/nested/nested/nested/depth', 4 ]
[ '/bar', 1 ]
```


### Only traverse on depth 1

__{ [recursive](#traversejsonoptions--object): false }__
```
[ '/foo', 0 ]
[ '/nested',
  { depth: 1, nested: { depth: 2, nested: [Object] } } ]
[ '/bar', 1 ]
```


### Skips even entries

__{ [step](#traversejsonoptions--object): 2 }__
```
[ '/foo', 0 ]
[ '/bar', 1 ]
```


### Match only the paths ending with _depth_

__{ [test](#traversejsonoptions--object): /depth$/ }__
```
[ '/nested/depth', 1 ]
[ '/nested/nested/depth', 2 ]
[ '/nested/nested/nested/depth', 3 ]
[ '/nested/nested/nested/nested/depth', 4 ]
```


### Return eather the nested and flatten values ending with _nested_

__{ [test](#traversejsonoptions--object): /nested$/, [nested](#traversejsonoptions--object): true }__
```
[ '/nested',
  { depth: 1, nested: { depth: 2, nested: [Object] } } ]
[ '/nested/nested',
  { depth: 2, nested: { depth: 3, nested: [Object] } } ]
[ '/nested/nested/nested', { depth: 3, nested: { depth: 4 } } ]
[ '/nested/nested/nested/nested', { depth: 4 } ]
```


### Match only the paths ending with _foo_ or _depth_

__{ [test](#traversejsonoptions--object): "&#42;&#42;/{depth,foo}" }__
```
[ '/foo', 0 ]
[ '/nested/depth', 1 ]
[ '/nested/nested/depth', 2 ]
[ '/nested/nested/nested/depth', 3 ]
[ '/nested/nested/nested/nested/depth', 4 ]
```


### Match entries which has a number value equal or greater than 3

__{ [test](#traversejsonoptions--object): ([,value]) => typeof value === 'number' && value >= 3 }__
```
[ '/nested/nested/nested/depth', 3 ]
[ '/nested/nested/nested/nested/depth', 4 ]
```


### Traverse recursively through the same key

__{ [test](#traversejsonoptions--object): "@nested" }__
```
[ '/nested',
  { depth: 1, nested: { depth: 2, nested: [Object] } } ]
[ '/nested/nested',
  { depth: 2, nested: { depth: 3, nested: [Object] } } ]
[ '/nested/nested/nested', { depth: 3, nested: { depth: 4 } } ]
[ '/nested/nested/nested/nested', { depth: 4 } ]
```
<a name="createIterator"></a>

## createIterator(obj, [opts]) ⇒ <code>Iterable</code>
Returns a traverseJson iterable, usefull for use it in a for loop.

**Kind**: global function  

| Param | Type |
| --- | --- |
| obj | <code>Object</code> | 
| [opts] | [<code>TraverseJsonOptions</code>](#TraverseJsonOptions) | 

**Example**  
```javascript
const { createIterator } = require('traverse-json');
const options = {...}
const ientries = createIterator({
  foo: 0,
  nested: {
    depth: 1,
    nested: {
      depth: 2,
       nested: {
         depth: 3,
         nested: {
           depth: 4,
         },
       },
     },
   },
  bar: 1,
}, options);

for (let [k, v] of ientries) {
  console.log(k, v);
}
````
### Output
```
/foo 0
/nested/depth 1
/nested/nested/depth 2
/nested/nested/nested/depth 3
/nested/nested/nested/nested/depth 4
/bar 1
```
<a name="TraverseJsonOptions"></a>

## TraverseJsonOptions : <code>Object</code>
**Kind**: global typedef  
**Properties**

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| [opts.recursive] | <code>Boolean</code> | <code>true</code> | enable/disable nested arrays and objects recursion |
| [opts.nested] | <code>Boolean</code> | <code>false</code> | also emit nested array or objects |
| [opts.step] | <code>Boolean</code> | <code>1</code> | the step to increment, default 1 |
| [opts.test] | <code>String</code> \| <code>function</code> \| <code>RegeExp</code> | <code>false</code> | regexp, string [minimatch](https://www.npmjs.com/package/minimatch) or function to filter properties |

<a name="TraverseJsonEntry"></a>

## TraverseJsonEntry : <code>Array.&lt;String, any&gt;</code>
**Kind**: global typedef  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| 0 | <code>string</code> | Object [JSONPointer](https://tools.ietf.org/html/rfc6901) |
| 1 | <code>any</code> | Value |

<a name="TraverseIteratorResult"></a>

## TraverseIteratorResult : <code>Object</code>
**Kind**: global typedef  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| value | [<code>TraverseJsonEntry</code>](#TraverseJsonEntry) | key value pair with the key as a full path of the property following the [json standard path format](https://tools.ietf.org/html/rfc6902#section-3) |
| done | <code>Boolean</code> |  |

<a name="TraverseIterator"></a>

## TraverseIterator ⇒ [<code>TraverseIteratorResult</code>](#TraverseIteratorResult)
Function iterator, [see](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Generator/next)
[examples](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Iterators_and_Generators#Advanced_generators)

**Kind**: global typedef  

| Param | Description |
| --- | --- |
| extra | a object or array to extends the current iteration |

