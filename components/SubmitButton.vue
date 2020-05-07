<template>
  <button :class="[{centreOnSmallScreens, success, smaller}, colourMode]" class="submit-button" @click="loading = true">
    <slot />
    <arrow-right-icon v-if="includeArrowIcon && !loading" class="icon" title="Submit" />
    <autorenew-icon v-if="includeArrowIcon && loading && !success" class="icon loading-icon" title="Loading" />
    <check-icon v-if="includeArrowIcon && success" class="icon" title="Success" />
  </button>
</template>

<script>
import ArrowRightIcon from 'vue-material-design-icons/ArrowRight.vue'
import AutorenewIcon from 'vue-material-design-icons/Autorenew.vue'
import CheckIcon from 'vue-material-design-icons/Check.vue'

export default {
  name: 'SubmitButton',
  components: {
    ArrowRightIcon,
    AutorenewIcon,
    CheckIcon
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
    success: {
      type: Boolean,
      default: false
    },
    smaller: Boolean,
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
    stopLoading (currentValue, previousValue) {
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
  &.success {
    background: $green-gradient;
    background-size: 400% 400%;
    color: $saturated-green-dim;
    box-shadow: 0px 4px 20px rgba($saturated-green, 0.5);
    animation: GradientAnimation 2s ease infinite;
  }
  &.smaller {
    font-size: 0.9rem;
    padding: 5px;
    padding-left: 10px;
    padding-right: 10px;
    margin-top: 10px;
  }
  &:hover {
    cursor: pointer;
    color: hsl(253, 100%, 94%);
    &.light {
      background: $muted-purple-dim;
      box-shadow: 0px 0px 10px hsla(252, 67%, 45%, 0.5);
    }
    &.dark {
      background: $muted-purple;
      box-shadow: 0px 4px 20px hsla(252, 67%, 45%, 0.2);
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

@keyframes GradientAnimation {
  0%{background-position:82% 0%}
  50%{background-position:19% 100%}
  100%{background-position:82% 0%}
}
</style>
