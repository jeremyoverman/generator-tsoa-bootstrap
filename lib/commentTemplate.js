module.exports = {
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
    commentTpl (string, params) {
        let newString = '';

        string.split('\n').forEach(line => {
            newString += line + '\n';

            let match = line.match(/.*?\/\*.*?yeo: (\w*).*?\*\//);
            if (!match) return;

            let param = match[1];

            newString += params[param] + '\n';
        });

        return newString.trim();
    }
}