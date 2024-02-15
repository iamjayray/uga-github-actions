<template>
  <div
    class="border border-light-4"
    :class="backgroundClass"
    data-cy="preview-section-details-collapse"
  >
    <div class="p-space-xs p-lg-space-md">
      <a
        data-cy="preview-section-details-collapse-button-toggle"
        :href="`#${collapseId}`"
        class="text-decoration-none text-dark-3"
        v-b-toggle
        @click.prevent
      >
        <div class="d-flex">
          <h2
            class="collapse-title h2-medium mr-space-sm mr-lg-space-md my-auto"
          >
            {{ compData.title }}
          </h2>
          <div class="ml-auto my-auto">
            <font-awesome-icon
              class="collapse-icon"
              icon="fa-chevron-down"
            ></font-awesome-icon>
          </div>
        </div>
      </a>
      <!-- Collapse contents -->
      <b-collapse :id="collapseId">
        <div class="mt-space-sm">
          <template v-for="(key, index) in getKeysOfObject(compData.data)">
            <div
              :key="`${key}`"
              class="text-small font-weight-bold py-space-xxs my-space-xxxs border-bottom"
              data-cy="preview-section-details-collapse-contents"
            >
              <template v-for="(item, i) in compData.data[key]">
                <div
                  :key="`${key}-${item.text}`"
                  class="row w-100 text-small font-weight-bold px-0 ml-0 mb-space-xxs"
                  :data-cy="`preview-section-details-collapse-item-${item?.text}-${index}-${i}`"
                >
                  <p
                    class="col-6 pl-0 pr-gutter mb-0"
                    :class="
                      item.type === 'title' ? 'text-primary mt-space-xxs' : ''
                    "
                  >
                    {{ item.text }}
                  </p>
                  <p
                    v-if="item?.text && item?.value"
                    class="col-6 mb-0 pr-0 pl-gutter text-right text-dark-1 text-break"
                    v-html="item.value"
                  ></p>
                  <p v-else class="col-6 mb-0 px-0 text-right text-dark-1">
                    No data has been entered
                  </p>
                </div>
              </template>
            </div>
          </template>
        </div>
      </b-collapse>
    </div>
  </div>
</template>

<script>
import { BCollapse, VBToggle } from "bootstrap-vue";
export default {
  name: "SectionDetailsCollapse",
  components: {
    "b-collapse": BCollapse,
  },
  directives: {
    "b-toggle": VBToggle,
  },
  props: {
    compData: {
      type: Object,
      required: true,
    },
    collapseId: {
      type: String,
      required: true,
    },
    bgVariant: {
      type: String,
      default: "light-1",
    },
  },
  computed: {
    backgroundClass() {
      return `bg-${this.bgVariant}`;
    },
  },
  methods: {
    getKeysOfObject(object) {
      return Object.keys(object || {});
    },
  },
};
</script>
<style lang="scss" scoped>
.not-collapsed {
  .collapse-icon {
    rotate: -180deg;
  }
}
.collapse-icon {
  transition: all 0.5s;
  font-size: 16px;
}
@media (min-width: 992px) {
  .collapse-icon {
    font-size: 32px;
  }
}
.collapse-title {
  max-width: 60%;
}
</style>
