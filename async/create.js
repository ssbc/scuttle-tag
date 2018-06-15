const isTag = require('../sync/isTag')
const TagError = require('../sync/TagError')
const { SCHEMA_VERSION } = require('../schema/version')

module.exports = function (server) {
  return function createTag (recps, cb) {
    const msg = recps && recps.length > 0 ? {
      type: 'tag',
      version: SCHEMA_VERSION,
      recps,
      private: true
    } : { type: 'tag', version: SCHEMA_VERSION }

    if (!isTag(msg)) return cb(TagError(msg))
    server.publish(msg, cb)
  }
}
