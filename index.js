const methods = {
  async: {
    apply: require('./async/apply'),
    create: require('./async/create'),
    name: require('./async/name'),
    getSuggestions: require('./async/getSuggestions')
  },
  obs: require('./obs'),
  pull: require('./pull'),
  sync: {
    isTag: require('./sync/isTag')
  }
}

module.exports = function ScuttleTag (server) {
  return require('scuttle-inject')(server, methods)
}
