<template>
  <main class="release">
    <article-content class="release-content">
      <img class="release-image" :class="[colourMode]" :src="release.image" :alt="release.title">
      <masthead fit-width centred>
        <span v-if="release.title">
          {{ release.title }}
        </span>
        <span v-else>
          Loading...
        </span>
      </masthead>
      <text-input
        v-if="user !== null"
        debounce
        no-icon
        centred
        placeholder="Enter a score out of 100."
        :default-value="initialScore"
        @input="rate($event)"
      />
      <paragraph-container v-else>
        <paragraph centred soft>
          You need to sign in to rate releases.
        </paragraph>
      </paragraph-container>
      <paragraph-container>
        <paragraph centred soft>
          Album ratings are currently in alpha. Enjoy cataloguing early, though!
        </paragraph>
      </paragraph-container>
    </article-content>
  </main>
</template>

<script>
// @ is an alias to /src
import { mapGetters } from 'vuex'
import masthead from '~/components/Masthead.vue'
import articleContent from '~/components/ArticleContent.vue'
import textInput from '~/components/TextInput.vue'
import paragraphContainer from '~/components/ParagraphContainer.vue'
import paragraph from '~/components/Paragraph.vue'

export default {
  name: 'Release',
  components: {
    masthead,
    articleContent,
    textInput,
    paragraph,
    paragraphContainer
  },
  data () {
    return {
      id: this.$route.params.id,
      release: {},
      initialScore: undefined
    }
  },
  computed: mapGetters({
    colourMode: 'theme/colourMode',
    user: 'login/user'
  }),
  watch: {
    user (user) {
      if (user !== null) {
        // check if the user has already rated the release
        const releases = this.$fireStore.collection('releases')
        const username = user.username
        releases.doc(this.id)
          .get()
          .then((res) => {
            const releasesData = res.data()
            const userScore = releasesData[username]
            if (userScore) {
              this.initialScore = userScore.toString()
            }
          })
      }
    }
  },
  mounted () {
    if (this.release.title === undefined) {
      // if the page is not loaded following a search we must find all the information again
      // get release group info
      this.$axios
        .get(
          `https://us-central1-tasteful.cloudfunctions.net/getReleaseData?query=${this.id}`
        )
        .then((res) => {
          this.release = res.data
          document.title = 'tasteful | ' + this.release.title
        })
    } else {
      this.release = this.$store.state.search.release
      document.title = 'tasteful | ' + this.release.title
    }
  },
  methods: {
    rate (scoreString) {
      const applyRating = (score) => {
        // rate on the release page
        const releases = this.$fireStore.collection('releases')
        const users = this.$fireStore.collection('users')
        const userDoc = users.doc(this.user.id)
        const compactReleaseObj = {
          title: this.release.title,
          artist: this.release['artist-credit'][0].name,
          id: this.id,
          score
        }
        const username = this.user.username
        const scoreObj = {}
        scoreObj[username] = score
        releases.doc(this.id).set(scoreObj, {
          merge: true
        })
        userDoc.collection('ratings').doc(this.id).set(compactReleaseObj, {
          merge: true
        })
        alert('Your rating for ' + this.release.title + ' has been submitted.')
      }

      // ensure score is a number
      if (!isNaN(scoreString) && scoreString !== '') {
        const score = Math.floor(Number(scoreString))
        if (score >= 0 && score <= 100) {
          // is a valid number
          applyRating(score)
        }
      } else if (scoreString === '') {
        // Remove the rating.
        applyRating(false)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.release {
  padding-left: 3vw;
  padding-right: 3vw;
  display: flex;
  justify-content: center;
  padding-bottom: 3vh;
}
.release-image {
  border-radius: 15px;
  box-shadow: 0px 0px 50px;
  max-width: 60vw;
  margin-top: 20px;
  margin-bottom: 20px;
  &.light {
    color: $quite-light-grey;
  }
  &.dark {
    color: $saturated-purple-dim;
  }
  &.black {
    color: $black;
  }
  &.solarised-light {
    color: $solarised-light-main-background;
  }
  &.solarised-dark {
    color: $solarised-dark-main-background;
  }
}
.release-content {
  display: flex;
  align-items: center;
  flex-direction: column;
}
</style>
