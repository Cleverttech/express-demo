const Joi = require('joi');
const config = require('config')
const startupDebugger= require('debug')('app:startup');
const dbDebugger= require('debug')('app:db');
const helmet = require('helmet');
const morgan = require('morgan');
const logger = require('./logger');
const authenticate = require('./authenticate');
const express = require('express');
const app = express();

// configuration
// console.log(`NODE_ENV: ${process.env.NODE_ENV}`)
// console.log(`app: ${app.get('env')}`)

console.log(`Application Name: ${config.get('name')}`)
console.log(`Mail Server: ${config.get('mail.host')}`)
console.log(`Mail password: ${config.get('mail.password')}`)


if (app.get('env') === 'development') {
    app.use(morgan('short'));
    console.log('morgan is enabled...')
}

// debugging using debug
if (app.get('env') === 'development') {
    app.use(morgan('short'));
    startupDebugger('debugger is enabled...')
}
// run DB debugger
dbDebugger('connecting to database..')

app.use(express.json()); // req.body
app.use(express.urlencoded({ extended: true })); // req.body
app.use(express.static('public'));
app.use(logger);
app.use(helmet());
app.use(morgan('short'));//show logs
app.use(authenticate);

// app.get(), app.post(), app.put(), app.delete()

const courses = [
    {id: 1, name: 'course1',},
    {id: 2,name: 'course2'},
    {id: 3, name: 'course3'}
];
app.get('/', (req, res) => {
    res.send("Here are Clever's courses");
});

// return all list of courses
app.get('/api/courses', (req, res) => {
    res.send(courses); // returns a the courses array
});

// adding a course
app.post('/api/courses', (req, res) => {
    const { error } = validateCourse(req.body); //function below

    if (error) return res.status(400).send(error.details[0].message);

    const course = {
        id: courses.length + 1,
        name: req.body.name, //express.json() handles this syntax
    };
    courses.push(course);
    res.send(course);
});

// finding a course
app.get('/api/courses/:id', (req, res) => {
    const course = courses.find((c) => c.id === parseInt(req.params.id));
    if (!course)
        return res
            .status(404)
            .send('The course with the given ID was not found');
    res.send(course);
});

//Updating an existing course
app.put('/api/courses/:id', (req, res) => {
    const course = courses.find((c) => c.id === parseInt(req.params.id));
    if (!course)
        return res
            .status(404)
            .send('The course with the given ID was not found');

    const { error } = validateCourse(req.body);

    if (error) return res.status(400).send(error.details[0].message);

    course.name = req.body.name;
    res.send(course);
});

// Deleting a course
app.delete('/api/courses/:id', (req, res) => {
    const course = courses.find((c) => c.id === parseInt(req.params.id));
    if (!course)
        return res
            .status(404)
            .send('The course with the given ID was not found');

    const index = courses.indexOf(course);
    courses.splice(index, 1);
    res.send(course);
});

// course validation with joi
function validateCourse(course) {
    const schema = {
        name: Joi.string().min(3).required(),
    };
    return Joi.validate(course, schema);
}

 const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`listening on port ${port}`));
