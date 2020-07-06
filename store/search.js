export const state = () => ({
  release: {},
  artist: {}
})

export const mutations = {
  setRelease (state, payload) {
    state.release = payload
  },
  setArtist (state, payload) {
    state.artist = payload
  }
}

export const getters = {
  release: state => state.release,
  artist: state => state.artist
}
