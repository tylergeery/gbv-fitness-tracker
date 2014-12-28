'use strict';

/*
 * Express Dependencies
 */
var hbs,
    express = require('express'),
    passport = require('passport'),
    bodyParser = require('body-parser'),
    app = express(),
    port = 3000,
    exphbs = require('express3-handlebars');

app.configure(function() {
  // For gzip compression
  app.use(express.logger('dev'));
  app.use(express.compress());
  app.use(express.static('public'));
  app.use(express.cookieParser());
  app.use(bodyParser.urlencoded({ extended: false }))
  app.use(bodyParser.json())
  app.use(express.session({ secret: 'TravisDoesntHelp', maxAge: null }));
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

    process.env['MONGO_URL'] = 'mongodb://localhost/fitness-local';
}

// Set Handlebars
app.set('view engine', 'handlebars');


// Need route declarations instantiated here because they are dependent on above if/else
var authenticate = require('./routes/authenticate'),
    mainHandler = require('./routes/main'),
    userHandler = require('./routes/user'),
    adminHandler = require('./routes/admin');

/*
 * Get Routes w/ Views
 */
app.get('/', mainHandler.main);
app.get('/about', mainHandler.about);
app.get('/blog', mainHandler.blog);
app.get('/login', mainHandler.login);
app.get('/register', mainHandler.register);
app.get('/users', authenticate.isLoggedIn, mainHandler.users);

/*
 * Get Routes w/ Resources
 */


/*
 * Post Routes
 */
app.post('/login', authenticate.login, mainHandler.loggingIn);
app.post('/register', authenticate.register, mainHandler.loggingIn);


/*
 * Admin Get Routes w/ Views
 */
app.get('/admin', authenticate.isAdminLoggedIn, adminHandler.main);

/*
 * Admin Get Routes w/ Resources
 */


/*
 * Admin Post Routes
 */

/*
 * Start it up
 */
app.listen(process.env.PORT || port);
console.log('Express started on port ' + port);