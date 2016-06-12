# temply-core

A non-invasive, pure HTML templating framework.

This is the core framework underpinning [Temply Web](https://github.com/mefernandez/temply).

## Why bother

There are just so many frameworks out there, right? So, why bother?

Well, there is this selfish personal satisfaction in doing something on your own, granted.
Other than that, the fundamental approach in Temply is to preserve the original HTML template
and move the code out to small, atomic units of JS code to transform it: let's call these _plugins_.

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

