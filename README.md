# temply-core

[![NPM Version][npm-image]][npm-url]
[![NPM Downloads][downloads-image]][downloads-url]
[![Travis Build][travis-image]][travis-url]

A non-invasive, pure HTML templating framework.

This is the core framework underpinning [Temply Web](https://github.com/mefernandez/temply).

## Why bother

There are just so many frameworks out there, right? 

So, why bother?

Well, there is this selfish personal satisfaction in doing something on your own, granted.

Other than that, the fundamental approach in Temply is to **preserve the original HTML template**
and **move the code out** to small, atomic units of JS code to transform it: let's call these _plugins_.

## What you get

Take this HTML snippet:

```html
<div class="cms-data-some-plugin">
  <a href="#">Some placeholder text</a>
</div>
```

Temply will lookup all `cms-*` class names and call a plugin with that name.

A plugin is a JS file living inside `plugins` folder, and it looks like this:

```js
module.exports = function(data, $element, callback) {
	$element.text('Hello world!');
	callback(data);
}
```

Which will produce the following HTML result:

```html
<div class="cms-data-some-plugin">
  <a href="#">Hello world!</a>
</div>
```

## What plugins do and how they work

A plugin is just a JS file at the `plugins` folder that begins with `cms-`.

It must export a function like so:

```js
module.exports = function(data, $element, callback) { ...
```

It gets 3 parameters:

- `data`: An object with information the plugin might use to render something.
- `$element`: The HTML element the plugin is invoked from. It is wrapped in a [Cheerio]() object to manipulate the HTML at will.
- `callback`: Because async, right?. A plugin **must** call this function, passing `data` to the next plugin.

### Data and Render plugins

There are 2 categories of plugins: data and render. Both have the same structure, but it's nice to separate concerns.

Data plugins will be devoted to getting information (databases, REST apis) and passing it along with `callback(data)`.

Render plugins will tipically use `data` object passed by parameter and render it.

### Plugins execution model

Plugins are called [in-order](https://en.wikipedia.org/wiki/Tree_traversal#In-order), like in _HTML Tree Traversal_ in-order.

The idea is that preceding `cms-data` plugins pass along valuable `data` to subsequent `cms-render` plugins. That's it.

## License

[MIT](LICENSE)

[npm-image]: https://img.shields.io/npm/v/temply-core.svg
[npm-url]: https://npmjs.org/package/temply-core
[travis-image]: https://img.shields.io/travis/mefernandez/temply-core/master.svg
[travis-url]: https://travis-ci.org/mefernandez/temply-core
[downloads-image]: https://img.shields.io/npm/dm/temply-core.svg
[downloads-url]: https://npmjs.org/package/temply-core
