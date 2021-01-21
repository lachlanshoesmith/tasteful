export const state = () => ({
  barVisible: false,
  barMessage: ''
})

export const getters = {
  barVisible: state => state.barVisible,
  barMessage: state => state.barMessage
}

export const mutations = {
  setBarVisible (state, payload) {
    state.barVisible = payload
  },
  setBarMessage (state, payload) {
    state.barMessage = payload
  }
}
