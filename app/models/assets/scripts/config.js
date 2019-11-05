'use strict'

let apiUrl
const apiUrls = {
  production: 'https://calm-basin-76423.com',
  development: 'https://calm-basin-76423.com'
  // development: 'http://localhost:4741'
}

if (window.location.hostname === 'localhost') {
  apiUrl = apiUrls.development
} else {
  apiUrl = apiUrls.production
}

module.exports = {
  apiUrl
}
