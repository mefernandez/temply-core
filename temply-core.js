'use strict';

var cheerio = require('cheerio');
var _ = require('lodash');
var fs = require('fs');
var loaderFactory = require('./plugin-loader');

module.exports = function (pluginsRepository) {


  var pluginsRepository = pluginsRepository ? (pluginsRepository instanceof Array ? pluginsRepository : [pluginsRepository]) : [];

  // Build an execution model for the HTML passed as an argument
  function build(html) {
    var $ = cheerio.load(html);
    var elements = $('[class*="cms-"]');
    var loader = loaderFactory(pluginsRepository);

    var plugins = _.chain(elements)
      .map(function(el) {
        var $el = $(el);
        var clazz = $el.attr('class');
        var plugins = clazz.split(' ');

        var modelItems = _.chain(plugins)
          .filter(function(plugin) {
            var matches = plugin.match(/cms-(?:data|render)-(?:\w-?)+/);
            return !!matches;
          })
          .map(function(plugin) {
            var modelItem = {
              plugin: {
                name: plugin,
                instance: loader.loadPlugin(plugin),
                $element: $el
              }
            };
            return modelItem;
          })
          .value();
        return modelItems;
      })
      .flatten()
      .value();
    var model = {
      $html: $,
      plugins: plugins
    };
    return model;
  }

  // Build an execution model for the HTML passed as an argument
  function render(model, options, callback) {

    if (arguments.length === 2) {
      callback = options;
      options = null;
    }

    if (!model) {
      callback();
      return;
    }


    if (!model.plugins) {
      if (model.$html) {
        callback(model.$html.html());
      } else {
        callback();
      }
      return;
    }

    var k = model.plugins.length;


    // see http://book.mixu.net/node/ch7.html
    function series(data, options, index) {

      if (index < k) {
        var plugin = model.plugins[index].plugin.instance;

        var $element = model.plugins[index].plugin.$element;

        // Check how many params defined this plugin
        if (plugin.length === 4) {
          // Call it with options
          plugin(data, $element, options, function(data) {
            var next = index + 1;
            series(data, options, next);
          });
        } else {
          // Call it without options
          plugin(data, $element, function(data) {
            var next = index + 1;
            series(data, options, next);
          });
        }
      } else {
        var render = model.$html.html();
        callback(render);
      }
    }
    series([], options, 0);
  }

  return {
    build: build,
    render: render
  };
};
