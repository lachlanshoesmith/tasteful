export const state = () => ({
  colourMode: 'light',
  colourModeToggle: ['light', 'dark']
})

export const mutations = {
  setColourMode (state, payload) {
    state.colourMode = payload
  },
  setColourModeToggle (state, payload) {
    state.colourModeToggle = payload
  }
}

export const getters = {
  colourMode: state => state.colourMode,
  colourModeToggle: state => state.colourModeToggle
}
