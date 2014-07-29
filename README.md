# grunt-meta-excel [![Build Status](https://travis-ci.org/daikiueda/grunt-meta-excel.svg?branch=master)](https://travis-ci.org/daikiueda/grunt-meta-excel)

> Update meta tags according to .xlsx file.  
> HTMLファイルのtitle, description, keywords, OGPなどの値を、Excelファイルの内容にあわせて更新するGruntプラグイン。

## Getting Started
This plugin requires Grunt `~0.4.5`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```Bash
$ npm install grunt-meta-excel --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```JavaScript
grunt.loadNpmTasks( "grunt-meta-excel" );
```

## The "meta_excel" task

### Overview
In your project's Gruntfile, add a section named `meta_excel` to the data object passed into `grunt.initConfig()`.

```JavaScript
grunt.initConfig({
  meta_excel: {
    options: {
      // Task-specific options go here.
    },
    your_target: {
      // Target-specific file and options go here.
    },
  },
});
```

### Options

* __htmlDir__ String  
  Path to html files root directory.

* __xlsx__ String  
  Path to xlsx file.

* __options__ Object
  * `dataStartingRow` Number (*one-based row position)
  * `mapping` Object
  * `charset` String

### Usage Examples

```JavaScript
grunt.initConfig( {
    meta_excel: {
        options: {
            dataStartingRow: 8,
            mapping: {
                path: "A",
                title: "B",
                title_all: "D",
                description: "E",
                keywords: "F",
                url: "G",
                thumbnail: "H",
                canonical: "I"
            }
        },
        sample_site: {
            xlsx: "sample/pages.xlsx",
            htmlDir: "sample/htdocs/"
        }
    }
} );

grunt.loadNpmTasks( "grunt-meta-excel" );
```
```Bash
$ grunt meta_excel
```
