// INSTRUCTIONS:
// - run patchbay (or something with a modern ssb-query installed)
// - run this file! `node tests/research/ssb-query.js`

const pull = require('pull-stream')
const Client = require('ssb-client')
const config = require('./config')
const TagHelper = require('../../index')

Client(config.keys, config, (err, server) => {
  if (err) throw err

  const ScuttleTag = TagHelper(server)
  // const myKey = server.id
  // const tag = '%32FV0EQgCkD3/yFWNgasTJPMQohXb7o2MIR08A+YgxQ=.sha256'
  const tag = '%TlZeUnduVNP93JYyf/1w/U1+XbawVoSjDbg3UlJnMQI=.sha256'

  const startTime = new Date()

  pull(
    ScuttleTag.pull.messagesTaggedWith(tag),
    // ScuttleTag.pull.messagesTaggedBy(myKey),
    pull.drain(
      (msg) => console.log(msg),
      () => {
        console.log('DONE')
        console.log('time for query:', (new Date() - startTime) / 1000, 's')
        server.close() // close ssb-client connection (good for this test)
      }
    )
  )
})
