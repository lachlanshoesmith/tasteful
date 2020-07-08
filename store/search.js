export const state = () => ({
  release: {},
  artist: {}
  // musicbrainzResults: {}
})

export const mutations = {
  setRelease (state, payload) {
    state.release = payload
  },
  setArtist (state, payload) {
    state.artist = payload
  }
  // setMusicbrainzResults (state, payload) {
  //   state.musicbrainzResults = payload
  // }
}

export const getters = {
  release: state => state.release,
  artist: state => state.artist
}
