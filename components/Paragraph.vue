<template>
  <p
    v-if="!hidden"
    ref="body"
    :class="[{error, soft, softer, smaller, noLeftMarginOnMobile, noTopMargin, noBottomMargin, centred}, colourMode]"
    :contenteditable="editable"
    class="paragraph"
    @input="emitValue"
    @keydown.enter.prevent
  >
    <slot v-if="!truncatedBody && !htmlContent">
      Paragraph content
    </slot>
    <span v-else-if="truncatedBody">{{ truncatedBody }}</span>
  </p>
</template>

<script>
import _ from 'lodash'

export default {
  name: 'Paragraph',
  props: {
    error: Boolean,
    noLeftMarginOnMobile: Boolean,
    noTopMargin: Boolean,
    noBottomMargin: Boolean,
    smaller: Boolean,
    centred: Boolean,
    soft: Boolean,
    softer: Boolean,
    alwaysShow: Boolean,
    truncate: {
      type: Number,
      default: 9999999999999
    },
    editable: Boolean,
    htmlContent: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      truncatedBody: '',
      hidden: false
    }
  },
  computed: {
    colourMode () {
      return this.$store.state.theme.colourMode
    }
  },
  mounted () {
    if (this.truncate) {
      const lengthOfBody = this.truncate
      const truncateProperties = {
        length: lengthOfBody,
        // truncates without cutting off words
        separator: /,? +/
      }
      const body = this.$refs.body.textContent
      if (lengthOfBody < body.length) {
        this.truncatedBody = _.truncate(body, truncateProperties)
        const difference = body.length - lengthOfBody
        this.$emit('toTruncate', difference)
      } else {
        const difference = body.length - lengthOfBody
        this.$emit('toTruncate', difference)
      }
    }
  },
  methods: {
    emitValue (element) {
      this.$emit('change', element.target.textContent)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.paragraph {
  font-size: 1rem;
  font-weight: 400;
  text-align: justify;
  line-height: 2rem;
  max-width: 50ch;
  color: hsl(222, 5%, 20%);
  transition: all 0.2s linear;
  &.soft {
    opacity: 0.7;
    &.solarised-light, &.solarised-dark {
      opacity: 1;
    }
    &.solarised-light {
      color: $solarised-light-secondary-content;
    }
    &.solarised-dark {
      color: $solarised-dark-secondary-content;
    }
    &.black {
      color: $quite-dark-grey;
    }
  }
  &.softer {
    opacity: 0.5;
  }
  &.dark {
    color: hsl(222, 10%, 55%);
    a {
      color: hsl(352, 52%, 55%);
      &:hover {
        color: hsl(352, 52%, 75%);
      }
    }
  }
  &.solarised-light {
    color: $solarised-light-main-content;
  }
  &.solarised-dark {
    color: $solarised-dark-main-content;
  }
  &.solarised-light, &.solarised-dark {
    a {
      color: $solarised-violet;
      &:hover {
        color: $solarised-magenta;
      }
    }
  }
  &.black {
    color: $quite-dark-grey;
    a {
      color: $quite-light-grey;
      &:hover {
        color: $light-grey;
      }
    }
  }
  &.error {
    max-width: 30ch;
    color: $saturated-red-dim;
    &.dark {
      color: $saturated-red;
    }
  }
  &.smaller {
    font-size: 0.8rem;
  }
  &.noTopMargin {
    margin-top: 0;
  }
  &.noBottomMargin {
    margin-bottom: 0;
  }
  &.centred {
    text-align: center;
    width: auto;
    min-width: 100%;
  }
}
.editing-tools {
  display: none;
  &:hover {
    display: block;
  }
}
@media (max-width: 1000px) {
  .paragraph {
    margin-left: auto;
    margin-right: auto;
    text-align: justify;
    &.noLeftMarginOnMobile {
      margin-left: 0;
      text-align: left;
    }
    &.smaller, &.centred, &.error {
      text-align: center;
    }
  }
}
</style>
