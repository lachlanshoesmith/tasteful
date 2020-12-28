export const state = () => ({
  reviewInFocus: {}
})

export const getters = {
  reviewInFocus: state => state.reviewInFocus
}

export const mutations = {
  setReviewInFocus (state, payload) {
    state.reviewInFocus = payload
  }
}
