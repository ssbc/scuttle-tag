const {map, computed, watch} = require('mutant')
const {allTagsFrom, mostActive} = require('../obs')

module.exports = function (server) {
  var suggestions = null
  var tagsUsedByYou = null

  return function ({ word, myId, stagedTagIds, matchFn, nameFn }, cb) {
    const matches = matchFn || ((a, b) => a.startsWith(b))
    const name = nameFn || ((id) => id)
    loadSuggestions()

    if (word === null) return

    var filtered
    if (!word) {
      filtered = suggestions().slice(0, 200)
    } else {
      filtered = suggestions().filter((item) => {
        return matches(item.title, word) && !stagedTagIds.includes(item.tagId)
      })
    }
    filtered.push({
      title: 'Click or press , to create a new tag',
      value: word,
      tagId: false
    })
    cb(null, filtered)

    function loadSuggestions () {
      if (!suggestions) {
        tagsUsedByYou = allTagsFrom(server)(myId)
        const mostActiveTags = mostActive(server)()
        const tags = computed([tagsUsedByYou, mostActiveTags], function (a, b) {
          const result = Array.from(a)
          b.forEach((item, i) => {
            if (!result.includes(item[0])) {
              result.push(item)
            }
          })
          return result
        })

        suggestions = map(tags, suggestion, {idle: true})
        watch(suggestions)
      }
    }

    function suggestion (id) {
      if (Array.isArray(id)) {
        const tagName = name(id[0])
        return {
          title: tagName,
          subtitle: `(${id[1]})`,
          value: tagName,
          tagId: id[0]
        }
      } else {
        const tagName = name(id)
        return {
          title: tagName,
          subtitle: 'used by you',
          value: tagName,
          tagId: id
        }
      }
    }
  }
}
