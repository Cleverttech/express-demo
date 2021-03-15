const express = require('express');
const router = express.Router();

// app.get(), app.post(), app.put(), app.delete()
const courses = [
    { id: 1, name: 'course1' },
    { id: 2, name: 'course2' },
    { id: 3, name: 'course3' },
]


// add
router.post('/', (req, res) => {
    const { error } = validateCourse(req.body); //function below

    if (error) return res.status(400).send(error.details[0].message);

    const course = {
        id: courses.length + 1,
        name: req.body.name, //express.json() handles this syntax
    };
    courses.push(course);
    res.send(course);
});

// find
router.get('/:id', (req, res) => {
    const course = courses.find((c) => c.id === parseInt(req.params.id));
    if (!course)
        return res
            .status(404)
            .send('The course with the given ID was not found');
    res.send(course);
});

//Update
router.put('/:id', (req, res) => {
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

// Delete
router.delete('/:id', (req, res) => {
    const course = courses.find((c) => c.id === parseInt(req.params.id));
    if (!course)
        return res
            .status(404)
            .send('The course with the given ID was not found');

    const index = courses.indexOf(course);
    courses.splice(index, 1);
    res.send(course);
});

// validation with joi
function validateCourse(course) {
    const schema = {
        name: Joi.string().min(3).required(),
    };
    return Joi.validate(course, schema);
}
module.exports = router;
