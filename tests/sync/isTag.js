const test = require('tape')

const isTag = require('../../sync/isTag')()

test('isTag / tag schema', t => {
  const notTag = {
    type: 'post',
    version: 1,
    tagged: true,
    message: '%sfoIYo0kKKGI+TJYnznVDSs3BM/HjMWdCPXirvj9BfE=.sha256'
  }
  t.notOk(isTag(notTag), 'invalidates messages that are not tags')

  const simpleTag = {
    type: 'tag',
    version: 1
  }
  t.ok(isTag(simpleTag), 'validates simple tag')

  const incompleteTag = {
    version: 1,
    tagged: true,
    message: '%sfoIYo0kKKGI+TJYnznVDSs3BM/HjMWdCPXirvj9BfE=.sha256'
  }
  t.notOk(isTag(incompleteTag), 'invalidates incomplete tag')
  t.equal(isTag.errors[0].message, 'is required', 'provides error messages')

  const malformedTag = {
    type: 'tag',
    version: 1,
    tagged: true,
    message: '%sfoIYo0kKKGI+TJYnznVDSs3BM'
  }
  t.notOk(isTag(malformedTag), 'invalidates malformed tag')

  const actualTag = {
    key: '%ax5XXjVge0rK3EAo4iMpHkKd2V4IBJTciqgbSApCasY=.sha256',
    value: {
      previous: '%4bZ7zwit1DwfY9i0DzlkyJjLRsuIN6mjUEl7Qs0hYsQ=.sha256',
      author: '@f4OG651mw8Je965wd8gi8EpbeSf0hsQs4hQ+E6INeGE=.ed25519',
      sequence: 4,
      timestamp: 1521076619868,
      hash: 'sha256',
      content: {
        type: 'tag',
        version: 1,
        tagged: true,
        message: '%ZXmZDRwPr0AKrNUoFnW/Yo0k3a7p6W716uEXDVnie2w=.sha256',
        root: '%V6Icaj1qhGrq6ocbP4pmzNLAO3dpNM/Besx+++Z+bE0=.sha256',
        branch: '%V6Icaj1qhGrq6ocbP4pmzNLAO3dpNM/Besx+++Z+bE0=.sha256'
      },
      signature: 's155Gsv9z+GgRyN+RjMEOtOlJfbSTc7jCGih/ssvVZ5FzNmfbu94PUjA/j4oNwRPb8lh1CTLbRBHpXII/vq1Bg==.sig.ed25519'
    },
    timestamp: 1521076619954
  }
  t.ok(isTag(actualTag), 'validates actual tag from Scuttle-Tag')

  t.end()
})
