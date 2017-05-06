/**
 * Require Browsersync
 */
var browserSync = require('browser-sync');

/**
 * Run Browsersync with server config
 */
browserSync({
    server: "client/app",
    files: ["client/app/*.html", "client/app/**/*.css", "client/app/**/*.js"]
});