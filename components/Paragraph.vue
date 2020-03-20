<template>
  <p :class="[{error}, colourMode]" class="paragraph">
    <slot>Paragraph content</slot>
  </p>
</template>

<script>
export default {
  name: 'Paragraph',
  props: {
    error: Boolean
  },
  computed: {
    colourMode () {
      return this.$store.state.theme.colourMode
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.paragraph {
  color: hsl(253, 100%, 24%);
  font-size: 1rem;
  font-weight: 400;
  text-align: left;
  line-height: 2rem;
  max-width: 50ch;
  color: hsl(222, 5%, 20%);
  transition: all 0.2s linear;
  &.dark {
    color: hsl(222, 10%, 55%);
    a {
      color: hsl(352, 52%, 55%);
      &:hover {
        color: hsl(352, 52%, 75%);
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
}
@media (max-width: 1000px) {
  .paragraph {
    margin-left: auto;
    margin-right: auto;
    text-align: justify;
    &.error {
      text-align: center;
    }
  }
}
</style>
