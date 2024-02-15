<template>
  <!-- emits date stamp with year and month selected as the first day of the month -->
  <!-- sets the month and year from the v-model -->
  <div class="col-12 mt-space-sm" data-cy="ug-app-month-year-select">
    <b-form-group>
      <template #label>
        <label class="mb-lg-space-xxs font-weight-bold">
          <span class="my-auto"> {{ label || content.label }}</span>
        </label>
      </template>
      <div class="row">
        <!-- select month -->
        <div class="col-lg-5 col-12 pr-lg-0 mr-lg-gutter">
          <b-form-group
            data-cy="group-month"
            :id="`group-${id}-month`"
            :aria-label="`select ${content.month.label}`"
            class="mb-space-md"
            label-class="pb-0"
            label-for="select-month"
          >
            <base-select
              :id="`select-month-${id}`"
              :options="monthOptions"
              v-model="form.month"
              :onErrorMsg="onErrorMsg"
              :placeholderText="content.month.placeholder"
              class="position-relative"
            ></base-select>
          </b-form-group>
        </div>
        <!-- select year -->
        <div class="col-lg-5 col-12 pl-lg-0 ml-lg-gutter">
          <b-form-group
            data-cy="group-year"
            :id="`group-${id}-year`"
            :aria-label="`select ${content.year.label}`"
            class="mb-space-md"
            label-class="pb-0"
            label-for="select-year"
          >
            <base-select
              :id="`select-year-${id}`"
              :options="yearOptions"
              v-model="form.year"
              :placeholderText="content.year.placeholder"
              :onErrorMsg="onErrorMsg"
              class="position-relative"
            ></base-select>
          </b-form-group>
        </div>
      </div>
    </b-form-group>
  </div>
</template>

<script>
import BaseSelect from "@/components/base-components/BaseSelect.vue";
import MonthOptions from "@/content/months.json";
import { BFormGroup } from "bootstrap-vue";
export default {
  name: "BaseDateDateSelect",
  components: {
    BaseSelect,
    BFormGroup,
  },
  data() {
    return {
      form: {
        month: null,
        year: null,
      },
    };
  },
  props: {
    label: {
      type: String,
      default: null,
    },
    value: {
      type: String,
      default: null,
    },
    content: {
      type: Object,
      required: true,
    },
    id: {
      type: String,
      required: true,
    },
    onErrorMsg: {
      type: Array,
      default: () => [],
    },
  },
  watch: {
    form: {
      handler: function (val) {
        if (val.month && val.year) {
          const date = `${val.year.value}-${val.month.value}`;
          this.$emit("input", date);
        }
      },
      deep: true,
    },
  },
  created() {
    if (this.value) {
      const date = this.formatDate(this.value);
      this.form.month = date.month;
      this.form.year = date.year;
    }
  },
  methods: {
    formatDate(_date) {
      const date = {
        month: null,
        year: null,
      };
      const dateObj = _date.split("-");
      date.month = this.monthOptions.find(
        (month) => month.monthIndex === Number(dateObj[1] - 1)
      );
      date.year = this.yearOptions.find(
        (year) => year.value === Number(dateObj[0])
      );
      return date;
    },
  },
  computed: {
    monthOptions() {
      return MonthOptions.sort((a, b) =>
        a.order > b.order ? 1 : b.order > a.order ? -1 : 0
      );
    },
    yearOptions() {
      const currentDate = new Date();
      const dateCopy = new Date(currentDate);
      dateCopy.setFullYear(currentDate.getFullYear() - 100);

      var options = [];
      for (
        var i = dateCopy.getFullYear();
        i <= currentDate.getFullYear();
        i++
      ) {
        options.push({ text: `${i}`, value: i });
      }
      return options.sort((a, b) =>
        a.value > b.value ? -1 : b.value > a.value ? 1 : 0
      );
    },
  },
};
</script>

<style scoped></style>
