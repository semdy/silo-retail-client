# i18n-helper

[![npm version](https://badge.fury.io/js/i18n-helper.svg)](http://badge.fury.io/js/i18n-helper)

---

I18n helper for node, you can use it as a helper in jsx , handlebars , ejs or any other template engines .

## Install

```shell
npm install i18n-helper --save
```

## Usage

```js
var locale = 'en';
var langs = {
    en: {
        'greetings': 'Hello {1} !'
    },
    zh: {
        'greetings': '你好 {1}！'
    }
};

var i18n = require('i18n-helper')(langs[locale]);

console.log(i18n('greetings', 'Jack')); // => 'Hello Jack !'
```

### Init

`i18n-helper` exports a generator which returns an i18n helper.

You can pass multiply resources into this generator,
the resources will be merged to one from right to left.

```js
// global resource and module resource
var globalLangs = require('../i18n/en');
var moduleLangs = require('./i18n/en');

// the i18n helper generator
var i18nHelperGenerator = require('i18n-helper');

// create an i18n helper with the giving resources
var i18nHelper = i18nHelperGenerator(globalLangs, moduleLangs);
```

### Find Key

The helper will try to find the matched key from the merged resource,
if not found, the key itself is returned.

```js
var i18n = i18nHelper({ key1: 'hello', key2: 'world' });

console.log(i18n('key'));
// => 'key'
```

You can override `i18n.keyNotFound` to apply your customized `key not found` handler ( >= 1.1.0 ).

```js
var i18n = i18nHelper({ key1: 'hello', key2: 'world' });

i18n.keyNotFound = function(key) {
    return key + ' is not found';
};

console.log(i18n('key'));
// => 'key is not found'
```

### Template

If the value to the key is a template ( with a string like `{1}` ),
then the arguments will be substituted into the template.

```js
var i18n = i18nHelper({ greetings: 'Hello {1} ! Welcome to {2} .' });

console.log(i18n('greetings', 'Jack', 'China'));
// => 'Hello Jack ! Welcome to China .'
```

## Change Log

### 1.1.0

- add `keyNotFound` handler.

## Links

- [Bug Report](https://github.com/gbk/i18n-helper/issues)
