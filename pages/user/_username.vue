<template>
  <main class="user">
    <article-content v-if="!error.display">
      <masthead centred smaller>
        {{ username }}
      </masthead>
    </article-content>
    <article-content v-else>
      <paragraph-container>
        <subheading>That didn't quite work out.</subheading>
        <paragraph>{{ error.message }}</paragraph>
      </paragraph-container>
    </article-content>
  </main>
</template>

<script>
// @ is an alias to /src
import masthead from '~/components/Masthead.vue'
import subheading from '~/components/Subheading.vue'
import paragraph from '~/components/Paragraph.vue'
import paragraphContainer from '~/components/ParagraphContainer.vue'
import articleContent from '~/components/ArticleContent.vue'

export default {
  name: 'User',
  components: {
    masthead,
    subheading,
    paragraph,
    paragraphContainer,
    articleContent
  },
  data () {
    return {
      username: 'One sec, please...',
      id: undefined,
      error: {
        display: false,
        message: ''
      }
    }
  },
  computed: {
    colourMode () {
      return this.$store.state.theme.colourMode
    }
  },
  mounted () {
    const usernamesDatabase = this.$fireStore.collection('usernames')
    let username = this.$route.params.username.toLowerCase()
    usernamesDatabase.get()
      .then((users) => {
        const arrayOfLowercaseUsernames = users.docs.map(doc => doc.id.toLowerCase())
        const arrayOfUsernames = users.docs.map(doc => doc.id)
        const usernameIndex = arrayOfLowercaseUsernames.indexOf(username)
        username = arrayOfUsernames[usernameIndex] // The correctly-capitalised username
        this.username = username
        if (usernameIndex !== -1) { // if the username is valid...
          usernamesDatabase.doc(username).get()
            .then((user) => {
              if (user.exists) {
                const userData = user.data()
                if (userData.uid !== undefined) {
                  // ready to load
                  this.id = userData.uid
                  document.title = 'tasteful | ' + username
                } else {
                  this.error.display = true
                  this.error.message = 'I\'m pretty sure this user doesn\'t exist. Check the URL.'
                }
              } else {
                this.error.display = true
                this.error.message = 'I\'m pretty sure this user doesn\'t exist. Check the URL.'
              }
            })
            .catch((error) => {
              this.error.display = true
              this.error.message = 'We ran into a problem: ' + error + '.'
            })
        } else {
          this.error.display = true
          this.error.message = 'I\'m pretty sure this user doesn\'t exist. Check the URL.'
        }
      })
      .catch((error) => {
        this.error.display = true
        this.error.message = 'We ran into a problem: ' + error + '.'
      })
  }
}
</script>

<style lang="scss" scoped>
.user {
  padding-left: 3vw;
  padding-right: 3vw;
  display: flex;
  justify-content: center;
  padding-bottom: 3vh;
}
.username-input-container {
  display: flex;
  align-items: center;
}
.submit-button {
  margin-left: 10px;
}
</style>
