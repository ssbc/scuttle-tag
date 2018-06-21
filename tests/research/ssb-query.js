// INSTRUCTIONS:
// - run patchbay (or something with a modern ssb-query installed)
// - run this file! `node tests/research/ssb-query.js`

const pull = require('pull-stream')
const Client = require('ssb-client')
const config = require('./config')
const isTag = require('../../isTag')

Client(config.keys, config, (err, server) => {
  if (err) throw err

  // const myKey = server.id
  // const tag = '%32FV0EQgCkD3/yFWNgasTJPMQohXb7o2MIR08A+YgxQ=.sha256'
  const tag = '%TlZeUnduVNP93JYyf/1w/U1+XbawVoSjDbg3UlJnMQI=.sha256'

  const startTime = new Date()

  pull(
    messagesTagged(tag, server),
    pull.map((result) => last(result.tagged)),
    pull.map((msg) => msg.value),
    pull.filter(isTag),
    pull.filter((msg) => msg.content.tagged),
    pull.drain(
      (tag) => console.log(tag),
      () => {
        console.log('DONE')
        console.log('time for query:', (new Date() - startTime) / 1000, 's')
        server.close() // close ssb-client connection (good for this test)
      }
    )
  )
})

function messagesTagged (tagKey, server) {
  const tagQuery = {
    // live: true,
    query: [
      {$filter: {
        value: {
          timestamp: { $gt: 0 }, // forces results ordered by published time
          content: {
            type: 'tag',
            root: tagKey
          }
        }
      }},
      {$map: {
        author: ['value', 'author'],
        tag: ['value', 'content', 'root'],
        message: ['value', 'content', 'message'],
        tagged: ['value', 'content', 'tagged'],
        value: 'value'
      }},
      {$reduce: {
        author: 'author',
        tag: 'tag',
        message: 'message',
        tagged: {$collect: true}
      }}
    ]
  }

  // server.query.explain(attendanceQuery, (err, a) => console.log('Resolved level query (reveals index in use)', a))

  return server.query.read(tagQuery)
}

function last (arr) {
  if (!arr.length) return

  return arr[arr.length - 1]
}
