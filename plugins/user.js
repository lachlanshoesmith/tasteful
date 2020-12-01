const getUsername = (id, firebase) => {
  firebase.firestore.collection('users').doc(id)
    .get()
    .then((user) => {
      const userData = user.data()
      console.log(userData.username)
      return userData.username
    })
}

export default ({ app }, inject) => {
  inject('getUsername', getUsername)
}
