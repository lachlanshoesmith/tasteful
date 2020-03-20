<template>
  <button :class="[{centreOnSmallScreens}, colourMode]" class="submit-button" @click="loading = true">
    <slot />
    <arrow-right-icon v-if="includeArrowIcon && !loading" class="icon" title="Submit" />
    <autorenew-icon v-if="includeArrowIcon && loading" class="icon loading-icon" title="Loading" />
  </button>
</template>

<script>
import ArrowRightIcon from 'vue-material-design-icons/ArrowRight.vue'
import AutorenewIcon from 'vue-material-design-icons/Autorenew.vue'

export default {
  name: 'SubmitButton',
  components: {
    ArrowRightIcon,
    AutorenewIcon
  },
  props: {
    value: {
      default: 'Submit',
      type: String
    },
    stopLoading: {
      type: Boolean,
      default: false
    },
    includeArrowIcon: Boolean,
    centreOnSmallScreens: Boolean
  },
  data () {
    return {
      loading: false
    }
  },
  computed: {
    colourMode () {
      return this.$store.state.theme.colourMode
    }
  },
  watch: {
    stopLoading (previousValue, currentValue) {
      if (currentValue === true) {
        this.loading = false
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.submit-button {
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  padding: 10px;
  border-radius: 100px;
  max-width: 40vw;
  transition: all 0.2s linear;
  color: hsl(253, 100%, 94%);
  font-size: 1rem;
  font-weight: 500;
  text-align: center;
  line-height: 1.5rem;

  &.light {
    background: $muted-purple;
    box-shadow: 0px 0px 10px hsla(252, 67%, 45%, 0.5);
  }
  &.dark {
    background: $muted-purple-dim;
    box-shadow: 0px 4px 20px hsla(252, 67%, 45%, 0.2);
  }
  &.sepia {
    background: linear-gradient(
      103.68deg,
      hsl(17, 47%, 76%) 0.09%,
      hsl(17, 67%, 75%) 97.38%
    );
    box-shadow: 0px 4px 20px hsla(39, 68%, 15%, 0.5);
    .masthead-content {
      color: hsl(35, 20%, 24%);
    }
  }
  &.sepia-dark {
    background: linear-gradient(
      103.68deg,
      hsl(17, 27%, 56%) 0.09%,
      hsl(17, 47%, 55%) 97.38%
    );
    box-shadow: 0px 4px 20px hsla(39, 68%, 15%, 0.5);
    .masthead-content {
      color: hsl(35, 20%, 94%);
    }
  }
  &:hover {
    cursor: pointer;
    &.light {
      background: $muted-purple-dim;
    }
    &.dark {
      background: $muted-purple;
    }
    .icon {
      margin-left: 10px;
    }
  }
  &:focus {
    outline: none;
  }
  &::-moz-focus-inner {
    border: 0;
  }
}

.icon {
  transition: all 0.2s linear;
  margin-left: 5px;
  display: inline-flex;
  vertical-align: middle;
}

.loading-icon {
  animation: rotation 1s infinite linear;
}

@media (max-width: 1000px) {
  .submit-button {
    &.centreOnSmallScreens {
      margin-left: auto;
      margin-right: auto;
      margin-top: 10px;
    }
  }
}

@keyframes rotation {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(359deg);
  }
}
</style>
