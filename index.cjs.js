const path = require("path");

const aliasRegex = /^@[\w\-]+/;
const pathAlias = (settings) => {
    const {root = __dirname, ...rawReplacers} = settings;

    const docRoot = path.resolve(root);

    const replacers = Object
        .entries(rawReplacers)
        .reduce(
            (r, [key, aliasPath]) => {
                if (key.startsWith("@") === true) {
                    if (aliasPath.startsWith(".") === true) {
                        r[key] = aliasPath;
                    }
                    else {
                        r[key] = path.resolve(docRoot, aliasPath);
                    }
                }

                return r;
            },
            {}
        );

    return {
        resolveId(lib) {
            if (lib.startsWith("@") === true) {
                const match = lib.match(aliasRegex);

                if (match === null || replacers[match[0]] === undefined) {
                    return;
                }

                return lib.replace(aliasRegex, (alias) => replacers[alias]);
            }
        }
    };
};

module.exports = pathAlias;
