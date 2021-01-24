export const state = () => ({
  barVisible: false,
  barMessage: '',
  barTimeout: null
})

export const getters = {
  barVisible: state => state.barVisible,
  barMessage: state => state.barMessage,
  barTimeout: state => state.barTimeout
}

export const mutations = {
  setBarVisible (state, payload) {
    state.barVisible = payload
  },
  setBarMessage (state, payload) {
    state.barMessage = payload
  },
  setBarTimeout (state, payload) {
    state.barTimeout = payload
  }
}

export const actions = {
  displayBar (state, { message, temporary }) {
    state.commit('setBarVisible', true)
    state.commit('setBarMessage', message)
    if (temporary) {
      state.commit('setBarTimeout', setTimeout(() => {
        state.dispatch('hideBar')
      }, 3000))
    } else if (!temporary) {
      clearTimeout(state.getters.barTimeout)
    }
  },
  hideBar (state) {
    state.commit('setBarVisible', false)
    state.commit('setBarMessage', '')
  }
}
