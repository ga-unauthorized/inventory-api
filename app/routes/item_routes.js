// Express docs: http://expressjs.com/en/api.html
const express = require('express')
// Passport docs: http://www.passportjs.org/docs/
const passport = require('passport')

// pull in Mongoose model for items
const Item = require('../models/item')

// this is a collection of methods that help us detect situations when we need
// to throw a custom error
const customErrors = require('../../lib/custom_errors')

// we'll use this function to send 404 when non-existant document is requested
const handle404 = customErrors.handle404
// we'll use this function to send 401 when a user tries to modify a resource
// that's owned by someone else
const requireOwnership = customErrors.requireOwnership

// this is middleware that will remove blank fields from `req.body`, e.g.
// { item: { title: '', text: 'foo' } } -> { item: { text: 'foo' } }
const removeBlanks = require('../../lib/remove_blank_fields')
// passing this as a second argument to `router.<verb>` will make it
// so that a token MUST be passed for that route to be available
// it will also set `req.user`
const requireToken = passport.authenticate('bearer', { session: false })

// instantiate a router (mini app that only handles routes)
const router = express.Router()

// INDEX
// GET /items
// we add routes to our router instead of `app` when using route handles
// we first make sure the user is sign in with `requireToken` and then we handle the request
router.get('/items', requireToken, (req, res, next) => {
  // Get all of our items, using the item model
  Item.find()
    // .populate('owner')
    .then(items => {
      // console.log('req.user._id', req.user._id)
      const arrayItems = items.filter(item => {
        // if you want to use _ , you need npm install ubderscore first
        // if (_.isEqual(item.owner._id, req.user._id)) {
        //   return item
        // }
        // console.log('item.owner._id', item.owner._id)
        if (req.user._id.toString() === item.owner._id.toString()) {
          return item
        }
      })
      // console.log('result', arrayItems)
      return arrayItems
    })
    .then(items => {
      // map each mongoose item object, into a plain old javascript object,useing toObject
      // this will apply virtuals and the tr fn=un
      console.log(req.user._id)
      return items.map(item => item.toObject())
      // return items.map(item => item)
    })
    // respond with your eamokes
    .then(items => res.status(200).json({ items: items }))
    // this call call the next middlecave, in this time errorHandle , if we encounter an error
    .catch(next)
})

// SHOW
// GET /items/5a7db6c74d55bc51bdf39793
// we include an `:id` dynamic segment, so we can get the specific item
// require TOKEN to ensure user is sign in
router.get('/items/:id', requireToken, (req, res, next) => {
  // req.params.id gives us the access to the id from the path (`/:id`)
  // we use Item.findById, to find the item with that id
  Item.findById(req.params.id)
    // if there isnt an item with that id , then send the user a 404 Not found
    .then(handle404)
    // respond with an item object , after calling `toObject` on the item
    .then(item => {
      requireOwnership(req, item)
      return res.status(200).json({ item: item.toObject() })
    })
    // if an error occurs , send it to the next middleware (error handler)
    .catch(next)
})

// CREATE
// POST /items
router.post('/items', requireToken, (req, res, next) => {
  // set owner of new item to be current user
  req.body.item.owner = req.user.id

  Item.create(req.body.item)
    // respond to succesful `create` with status 201 and JSON of new "item"
    .then(item => {
      res.status(201).json({ item: item.toObject() })
    })
    // if an error occurs, pass it off to our error handler
    // the error handler needs the error message and the `res` object so that it
    // can send an error message back to the client
    .catch(next)
})

// UPDATE
// PATCH /items/5a7db6c74d55bc51bdf39793
router.patch('/items/:id', requireToken, removeBlanks, (req, res, next) => {
  // if the client attempts to change the `owner` property by including a new
  // owner, prevent that by deleting that key/value pair
  delete req.body.item.owner

  Item.findById(req.params.id)
    .then(handle404)
    .then(item => {
      // pass the `req` object and the Mongoose record to `requireOwnership`
      // it will throw an error if the current user isn't the owner
      requireOwnership(req, item)

      // pass the result of Mongoose's `.update` to the next `.then`
      return item.updateOne(req.body.item)
    })
    // if that succeeded, return 204 and no JSON
    .then(() => res.sendStatus(204))
    // if an error occurs, pass it to the handler
    .catch(next)
})

// DESTROY
// DELETE /items/5a7db6c74d55bc51bdf39793
router.delete('/items/:id', requireToken, (req, res, next) => {
  Item.findById(req.params.id)
    .then(handle404)
    .then(item => {
      // throw an error if current user doesn't own `item`
      requireOwnership(req, item)
      // delete the item ONLY IF the above didn't throw
      item.deleteOne()
    })
    // send back 204 and no content if the deletion succeeded
    .then(() => res.sendStatus(204))
    // if an error occurs, pass it to the handler
    .catch(next)
})

module.exports = router
