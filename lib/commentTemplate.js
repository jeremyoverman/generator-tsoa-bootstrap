module.exports = {
    resolve (string, params) {
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