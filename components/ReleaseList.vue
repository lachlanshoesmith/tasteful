<template>
  <div class="release-list" :style="{ 'max-height': `${maxHeight}vh` }">
    <vertical-table no-header less-left-padding small-rows>
      <template #content>
        <draggable
          v-if="editable"
          v-model="listItemsModified"
          class="sortable-list"
          ghost-class="dragging"
          :options="{setData: hideDragGhost}"
          @update="$emit('change', listItemsModified)"
        >
          <div v-for="(item, i) in listItemsModified" :key="item.id" class="row flex-container" :class="{ 'selected-release-in-list': item.id === selectedRelease}">
            <pill smaller class="list-item-index" :alt="((i + 1) % 2) !== 0">
              <p class="list-item-index-text">
                {{ i + 1 }}
              </p>
            </pill>
            <profile-picture class="release-image" size="medium" :url="item.data.image" :release="item.data.id" />
            <div class="release-info">
              <subheading smallest>
                {{ item.data['artist-credit'][0].artist.name }}
              </subheading>
              <subheading smaller title-case no-margin>
                {{ item.data.title }}
              </subheading>
            </div>
          </div>
        </draggable>
        <div v-else>
          <!-- for non-editable lists. this is much the same; i need to modularise this further -->
          <div v-for="(item, i) in listItems" :key="item.id" class="row" :class="{ 'selected-release-in-list': item.id === selectedRelease}">
            <div class="flex-container">
              <pill smaller class="list-item-index" :alt="((i + 1) % 2) !== 0">
                <p class="list-item-index-text">
                  {{ i + 1 }}
                </p>
              </pill>
              <profile-picture class="release-image" size="medium" :url="item.data.image" :release="item.data.id" />
              <div class="release-info">
                <subheading smallest>
                  {{ item.data['artist-credit'][0].artist.name }}
                </subheading>
                <subheading smaller title-case no-margin>
                  {{ item.data.title }}
                </subheading>
              </div>
            </div>
            <paragraph v-if="showDescriptions && item.description">
              {{ item.description }}
            </paragraph>
          </div>
        </div>
      </template>
    </vertical-table>
  </div>
</template>

<script>
import draggable from 'vuedraggable'
import verticalTable from '~/components/VerticalTable.vue'
import profilePicture from '~/components/ProfilePicture.vue'
import pill from '~/components/Pill.vue'
import subheading from '~/components/Subheading.vue'
import paragraph from '~/components/Paragraph.vue'

export default {
  name: 'ReleaseList',
  components: {
    verticalTable,
    profilePicture,
    pill,
    subheading,
    draggable,
    paragraph
  },
  props: {
    listItems: {
      type: Array,
      default: () => {
        return []
      }
    },
    selectedRelease: {
      type: String,
      default: ''
    },
    maxHeight: {
      type: String,
      default: '100'
    },
    editable: Boolean,
    showDescriptions: Boolean
  },
  data () {
    return {
      listItemsModified: [...this.listItems]
    }
  },
  methods: {
    hideDragGhost (draggedItemData) {
      const ghostElement = document.createElement('div')
      ghostElement.classList.add('dragged-item-ghost')
      draggedItemData.setDragImage(ghostElement, 0, 0)
    }
  }
}
</script>

<style lang="scss" scoped>
.release-list {
  margin-top: 16px;
  margin-bottom: 32px;
  overflow-y: auto;
}
.flex-container {
  display: flex;
  align-items: center;
}
.list-item-index {
  margin-right: 16px;
}
.list-item-index-text {
  margin: 0;
}
.release-info {
  margin-left: 16px;
}
.selected-release-in-list {
  box-shadow: 0px 0px 32px $dimmish-purple;
  border-radius: 0px;
  position: relative;
}
.dragging {
  opacity: 0.5;
}
.dragged-item-ghost {
  position: absolute;
  top: 0;
  left: 0;
  visibility: hidden;
}

// CAVEAT: unless i distinguish row as its own component and do some conditional class trickery,
//         rows will have to be styled in both ReleaseList under the sortable-list class as well
//         as the VerticalTable components.

.sortable-list {
  .row {
    padding-left: 32px;
    padding-bottom: 16px;
    padding-top: 16px;
    &:nth-child(even) {
      background: $lightest-purple;
    }
    &:hover {
      cursor: move;
    }
  }
}
</style>
