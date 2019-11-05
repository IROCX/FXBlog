var express = require('express')
var app = express()
var mongoose = require('mongoose')
var bodyParser = require('body-parser')
var moment = require('moment')
var methodOverride = require('method-override')
var expressSanitizer = require('express-sanitizer')

app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(methodOverride('_method'))
app.use(expressSanitizer())

mongoose.connect('mongodb://localhost:27017/myblog', { useUnifiedTopology: true, useNewUrlParser: true, useFindAndModify: false })
var moment = require('moment')
moment().format('MMMM Do YYYY')
var blogSchema = new mongoose.Schema({
    title: String,
    image: { type: String, default: 'https://cdn.pixabay.com/photo/2016/03/21/20/05/image-1271454_1280.png' },
    body: String,
    created: { type: Date, default: Date.now }
})

var newBlog = mongoose.model('Blog', blogSchema)

// newBlog.create({
//     title: 'Computer',
//     image: 'https://wallpapercave.com/wp/QF7ldWw.jpg',
//     body: 'Hello....This is a blog Post.'
// })

app.listen(3000, () => {
    console.log('Server running ... ')
})

app.get('/blogs', (req, res) => {
    newBlog.find({}, (error, itemreturned) => {
        if (error) {
            console.log(error)
        } else {
            res.render('index', { blogs: itemreturned })
        }
    })
})

app.get('/', (req, res) => {
    res.redirect('/blogs')
})

app.get('/blogs/new', (req, res) => {
    res.render('new')
})

app.post('/blogs', (req, res) => {
    req.body.blog.body = req.sanitize(req.body.blog.body)
    newBlog.create(req.body.blog, (error, itemReturned) => {
        if (error) {
            res.render('new')
        } else {
            res.redirect('/blogs')
        }
    })
})

app.get('/blogs/:id', (req, res) => {
    // res.send('Here we will show the details')
    newBlog.findById(req.params.id, (error, itemReturned) => {
        if (error) {
            res.redirect('/blogs')
        } else
            res.render('show', { blog: itemReturned })
    })
})

app.get('/blogs/:id/edit', (req, res) => {
    newBlog.findById(req.params.id, (error, itemreturned) => {
        if (error)
            res.redirect('/blogs/:id/edit')
        else {
            res.render('edit', { blog: itemreturned })
        }
    })
})

app.put('/blogs/:id', (req, res) => {
    req.body.blog.body = req.sanitize(req.body.blog.body)
    newBlog.findByIdAndUpdate(req.params.id, req.body.blog, (error, itemReturned) => {
        if (error) {
            res.redirect('/blogs')
        } else {
            res.redirect('/blogs/' + req.params.id)
        }
    })
})

app.delete('/blogs/:id', (req, res) => {
    newBlog.findByIdAndRemove(req.params.id, (error) => {
        if (error) {
            res.redirect('/blogs')
        }
        else {
            res.redirect('/blogs')
        }
    })
})