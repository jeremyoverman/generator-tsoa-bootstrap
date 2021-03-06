'use strict';
const Generator = require('yeoman-generator');
let ejs = require('ejs');
const fs = require('fs');
const path = require('path');
const beautify = require('gulp-beautify');

module.exports = class extends Generator {
  constructor(opts, args) {
    super(opts, args);

    this.registerTransformStream(
      beautify({
        brace_style: 'collapse-preserve-inline' // eslint-disable-line camelcase
      })
    );
  }
  /**
   * This function takes a string (normally a files output) and finds any
   * occurence of:
   *
   * ```javascript
   * /* yeo: some-flag /* (With the end comment the correct way)
   * ```
   *
   * When it finds that flag, it looks in the params for the flag and places
   * that param after the comment. For intstance, if you have a generator that
   * needs to add a new import to a file, you could do something like:
   *
   * ```javascript
   * // My Module
   *
   * export default interface Models {
   *     /* yeo: import /*
   * }
   *
   * // Generator
   * commentTpl(fileContents, {
   *     import: `    ${name}: I${name};`
   * });
   * ```
   *
   * and the output would be:
   *
   * ```javascript
   * export default interface Models {
   *     /* yeo: import /*
   *     Module: IModule;
   * }
   * ```
   *
   * @param {string} string The string to be manipulated
   * @param {object} params The params to be matched to the placeholders
   */
  alterTpl(outputFile, templates, params) {
    let input = this.fs.read(outputFile);

    let result = '';
    let isReplacing = false;

    input.split('\n').forEach(line => {
      if (/yeo-end/.test(line)) {
        isReplacing = false;
      }

      if (!isReplacing) {
        result += line + '\n';
      }

      let match = line.match(/.*?\/\*.*?yeo-?(\w*?): (\w*).*?\*\//);
      if (!match || !templates[match[2]]) return;

      if (match[1] === 'replace') {
        isReplacing = true;
      }

      let template = this.fs.read(templates[match[2]]);
      let rendered = ejs.render(template, params);

      result += rendered + '\n';
    });

    this.fs.write(outputFile, result);
  }

  /**
   * Delete all files in a directory
   *
   * @param {string} directory The directory to empty
   */
  emptyDirectory(directory) {
    return new Promise(resolve => {
      fs.readdir(directory, (err, files) => {
        if (err) return resolve([]);

        resolve(files);
      });
    }).then(files => {
      return Promise.all(
        files.map(file => {
          return new Promise((resolve, reject) => {
            fs.unlink(path.join(directory, file), err => {
              if (err) return reject();

              resolve();
            });
          });
        })
      );
    });
  }

  getDirectoryFileCount(directory) {
    return new Promise(resolve => {
      fs.readdir(directory, (err, files) => {
        if (err) return resolve(0);

        resolve(files.length);
      });
    });
  }

  upperCase(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  lowerCase(str) {
    return str.charAt(0).toLowerCase() + str.slice(1);
  }
};
