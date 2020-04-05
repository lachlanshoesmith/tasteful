export const state = () => ({
  user: null,
  error: {
    display: false,
    message: ''
  }
})

export const mutations = {
  setUser (state, payload) {
    const usernameDocument = this.$fireStore.collection('users').doc(payload.id)
    usernameDocument.get()
      .then((doc) => {
        if (doc.exists) {
          payload.username = doc.data().username
          state.user = payload
        } else {
          state.user = payload
        }
      })
      .catch((error) => {
        console.log(error)
      })
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
            id: userObject.uid,
            username: ''
          }
          const errorPayload = {
            display: false,
            code: false,
            message: ''
          }
          commit('setError', errorPayload)
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
  },
  updateUser ({ commit }, payload) {
    const user = {
      id: payload.uid,
      username: ''
    }
    commit('setUser', user)
  }
}

export const getters = {
  user: state => state.user,
  error: state => state.error
}
