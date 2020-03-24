import VuexPersistence from 'vuex-persist'

export default ({ store }) => {
  window.onNuxtReady(() => {
    new VuexPersistence({
      storage: window.localStorage,
      reducer: state => ({
        theme: state.theme,
        login: state.login
      })
    }).plugin(store)
  })
}
