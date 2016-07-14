'use strict';

var path = require('path');
var through2 = require('through2');
var PluginError = require('gulp-util').PluginError;
var gutil = require('gulp-util')
var recast = require('recast')

module.exports = function() {
    return through2.obj(function(file, enc, next) {
        if (!file.isDirectory() && !file.isNull() && !file.isStream()) {
            try {
                file.contents = new Buffer(recast.print(recast.visit(recast.parse(file.contents.toString()), {
                    visitCallExpression: function(path) {
                        var expr = path.node;
                        if (expr.callee.name == 'require') {
                            this.traverse(path);
                            if (expr.arguments.length && expr.arguments[0].value.charAt(0) == '.') {
                                var arg = expr.arguments[0];
                                var value = arg.value;
                                while (value[0] == '.' || value[0] == '/')
                                    value = value.slice(1);
                                expr.arguments[0] = arg.raw.charAt(0) + './' + value.split('/').join('.') + arg.raw.charAt(0);
                            }
                        }
                        else {
                            return false;
                        }
                    }
                })).code);
                let fullPath = path.dirname(file.relative).split(path.sep);
                fullPath.push(path.basename(file.path));
                if (fullPath[0] == '.')
                    fullPath.shift();
                console.log(path.dirname(file.relative) + ' : ' + path.basename(file.path) + ' => ' + fullPath.join("."));
                file.path = path.join(file.base, '', fullPath.join("."));
                this.push(file);
            } catch (e) {
                this.emit('error', new PluginError('flatten', e));
            }
        }
        next();
    });
};
