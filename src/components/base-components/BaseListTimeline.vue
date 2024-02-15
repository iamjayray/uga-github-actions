<template>
  <ul class="list-unstyled pl-space-lg" data-cy="list-timeline">
    <li
      v-for="(item, index) in items"
      :key="index"
      class="timeline-num position-relative"
      :class="getConnectClass(index)"
    >
      <div class="row">
        <div class="col-12 pl-space-sm mb-space-md mb-lg-space-lg">
          <h3 class="mb-space-xs mb-lg-space-sm" :class="titleClass">
            {{ item.title }}
          </h3>

          <div
            v-for="(text, index) in item.texts"
            :key="index"
            :class="textClass"
          >
            <p v-html="text"></p>
          </div>

          <a
            class="text-underline"
            v-if="item.cta"
            :href="item.cta.link"
            :target="item.cta.target"
            @click="handleCtaClick(item.title, item.cta.label)"
            >{{ item.cta.label }}</a
          >
        </div>
      </div>
    </li>
  </ul>
</template>

<script>
export default {
  name: "ListTimeline",
  props: {
    items: {
      type: Array,
      required: true,
    },
    itemTitleSize: {
      type: String,
      default: "large",
    },
    itemTitleVariant: {
      type: String,
      default: "dark-3",
    },
    itemTextSize: {
      type: String,
      default: "medium",
    },
    itemTextVariant: {
      type: String,
      default: "dark-3",
    },
  },
  computed: {
    titleClass() {
      return `h3-${this.itemTitleSize} text-${this.itemTitleVariant}`;
    },
    textClass() {
      return `text-${this.itemTextSize} text-${this.itemTextVariant}`;
    },
  },
  methods: {
    getConnectClass(currentIndex) {
      return currentIndex !== this.items.length - 1 ? "timeline-connect" : null;
    },
    handleCtaClick(section, text) {
      const event = {
        event: "link",
        action: "click",
        name: "onclick",
        type: "internal link",
        region: "main content",
        section: section.toLowerCase(),
        text: text.toLowerCase(),
      };
      this.$emit("ctaClick", event);
    },
  },
};
</script>

<style lang="scss" scoped>
.timeline-num::before {
  content: " ";
  position: absolute;
  background-color: var(--dark-3);
  border: 7px solid var(--secondary);
  border-radius: 50%;
  height: 30px;
  width: 30px;
  left: -42px;
  top: -4px;
  box-shadow: 0px 0px 2px 4px rgba(255, 198, 39, 0.32);
}

.timeline-connect::after {
  content: "";
  position: absolute;
  border-left-width: 3px;
  border-left-style: solid;
  border-left-color: var(--secondary);
  bottom: 0;
  left: -28px;
  top: 24px;
}
</style>
