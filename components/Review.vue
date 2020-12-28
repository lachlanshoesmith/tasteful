<template>
  <div class="review" :class="{ 'alternate': index % 2 === 1 }">
    <div class="flex-container">
      <div>
        <profile-picture :username="review.username" class="review-avatar" size="small" :url="review.avatar" />
      </div>
      <div>
        <subheading smallest>
          <nuxt-link class="review-author" :to="'/user/' + review.username">
            {{ review.username }}
          </nuxt-link>
        </subheading>
        <subheading smaller>
          {{ review.header }}
        </subheading>
        <div v-for="(block, i) in review.body" :key="block.id">
          <paragraph v-if="block.type === 'paragraph'" :always-show="i === 0" :truncate="truncationLength" :html-content="sanitise(block.content)" @toTruncate="truncationLength = Number($event); truncated = true" />
        </div>
        <a v-if="truncated" :href="`#${review.author}`" @click="$emit('show')">
          Read more
        </a>
        <like-button :liked-condition="user === null || review.likers.some(liker => liker.id === user.id)" :likes="review.likes" :likers="review.likers" @liked="$emit('liked')" />
      </div>
    </div>
  </div>
</template>

<script>
import sanitizeHtml from 'sanitize-html'
import profilePicture from '~/components/ProfilePicture.vue'
import subheading from '~/components/Subheading.vue'
import paragraph from '~/components/Paragraph.vue'
import likeButton from '~/components/LikeButton.vue'

export default {
  name: 'Review',
  components: {
    profilePicture,
    subheading,
    paragraph,
    likeButton
  },
  props: {
    review: {
      type: Object,
      default: () => {
        return {
          author: 'loading',
          avatar: 'loading',
          body: 'loading',
          header: 'loading'
        }
      }
    },
    release: {
      type: String,
      default: ''
    },
    index: {
      type: Number,
      default: 0
    },
    user: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data () {
    return {
      truncated: false,
      truncationLength: 300
    }
  },
  watch: {
    review (state) {
      if (state.body.length > 300) {
        this.truncated = true
      }
    }
  },
  async mounted () {
    this.review.username = await this.getUsername()
    this.review.avatar = await this.getAvatar()
  },
  methods: {
    sanitise (html) {
      const sanitiser = {
        'allowedTags': ['strong'],
        'allowedAttributes': {}
      }
      const sanitisedHTML = sanitizeHtml(html, sanitiser)
      return sanitisedHTML
    },
    getAvatar () {
      const imagePath = 'users/' + this.review.author + '/avatar.jpg'
      return this.$fire.storage.ref().child(imagePath)
        .getDownloadURL()
        .then(url => url)
    },
    getUsername () {
      return this.$fire.firestore.collection('users').doc(this.review.author)
        .get()
        .then((user) => {
          const userData = user.data()
          return userData.username
        })
    }
  }
}
</script>

<style lang="scss" scoped>
.review {
  padding: 16px;
  padding-top: 32px;
  max-width: 400px;
  border-radius: 10px;
  &.alternate {
    background: $lighter-purple;
  }
}
.flex-container {
  display: flex;
}
.review-avatar {
  margin-right: 16px;
}
.review-author {
  color: $dimmish-purple;
  &:hover {
    color: $saturated-purple;
  }
}
</style>
