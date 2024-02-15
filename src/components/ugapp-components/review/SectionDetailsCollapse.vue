<template>
  <div
    class="border border-light-4 light-1"
    data-cy="review-section-details-collapse"
  >
    <div class="p-space-xs p-lg-space-md">
      <div class="d-flex flex-wrap">
        <a
          :href="`#${collapseId}`"
          class="text-decoration-none text-dark-3 mb-space-xxs mb-sm-0"
          v-b-toggle
          @click.prevent
        >
          <h2
            class="collapse-title h2-medium mr-space-sm mr-lg-space-md my-auto"
          >
            {{ compData.title }}
          </h2>
        </a>
        <span
          data-cy="incomplete-error-message"
          v-if="validationErrors.length > 0"
          class="danger-button badge badge-pill text-xs py-space-xxxs px-space-xxs px-lg-space-xs py-lg-space-xxs my-auto mr-space-xs"
        >
          <font-awesome-icon :icon="['fasr', 'circle-exclamation']" />
          Incomplete
        </span>
        <button
          data-cy="review-section-details-collapse-edit-button"
          v-if="showEditButton"
          class="btn btn-dark-1 text-xs py-space-xxxs px-space-xxs px-lg-space-xs py-lg-space-xxs my-auto mr-space-xs"
          @click="handleEditClick(compData.editCtaLink)"
        >
          <font-awesome-icon icon="fa-pencil" size="xs"></font-awesome-icon>
          Edit
        </button>

        <div class="ml-auto my-auto">
          <a
            data-cy="review-section-details-collapse-button-toggle"
            :href="`#${collapseId}`"
            class="text-decoration-none text-dark-3"
            v-b-toggle
            @click.prevent
            aria-label="open and close collapse"
          >
            <font-awesome-icon
              class="collapse-icon"
              icon="fa-chevron-down"
            ></font-awesome-icon
          ></a>
        </div>
      </div>
      <!-- Collapse contents -->
      <b-collapse
        :id="collapseId"
        @shown="handleCollapseShown"
        @hidden="handleCollapseHidden"
      >
        <div class="mt-space-sm">
          <template v-for="(key, index) in getKeysOfObject(compData.data)">
            <div
              :key="`${key}`"
              class="text-small font-weight-bold py-space-xxs my-space-xxxs border-bottom"
              data-cy="review-section-details-collapse-contents"
            >
              <template v-for="(item, i) in compData.data[key]">
                <div
                  :data-cy="`review-section-details-collapse-item-${item?.text}-${index}-${i}`"
                  :key="`${key}-${item?.text}`"
                  class="row w-100 text-small font-weight-bold px-0 ml-0 mb-space-xxs"
                >
                  <p
                    class="col-6 pl-0 pr-gutter mb-0"
                    :class="
                      item?.type === 'title' ? 'text-primary mt-space-xxs' : ''
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
    validationErrors: {
      type: Array,
      default: () => [],
    },
    bgVariant: {
      type: String,
      default: "light-1",
    },
    showEditButton: {
      type: Boolean,
      default: true,
    },
  },
  methods: {
    getKeysOfObject(object) {
      return Object.keys(object || {});
    },
    handleEditClick() {
      this.$track({
        event: "link",
        action: "click",
        name: "onclick",
        type: "internal link",
        region: "main content",
        section: this.compData.title.toLowerCase(),
        text: "edit",
        component: "certify your application",
      });
      this.$emit("editClicked", this.compData.editCtaLink);
    },
    handleCollapseShown() {
      this.$track({
        event: "collapse",
        action: "open",
        name: "onclick",
        type: "click",
        region: "main content",
        section: "certify your application",
        text: this.compData.title.toLowerCase(),
      });
    },
    handleCollapseHidden() {
      this.$track({
        event: "collapse",
        action: "close",
        name: "onclick",
        type: "click",
        region: "main content",
        section: "certify your application",
        text: this.compData.title.toLowerCase(),
      });
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
.has-errors {
  border: 1px solid var(--danger);
  border-bottom: 5px solid var(--danger) !important;
  box-shadow: 0 0 0 1px var(--danger);
  .collapse-title {
    color: var(--danger);
  }
}
</style>
