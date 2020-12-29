<template>
  <div class="like-button-container">
    <button class="like-button" @click="$emit('liked')">
      <heart-icon v-if="likedCondition" class="favourited-icon" />
      <heart-icon v-else class="unfavourited-icon" />
    </button>
    <p class="likes" @click="showModal = true">
      {{ likes }}
    </p>
    <transition name="fade">
      <modal v-if="showModal" @closeModal="showModal = false">
        <template v-slot:heading>
          <masthead smaller>
            Review likers
          </masthead>
        </template>
        <template v-slot:left>
          <ul>
            <li v-for="liker in likers" :key="liker.id">
              {{ liker.username }}
            </li>
          </ul>
        </template>
      </modal>
    </transition>
  </div>
</template>

<script>
import HeartIcon from 'vue-material-design-icons/Heart.vue'
import Modal from '~/components/Modal.vue'
import Masthead from '~/components/Masthead.vue'

export default {
  name: 'LikeButton',
  components: {
    HeartIcon,
    Modal,
    Masthead
  },
  props: {
    likedCondition: Boolean,
    likes: {
      type: Number,
      default: 0
    },
    likers: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  data () {
    return {
      showModal: false
    }
  }
}
</script>

<style lang="scss" scoped>
.like-button-container {
  display: flex;
  align-items: center;
}
.like-button {
  appearance: none;
  background: none;
  border: none;
}
.favourited-icon {
  color: $saturated-purple;
  &:hover {
    color: $desaturated-dimmish-purple;
  }
}
.unfavourited-icon {
  color: $desaturated-dimmish-purple;
  &:hover {
    color: $saturated-purple;
  }
}
.favourited-icon, .unfavourited-icon {
  transition: all 0.2s linear;
  &:hover {
    cursor: pointer;
  }
}
.likes {
  margin: 0;
}
.material-design-icon {
  display: inline-flex;
  vertical-align: middle;
}
.likes {
  &:hover {
    cursor: pointer;
  }
}
</style>
