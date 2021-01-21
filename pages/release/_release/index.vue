<template>
  <main class="release">
    <transition name="fade">
      <modal v-if="showAddToListModal" larger-left-side scrollable :image-for-right-side="release.imageHQ" @closeModal="showAddToListModal = false; showCreateListModal = false; showAdjustPositionInListModal = false">
        <template #heading>
          <masthead smaller>
            <span v-if="showCreateListModal">Create new list</span>
            <span v-else-if="showAdjustPositionInListModal">Adjust position in list</span>
            <span v-else>
              Add
              <span v-if="release.title.length < 100">
                {{ release.tile }}
              </span>
              <span v-else>
                release
              </span>
              to list</span>
          </masthead>
        </template>
        <template #left>
          <div v-if="showCreateListModal">
            <text-input
              full-width
              maxlength="96"
              placeholder="The inspiration for the list, perhaps?"
              name="new-list-name"
              @input="newList.name=$event"
            >
              List name
            </text-input>
            <text-area name="new-list-description" full-width placeholder="Descriptions are optional, but they can help give your list some identity and purpose." @input="newList.description=$event">
              Description
            </text-area>
            <div class="flex-container">
              <text-input
                full-width
                placeholder="https://via.placeholder.com/64C/"
                name="new-list-imageURL-input"
                @input="newList.imageURL = $event"
              >
                Image URL
              </text-input>
              <div class="new-list-image-preview" :style="{ backgroundImage: `url(${newList.imageURL})` }" />
            </div>
            <paragraph soft>
              Image uploading is not currently supported. Consider using a third party service, such as <a href="https://imgur.com/" target="_blank">Imgur</a>.
              Ensure you use a direct link (<a href="https://i.imgur.com/wMeVWI7.png" target="_blank">here's an example</a>, if you're not quite following).
            </paragraph>
            <div class="flex-container">
              <regular-button wide type="call-to-action" @pressed="createNewList()">
                Create new list
              </regular-button>
              <regular-button no-right-margin type="primary" @pressed="showCreateListModal = false">
                Go back
              </regular-button>
            </div>
          </div>
          <div v-else-if="showAdjustPositionInListModal">
            Hello
            <div class="flex-container">
              <regular-button wide type="call-to-action">
                Save position in list
              </regular-button>
              <regular-button no-right-margin type="primary" @pressed="showAdjustPositionInListModal = false">
                Go back
              </regular-button>
            </div>
          </div>
          <div v-else>
            <dropdown
              name="selected-list"
              description-value="2020 favourites, for example."
              :options="['Example list 1', 'Example list 2']"
              @change="listItemToAdd.selectedList = $event"
            >
              Selected list
            </dropdown>
            <text-area name="list-item-description" full-width placeholder="Descriptions are optional, but should be related to the album or artist if included." @input="listItemToAdd.description=$event">
              Description
            </text-area>
            <div class="flex-container secondary-list-buttons">
              <regular-button wide type="secondary" @pressed="showCreateListModal = true">
                Create new list
              </regular-button>
              <regular-button
                wide
                no-right-margin
                type="secondary"
                :disable="!listItemToAdd.selectedList"
                disabled-reason="Please select a list first."
                @pressed="showAdjustPositionInListModal = true"
              >
                Adjust position in list
              </regular-button>
            </div>
            <regular-button wide type="call-to-action">
              <span v-if="release.title.length <= 128">
                Add {{ release.title }} to list
              </span>
              <span v-else>
                Add release to list
              </span>
            </regular-button>
          </div>
        </template>
      </modal>
    </transition>
    <blur loading :apply-blur="loading" />
    <hero :background="release.image">
      <header>
        <nuxt-link
          class="link"
          :to="'/artist/' + release['artist-credit'][0].artist.id"
          :class="colourMode"
        >
          <subheading>
            {{ release['artist-credit'][0].artist.name }}
          </subheading>
        </nuxt-link>
        <masthead>
          <span v-if="release.title">
            {{ release.title }}
          </span>
          <span v-else>
            Loading...
          </span>
        </masthead>
        <tag desaturated>
          {{ release.firstReleaseDate[3] }}
          <nuxt-link to="/">
            {{ release.firstReleaseDate[2] }}
          </nuxt-link>
        </tag>
        <div class="tags">
          <tag v-for="tag in release.genres" :key="tag.id">
            {{ tag.name }}
          </tag>
        </div>
      </header>
      <img
        id="release-image"
        class="release-image"
        :class="[colourMode]"
        :src="release.image"
        :alt="release.title"
        @load="loading = false; createParagraphOnlyReviews()"
      >
    </hero>
    <div v-if="!editing && !selectedReview" class="flex-container content">
      <div class="left-column">
        <div class="flex-container">
          <regular-button type="secondary">
            Update rating
          </regular-button>
          <regular-button type="secondary" @pressed="showAddToListModal = true">
            Add to list
          </regular-button>
          <regular-button no-right-margin type="tertiary" :to="'https://musicbrainz.org/release-group/' + id">
            Edit this release
          </regular-button>
        </div>
        <div class="flex-container user-review-container" emphasised-block>
          <div class="user-score-container">
            <div v-if="user">
              <profile-picture :username="user.username" size="medium" :url="user.avatar" />
            </div>
            <p class="user-score">
              {{ initialScore }}
            </p>
          </div>
          <div class="user-review-composition-container">
            <text-input
              full-width
              maxlength="125"
              placeholder="Something provocative and enticing!"
              name="review-header"
              :default-value="reviewContent.headerDraft"
              @input="reviewContent.headerDraft=$event"
            >
              Header
            </text-input>
            <text-area
              v-if="paragraphOnlyUserReview[1] === 'passed'"
              name="review-body"
              full-width
              placeholder="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin felis nibh, condimentum sit amet tempor quis, ultricies eu massa. Pellentesque aliquam mi at odio commodo, at pharetra arcu consectetur."
              :default-value="paragraphOnlyUserReview[0]"
              @input="reviewContent.body[editableBlockIndex].contentDraft = $event"
            >
              Body
            </text-area>
            <paragraph v-else-if="paragraphOnlyUserReview[1] === 'non paragraph blocks'" no-top-margin soft>
              Your review body has blocks other than paragraphs. Please use the <a @click="openRichEditor">rich editor</a> to edit the review.
            </paragraph>
            <paragraph v-else-if="paragraphOnlyUserReview[1] === 'multiple blocks'" no-top-margin soft>
              Your review body has multiple blocks. Please use the <a @click="openRichEditor">rich editor</a> to edit the review.
            </paragraph>
            <div class="flex-container">
              <regular-button type="primary" @pressed="publishReview">
                Publish review
              </regular-button>
              <regular-button type="tertiary" @pressed="openRichEditor">
                Open rich editor
              </regular-button>
            </div>
          </div>
        </div>
        <vertical-table class="relevant-lists-and-charts">
          <template #header>
            Relevant lists and charts
          </template>
          <template #content>
            <div class="row">
              <div class="flex-container">
                <profile-picture size="small" url="https://pbs.twimg.com/profile_images/1320206650469502976/Ic6iMceQ_400x400.jpg" />
              </div>
            </div>
            <div class="row">
              Content
            </div>
            <div class="row">
              Content
            </div>
          </template>
        </vertical-table>
      </div>
      <div class="right-column">
        <div v-if="averageScore">
          <pill>
            <div class="flex-container">
              <tag align="right">
                Average
              </tag>
              <p style="color: hsl(249, 10%, 26%)">
                {{ averageScore }}
              </p>
            </div>
            <div class="flex-container">
              <tag align="right">
                Total ratings
              </tag>
              <p style="color: hsl(249, 10%, 26%);">
                {{ amountOfRatings }}
              </p>
            </div>
          </pill>
        </div>
        <div v-if="reviews" class="reviews">
          <review
            v-for="(review, i) in paragraphOnlyReviews"
            :key="review.id"
            :index="i"
            :user="user"
            :review-prop="review"
            :release="id"
            @liked="likeReview(review, i)"
            @show="selectedReview = i"
          />
        </div>
      </div>
    </div>
    <div v-else class="review-container">
      <article-content>
        <masthead :editable="editing" @change="reviewContent.headerDraft = $event">
          <span v-if="editing">
            {{ reviewContent.headerDraft }}
          </span>
          <span v-else>
            {{ reviewContent.header }}
          </span>
        </masthead>
        <div class="flex-container review-author-container">
          <profile-picture :username="reviewContent.username" size="small" :url="reviewContent.avatar" />
          <div class="review-author">
            <subheading smaller no-margin>
              Review by
              <nuxt-link :to="'/user/' + reviewContent.username">
                {{ reviewContent.username }}
              </nuxt-link>
            </subheading>
            <subheading smallest no-margin>
              18 December 2020
            </subheading>
          </div>
        </div>
        <div v-for="(block, i) in reviewContent.body" :key="block.id" class="review-content-block">
          <div v-if="editing" class="block-editing-toolbar">
            <div class="block-number">
              <p>{{ i + 1 }}</p>
            </div>
            <div v-if="block.typeDraft !== 'deleted'" class="block-editing-toolbar-content flex-container">
              <div class="block-information">
                <dropdown
                  alternate
                  name="block-type"
                  description-value="This determines the block type."
                  :options="['Image', 'Paragraph', 'Subheading']"
                  :default-value="block.typeDraft.charAt(0).toUpperCase() + block.typeDraft.slice(1)"
                  @change="block = changeBlockType(block, $event.toLowerCase())"
                />
              </div>
              <button class="delete-review-block-button" @click="deleteBlock(i)">
                <close-icon title="Delete block" class="delete-review-icon" />
              </button>
            </div>
            <div v-else class="block-editing-toolbar-deleted">
              <paragraph>
                Deleted block
              </paragraph>
            </div>
          </div>
          <paragraph v-if="block.typeDraft === 'paragraph'" :editable="editing" @change="block.contentDraft = $event">
            <span v-if="editing">
              {{ block.contentPreviousDraft }}
            </span>
            <span v-else>
              {{ block.content }}
            </span>
          </paragraph>
          <subheading v-if="block.typeDraft === 'subheading'" :top-margin="editing" :editable="editing" @change="block.contentDraft = $event">
            <span v-if="editing">
              {{ block.contentPreviousDraft }}
            </span>
            <span v-else>
              {{ block.content }}
            </span>
          </subheading>
          <div v-else-if="block.typeDraft === 'image'" class="review-image-container">
            <img
              v-if="(block.imageURL || block.imageURLDraft) && !block.changeImage"
              class="review-image"
              :src="getReviewImage(block)"
              :alt="block.content"
              @error="$set(block, 'changeImage', true)"
              @click="clickedReviewImage(block.imageURLDraft, selectedReview, i)"
            >
            <div v-else-if="block.changeImage && editing" class="emphasised-block">
              <text-input
                alternate
                full-width
                no-margin
                placeholder="https://something.com/images/relevant-photo.jpg"
                name="review-imageURL-input"
                :default-value="block.imageURLDraft"
                @input="block.imageURLToAdd = $event"
              >
                Image URL
              </text-input>
              <paragraph centred soft>
                Image uploading is not currently supported. Consider using a third party service, such as <a href="https://imgur.com/" target="_blank">Imgur</a>.
                Ensure you use a direct link (<a href="https://i.imgur.com/wMeVWI7.png" target="_blank">here's an example</a>, if you're not quite following).
              </paragraph>
              <regular-button centred type="primary" @pressed="saveReviewImageChanges(block.imageURL, selectedReview, i)">
                Save changes
              </regular-button>
            </div>
            <subheading :editable="editing" smaller @change="block.contentDraft = $event">
              <span v-if="block.content">{{ block.content }}</span>
              <span v-if="editing && !block.content">Click me to add a caption.</span>
            </subheading>
          </div>
          <div v-else-if="block.typeDraft === 'deleted'" class="review-image-container">
            <div class="emphasised-block">
              <paragraph centred soft>
                This block has been deleted. It will be permanently removed when this review is published.
              </paragraph>
              <regular-button centred type="primary" @pressed="restoreBlock(i)">
                Restore block
              </regular-button>
            </div>
          </div>
        </div>
        <div v-if="editing" id="add-new-block-container" class="review-content-block">
          <div class="flex-container">
            <regular-button type="primary" @pressed="publishReview">
              Publish review
            </regular-button>
            <regular-button type="secondary" @pressed="addNewBlock()">
              Add new block
            </regular-button>
            <regular-button no-right-margin type="secondary" @pressed="autosave(); editing = false; getParagraphOnlyUserReview()">
              Close editor
            </regular-button>
          </div>
          <paragraph soft centred>
            By publishing this review you agree to tasteful's Content Guidelines. Breaking these rules may result in the removal of this review or the suspension of your account.
          </paragraph>
          <paragraph no-top-margin centred>
            Your content is automatically saved as a draft twice each minute and when you close the editor.
          </paragraph>
        </div>
      </article-content>
    </div>
  </main>
</template>

<script>
// @ is an alias to /src
import { mapGetters } from 'vuex'
import sanitizeHtml from 'sanitize-html'
import closeIcon from 'vue-material-design-icons/Close.vue'
import _ from 'lodash'
import blur from '~/components/Blur.vue'
import masthead from '~/components/Masthead.vue'
import hero from '~/components/Hero.vue'
import subheading from '~/components/Subheading.vue'
import tag from '~/components/Tag.vue'
import regularButton from '~/components/RegularButton.vue'
import textInput from '~/components/TextInput.vue'
import textArea from '~/components/TextArea.vue'
import verticalTable from '~/components/VerticalTable.vue'
import profilePicture from '~/components/ProfilePicture.vue'
import pill from '~/components/Pill.vue'
import modal from '~/components/Modal.vue'
import dropdown from '~/components/Dropdown.vue'
import review from '~/components/Review.vue'
import paragraph from '~/components/Paragraph.vue'
import articleContent from '~/components/ArticleContent.vue'

export default {
  name: 'Release',
  components: {
    blur,
    masthead,
    hero,
    subheading,
    tag,
    regularButton,
    textInput,
    textArea,
    verticalTable,
    profilePicture,
    pill,
    modal,
    dropdown,
    review,
    paragraph,
    articleContent,
    closeIcon
  },
  data () {
    return {
      id: this.$route.params.release,
      averageScore: undefined,
      amountOfRatings: undefined,
      reviews: undefined,
      ratings: {},
      release: {
        'artist-credit': [
          {
            artist: {
              name: 'Loading...'
            }
          }
        ],
        firstReleaseDate: []
      },
      reviewContent: {
        header: '',
        body: []
      },
      paragraphOnlyUserReview: ['', 'passed'],
      listItemToAdd: {
        selectedList: '',
        description: ''
      },
      previousAutosave: [],
      initialScore: undefined,
      paragraphOnlyReviews: undefined,
      loading: false,
      consideredUser: false,
      showAddToListModal: false,
      showCreateListModal: false,
      showAdjustPositionInListModal: false,
      newList: {
        name: '',
        description: '',
        imageURL: 'https://coverartarchive.org/release/315bbc48-dea9-463c-bfa9-a6ccab78b990/25806517352-1200.jpg'
      },
      selectedReview: false,
      editing: false,
      newBlockCount: 0,
      editableBlockIndex: -1
    }
  },
  computed: mapGetters({
    colourMode: 'theme/colourMode',
    user: 'login/user'
  }),
  mounted () {
    this.loading = true
    this.onUserLoad()
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
          this.checkForReleaseInDatabase()
        })
        .catch((err) => {
          const error = err.response.data
          return this.$nuxt.error(
            {
              statusCode: 500,
              message: error.message
            })
        })
    } else {
      this.release = this.$store.state.search.release
      document.title = 'tasteful | ' + this.release.title
    }
    this.getRatingsAndReviews()
  },
  methods: {
    rate (scoreString) {
      const applyRating = (score) => {
        // rate on the release page
        const releases = this.$fire.firestore.collection('releases')
        const users = this.$fire.firestore.collection('users')
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
      // check if the user has already rated the release
      const users = this.$fire.firestore.collection('users')
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
    },
    checkIfExistingReview () {
      this.$fire.firestore.collection('releases').doc(this.id).collection('reviews').doc(this.user.id)
        .get()
        .then((doc) => {
          const reviewData = doc.data()
          if (reviewData) {
            this.reviewContent = reviewData
          }
          this.getParagraphOnlyUserReview()
        })
        .catch((err) => {
          return this.$nuxt.error(
            {
              statusCode: 500,
              message: err
            })
        })
    },
    getRatingsAndReviews () {
      const releases = this.$fire.firestore.collection('releases')
      releases.doc(this.id)
        .get()
        .then((res) => {
          // get ratings
          this.ratings = res.data().ratings
          if (this.ratings) {
            const ratings = Object.values(this.ratings)
            const sum = ratings.reduce((val, val2) => val + val2, 0)
            this.amountOfRatings = ratings.length
            this.averageScore = Math.floor(sum / this.amountOfRatings)
          }
        })
        .catch((err) => {
          console.log('Release may not exist. Will add to database (tried getting ratings).')
          // add adding-to-db support
          console.log(err.response.data)
        })

      // get reviews
      releases.doc(this.id).collection('reviews')
        .get()
        .then((res) => {
          this.reviews = res.docs.map(doc => doc.data())
          this.getReviewerAvatars()
          this.getReviewerUsernames()
        })
        .catch((err) => {
          console.log('Release does not exist. Will add to database (tried getting reviews).')
          console.log(err.response.data)
        })
    },
    postReview () {
      if (!this.reviewContent.body) {
        alert('Your review\'s body seems empty. That\'s a pretty important part of a review, don\'t you think?')
      } else {
        // create review object
        const review = this.reviewContent
        // add review to release in database
        const releases = this.$fire.firestore.collection('releases')
        releases.doc(this.id).collection('reviews').doc(this.user.id).set({
          author: this.user.id,
          header: review.header,
          body: review.body,
          likes: 0,
          likers: []
        })
        // add review to user in database
        const users = this.$fire.firestore.collection('users')
        users.doc(this.user.id).collection('reviews').doc(this.id).set({
          review: releases.doc(this.id).collection('reviews').doc(this.user.id) // reference
        })
          .then(() => {
            alert('Your review for ' + this.release.title + ' has been submitted.')
          })
      }
    },
    checkForReleaseInDatabase () {
      const releases = this.$fire.firestore.collection('releases')
      releases.doc(this.id)
        .get()
        .then((release) => {
          if (!release.exists) {
            this.addReleaseToDatabase()
          }
        })
    },
    addReleaseToDatabase (release) {
      this.$fire.firestore.collection('releases').doc(this.id).set(this.release)
    },
    likeReview (review, i) {
      const releases = this.$fire.firestore.collection('releases')
      // check if user has already liked
      if (this.reviews[i].likers.some(liker => liker.id === this.user.id)) {
        this.reviews[i].likes = review.likes - 1
        const indexOfLiker = this.reviews[i].likers.findIndex(review => review.id === this.user.id)
        this.reviews[i].likers.splice(indexOfLiker, 1)
      } else if (this.user.id === review.author) {
        alert('You can\'t like your own review, sorry.')
      } else {
        this.reviews[i].likes = review.likes + 1
        this.reviews[i].likers.push({
          id: this.user.id,
          username: this.user.username
        })
      }
      const likes = this.reviews[i].likes
      const likers = this.reviews[i].likers
      releases.doc(this.id).collection('reviews').doc(review.author).update({
        likes,
        likers
      })
    },
    getReviewImage (block) {
      if (this.editing) {
        return block.imageURLDraft
      } else {
        return block.imageURL
      }
    },
    onUserLoad () {
      this.checkIfExistingRating()
      this.checkIfExistingReview()
    },
    getAvatar (id) {
      const imagePath = 'users/' + id + '/avatar.jpg'
      return this.$fire.storage.ref().child(imagePath)
        .getDownloadURL()
        .then(url => url)
    },
    getReviewerAvatars () {
      this.reviews.forEach(async (review) => {
        const i = this.reviews.indexOf(review)
        await this.getAvatar(review.author)
          .then((url) => {
            this.$set(this.reviews[i], 'avatar', url)
          })
      })
    },
    getUsername (id) {
      return this.$fire.firestore.collection('users').doc(id)
        .get()
        .then((user) => {
          const userData = user.data()
          return userData.username
        })
    },
    getReviewerUsernames () {
      this.reviews.forEach(async (review) => {
        const i = this.reviews.indexOf(review)
        const username = await this.getUsername(review.author)
        this.$set(this.reviews[i], 'username', username)
      })
    },
    sanitise (html) {
      const sanitiser = {
        allowedTags: ['strong'],
        allowedAttributes: {}
      }
      const sanitisedHTML = sanitizeHtml(html, sanitiser)
      return sanitisedHTML
    },
    createParagraphOnlyReviews () {
      const paragraphOnlyReviews = []
      this.reviews.forEach((review) => {
        if (review.author !== this.user.id) {
          const body = review.body // array of 'blocks'
          const bodyOnlyParagraphs = []
          body.forEach((block) => {
            if (block.type === 'paragraph') {
              bodyOnlyParagraphs.push(block)
            }
          })
          const reviewWithOnlyParagraphBlocks = Object.assign({}, review)
          reviewWithOnlyParagraphBlocks.body = bodyOnlyParagraphs // The Line.
          paragraphOnlyReviews.push(reviewWithOnlyParagraphBlocks)
        }
      })
      this.paragraphOnlyReviews = paragraphOnlyReviews
    },
    getParagraphOnlyUserReview () {
      const userReviewBody = this.reviewContent.body
      let paragraphOnlyUserReviewBody = ''
      let userReviewTruncatedIssue = 'passed'
      let length = -1
      userReviewBody.forEach((block) => {
        if (block.typeDraft !== 'deleted') {
          length = length + 1
        }
        if (length > 0) {
          userReviewTruncatedIssue = 'multiple blocks'
        } else if (block.typeDraft === 'paragraph') {
          paragraphOnlyUserReviewBody = paragraphOnlyUserReviewBody + block.contentPreviousDraft
        } else if (block.typeDraft !== 'deleted') {
          console.log(block.typeDraft)
          userReviewTruncatedIssue = 'non paragraph blocks'
        }
      })
      this.editableBlockIndex = length
      this.paragraphOnlyUserReview = [paragraphOnlyUserReviewBody, userReviewTruncatedIssue, length]
      // i provide length as an argument because it determines the index of the block that's being edited.
      // this is useful in the instance where the user has a deleted block at index 0 but a paragraph at index 1, for example.
    },
    openRichEditor () {
      this.editing = true
      const header = this.reviewContent.headerPreviousDraft
      const body = this.reviewContent.body
      const author = this.reviewContent.author
      if (!body.length) {
        // Automatically add an additional block if the body is empty.
        this.addNewBlock()
      }
      if (!header) {
        // Add a header if there is none.
        this.addHeader()
      }
      if (!author) {
        // If this is a new review add the necessary properties
        this.reviewContent.author = this.user.id
        this.reviewContent.username = this.user.username
        this.reviewContent.avatar = this.user.avatar
      }
      this.previousAutosave = JSON.parse(JSON.stringify(body))
      // load previous values
      body.forEach((block) => {
        block.contentPreviousDraft = block.contentDraft
        // 'contentPreviousDraft' is never altered beyond this point and is only used to display the initial body on the DOM.
        // 'contentDraft' isn't used as that variable is being written to. Displaying that messes with the cursor as it re-renders
        // after its updated with a new value.
      })
      // begin autosaving
      this.$store.commit('interface/setBarVisible', true)
      this.$store.commit('interface/setBarMessage', 'You are in edit mode. Click a block to edit its contents.')
      const autosaveLoop = setInterval(() => {
        if (!this.editing) {
          clearInterval(autosaveLoop)
        } else {
          this.autosave()
        }
      }, 30000)
    },
    autosave () {
      const reviewDraft = this.reviewContent
      // reviewDraft.body = this.reviewContent.body
      // reviewDraft.header = this.reviewContent.headerDraft
      // reviewDraft.author = this.reviewContent.author
      if (!_.isEqual(this.previousAutosave, reviewDraft)) {
        // a save is necessary because the content has changed since last save
        this.$store.commit('interface/setBarVisible', true)
        this.$store.commit('interface/setBarMessage', 'Saving draft... 💾')
        this.saveDraft(reviewDraft)
      } else {
        // save is not necessary
        this.showDraftSavedMessage()
      }
      this.previousAutosave = reviewDraft
    },
    saveDraft (draft) {
      // draft needs to be filtered to remove certain tags
      const filteredDraft = JSON.parse(JSON.stringify(draft))
      filteredDraft.body.forEach((block) => {
        delete block.changeImage
        delete block.imageURLToAdd
      })
      const releases = this.$fire.firestore.collection('releases')
      releases.doc(this.id)
        .collection('reviews')
        .doc(this.user.id)
        .set(filteredDraft,
          {
            merge: true
          }
        )
        .then(() => {
          this.showDraftSavedMessage()
        })
    },
    publishReview () {
      // get the final draft
      const reviewDraft = JSON.parse(JSON.stringify(this.reviewContent.body))
      const headerDraft = this.reviewContent.headerDraft
      const publishDraft = reviewDraft.filter((block) => {
        return block.typeDraft !== 'deleted'
      })
      publishDraft.forEach((block) => {
        block.content = block.contentDraft
        block.type = block.typeDraft
      })
      this.reviewContent.body = JSON.parse(JSON.stringify(publishDraft))
      publishDraft.forEach((block) => {
        delete block.changeImage
        delete block.imageURLToAdd
      })
      const review = {
        body: publishDraft,
        header: headerDraft
      }
      // save to database
      const releases = this.$fire.firestore.collection('releases')
      releases.doc(this.id)
        .collection('reviews')
        .doc(this.user.id)
        .set(review,
          {
            merge: true
          }
        )
        .then(() => {
          this.showDraftSavedMessage('Your review has been published! 🎉')
        })
    },
    showDraftSavedMessage (message = 'Draft saved. 😊') {
      this.$store.commit('interface/setBarVisible', true)
      this.$store.commit('interface/setBarMessage', message)
      setTimeout(() => {
        if (!this.editing) {
          this.$store.commit('interface/setBarVisible', false)
          this.$store.commit('interface/setBarMessage', '')
        } else {
          this.$store.commit('interface/setBarVisible', true)
          this.$store.commit('interface/setBarMessage', 'You are in edit mode. Click a block to edit its contents.')
        }
      }, 3000)
    },
    addNewBlock () {
      const possibleBlockContent = [
        'This is a fresh, new, and lovely block with which you can do what you please.',
        'An empty canvas which permits all sorts of wonderful and delightful expression.',
        'What quality will you describe in this area? That\'s up to you, I suppose.',
        'Don\'t forget that you can change the type of block this is to something other than a paragraph by using the dropdown above this block.',
        `So much room for expressing your love for ${this.release.title}, so little time...`,
        'I\'ve run out of things to say. Enjoy the same text from the next block out!',
        'A new block.'
      ]
      const blockContent = possibleBlockContent[this.newBlockCount]
      if (this.newBlockCount !== (possibleBlockContent.length - 1)) {
        this.newBlockCount = this.newBlockCount + 1
      }
      this.reviewContent.body.push({
        contentDraft: blockContent,
        contentPreviousDraft: blockContent,
        typeDraft: 'paragraph'
      })
    },
    addHeader () {
      const possibleHeaderContent = [
        'A wonderful opening line!',
        'Something to grab their attention.',
        'Something provocative and enticing!',
        'Your thoughts in one sentence.'
      ]
      const index = Math.floor(Math.random() * possibleHeaderContent.length)
      this.reviewContent.headerDraft = possibleHeaderContent[index]
    },
    clickedReviewImage (imageURL, selectedReview, i) {
      if (!this.editing) {
        window.open(imageURL, '_blank')
      } else {
        // Allow the user to change the image.
        this.$set(this.reviewContent.body[i], 'imageURLToAdd', imageURL)
        this.$set(this.reviewContent.body[i], 'changeImage', true)
      }
    },
    saveReviewImageChanges (imageURL, selectedReview, i) {
      if (!this.reviewContent.body[i].imageURLToAdd) {
        // remove block
        this.reviewContent.body.splice(i, 1)
      } else {
        this.reviewContent.body[i].changeImage = false
        this.$set(this.reviewContent.body[i], 'imageURLDraft', this.reviewContent.body[i].imageURLToAdd)
        this.$set(this.reviewContent.body[i], 'imageURLToAdd', '')
      }
    },
    changeBlockType (block, type) {
      const updatedBlock = block
      updatedBlock.typeDraft = type
      if (type === 'image') {
        const imageBlock = updatedBlock
        imageBlock.changeImage = true
        return imageBlock
      }
      return updatedBlock
    },
    deleteBlock (blockIndex) {
      // the block is not actually deleted from the array until the draft is published.
      this.reviewContent.body[blockIndex].typeDraftBeforeDeletion = this.reviewContent.body[blockIndex].typeDraft
      this.reviewContent.body[blockIndex].contentPreviousDraft = this.reviewContent.body[blockIndex].contentDraft
      this.reviewContent.body[blockIndex].typeDraft = 'deleted'
    },
    restoreBlock (blockIndex) {
      this.reviewContent.body[blockIndex].typeDraft = this.reviewContent.body[blockIndex].typeDraftBeforeDeletion
    },
    createNewList () {
      this.showCreateListModal = false
      this.$store.commit('interface/setBarVisible', true)
      this.$store.commit('interface/setBarMessage', `✨ Your list '${this.newList.name}' has been created!`)
      setTimeout(() => {
        this.$store.commit('interface/setBarVisible', false)
        this.$store.commit('interface/setBarMessage', '')
      }, 3000)
    }
  }
}
</script>

<style lang="scss" scoped>
.release {
  padding-bottom: 3vh;
}
.release-image {
  border-radius: 10px;
  box-shadow: 0px 0px 50px;
  width: 300px;
  margin-left: auto;
  margin-top: 20px;
  margin-bottom: 20px;
  &.light {
    color: rgba($saturated-purple, 0.25)
  }
}
.link {
  text-decoration: none;
}
.tags {
  max-width: 90%;
}
.flex-container {
  display: flex;
}
.user-score-container {
  margin-left: 32px;
  margin-top: 16px;
  margin-right: 16px;
}
.user-score {
  text-align: center;
  color: $saturated-purple;
  font-weight: 700;
  font-size: 18px;
  width: 64px;
  letter-spacing: 2px;
  margin-top: 16px;
}
.user-review-container {
  margin-bottom: 32px;
}
.user-review-composition-container {
  width: 100%;
}
.relevant-lists-and-charts {
  margin-left: 32px;
}
.content {
  padding-left: calc(25vw - 32px);
  padding-right: 25vw;
}
.left-column {
  margin-right: 35px;
  max-width: 25vw;
}
.right-column {
  margin-left: 35px;
  max-width: 25vw;
}
.review-container {
  display: flex;
  justify-content: center;
}
.review-author-container {
  align-items: center;
  margin-top: 24px;
}
.review-author {
  margin-left: 8px;
}
.review-image-container {
  display: flex;
  align-items: center;
  flex-direction: column;
  margin-top: 16px;
  margin-bottom: 64px;
  max-width: 512px;
}
.review-image {
  margin-bottom: 32px;
  max-width: 512px;
  box-shadow: 0px 4px 32px $desaturated-dimmest-purple;
  border-radius: 5px;
  &:hover {
    cursor: pointer;
  }
}
.emphasised-block {
  background: $lighter-purple;
  padding: 32px;
  border-radius: 10px;
  margin-bottom: 32px;
}
.review-caption {
  max-width: 90%;
}
.review-content-block {
  display: flex;
  align-items: center;
  flex-direction: column;
}
#add-new-block-container {
  margin-top: 64px;
  margin-bottom: 96px;
  background: $lighter-purple;
  padding: 32px;
  border-radius: 10px;
}
.block-editing-toolbar {
  display: flex;
  border-radius: 0px 16px 16px 0px;
  background: $lighter-purple;
  width: 100%;
  margin-top: 32px;
}
.block-editing-toolbar-content {
  width: 100%;
}
.block-editing-toolbar-deleted {
  display: flex;
  align-items: center;
  margin-left: 16px;
}
.block-number {
  background: $desaturated-dimmish-purple;
  color: $lighter-purple;
  padding: 16px;
  border-radius: 16px 0px 0px 16px;
}
.block-information {
  margin-left: 16px;
}
.delete-review-block-button {
  appearance: none;
  background: none;
  border: none;
  margin-left: auto;
  margin-right: 16px;
}
.delete-review-icon {
  color: $desaturated-dimmish-purple;
  transition: all 0.2s linear;
  &:hover {
    color: $saturated-purple;
    cursor: pointer;
  }
}
.new-list-image-preview {
  min-width: 64px;
  min-height: 64px;
  border-radius: 10px;
  margin-left: 16px;
  margin-top: auto;
  margin-bottom: 16px;
  background-size: cover;
}
.secondary-list-buttons {
  margin-bottom: 16px;
}
</style>
