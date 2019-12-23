export const state = () => ({
  colourMode: 'light'
})

export const mutations = {
  setColourMode (state, payload) {
    state.colourMode = payload
  }
}
