const Joi = require('joi');
const config = require('config')
const debug= require('debug')('app:startup');
const helmet = require('helmet');
const morgan = require('morgan');
const logger = require('./middleware/logger');
const courses = require('./routes/courses')
const home = require('./routes/home')
const authenticate = require('./authenticate');
const express = require('express');
const app = express();

// use returned values
app.use(express.json()); // req.body
app.use(express.urlencoded({ extended: true })); // req.body
app.use(express.static('public'));
app.use(logger);
app.use('/api/courses', courses);
app.use('/', home);
app.use(helmet());
app.use(morgan('short'));//show logs
app.use(authenticate);

// test templating engine
// app.set('view engine', 'pug')
// app.set('views', './views') // default
// configuration
// console.log(`NODE_ENV: ${process.env.NODE_ENV}`)
// console.log(`app: ${app.get('env')}`)

console.log(`Application Name: ${config.get('name')}`)
console.log(`Mail Server: ${config.get('mail.host')}`)
console.log(`Mail password: ${config.get('mail.password')}`)

// run morgan to check logs
if (app.get('env') === 'development') {
    app.use(morgan('short'));
    console.log('morgan is enabled...')
}

// debugging using debug-- run startup
if (app.get('env') === 'development') {
    app.use(morgan('short'));
    debug('debugger is enabled...')
}


 const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`listening on port ${port}`));
