const validator = require('is-my-json-valid')
const getMsgContent = require('ssb-msg-content')
const schema = require('../schema/tag')

const isTagContent = validator(schema, {verbose: true})

module.exports = function (server) {
  return function isTag (obj) {
    const result = isTagContent(getMsgContent(obj))

    // exposes error messages provided by is-my-json-valid
    isTag.errors = isTagContent.errors

    return result
  }
}
