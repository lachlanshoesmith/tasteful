export const state = () => ({
  user: null,
  error: {
    display: false,
    message: ''
  }
})

export const mutations = {
  setUser (state, payload) {
    state.user = payload
  },
  setError (state, payload) {
    state.error = payload
  }
}

export const actions = {
  signInUser ({ commit }, payload) {
    this.$fireAuth
      .signInWithEmailAndPassword(payload.email, payload.password)
      .then(
        (user) => {
          const userObject = user.user
          const newUser = {
            id: userObject.uid
          }
          commit('setUser', newUser)
        }
      )
      .catch(
        (error) => {
          const errorPayload = {
            display: true,
            code: error.code
          }
          commit('setError', errorPayload)
        }
      )
  },
  signUpUser ({ commit }, payload) {
    this.$fireAuth
      .createUserWithEmailAndPassword(payload.email, payload.password)
      .then((user) => {
        this.$fireAuth
          .currentUser.updateProfile({
            username: payload.username
          })
          .catch((error) => {
            console.log(error)
          })
        const newUser = {
          id: user.uid,
          username: payload.username
        }
        commit('setUser', newUser)
      })
      .catch((error) => {
        console.log(error)
      })
  }
}

export const getters = {
  user: state => state.user,
  error: state => state.error
}
