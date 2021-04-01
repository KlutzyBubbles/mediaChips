const {app} = require('electron').remote
const path = require("path")
const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
const pathToDbSavedFilters = path.join(app.getPath('userData'), 'userfiles/databases/dbsf.json')
const adapterSavedFilters = new FileSync(pathToDbSavedFilters)
const dbsf = low(adapterSavedFilters)
dbsf.defaults({
  savedFilters: {
    videos: [],
    performers: [],
    tags: [],
    websites: [],
    playlists: [],
  }
}).write()


const SavedFilters = {
  state: () => ({
    savedFilters: _.cloneDeep(dbsf.get('savedFilters').value()),
    dialogSavedFilters: false,
  }),
  mutations: {
  },
  actions: {
    addSavedFilter({ state, commit, getters}, {type, savedFilters}) {
      getters.savedFilters.get(type).push(savedFilters).write()
      state.savedFilters[type].push(savedFilters)
    },
    deleteSavedFilter({ state, commit, getters}, {type, name}) {
      getters.savedFilters.get(type).remove({ name: name }).write()
      state.savedFilters = _.cloneDeep(getters.savedFilters.value())
    },
    updateSavedFiltersName({ state, commit, getters}, {type, oldName, newName}) {
      getters.savedFilters.get(type).find({name:oldName}).assign({name:newName}).write()
      state.savedFilters = _.cloneDeep(getters.savedFilters.value())
    },
  },
  getters: {
    dbsf(state) {
      return state.lastChanged, dbsf
    },
    savedFiltersDatabase(state, store) {
      return store.dbsf
    },
    savedFilters(state, store) {
      return store.dbsf.get('savedFilters')
    },
  }
}

export default SavedFilters