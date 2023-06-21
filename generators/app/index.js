var Generator = require('yeoman-generator')
var fs = require('fs')

module.exports = class extends Generator {
    constructor(args, opts) {
        super(args, opts)
    }

    createBuildRunScripts() {
        // Create package.json
        {
            this.log(`🌑 Creating the npm package (you'll provide the author later)`);
            fs.writeFileSync(this.destinationPath('package.json'), JSON.stringify({
                name: this.appname,
                version: "0.0.1",
                author: "TODO: Provide author",
                license: "ISC",
                scripts: {
                    "build": "npx @11ty/eleventy",
                    "serve": "npx @11ty/eleventy --serve"
                }
            }, null, 2))
        }
        
        // Install dependencies
        {
            this.log(`🌒 Installing latest versions of dependencies to our npm package...`);
            this.spawnCommandSync('npm', ['i', '@11ty/eleventy', 'html-minifier'], {});
        }

        // Create .eleventy.js file
        {
            this.log('🌓 Creating a lovely .eleventy.js file')
            fs.writeFileSync(this.destinationPath('.eleventy.js'), `const htmlMinifier = require("html-minifier");
module.exports = function (eleventyConfig) {
    // Minify files on build
    eleventyConfig.addTransform("htmlMinifier", function (content, outputPath) {
        if (outputPath.endsWith(".html")) {
            let minified = htmlMinifier.minify(content, {
                useShortDoctype: true,
                removeComments: true,
                collapseWhitespace: true
            });
            return minified;
        }

        return content;
    });

    // Pass through everything in the assets folder
    eleventyConfig.addPassthroughCopy("src/_assets");

    return {
        dir: {
            // By separating source into a sub folder, we don't have to
            // ignore the package's README.
            input: "src"
        }
    }
};
`)
        }

        // Create template
        {
            this.log('🌔 Creating the initial project for you')

            fs.mkdirSync(this.destinationPath('src'))
            fs.writeFileSync(this.destinationPath('src/index.njk'), `---
layout: layout.njk
---

Hello, world!
            `);

            // Layout
            fs.mkdirSync(this.destinationPath('src/_includes'))
            fs.writeFileSync(this.destinationPath('src/includes/layout.njk'), `<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="referrer" content="same-origin">
    <meta name="theme-color" media="(prefers-color-scheme: dark)" content="#000">
    <meta name="theme-color" media="(prefers-color-scheme: light)" content="#fff">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="TODO">
    <meta name="keywords" content="TODO">
    <meta name="author" content="TODO">
    <meta name="creator" content="TODO">
    <meta name="publisher" content="TODO">
    <meta name="robots" content="all">
    <title>${this.appname}</title>
    <link rel="icon"
        href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 200 200%22><text font-size=%22160%22 y=%221em%22 x=%22-0.05em%22>🌚</text></svg>">
    </script>
</head>

<body>
    {% set siteCss %}{% include 'site.css' %}{% endset %}
    <style>{{ siteCss | cssmin | safe }}</style>

    <header>
        <p>TODO: header</p>
    </header>

    <main>
        {{ content | safe }}
    </main>

    <footer>
        <p>TODO: footer</p>
    </footer>
</body>

</html>

            `);

            fs.writeFileSync(this.destinationPath('src/includes/site.css'), ``);
        }
    }
};