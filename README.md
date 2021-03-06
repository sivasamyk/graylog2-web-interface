# Graylog Web Interface
[![Build Status](https://travis-ci.org/Graylog2/graylog2-web-interface.png)](https://travis-ci.org/Graylog2/graylog2-web-interface)

## Development Setup

* Make sure Java 7 is installed
* Install [Typesafe Activator](https://typesafe.com/activator) version 1.2.x and ensure the `activator` binary is in `$PATH`

* Run the server

```
$ activator run
[...]

--- (Running the application from SBT, auto-reloading is enabled) ---

[info] play - Listening for HTTP on /0:0:0:0:0:0:0:0:9000

(Server started, use Ctrl+D to stop and go back to the console...)

```

### Javascript

* Install [node.js](http://nodejs.org/) and npm.
* `cd javascript/`
* `npm install`
* `npm run watch`

**_or_**
* `npm run hot` for hot reloading.

The `npm run watch` command will run the `webpack --watch` task, which is continuously bundling JS whenever a source
file changes.
The `npm run hot` command will run the `webpack-dev-server` instead, which allows in-browser hot reloading.
In order to make switching between different branches faster, we use a script to store all `node_modules` folders
into `.node_cache` and then symlink the folder for the current branch to `node_modules`.

When using IntelliJ or WebStorm, be sure to enable `JSX harmony` (available in IntelliJ 14 and WebStorm 9)
as JavaScript language version to properly support react templates.

You might get an error message during `npm install` from `gyp` because the installed (default) Python version is too recent (sic!):

```
gyp ERR! stack Error: Python executable "python" is v3.4.2, which is not supported by gyp.                                                                                                                 
```

In this case just set the correct (installed!) Python binary before running `npm install`:

```
npm config set python python2.7
```

#### Update Javascript dependencies

a. Update a single dependency

* Update `package.json` file with the new dependency
* `npm update <npm-package>`
* `npm shrinkwrap --dev` to save the whole dependency tree into the `npm-shrinkwrap.json` file

b. Update devDependencies

* `npm shinkwrap` to keep the dependency tree (without devDependencies) into `npm-shrinkwrap.json`
* Update `package.json` file with the new devDependencies
* `npm install`
* Do more work with the new devDependencies
* `npm shrinkwrap --dev` to export the whole dependency tree with the new devDependencies into `npm-shrinkwrap.json`

![YourKit](https://s3.amazonaws.com/graylog2public/images/yourkit.png)

YourKit supports our open source project by sponsoring its full-featured Java Profiler. YourKit, LLC is the creator of [YourKit Java Profiler](http://www.yourkit.com/java/profiler/index.jsp) and [YourKit .NET Profiler](http://www.yourkit.com/.net/profiler/index.jsp), innovative and intelligent tools for profiling Java and .NET applications.
