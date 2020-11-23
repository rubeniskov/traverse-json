# traverse-json

[![Build Status](https://travis-ci.org/rubeniskov/traverse-json.svg?branch=master)](https://travis-ci.org/rubeniskov/traverse-json)
![npm-publish](https://github.com/rubeniskov/traverse-json/workflows/npm-publish/badge.svg)
[![Downloads](https://img.shields.io/npm/dw/traverse-json)](https://www.npmjs.com/package/traverse-json)

A complete traverse json function with `iterable` interface.

## Motivation

Many time I've encontered with the difficult task of mutate a object with nested properties by filtering properties using a single function, so a `traverse-json` solves this using multiple options for traversing.
## Functions

<dl>
<dt><a href="#traverseJson">traverseJson(obj, [opts])</a> ⇒ <code><a href="#TraverseIterator">TraverseIterator</a></code></dt>
<dd><p>Creates a function which traverses an object by its keys and values recursively,
returning the iterator result with the full path and its value</p>
</dd>
<dt><a href="#createIterator">createIterator(obj, [opts])</a> ⇒ <code>Iterable</code></dt>
<dd><p>Returns a traverseJson iterable, usefull for use it in a for loop.</p>
</dd>
</dl>

## Typedefs

<dl>
<dt><a href="#TraverseJsonOptions">TraverseJsonOptions</a> : <code>Object</code></dt>
<dd></dd>
<dt><a href="#TraverseJsonEntry">TraverseJsonEntry</a> : <code>Array.&lt;string, any&gt;</code></dt>
<dd></dd>
<dt><a href="#TraverseIteratorResult">TraverseIteratorResult</a> : <code>Object</code></dt>
<dd></dd>
<dt><a href="#TraverseIterator">TraverseIterator</a> ⇒ <code><a href="#TraverseIteratorResult">TraverseIteratorResult</a></code></dt>
<dd></dd>
</dl>

<a name="traverseJson"></a>

## traverseJson(obj, [opts]) ⇒ [<code>TraverseIterator</code>](#TraverseIterator)
Creates a function which traverses an object by its keys and values recursively,
returning the iterator result with the full path and its value

**Kind**: global function  

| Param | Type |
| --- | --- |
| obj | <code>Object</code> | 
| [opts] | [<code>TraverseJsonOptions</code>](#TraverseJsonOptions) | 

**Example**  
```javascript
const traverseJson = require('.');

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
### Outputs
__{}__
```
[ '/foo', 0 ]
[ '/nested/depth', 1 ]
[ '/nested/nested/depth', 2 ]
[ '/nested/nested/nested/depth', 3 ]
[ '/nested/nested/nested/nested/depth', 4 ]
[ '/bar', 1 ]
```
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
__{ [recursive](#traversejsonoptions--object): false }__
```
[ '/foo', 0 ]
[ '/nested',
  { depth: 1, nested: { depth: 2, nested: [Object] } } ]
[ '/bar', 1 ]
```
__{ [step](#traversejsonoptions--object): 2 }__
```
[ '/foo', 0 ]
[ '/bar', 1 ]
```
__{ [test](#traversejsonoptions--object): /depth$/ }__
```
[ '/nested/depth', 1 ]
[ '/nested/nested/depth', 2 ]
[ '/nested/nested/nested/depth', 3 ]
[ '/nested/nested/nested/nested/depth', 4 ]
```
__{ [test](#traversejsonoptions--object): /nested$/, nested: true }__
```
[ '/nested',
  { depth: 1, nested: { depth: 2, nested: [Object] } } ]
[ '/nested/nested',
  { depth: 2, nested: { depth: 3, nested: [Object] } } ]
[ '/nested/nested/nested', { depth: 3, nested: { depth: 4 } } ]
[ '/nested/nested/nested/nested', { depth: 4 } ]
```
__{ [test](#traversejsonoptions--object): "&#42;&#42;/{depth,foo}" }__
```
[ '/foo', 0 ]
[ '/nested/depth', 1 ]
[ '/nested/nested/depth', 2 ]
[ '/nested/nested/nested/depth', 3 ]
[ '/nested/nested/nested/nested/depth', 4 ]
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

| Name | Type | Description |
| --- | --- | --- |
| [opts.recursive] | <code>Boolean</code> | enable/disable nested arrays and objects recursion |
| [opts.nested] | <code>Boolean</code> | also emit nested array or objects |
| [opts.step] | <code>Boolean</code> | the step to increment, default 1 |
| [opts.test] | <code>Boolean</code> | regexp, string [minimatch](https://www.npmjs.com/package/minimatch) or function to filter properties |

<a name="TraverseJsonEntry"></a>

## TraverseJsonEntry : <code>Array.&lt;string, any&gt;</code>
**Kind**: global typedef  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| 0 | <code>string</code> | Object path |
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
**Kind**: global typedef  
