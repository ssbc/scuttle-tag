const methods = {
  async: {
    apply: require('./async/apply'),
    create: require('./async/create'),
    name: require('./async/name')
  },
  obs: require('./obs'),
  sync: {
    isTag: require('./sync/isTag')
  }
}

module.exports = function ScuttleTag (server) {
  return require('./lib/inject')(server, methods)
}
