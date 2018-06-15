const pull = require('pull-stream')
const { heads } = require('ssb-sort')
const { isFeedId } = require('ssb-ref')
const isTag = require('../sync/isTag')
const TagError = require('../sync/TagError')
const { SCHEMA_VERSION } = require('../schema/version')

module.exports = function (server) {
  return function applyTag (data, cb) {
    const { tagged, message, recps = [], tag } = data
    const _recps = recps.filter(feed => {
      return isFeedId(feed) || isFeedId(feed.link) // TODO check this logic
    })

    pull(
      createBacklinkStream(tag),
      pull.collect((err, msgs) => {
        if (err) return cb(err)

        var msg = {
          type: 'tag',
          version: SCHEMA_VERSION,
          tagged,
          message,
          root: tag,
          branch: heads(msgs)
        }
        if (_recps.length > 0) {
          msg.recps = _recps
          msg.private = true
        }

        if (!isTag(msg)) return cb(TagError(msg))
        server.publish(msg, cb)
      })
    )
  }

  function createBacklinkStream (key) {
    var filterQuery = {
      $filter: {
        dest: key
      }
    }

    return server.backlinks.read({
      query: [filterQuery],
      index: 'DTA' // use asserted timestamps
    })
  }
}
