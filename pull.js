const pull = require('pull-stream')
const get = require('lodash/get')
const set = require('lodash/set')
const size = require('lodash/size')
const reduce = require('lodash/reduce')
const merge = require('lodash/merge')
const isTag = require('./sync/isTag')

const mapQuery = {
  $map: {
    author: ['value', 'author'],
    tag: ['value', 'content', 'root'],
    message: ['value', 'content', 'message'],
    tagged: ['value', 'content', 'tagged'],
    timestamp: ['value', 'timestamp'],
    value: 'value'
  }
}

const reduceQuery = {
  $reduce: {
    message: 'message',
    tag: {$collect: true}
  }
}

const filter = (stream) => {
  return pull(
    stream,
    pull.filter((message) => {
      const tagDict = reduce(message.tag, (result, tagMsg) => {
        if (!isTag(tagMsg.value)) return result
        const authorTag = get(result, [tagMsg.author, tagMsg.tag])
        if (!authorTag || tagMsg.timestamp > authorTag.timestamp) {
          if (tagMsg.tagged) {
            set(result, [tagMsg.author, tagMsg.tag], tagMsg.value)
            return result
          }
          if (!result[tagMsg.author]) return result
          delete result[tagMsg.author][tagMsg.tag]
          return result
        }
      }, {})
      const count = reduce(tagDict, (result, authorTags) => result + size(authorTags), 0)
      return count > 0
    }),
    pull.map((message) => message.message)
  )
}

function messagesTagged (server) {
  return (opts = {}) => filter(server.query.read(merge(opts, {
    query: [
      {$filter: {
        value: {
          timestamp: { $gt: 0 },
          content: { type: 'tag' }
        }
      }},
      mapQuery,
      reduceQuery
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
            root: tagId
          }
        }
      }},
      mapQuery,
      reduceQuery
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
          content: { type: 'tag' }
        }
      }},
      mapQuery,
      reduceQuery
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
            root: tagId
          }
        }
      }},
      mapQuery,
      reduceQuery
    ]
  })))
}

module.exports = {
  messagesTagged,
  messagesTaggedWith,
  messagesTaggedBy,
  messagesTaggedWithBy
}
