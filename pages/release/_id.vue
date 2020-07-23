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
      <nuxt-link
        class="link"
        :to="'/artist/' + release['artist-credit'][0].artist.id"
        :class="colourMode"
      >
        <subheading smaller centred no-top-margin>
          {{ release['artist-credit'][0].artist.name }}
        </subheading>
      </nuxt-link>
      <masthead full-width smaller centred small-bottom-margin>
        <span v-if="release.title">
          {{ release.title }}
        </span>
        <span v-else>
          Loading...
        </span>
      </masthead>
      <paragraph centred>
        Average score of <strong>{{ averageScore }}</strong> from
        <strong>
          {{ amountOfRatings }}
          <span v-if="amountOfRatings === 1">
            rating
          </span>
          <span v-else>
            ratings
          </span>
        </strong>
      </paragraph>
      <div class="tags">
        <tag v-for="tag in release.genres" :key="tag.id">
          {{ tag.name }}
        </tag>
      </div>
    </sidebar>
    <divided-container>
      <template v-slot:left>
        <paragraph-container>
          <paragraph soft>
            Album ratings are currently in alpha. Enjoy cataloguing early, though!
          </paragraph>
        </paragraph-container>
      </template>
      <template v-slot:right>
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
      </template>
    </divided-container>
  </main>
</template>

<script>
// @ is an alias to /src
import { mapGetters } from 'vuex'
import blur from '~/components/Blur.vue'
import masthead from '~/components/Masthead.vue'
import textInput from '~/components/TextInput.vue'
import paragraphContainer from '~/components/ParagraphContainer.vue'
import paragraph from '~/components/Paragraph.vue'
import sidebar from '~/components/Sidebar.vue'
import subheading from '~/components/Subheading.vue'
import tag from '~/components/Tag.vue'
import dividedContainer from '~/components/DividedContainer.vue'

export default {
  name: 'Release',
  components: {
    blur,
    masthead,
    textInput,
    paragraph,
    paragraphContainer,
    sidebar,
    subheading,
    tag,
    dividedContainer
  },
  data () {
    return {
      id: this.$route.params.id,
      averageScore: undefined,
      amountOfRatings: undefined,
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
        releases.doc(this.id).set(releaseData, { merge: true })
        const updateContent = {}
        updateContent[`ratings.${username}`] = score
        releases.doc(this.id).update(updateContent)
        releaseData.score = score
        userDoc.collection('ratings').doc(this.id).set(releaseData)
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
        const users = this.$fireStore.collection('users')
        const id = this.user.id
        users.doc(id + '/ratings/' + this.id)
          .get()
          .then((res) => {
            const scoreDoc = res.data()
            if (scoreDoc !== undefined) {
              // if the user has rated the release
              const userScore = scoreDoc.score
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
          if (res.data() !== undefined) {
            // ratings exist
            this.ratings = res.data().ratings
            const ratings = Object.values(this.ratings)
            const sum = ratings.reduce((val, val2) => val + val2, 0)
            this.amountOfRatings = ratings.length
            this.averageScore = Math.floor(sum / this.amountOfRatings)
          }
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
  width: 100%;
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
.link {
  text-decoration: none;
}
.tags {
  max-width: 300px;
}
</style>
