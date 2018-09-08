const pull = require('pull-stream')
const merge = require('lodash/merge')
const isTag = require('./sync/isTag')

const filter = (stream) => {
  return pull(
    stream,
    pull.filter(isTag)
  )
}

function messagesTagged (server) {
  return (opts = {}) => filter(server.query.read(merge(opts, {
    query: [
      {$filter: {
        value: {
          timestamp: { $gt: 0 },
          content: {
            type: 'tag',
            version: 1,
            root: { $prefix: '%' },
            message: { $prefix: '%' }
          }
        }
      }}
    ]
  })))
}

function messagesTaggedWith (server) {
  return (tagId, opts = {}) => filter(server.query.read(merge(opts, {
    query: [
      {$filter: {
        value: {
          timestamp: { $gt: 0 },
          content: {
            type: 'tag',
            version: 1,
            root: tagId,
            message: { $prefix: '%' }
          }
        }
      }}
    ]
  })))
}

function messagesTaggedBy (server) {
  return (author, opts = {}) => filter(server.query.read(merge(opts, {
    query: [
      {$filter: {
        value: {
          timestamp: { $gt: 0 },
          author,
          content: {
            type: 'tag',
            version: 1,
            root: { $prefix: '%' },
            message: { $prefix: '%' }
          }
        }
      }}
    ]
  })))
}

function messagesTaggedWithBy (server) {
  return (tagId, author, opts = {}) => filter(server.query.read(merge(opts, {
    query: [
      {$filter: {
        value: {
          timestamp: { $gt: 0 },
          author,
          content: {
            type: 'tag',
            version: 1,
            root: tagId,
            message: { $prefix: '%' }
          }
        }
      }}
    ]
  })))
}

module.exports = {
  messagesTagged,
  messagesTaggedWith,
  messagesTaggedBy,
  messagesTaggedWithBy
}
