const config = require('./config')
// require `store` so we have access to our `token`
// so the API knows who we anywhere
const store = require('./store')

const viewItem = function () {
  return $.ajax({
    method: 'GET',
    url: config.apiUrl + '/view_item'
  })
}

const onCreateWorkout = function (formData) {
  return $.ajax({
    method: 'POST',
    url: config.apiUrl + '/workout_logs',
    data: formData
  })
}

const signUp = function (formData) {
  return $.ajax({
    method: 'POST',
    url: config.apiUrl + '/sign-up',
    data: formData
  })
}

const signIn = function (formData) {
  return $.ajax({
    method: 'POST',
    url: config.apiUrl + '/sign-in',
    data: formData
  })
}

const changePassword = function (formData) {
  return $.ajax({
    method: 'PATCH',
    url: config.apiUrl + '/change-password',
    headers: {
      Authorization: 'Token token=' + store.user.token
    },
    data: formData
  })
}

const signOut = function (formData) {
  return $.ajax({
    method: 'DELETE',
    url: config.apiUrl + '/sign-out',
    headers: {
      Authorization: 'Token token=' + store.user.token
    }
  })
}

module.exports = {
  signUp,
  signIn,
  changePassword,
  signOut,
  onCreateWorkout,
  displayWorkouts,
  viewItem
}
