<template>
  <b-form ref="formHigSchoolCourses" @submit.prevent="handleSubmitForm">
    <!-- academic year -->
    <b-form-group
      data-cy="my-high-school-grades-course-works-academic-year"
      :id="`${formState}_academic_year`"
      aria-label="Academic year"
      class="mb-space-md"
      label-class="pb-0"
      label-for="add_academic_year"
    >
      <template #label>
        <label :for="`${formState}_add_academic_year`" class="font-weight-bold">
          {{ pageData.addCourse.academicYear.label }}
          <span
            class="ml-space-xs ml-lg-space-sm tool-tip-icon"
            tabindex="0"
            v-b-tooltip.hover="{ customClass: 'mb-space-xxs' }"
            :title="pageData.addCourse.academicYear.toolTip"
          >
            <font-awesome-icon
              icon="fa-sharp fa-solid fa-circle-info"
              size="xl"
              class="fa-icon text-dark-1"
            />
          </span>
        </label>
      </template>
      <base-select
        :id="`${formState}_add_academic_year`"
        :options="formatAcademicYears"
        v-model="$v.academicYear.$model"
        :onErrorMsg="validateAcademicYear"
        placeholderText="Select an academic year"
        :class="formGrid"
        :isDisabled="onlySeniorYear"
      ></base-select>
    </b-form-group>
    <!-- course name -->
    <b-form-group
      data-cy="my-high-school-grades-course-works-course-name"
      :id="`${formState}_course_name_group`"
      aria-label="Course name"
      class="mb-space-md"
      label-class="pb-0"
      label-for="add_course_name"
    >
      <template #label>
        <label :for="`${formState}_course_name`" class="font-weight-bold">
          {{ pageData.addCourse.courseName.label }}
          <span
            class="ml-space-xs ml-lg-space-sm tool-tip-icon"
            tabindex="0"
            v-b-tooltip.hover="{ customClass: 'mb-space-xxs' }"
            :title="pageData.addCourse.courseName.toolTip"
          >
            <font-awesome-icon
              icon="fa-sharp fa-solid fa-circle-info"
              size="xl"
              class="fa-icon text-dark-1"
            />
          </span>
        </label>
      </template>
      <base-select
        :id="`${formState}_course_name`"
        :options="newCourseNames"
        v-model="$v.courseName.$model"
        :onErrorMsg="validateCourseName"
        placeholderText="Select course name"
        :class="formGrid"
      ></base-select>
    </b-form-group>
    <!-- custom course name -->
    <template v-if="iscustomeCourseNameVisible">
      <b-form-group
        data-cy="my-high-school-grades-course-works-custom-course-name"
        :id="`${formState}_custom_course-name`"
        aria-label="Course name"
        class="mb-space-md position-relative"
        label-class="pb-0"
      >
        <template #label>
          <label
            :id="`${formState}_custom_course_name`"
            class="font-weight-bold"
          >
            {{ pageData.addCourse.customCourseName.label }}
          </label>
        </template>
        <b-form-input
          :id="`${formState}_custom_course_name`"
          class="px-space-xs"
          placeholder="Enter the course name"
          v-model.trim="$v.customeCourseName.$model"
          :state="
            $v.customeCourseName.$dirty ? !$v.customeCourseName.$error : null
          "
          :class="formGrid"
        >
        </b-form-input>
        <b-form-invalid-feedback v-if="!$v.customeCourseName.required">
          <font-awesome-icon
            icon="fa-sharp fa-regular fa-circle-exclamation"
            size="xs"
          />
          This is a required field.
        </b-form-invalid-feedback>
        <b-form-invalid-feedback v-if="!$v.customeCourseName.maxLength">
          <font-awesome-icon
            icon="fa-sharp fa-regular fa-circle-exclamation"
            size="xs"
          />
          The course name should not be more than 30 characters.
        </b-form-invalid-feedback>
      </b-form-group>
    </template>
    <!-- Duration -->
    <b-form-group
      data-cy="my-high-school-grades-course-works-duration"
      :id="`${formState}_duration`"
      aria-label="duration"
      class="mb-space-md"
      label-class="pb-0"
      label-for="add_select_duration"
    >
      <template #label>
        <label :for="`${formState}_duration`" class="font-weight-bold">
          {{ pageData.addCourse.duration.label }}
          <span
            class="ml-space-xs ml-lg-space-sm tool-tip-icon"
            tabindex="0"
            v-b-tooltip.hover="{ customClass: 'mb-space-xxs' }"
            :title="pageData.addCourse.duration.toolTip"
          >
            <font-awesome-icon
              icon="fa-sharp fa-solid fa-circle-info"
              size="xl"
              class="fa-icon text-dark-1"
            />
          </span>
        </label>
      </template>
      <base-select
        :id="`${formState}_select_duration`"
        :options="configHighSchoolTermTypes"
        v-model="$v.duration.$model"
        :onErrorMsg="validateDuration"
        placeholderText="Select duration"
        @change="resetGrades"
        :class="formGrid"
      ></base-select>
    </b-form-group>

    <!-- course level -->
    <b-form-group
      data-cy="my-high-school-grades-course-works-course-level"
      :id="`${formState}_course-level`"
      :aria-label="pageData.addCourse.courseLevel.label"
      class="mb-space-md"
      label-class="pb-0"
      label-for="add_course_level"
    >
      <template #label>
        <label :for="`${formState}_course_level`" class="font-weight-bold">
          {{ pageData.addCourse.courseLevel.label }}
          <span
            class="ml-space-xs ml-lg-space-sm tool-tip-icon"
            tabindex="0"
            v-b-tooltip.hover="{ customClass: 'mb-space-xxs' }"
            :title="pageData.addCourse.courseLevel.toolTip"
          >
            <font-awesome-icon
              icon="fa-sharp fa-solid fa-circle-info"
              size="xl"
              class="fa-icon text-dark-1"
            />
          </span>
        </label>
      </template>
      <base-select
        :id="`${formState}_new_course_name`"
        :options="configHighSchoolCourseLevels"
        v-model="$v.courseLevel.$model"
        :onErrorMsg="validateCourseLevel"
        placeholderText="Select course level"
        :class="formGrid"
      ></base-select>
    </b-form-group>

    <!-- grades -->
    <template v-if="duration?.value">
      <div class="grade-fields">
        <label for="grades" class="font-weight-bold">
          {{ pageData.addCourse.grades.label }}
        </label>
      </div>
      <div
        :class="`grid-container__${formState}`"
        :style="`--number-of-cols: ${getGradeType.length};`"
        data-cy="my-high-school-grades-course-works-grade-fields"
      >
        <template v-for="(grade, index) in getGradeType">
          <div
            :key="index"
            :class="formState !== 'edit' ? 'pr-0 pr-md-space-sm' : 'p-0'"
          >
            <b-form-group
              :id="`course-level-${index}`"
              :aria-label="grade.label"
              class="mb-space-md"
              label-class="pb-0"
              label-for="add_course_level"
            >
              <template #label>
                <label
                  :for="`grades-${index}`"
                  class="text-small mt-space-sm font-weight-bold"
                >
                  {{ grade.label }}
                </label>
              </template>
              <base-select
                :id="`grades-update-${index}`"
                :options="getGradingOptions"
                v-model="$v.grades[getDurationType][grade.fieldId].$model"
                :onErrorMsg="handleValidateGrades(grade.fieldId)"
                :placeholderText="`Select ${grade.label}`"
                class="position-relative"
              ></base-select>
            </b-form-group>
          </div>
        </template>
      </div>
    </template>
    <div
      class="form-actions mt-space-sm mb-space-lg"
      data-cy="my-high-school-grades-new-courses-button-submit"
    >
      <button type="submit" class="btn btn-dark-3">{{ btnTitle }}</button>
    </div>
  </b-form>
</template>

<script>
import { validationMixin } from "vuelidate";
import { required, requiredIf, maxLength } from "vuelidate/lib/validators";
import {
  BFormGroup,
  BForm,
  BFormInput,
  BFormInvalidFeedback,
} from "bootstrap-vue";
import BaseSelect from "@/components/base-components/BaseSelect.vue";
import { mapState } from "pinia";
import { useConfigStore } from "@/stores/config-store.js";
import { MyHighSchoolConstants } from "@/content/enum-ug-application.js";
import * as _ from "lodash";

export default {
  name: "SectionNewCourses",
  mixins: [validationMixin],
  components: {
    "base-select": BaseSelect,
    "b-form-group": BFormGroup,
    "b-form": BForm,
    "b-form-input": BFormInput,
    "b-form-invalid-feedback": BFormInvalidFeedback,
  },
  validations: {
    academicYear: {
      required,
    },
    courseName: {
      required,
    },
    customeCourseName: {
      required: requiredIf(function () {
        return this.iscustomeCourseNameVisible;
      }),
      maxLength: maxLength(30),
    },
    duration: {
      required,
    },
    courseLevel: {
      required,
    },
    grades: {
      fullYear: {
        yearGrade: {
          required: requiredIf(function () {
            return (
              this.duration?.text === MyHighSchoolConstants.duration.fullYear
            );
          }),
        },
      },
      quarterly: {
        "1stQuarterGrade": {
          required: requiredIf(function () {
            return (
              this.duration?.text === MyHighSchoolConstants.duration.quarterly
            );
          }),
        },
        "2ndQuarterGrade": {
          required: requiredIf(function () {
            return (
              this.duration?.text === MyHighSchoolConstants.duration.quarterly
            );
          }),
        },
        "3rdQuarterGrade": {
          required: requiredIf(function () {
            return (
              this.duration?.text === MyHighSchoolConstants.duration.quarterly
            );
          }),
        },
        "4thQuarterGrade": {
          required: requiredIf(function () {
            return (
              this.duration?.text === MyHighSchoolConstants.duration.quarterly
            );
          }),
        },
      },
      trimester: {
        "1stTrimesterGrade": {
          required: requiredIf(function () {
            return (
              this.duration?.text === MyHighSchoolConstants.duration.trimester
            );
          }),
        },
        "2ndTrimesterGrade": {
          required: requiredIf(function () {
            return (
              this.duration?.text === MyHighSchoolConstants.duration.trimester
            );
          }),
        },
        "3rdTrimesterGrade": {
          required: requiredIf(function () {
            return (
              this.duration?.text === MyHighSchoolConstants.duration.trimester
            );
          }),
        },
      },
      semester: {
        "1stSemesterGrade": {
          required: requiredIf(function () {
            return (
              this.duration?.text === MyHighSchoolConstants.duration.semister
            );
          }),
        },
        "2ndSemesterGrade": {
          required: requiredIf(function () {
            return (
              this.duration?.text === MyHighSchoolConstants.duration.semister
            );
          }),
        },
      },
    },
  },
  data() {
    return {
      academicYear: null,
      courseName: null,
      customeCourseName: null,
      duration: null,
      courseLevel: null,
      gradingSystemOption: null,
      grades: {},
    };
  },

  computed: {
    ...mapState(useConfigStore, {
      configHighSchoolAcademicYears: "highSchoolAcademicYears",
      configHighSchoolCourses: "highSchoolCourses",
      configHighSchoolTermTypes: "highSchoolTermTypes",
      configHighSchoolCourseLevels: "highSchoolCourseLevels",
      configHighSchoolGrades: "highSchoolGrades",
    }),
    formatAcademicYears() {
      if (this.isNonResident) {
        return this.configHighSchoolAcademicYears.filter(
          (year) => year.text === MyHighSchoolConstants.seniorAcadYear
        );
      }
      return this.configHighSchoolAcademicYears;
    },
    iscustomeCourseNameVisible() {
      return MyHighSchoolConstants.courseNameOther.includes(
        this.courseName?.text
      );
    },
    getDurationType() {
      return _.camelCase(this.duration.text);
    },
    // validation errors
    validateAcademicYear() {
      const messages = [];
      const { $dirty, required } = this.$v.academicYear;
      if ($dirty && !required) {
        messages.push("Academic year is required");
      }
      return messages;
    },
    validateCourseName() {
      const messages = [];
      const { $dirty, required } = this.$v.courseName;
      if ($dirty && !required) {
        messages.push("Course name is required");
      }
      return messages;
    },
    validateDuration() {
      const messages = [];
      const { $dirty, required } = this.$v.duration;
      if ($dirty && !required) {
        messages.push("Duration is required");
      }
      return messages;
    },
    validateCourseLevel() {
      const messages = [];
      const { $dirty, required } = this.$v.courseLevel;
      if ($dirty && !required) {
        messages.push("Course level is required");
      }
      return messages;
    },
    calculateGridSize() {
      const DEFAULT_GRID_SIZE = 3;
      // If we have 1 field then we need to set the grid size to 3
      return this.duration?.gradeFields?.length === 1
        ? DEFAULT_GRID_SIZE
        : this.duration?.gradeFields?.length;
    },
    getGradeType() {
      const data = this.pageData.addCourse.grades.type.filter(
        (type) => type.text === this.duration.text
      );
      if (data.length > 0) {
        return data[0].gradeFields;
      } else {
        return [];
      }
    },
    getGradingOptions() {
      const gpaScaleTypeId =
        this.gradingSystemOption ===
        MyHighSchoolConstants.gradeSystemHunderedPonts
          ? 2
          : 1;
      return this.configHighSchoolGrades.filter(
        (item) => item.gpaScaleTypeId === gpaScaleTypeId
      );
    },
    formGrid() {
      if (this.updateHighSchoolCourse) {
        return `col-12 px-0`;
      }
      return "col-lg-5 px-0 col-12";
    },
    newCourseNames() {
      return this.configHighSchoolCourses.filter(
        (course) => course.subjectId === this.subject
      );
    },
  },
  methods: {
    handleValidateGrades(gradeId) {
      const messages = [];
      const { $dirty, required } =
        this.$v.grades[this.getDurationType][gradeId];
      if ($dirty && !required) {
        messages.push("Grade is required");
      }
      return messages;
    },
    resetGrades() {
      this.grades = {
        fullYear: {
          yearGrade: null,
        },
        quarterly: {
          "1stQuarterGrade": null,
          "2ndQuarterGrade": null,
          "3rdQuarterGrade": null,
          "4thQuarterGrade": null,
        },
        trimester: {
          "1stTrimesterGrade": null,
          "2ndTrimesterGrade": null,
          "3rdTrimesterGrade": null,
        },
        semester: {
          "1stSemesterGrade": null,
          "2ndSemesterGrade": null,
        },
      };
    },
    handleSubmitForm() {
      this.$v.$touch();
      this.$track({
        event: "form",
        action: "click",
        name: "onclick",
        type: "click",
        region: "main content",
        section: "add a course",
        text: "save course",
        component: "my high school grades",
      });
      if (this.$v.$anyError) {
        return;
      }
      const courseDetails = {
        academicYear: this.academicYear,
        courseName: this.courseName,
        customeCourseName: this.customeCourseName,
        duration: this.duration,
        courseLevel: this.courseLevel,
        grades: this.grades[this.getDurationType],
        type: MyHighSchoolConstants.typeNew,
      };
      if (this.updateHighSchoolCourse) {
        courseDetails.id = this.updateHighSchoolCourse.id;
        courseDetails["subject"] = this.updateHighSchoolCourse["subject"];
        courseDetails["gradingSystemOption"] =
          this.updateHighSchoolCourse["gradingSystemOption"];
        if (this.updateHighSchoolCourse.highSchoolCourseworkId) {
          courseDetails["highSchoolCourseworkId"] =
            this.updateHighSchoolCourse.highSchoolCourseworkId;
          courseDetails["type"] = MyHighSchoolConstants.typeUpdate;
        }
        this.$emit("update-course", courseDetails);
      } else {
        courseDetails.id = Math.random().toString(36).slice(2);
        courseDetails["gradingSystemOption"] = this.gradingSystem;
        this.$emit("add-new-course", courseDetails);
      }
      // reset form
      this.resetForm();
    },
    resetForm() {
      if (this.onlySeniorYear) {
        this.updateAcademicYearToSeniorYear();
      } else {
        this.academicYear = null;
      }
      this.courseName = null;
      this.customeCourseName = null;
      this.duration = null;
      this.courseLevel = null;
      this.gradingSystemOption = this.gradingSystem;
      this.$v.$reset();
      this.resetGrades();
    },
    updateAcademicYearToSeniorYear() {
      const seniorYear = this.configHighSchoolAcademicYears.filter(
        (item) => item.text === MyHighSchoolConstants.seniorAcadYear
      );
      this.academicYear = seniorYear.length > 0 ? seniorYear[0] : null;
    },
  },
  created() {
    if (this.formState === "edit") {
      if (this.onlySeniorYear) {
        this.updateAcademicYearToSeniorYear();
      } else {
        this.academicYear = this.updateHighSchoolCourse.academicYear;
      }
      this.courseName = this.updateHighSchoolCourse.courseName;
      this.customeCourseName = this.updateHighSchoolCourse.customeCourseName;
      this.duration = this.updateHighSchoolCourse.duration;
      this.courseLevel = this.updateHighSchoolCourse.courseLevel;
      this.gradingSystemOption =
        this.updateHighSchoolCourse.gradingSystemOption;
      this.grades[this.getDurationType] = this.updateHighSchoolCourse.grades;
    } else {
      this.gradingSystemOption = this.gradingSystem;
    }
  },
  props: {
    btnTitle: {
      type: String,
      required: true,
    },
    isResident: {
      type: Boolean,
      required: false,
    },
    isNonResident: {
      type: Boolean,
      required: false,
    },
    pageData: {
      type: Object,
      required: true,
    },
    gradingSystem: {
      type: String,
      required: false,
      default: "",
    },
    formState: {
      type: String,
      required: false,
      default: "new",
    },
    updateHighSchoolCourse: {
      type: Object,
      required: false,
      default: null,
    },
    subject: {
      type: String,
      required: false,
      default: "",
    },
    onlySeniorYear: {
      type: Boolean,
      default: false,
    },
  },
  watch: {
    // resetting the form when the subject tab is changed
    subject() {
      // reset form
      this.resetForm();
    },
    gradingSystem(newValue) {
      this.gradingSystemOption = newValue;
      this.resetGrades();
    },
  },
  mounted() {
    if (this.onlySeniorYear) {
      this.updateAcademicYearToSeniorYear();
    }
  },
};
</script>

<style lang="scss" scoped>
// The new modifier class here refers to the new course form derived from the data prop formState
.grid-container__new {
  display: grid;
  @media screen and (min-width: 768px) {
    grid-template-columns: calc(100% / var(--number-of-cols)) repeat(
        auto-fit,
        minmax(0, 1fr)
      );
    grid-gap: 10px;
  }
}
</style>
