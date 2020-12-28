export const state = () => ({
  user: null,
  error: {
    display: false,
    message: ''
  },
  allowSignup: false
})

export const mutations = {
  setUser (state, payload) {
    const getAvatar = (id) => {
      const imagePath = 'users/' + id + '/avatar.jpg'
      return this.$fire.storage.ref().child(imagePath)
        .getDownloadURL()
        .then(url => url)
    }

    // check if user means to log out
    if (payload === 'logout') {
      // Setting 'user' to false instead of null makes clear the difference between when
      // the state is being loaded (ie default: not logged in, no user) and when it has been
      // (ie may have logged in or out, but loaded). Hope that makes some sense.
      state.user = false
      state.error = {
        display: false,
        message: ''
      }
    } else {
      // get username
      const id = payload.id
      const user = this.$fire.firestore.collection('users').doc(id)
      user.get()
        .then(async (doc) => {
          payload = doc.data()
          payload.id = id
          // get avatar
          const avatar = await getAvatar(id)
          payload.avatar = avatar
          state.user = payload
        })
        .catch((error) => {
          console.log(error)
        })
    }
  },
  setError (state, payload) {
    state.error = payload
  },
  setSignup (state, payload) {
    state.allowSignup = payload
  }
}

export const actions = {
  signInUser ({ commit }, payload) {
    this.$fire.auth
      .signInWithEmailAndPassword(payload.email, payload.password)
      .then(
        (user) => {
          const userObject = user.user
          const newUser = {
            id: userObject.uid,
            username: '',
            new: false
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
    // remove all existing errors
    const errorPayload = {
      display: false,
      code: ''
    }
    commit('setError', errorPayload)
    // check if username is valid
    if (/[\s~`!@#$%^&*+=\-[\]\\';,/{}|\\":<>?()._]/g.test(payload.username)) {
      errorPayload.display = true
      errorPayload.code = 'username/symbols'
    } else if (payload.username.includes(' ')) {
      errorPayload.display = true
      errorPayload.code = 'username/spaces'
    } else if (!payload.username.match(/[a-z]/i)) {
      errorPayload.display = true
      errorPayload.code = 'username/numbers'
    } else if (
      payload.username.includes('tastef') ||
      payload.username.includes('admin') ||
      payload.username.includes('settings')
    ) {
      errorPayload.display = true
      errorPayload.code = 'username/impersonate'
    } else if (payload.username.length < 3) {
      errorPayload.display = true
      errorPayload.code = 'username/too-short'
    } else if (payload.username.length > 16) {
      errorPayload.display = true
      errorPayload.code = 'username/too-long'
    } else {
      // check if the username already exists
      const usernames = this.$fire.firestore.collection('usernames')
      usernames.get().then((data) => {
        data.forEach((username) => {
          if (payload.username.toLowerCase() === username.id.toLowerCase()) {
            errorPayload.display = true
            errorPayload.code = 'username/taken'
          }
        })
        // if all is well, attempt to continue with sign up
        if (!errorPayload.display) {
          this.$fire.auth
            .createUserWithEmailAndPassword(payload.email, payload.password)
            .then(
              (user) => {
                const userObject = user.user
                const newUser = {
                  id: userObject.uid,
                  username: payload.username,
                  new: true
                }
                errorPayload.display = false
                errorPayload.code = false
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
        }
      })
    }
    commit('setError', errorPayload)
  },
  signOutUser ({ commit }) {
    this.$fire.auth
      .signOut()
      .then(() => {
        commit('setUser', 'logout')
      })
      .catch((err) => {
        const errorPayload = {
          display: true,
          code: true,
          message: err
        }
        commit('setError', errorPayload)
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
  error: state => state.error,
  allowSignup: state => state.allowSignup
}
