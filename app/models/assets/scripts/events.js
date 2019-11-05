const getFormFields = require('../../lib/get-form-fields')
const api = require('./api')
const ui = require('./ui')

const onCreateWorkout = function (event) {
  event.preventDefault()
  const form = event.target
  const formData = getFormFields(form)
  api.onCreateWorkout(formData)
    .then(ui.onCreateWorkoutSuccess)
    .catch(ui.onCreateWorkoutFailure)
  // console.log(api.displayWorkouts().then(response => response.json()))
}

const onSignUp = function (event) {
  // page doesnt refresh when you click on submit button
  event.preventDefault()
  const form = event.target
  const formData = getFormFields(form)
  // console.log('success')
  api.signUp(formData)
    .then(ui.onSignUpSuccess)
    .catch(ui.onSignUpFailure)
}
const onSignIn = function (event) {
  event.preventDefault()
  const form = event.target
  const formData = getFormFields(form)
  api.signIn(formData)
    .then(ui.onSignInSuccess)
    .catch(ui.onSignInFailure)
}

const onChangePassword = function (event) {
  event.preventDefault()
  const form = event.target
  const formData = getFormFields(form)
  api.changePassword(formData)
    .then(ui.onChangePasswordSuccess)
    .catch(ui.onChangePasswordFailure)
}

const onSignOut = function (event) {
  event.preventDefault()
  api.signOut()
    .then(ui.onSignOutSuccess)
    .catch(ui.onSignOutFailure)
}

module.exports = {
  onSignUp,
  onSignIn,
  onChangePassword,
  onSignOut,
  onCreateWorkout
}
