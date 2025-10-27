import {defineMigration, at, set, unset} from 'sanity/migrate'

const from = 'videoMux'
const to = 'video'

export default defineMigration({
  title: 'mux-video',

  migrate: {
    object(doc) {
      if (doc._type !== 'media') return

      return [at(to, unset()), at(to, set(doc[from])), at(from, unset())]
    },
  },
})
