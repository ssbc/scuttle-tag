# scuttle-tag

Tag reading and manipulation plugin for [secure scuttlebutt](https://github.com/ssbc/secure-scuttlebutt).

`gives` observables and async methods for getting and publishing tags on secure scuttlebutt.

## Dependencies

`ssb-backlinks` must be installed in your server

## Message Schema

```js
{
  type: 'tag',
  tagged: true | false,
  message: %msg_id, // the message being tagged
  root: %tag_id, // unless this is original message for this tag
  branch: %tag_id | [%tag_id_a, %tag_id_b, ...] // only required if root present
}
```

## Instantiate

```js
var ScuttleTag = require('scuttle-tag')(server)
```

where `server` is a scuttlebutt server, ssb-client instance, or an observeable which will resolve to one of these!

## API

### tag.async.create({}, cb)

Creates a new tag message and calls cb when done.

### tag.async.apply({ tag, message, tagged }, cb)

Creates a new tag message which applies the tag `tag` to the message `message` if `tagged` is `true`. (TODO: default tagged to true)

- `tag` (required) - id of tag being applied
- `message` (required) - id of message being tagged
- `tagged` (required) - `true` if tag is being added, `false` if tag is being removed

### tag.async.name({ tag, name }, cb)

Sets the name of a tag and calls cb when done.

- `tag` (required) - id of tag being named
- `name` (required) - name being applied to the tag

### tag.obs.Tag(tagId, nameFn)

Returns a [Mutant](https://github.com/mmckegg/mutant) observable Struct which represents a tag. This struct holds the `tagId` and `tagName`. Takes an optional `nameFn` which returns an observable representing the `tagName`. If `nameFn` is not provided it will attempt to use the [ssb-names](https://github.com/ssbc/ssb-names) plugin and if that is not available its short id will be used.

### tag.obs.recent()

Returns a Mutant obserable list of most recently used tags

### tag.obs.mostActive()

Returns a Mutant observable list of most actively used tags

### tag.obs.messageTags(msgId)

Returns a Mutant observable list of tagIds which have been applied to the message `msgId`.

### tag.obs.messageTagsFrom(msgId, author)

Returns a Mutant observable list of tagIds which have been applied to the message `msgId` by the specified `author`.

### tag.obs.messageTaggers(msgId, tagId)

Returns a Mutant observable list of users which have applied tag `tagId` to the message `msgId`.

### tag.obs.allTags()

Returns a Mutant observable array of all published tag messages visible to you.

### tag.obs.allTagsFrom(author)

Returns a Mutant observable array of all tag messages published by an user.

### tag.obs.messagesTaggedByWith(author, tagId)

Returns a Mutant observable array of ids of messages. This array is messages that have had the tag `tagId` applied by `author`.
