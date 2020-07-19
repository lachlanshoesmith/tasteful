<template>
  <main class="release">
    <blur loading :apply-blur="loading" />
    <sidebar>
      <img
        id="release-image"
        class="release-image"
        :class="[colourMode]"
        :src="release.image"
        :alt="release.title"
        @load="loading = false"
      >
      <subheading smaller centred no-top-margin>
        {{ release['artist-credit'][0].artist.name }}
      </subheading>
      <masthead fit-width smaller centred>
        <span v-if="release.title">
          {{ release.title }}
        </span>
        <span v-else>
          Loading...
        </span>
      </masthead>
      <paragraph centred>
        Average score: {{ averageScore }}
      </paragraph>
    </sidebar>
    <article-content class="release-content">
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
import blur from '~/components/Blur.vue'
import masthead from '~/components/Masthead.vue'
import articleContent from '~/components/ArticleContent.vue'
import textInput from '~/components/TextInput.vue'
import paragraphContainer from '~/components/ParagraphContainer.vue'
import paragraph from '~/components/Paragraph.vue'
import sidebar from '~/components/Sidebar.vue'
import subheading from '~/components/Subheading.vue'

export default {
  name: 'Release',
  components: {
    blur,
    masthead,
    articleContent,
    textInput,
    paragraph,
    paragraphContainer,
    sidebar,
    subheading
  },
  data () {
    return {
      id: this.$route.params.id,
      averageScore: undefined,
      ratings: {},
      release: {
        'artist-credit': [
          {
            'artist': {
              name: 'Loading...'
            }
          }
        ]
      },
      initialScore: undefined,
      loading: false,
      consideredUser: false
    }
  },
  computed: mapGetters({
    colourMode: 'theme/colourMode',
    user: 'login/user'
  }),
  watch: {
    user (user) {
      this.checkIfExistingRating()
    }
  },
  mounted () {
    this.loading = true
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
    this.checkIfExistingRating()
    this.getOtherRatings()
  },
  methods: {
    rate (scoreString) {
      const applyRating = (score) => {
        // rate on the release page
        const releases = this.$fireStore.collection('releases')
        const users = this.$fireStore.collection('users')
        const userDoc = users.doc(this.user.id)
        const username = this.user.username
        const releaseData = {
          title: this.release.title,
          artist: this.release['artist-credit'][0].name,
          id: this.id
        }
        releaseData['ratings.' + username] = score
        releases.doc(this.id).update(releaseData)
        userDoc.collection('ratings').doc(this.id).set({ score }, {
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
    },
    checkIfExistingRating () {
      if (this.user !== null) {
      // check if the user has already rated the release
        const releases = this.$fireStore.collection('releases')
        const username = this.user.username
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
    },
    getOtherRatings () {
      const releases = this.$fireStore.collection('releases')
      releases.doc(this.id)
        .get()
        .then((res) => {
          this.ratings = res.data().ratings
        })
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
