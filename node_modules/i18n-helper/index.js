/* 
* @Author: caoke
* @Date:   2015-09-18 13:37:01
* @Last Modified by:   caoke
* @Last Modified time: 2015-09-21 17:32:07
*/

module.exports = generateI18nHelper;

// i18n helper generator
function generateI18nHelper() {

    // language resource
    var lang = {};

    // split arguments
    var args = toArray(arguments);

    // merge all resources to lang
    for (var i = 0; i < args.length; i++) {
        var arg = args[i];
        for (var j in arg) {
            lang[j] = arg[j];
        }
    }

    var i18nHelper = function() {

        // split arguments
        var args = toArray(arguments);

        // first argument is key
        var key = notNull(args[0]);

        // key exists in lang pack
        if (key in lang) {

            // find value mapping to this key
            var value = notNull(lang[key]);

            // value maybe a substitute template
            if (value.indexOf('{') !== -1) {

                // subsititute the template
                return value.replace(/\{(\d+)\}/mg, function(p, index) {

                    // index in array
                    if (index in args) {
                        return args[index];
                    } else {

                        // fallback is blank string
                        return '';
                    }
                });
            } else {
                return value;
            }

        // key not exists
        } else {
            return i18nHelper.keyNotFound(key);
        }
    };

    // key not found handler
    i18nHelper.keyNotFound = function(key) {
        return key;
    };

    return i18nHelper;
};

// key not found handler
function keyNotFound(key) {
    return key;
};

// arguments to array
function toArray(o) {
    return Array.prototype.slice.call(o, 0);
}

// object to string, null or undefined will return empty string
function notNull(o) {
    if (o === undefined || o === null) {
        return '';
    }
    return '' + o;
}
