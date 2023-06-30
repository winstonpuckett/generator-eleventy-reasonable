var Generator = require('yeoman-generator')
var fs = require('fs')

module.exports = class extends Generator {
    constructor(args, opts) {
        super(args, opts)
    }

    async createBuildRunScripts() {
        // Get info
        const answers = await this.prompt([
            {
                type: 'input',
                name: 'name',
                message: `What would you like to name this project?`,
                default: this.appname
            },
            {
                type: 'input',
                name: 'author',
                message: `Who is the author? (will be used for HTML meta tags and package.json)`
            },
            {
                type: 'input',
                name: 'license',
                message: `How would you like to license the NPM package?`,
                default: 'ISC'
            }
        ])

        // Create package.json
        {
            this.log(`🌑 Creating the npm package.`);
            fs.writeFileSync(this.destinationPath('package.json'), JSON.stringify({
                name: answers.name,
                author: answers.author,
                license: answers.license,
                version: "0.0.1",
                scripts: {
                    "build": "npx @11ty/eleventy",
                    "serve": "npx @11ty/eleventy --serve"
                }
            }, null, 2))
        }

        // Install dependencies
        {
            this.log(`🌒 Installing latest versions of dependencies to our npm package. (this may take a moment)`);
            this.spawnCommandSync('npm', ['i', '@11ty/eleventy', 'html-minifier', 'clean-css', 'terser'], { stdio: ['ignore', 'ignore'] });
        }

        // Create .eleventy.js file
        {
            this.log('🌓 Creating default configuration.')
            fs.writeFileSync(this.destinationPath('.eleventy.js'), `const CleanCSS = require("clean-css");
const htmlMinifier = require("html-minifier");
const { minify } = require("terser");

module.exports = function (eleventyConfig) {
    // Minify HTML files on build
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

    // Minify CSS upon request.
    eleventyConfig.addFilter("cssMinifier", function (css) {
        return new CleanCSS({}).minify(css).styles;
    });

    // Minify JS upon request
    eleventyConfig.addNunjucksAsyncFilter("jsMinifier", async function(code, callback) {
        try {
            const minified = await minify(code);
            callback(null, minified.code);
        } catch (err) {
            console.error("Terser error: ", err);
            // Fail gracefully.
            callback(null, code);
        }
    })

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
            this.log('🌔 Creating initial project files')
            fs.mkdirSync(this.destinationPath('src'))
            fs.mkdirSync(this.destinationPath('src/_includes'))

            // CSS
            fs.mkdirSync(this.destinationPath('src/_includes/css'))
            fs.writeFileSync(this.destinationPath('src/_includes/css/site.css'), `:root {
    --color-background: #000;
    --color-foreground: #fff;
    --color-brand: #f0f;
}

body {
    background: var(--color-background);
    color: var(--color-foreground);
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    min-height: 100vh;
    font-size: 20px;
    font-family: sans-serif;
}

main {
    margin: auto;
    max-width: 600px;
}

a {
    color: var(--color-brand);
}

.nav__logo {
    color: var(--color-foreground);
    text-decoration: none;
}`)

            // JS
            fs.mkdirSync(this.destinationPath('src/_includes/js'))
            fs.writeFileSync(this.destinationPath('src/_includes/js/example.js'), `console.log('I feel included!')`)

            // Layout
            fs.mkdirSync(this.destinationPath('src/_includes/layouts'))
            fs.writeFileSync(this.destinationPath('src/_includes/layouts/default.njk'), `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="referrer" content="same-origin">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="TODO">
    <meta name="keywords" content="TODO">
    <meta name="publisher" content="TODO">
    <meta name="robots" content="all">
    <meta name="creator" content="${answers.author}">
    <meta name="author" content="${answers.author}">
    <title>${answers.name}</title>
    <link rel="icon"
        href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 200 200%22><text font-size=%22160%22 y=%221em%22 x=%22-0.05em%22>🌕</text></svg>">
    </script>
</head>

<body>
    <style>{% filter cssMinifier %}{% include "css/site.css" %}{% endfilter %}</style>

    <header>
        <nav>
            <a class="nav__logo" href="/"><h1>🌕 ${answers.name}</h1></a>
        </nav>
    </header>

    <main>
        {{ content | safe }}
    </main>

    <footer>
        <p>Created by ${answers.author}. Initially generated using <a href="https://github.com/winstonpuckett/generator-eleventy-reasonable">eleventy reasonable</a>.</p>
    </footer>

    {% set exampleJs %}{% include "js/example.js" %}{% endset %}
    <script>{{ exampleJs | jsMinifier | safe }}</script>
</body>

</html>
`);

            // Index
            fs.writeFileSync(this.destinationPath('src/index.njk'), `---
layout: layouts/default.njk
---

<p>Welcome to your new project!!</p>

<h2>What should I do now?</h2>

<ul>
    <li>Look at the meta tags in src/_includes/layouts/default.njk. Some of them need updating.</li>
    <li>Update the styles in site.css</li>
    <li>Visit the <a href="https://www.11ty.dev/">11ty docs</a> to learn about all of the cool things you can do with 11ty.</li>
    <li>Lookup <a href="https://mozilla.github.io/nunjucks/">nunjucks syntax</a> because it really is the best templating language.</li>
    <li>Show your appreciation by leaving a start on GitHub</li>
</ul>
`);
        }

        // Output success
        {
            this.log("🌕 Success!")
            this.log("- If you see a warning message, 'No change to package.json was detected...', this is safe to ignore.")
            this.log("- Run `npm run serve` to view the project!")
        }
    }
};