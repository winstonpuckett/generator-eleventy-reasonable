# What is this?

In a sentence? A template for 11ty projects so that you don't have to set up minification with every new project.

The best way to achieve performance on the web is by delivering the smallest payload possible and pre-rendering any dynamic resources as much as possible. After trying many Static Site Generators, I've found that [11ty](https://www.11ty.dev) delivers ease of use and powerful resources to pre-render anything I need. I've used it extensively to create side projects which always pass 100% lighthouse scores (something just not possible with most modern frameworks).

Though I've grown to love 11ty, it has become apparent that it is a fairly bare-bones SSG. After the third or fourth time having to set up the same basic configs and settings, I got tired of trying to remember how to enable minification, vs code build settings, and other features I wanted by default. [Yeoman](https://yeoman.io/) is an industry-standard tool which scaffolds out projects.

This project allows you to run `yo eleventy-reasonable` to take the tedium out of setting up a project for the best SSG on the market.

# Features?

- Runs `npm install` to always start with the latest versions of dependencies
- Minification on build through [html-minifier](https://www.npmjs.com/package/html-minifier), [clean-css](https://www.npmjs.com/package/clean-css), and [terser](https://www.npmjs.com/package/terser).
- Sets up standard 11ty folder structure (_includes for include-able files and _assets for files to copy to the server).
- Sets up a default nunjucks template and wires in a default CSS file.
- Default template has a number of good meta tag suggestions and sets up an emoji favicon (something I've appreciated).
- Default CSS file is in dark mode in case you're coding late at night.
- With only a few short files, it's easy to see what needs to be updated and removed.
- Sets up a build and serve script in the package.json file, so you can run `npm run serve` to work with the project.

# How do I get started?

1. Install dependencies:
    1. [node](https://nodejs.org/en)
    1. [Yeoman](https://yeoman.io/learning/index.html): `npm install -g yo`
    1. This package: `npm install -g generator-eleventy-reasonable`
1. Navigate to your preferred workspace
1. Run `yo eleventy-reasonable`
1. Follow the prompts

And you're off with a new project!

# Can I use this for a commercial project?

Yes! This project is licensed under MIT. If you're doing something cool, let me know!

# How do I appreciate the project?

- Tell your friends!
- Star the repo on GitHub: https://github.com/winstonpuckett/generator-eleventy-reasonable
