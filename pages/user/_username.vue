<template>
  <main class="user">
    <blur loading :apply-blur="loading" />
    <article-content v-if="!error.display">
      <masthead centred smaller>
        {{ username }}
      </masthead>
      <paragraph-container v-if="ratedReleases !== undefined">
        <subheading>Ratings</subheading>
        <paragraph soft>
          This whole section will be improved <em>drastically</em> over the next few updates. I mean, look what happened to the search functionality!
        </paragraph>
        <list>
          <li v-for="release in ratedReleases" :key="release.id">
            [<strong>{{ release.score }}</strong>] {{ release.artist }} - <nuxt-link :to="'/release/' + release.id">
              {{ release.title }}
            </nuxt-link>
          </li>
        </list>
      </paragraph-container>
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
import blur from '~/components/Blur.vue'
import masthead from '~/components/Masthead.vue'
import subheading from '~/components/Subheading.vue'
import paragraph from '~/components/Paragraph.vue'
import paragraphContainer from '~/components/ParagraphContainer.vue'
import articleContent from '~/components/ArticleContent.vue'
import list from '~/components/List.vue'

export default {
  name: 'User',
  components: {
    blur,
    masthead,
    subheading,
    paragraph,
    paragraphContainer,
    articleContent,
    list
  },
  data () {
    return {
      username: this.$route.params.username,
      id: undefined,
      ratedReleases: undefined,
      loading: false,
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
    const usernamesDatabase = this.$fire.firestore.collection('usernames')
    let username = this.$route.params.username.toLowerCase()
    this.loading = true
    usernamesDatabase.get()
      .then((users) => {
        // this needs to be cleaned up, holy shit...
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
                  this.getRatings()
                  document.title = 'tasteful | ' + username
                } else {
                  this.error.display = true
                  this.error.message = 'I\'m pretty sure this user doesn\'t exist. Check the URL.'
                }
              } else {
                this.error.display = true
                this.error.message = 'I\'m pretty sure this user doesn\'t exist. Check the URL.'
              }
              this.loading = false
            })
            .catch((error) => {
              this.error.display = true
              this.error.message = 'We ran into a problem: ' + error + '.'
              this.loading = false
            })
        } else {
          this.error.display = true
          this.error.message = 'I\'m pretty sure this user doesn\'t exist. Check the URL.'
          this.loading = false
        }
      })
      .catch((error) => {
        this.error.display = true
        this.error.message = 'We ran into a problem: ' + error + '.'
        this.loading = false
      })
  },
  methods: {
    getRatings () {
      const user = this.$fire.firestore.collection('users').doc(this.id)
      const ratingsCollection = user.collection('ratings')
      ratingsCollection.get()
        .then((res) => {
          this.ratedReleases = []
          res.docs.forEach((release) => {
            const releaseData = release.data()
            this.ratedReleases.push(releaseData)
          })
        })
    }
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
