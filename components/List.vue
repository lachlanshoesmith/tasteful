<template>
  <ul :class="colourMode" class="list">
    <slot>List content</slot>
  </ul>
</template>

<script>
export default {
  name: 'List',
  computed: {
    colourMode () {
      return this.$store.state.theme.colourMode
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.list {
  color: hsl(253, 100%, 24%);
  font-size: 1rem;
  font-weight: 400;
  text-align: left;
  line-height: 2rem;
  max-width: 50ch;
  color: hsl(222, 5%, 20%);
  transition: all 0.2s linear;
  list-style: none;
  padding-left: 0px;
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
}

@media (max-width: 1000px) {
  .list {
    margin-left: auto;
    margin-right: auto;
    text-align: justify;
  }
}
</style>
