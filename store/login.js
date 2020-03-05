import * as firebase from 'firebase'

export const state = () => ({
  user: null
})

export const mutations = {
  setUser (state, payload) {
    state.user = payload
  }
}

export const actions = {
  signInUser ({ commit }, payload) {
    firebase
      .auth()
      .signInWithEmailAndPassword(payload.email, payload.password)
      .then(
        (user) => {
          const newUser = {
            id: user.uid,
            username: 'TODO'
          }
          console.log(newUser)
        }
      )
      .catch(
        (error) => {
          console.log(error)
        }
      )
  },
  signUpUser ({ commit }, payload) {
    firebase
      .auth()
      .createUserWithEmailAndPassword(payload.email, payload.password)
      .then((user) => {
        firebase
          .auth()
          .currentUser.updateProfile({
            username: payload.username
          })
          .then(console.log('Successfully set username to profile.'))
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
  user (state) {
    return state.user
  }
}
