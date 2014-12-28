'use strict';

/*
 * Express Dependencies
 */
var express = require('express'),
    passport = require('passport'),
    app = express(),
    port = 3000;

/*
 * Use Handlebars for templating
 */
var exphbs = require('express3-handlebars');
var hbs;

var authenticate = require('./routes/authenticate'),
    mainHandler = require('./routes/main'),
    adminHandler = require('./routes/admin');

app.configure(function() {
  // For gzip compression
  app.use(express.compress());
  app.use(express.static('public'));
  app.use(express.cookieParser());
  app.use(express.bodyParser());
  app.use(express.session({ secret: 'Travis doesnt help' }));
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(app.router);
});

/*
 * Config for Production and Development
 */
if (process.env.NODE_ENV === 'production') {
    // Set the default layout and locate layouts and partials
    app.engine('handlebars', exphbs({
        defaultLayout: 'main',
        layoutsDir: 'dist/views/layouts/',
        partialsDir: 'dist/views/partials/'
    }));

    // Locate the views
    app.set('views', __dirname + '/dist/views');

    // Locate the assets
    app.use(express.static(__dirname + '/dist/assets'));

} else {
    app.engine('handlebars', exphbs({
        // Default Layout and locate layouts and partials
        defaultLayout: 'main',
        layoutsDir: 'views/layouts/',
        partialsDir: 'views/partials/'
    }));

    // Locate the views
    app.set('views', __dirname + '/views');
    
    // Locate the assets
    app.use(express.static(__dirname + '/assets'));

    process.env.mongoURL = 'local';
}

// Set Handlebars
app.set('view engine', 'handlebars');



/*
 * Routes
 */
app.get('/', mainHandler.main);
app.get('/login', mainHandler.login);
app.post('/login', authenticate.login, mainHandler.loggingIn);

/*
 * Admin Routes
 */

app.get('/admin', adminHandler.main);

/*
 * Start it up
 */
app.listen(process.env.PORT || port);
console.log('Express started on port ' + port);