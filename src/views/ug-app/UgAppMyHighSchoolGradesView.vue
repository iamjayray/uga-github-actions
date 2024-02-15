<template>
  <main id="main-content" data-cy="my-high-school-grades-view">
    <div class="bg-light-1 px-space-xxs pt-space-sm">
      <div
        class="my-highschool-grades container bg-white pt-space-md pb-space-xxl px-space-sm p-lg-space-xl min-vh-100"
      >
        <!-- page heading and eta -->
        <section
          id="page_title"
          data-cy="my-high-school-grades-page-heading-and-eta"
        >
          <div class="row">
            <div class="col-12">
              <h1 class="h1-medium">
                <span class="bg-secondary">{{ pageData.title }}</span>
              </h1>
              <div class="eta pt-space-xxs">
                <p
                  class="text-dark-1 m-0"
                  v-if="isEligibleToFillDetails || isFutureGraduate"
                >
                  <font-awesome-icon
                    icon="fa-sharp fa-solid fa-clock"
                    size="xs"
                  />
                  <span v-html="pageData.eta"></span>
                </p>
                <!-- SKIP message for non resident -->
                <base-alert
                  v-else
                  data-cy="my-high-school-grades-skip-alert-message"
                  alert-type="success"
                  :text="pageData.nonResidentMessage"
                  textWeight="normal"
                  iconVariant="success"
                  :isDismissible="false"
                  class="mt-space-sm mb-0"
                ></base-alert>
              </div>
            </div>
          </div>
        </section>
        <hr class="my-space-lg" />

        <!-- intro and card selections -->
        <section
          data-cy="my-high-school-grades-intro-and-card-selections"
          v-if="isEligibleToFillDetails && !isFutureGraduate"
          id="intro_card_options"
        >
          <div class="row">
            <div class="col-12">
              <div v-html="pageData.intro.text" class="mt-space-sm"></div>
            </div>
            <div class="col-12">
              <b-form-group
                data-cy="my-high-school-grades-admission-type"
                id="admission-type"
                :aria-label="pageData.intro.gradeReporting.helpText"
                class="mb-space-md"
              >
                <template #label>
                  <label
                    for="radio-self-reporting"
                    class="font-weight-bold text-large"
                  >
                    {{ pageData.intro.gradeReporting.label }}
                  </label>
                  <p class="small">
                    {{ pageData.intro.gradeReporting.helpText }}
                  </p>
                </template>
                <div class="radio-card-group row">
                  <template
                    v-for="item in pageData.intro.gradeReporting.options"
                  >
                    <div class="col-lg-6 col-12 mb-space-sm" :key="item.text">
                      <base-radio-card
                        :option="item.option"
                        name="base-radio-card"
                        v-model="$v.form.gradePath.$model"
                        @change="handleGradedPathOptionChange"
                        :onErrorMsg="validateGradedPathOption"
                        class="h-100"
                      >
                        <template #body>
                          <div class="p-space-md">
                            <img
                              :src="images[item.card.icon]"
                              :alt="item.card.title"
                              class="mb-space-xs mb-lg-space-sm"
                              height="48px"
                            />
                            <h3 class="h3-large mb-space-sm mb-md-space-md">
                              {{ item.card.title }}
                            </h3>
                            <p>{{ item.card.text }}</p>

                            <ul class="text-muted pl-space-sm">
                              <li v-for="(item, i) in item.card.list" :key="i">
                                {{ item }}
                              </li>
                            </ul>
                          </div>
                        </template>
                      </base-radio-card>
                    </div>
                  </template>
                </div>
              </b-form-group>
            </div>
            <!-- alert -->
            <div
              v-if="isInputsVisible"
              class="col-12 bg-light-1 px-lg-space-sm py-space-xs rounded"
              data-cy="my-high-school-grades-alert"
            >
              <div class="d-flex align-items-center text-dark-2">
                <div class="text-center">
                  <font-awesome-icon
                    icon="fa-sharp fa-solid fa-info-circle"
                    size="xl"
                  />
                </div>
                <div class="ml-space-xs ml-lg-space-sm">
                  <h3 class="h3-small">Transcripts required later</h3>
                  <p class="mt-space-xxs mb-0">
                    You’ll still need to submit official transcripts later even
                    if you enter your high school grades now.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <template v-if="isInputsVisible">
          <!-- Future dated intro  with grading system input-->
          <section
            v-if="isFutureGraduate"
            data-cy="my-high-school-grades-future-dated-intro-with-grading-system-input"
          >
            <div>
              <h3 class="h3-large d-flex mb-space-sm">
                <span class="my-auto">
                  {{ pageData.futureHighSchoolDateIntro.title }}</span
                >
                <span
                  class="ml-space-xs ml-lg-space-sm tool-tip-icon"
                  tabindex="0"
                  v-b-tooltip.hover="{ customClass: 'mb-space-xxs' }"
                  :title="pageData.futureHighSchoolDateIntro.tooltip"
                >
                  <font-awesome-icon
                    icon="fa-sharp fa-solid fa-circle-info"
                    size="xl"
                    class="fa-icon text-dark-1"
                  />
                </span>
              </h3>
              <div
                class="px-space-sm py-space-xs d-flex text-dark-2 bg-light-1 col-12 col-lg-10"
              >
                <font-awesome-icon
                  icon="fa-solid fa-circle-info"
                  size="xl"
                  class="my-auto mr-space-sm text-dark-2"
                />
                <div>
                  <h3 class="h3-small mb-space-xxs pb-space-xxxs">
                    {{ pageData.futureHighSchoolDateIntro.alert.title }}
                  </h3>
                  <p class="text-small mb-0">
                    {{ pageData.futureHighSchoolDateIntro.alert.text }}
                  </p>
                </div>
              </div>
            </div>
          </section>
          <!-- overall academics -->
          <section
            data-cy="my-high-school-grades-overall-academics"
            v-if="isEligibleToFillDetails || isFutureGraduate"
            id="overall_academics"
            class="pt-space-lg"
            ref="overall_academics"
          >
            <div class="row">
              <div class="col-12">
                <h2 class="h2-small">
                  {{ pageData.overallAcademics.title }}
                </h2>
              </div>
              <div class="col-12 pt-space-sm">
                <!-- unweightedGpa -->
                <b-form-group
                  data-cy="my-high-school-grades-overall-academics-unweighted-gpa"
                  id="group-unweighted-gpa"
                  :aria-label="`Enter ${pageData.overallAcademics.title}`"
                  class="mb-space-md position-relative"
                  label-class="pb-0"
                >
                  <template #label>
                    <label for="unweighted_gpa" class="font-weight-bold">
                      {{ pageData.overallAcademics.unweightedGpa.label }}
                      <span
                        class="ml-space-xs ml-lg-space-sm tool-tip-icon"
                        tabindex="0"
                        v-b-tooltip.hover="{ customClass: 'mb-space-xxs' }"
                        :title="pageData.overallAcademics.unweightedGpa.toolTip"
                      >
                        <font-awesome-icon
                          icon="fa-sharp fa-solid fa-circle-info"
                          size="xl"
                          class="fa-icon text-dark-1"
                        />
                      </span>
                    </label>
                  </template>
                  <b-form-input
                    placeholder="0.00"
                    v-model.trim="$v.form.overallAcademics.unweightedGpa.$model"
                    class="col-lg-2 col-10"
                    :state="validateUnweightedGpa.state"
                  >
                  </b-form-input>
                  <b-form-invalid-feedback
                    v-if="validateUnweightedGpa.isRequired"
                  >
                    This is a required field
                  </b-form-invalid-feedback>
                  <b-form-invalid-feedback
                    v-else-if="validateUnweightedGpa.isMaxLength"
                  >
                    GPA should not be more that 6 characters.
                  </b-form-invalid-feedback>
                  <b-form-invalid-feedback
                    v-else-if="validateUnweightedGpa.isNumeric"
                  >
                    GPA should be a whole number or decimal number.
                  </b-form-invalid-feedback>
                </b-form-group>
                <!-- gpaScale -->
                <b-form-group
                  data-cy="my-high-school-grades-overall-academics-gpa-scale"
                  id="group-gpa-scale"
                  aria-label="Select GPA scale"
                  class="mb-space-md"
                  label-class="pb-0"
                  label-for="gpa_scale"
                >
                  <template #label>
                    <label for="unweighted_gpa" class="font-weight-bold">
                      {{ pageData.overallAcademics.gpaScale.label }}
                    </label>
                  </template>
                  <base-select
                    :options="configHighSchoolGpaScales"
                    v-model="$v.form.overallAcademics.gpaScale.$model"
                    :onErrorMsg="validateGpaScale"
                    placeholderText="Select scale"
                    class="col-lg-4 px-0 col-10"
                    @select="handleGpaScalesSelect"
                  ></base-select>
                </b-form-group>
                <!-- class rank or size -->
                <b-form-group
                  data-cy="my-high-school-grades-overall-academics-class-rank-size"
                  id="group-class-rank-size"
                  aria-label="Enter class rank and size"
                  class="mb-space-md"
                  label-class="pb-0"
                >
                  <template #label>
                    <label id="class_rank_size" class="font-weight-bold d-flex">
                      <span class="my-auto">
                        {{ pageData.overallAcademics.classRankSize.label }}
                      </span>
                      <span
                        class="my-auto ml-space-xxs ml-lg-space-sm bg-light-3 text-xs px-space-xxs py-lg-space-xxxs"
                      >
                        Optional
                      </span>
                    </label>
                  </template>
                  <div class="d-flex">
                    <div
                      class="rank-wrapper col-lg-2 col-5 p-0 position-relative"
                      id="class_rank"
                    >
                      <b-form-input
                        placeholder="000"
                        :aria-label="
                          pageData.overallAcademics.classRankSize.rankLabel
                        "
                        v-model.trim="
                          $v.form.overallAcademics.classRankSize.rank.$model
                        "
                        :state="validateClassRank.state"
                      >
                      </b-form-input>
                      <b-form-invalid-feedback
                        v-if="validateClassRank.isRequired"
                      >
                        This is required
                      </b-form-invalid-feedback>
                      <b-form-invalid-feedback
                        v-else-if="validateClassRank.isMaxLength"
                      >
                        Should not contain more than 4 characters.
                      </b-form-invalid-feedback>
                      <b-form-invalid-feedback
                        v-else-if="validateClassRank.isNumeric"
                      >
                        This should contain only numbers.
                      </b-form-invalid-feedback>
                      <b-form-invalid-feedback
                        v-else-if="validateClassRank.isMinValue"
                      >
                        Should contain minimum value 1.
                      </b-form-invalid-feedback>
                    </div>
                    <div class="col-1 mx-space-xs px-0">
                      <div class="h-100 vertical-line mx-auto bg-dark-1"></div>
                    </div>
                    <div
                      class="class-wrapper col-lg-2 col-5 p-0 position-relative"
                      id="class_size"
                    >
                      <b-form-input
                        placeholder="000"
                        :aria-label="
                          pageData.overallAcademics.classRankSize.sizeLabel
                        "
                        v-model.trim="
                          $v.form.overallAcademics.classRankSize.size.$model
                        "
                        :state="validateClassSize.state"
                      >
                      </b-form-input>
                      <b-form-invalid-feedback
                        v-if="validateClassSize.isRequired"
                      >
                        This is required
                      </b-form-invalid-feedback>
                      <b-form-invalid-feedback
                        v-else-if="validateClassSize.isMaxLength"
                      >
                        Should not contain more than 4 characters.
                      </b-form-invalid-feedback>
                      <b-form-invalid-feedback
                        v-else-if="validateClassSize.isNumeric"
                      >
                        This should contain only numbers.
                      </b-form-invalid-feedback>
                      <b-form-invalid-feedback
                        v-else-if="validateClassSize.minValue"
                      >
                        Enter valid Class size.
                      </b-form-invalid-feedback>
                    </div>
                  </div>
                </b-form-group>
                <!-- grading system -->
                <b-form-group
                  data-cy="my-high-school-grades-overall-academics-grading-system"
                  id="grading-system"
                  :aria-label="`Select GPA scale ${pageData.overallAcademics.gpaScale.label}`"
                  class="mb-space-md"
                  label-class="pb-0"
                  label-for="grading_system_select"
                >
                  <template #label>
                    <label for="grading_system_select" class="font-weight-bold">
                      {{ pageData.overallAcademics.gradingSystem.label }}
                    </label>
                  </template>
                  <base-select
                    id="grading_system_select"
                    :options="configHighSchoolGradeScaleTypes"
                    v-model="$v.form.overallAcademics.gradingSystem.$model"
                    :onErrorMsg="validateGradingSystem"
                    placeholderText="A - F or 100 point based"
                    class="col-lg-4 px-0 col-10"
                    @select="handleGradingSystemSelect"
                  ></base-select>
                </b-form-group>
              </div>
            </div>
            <hr v-if="isEligibleToFillDetails" class="my-space-lg" />
          </section>
          <template v-if="isCourseWorkSectionVisible">
            <div
              v-if="!isEligibleToFillDetails && isFutureGraduate"
              data-cy="my-high-school-grades-future-high-school-date-intro-sub-texts"
            >
              <template
                v-for="text in pageData.futureHighSchoolDateIntro.subTexts"
              >
                <p :key="text" class="mb-space-xxs">{{ text }}</p>
              </template>
            </div>
            <!-- Tabs -->
            <section
              id="required_highschool_grades"
              data-cy="my-high-school-grades-course-works-tabs"
            >
              <template v-if="isEligibleToFillDetails">
                <label class="text-large font-weight-bold">
                  {{ pageData.highSchoolCourses.label }}
                  <span
                    class="ml-space-xs ml-lg-space-sm tool-tip-icon"
                    tabindex="0"
                    v-b-tooltip.hover="{ customClass: 'mb-space-xxs' }"
                    :title="pageData.highSchoolCourses.toolTip"
                  >
                    <font-awesome-icon
                      icon="fa-sharp fa-solid fa-circle-info"
                      size="xl"
                      class="fa-icon text-dark-1"
                    />
                  </span>
                </label>
                <p
                  class="small"
                  v-for="(text, i) in pageData.highSchoolCourses.helperText"
                  :key="i"
                >
                  {{ text }}
                </p>
              </template>
              <template v-if="hasFutureGraduateError || hasMinCourseWorkError">
                <base-alert
                  data-cy="my-high-school-grades-course-works-error-alert"
                  class="mb-space-sm mb-lg-space-md is-invalid"
                  :isDismissible="false"
                  alert-type="error"
                  textWeight="normal"
                  textSize="small"
                  :text="
                    hasFutureGraduateError
                      ? pageData.highSchoolCourses.seniorYearCourseErrorText
                      : pageData.highSchoolCourses.minCourseErrorText
                  "
                ></base-alert>
              </template>
              <!-- Tabs -->
              <b-tabs
                content-class="mt-3"
                active-nav-item-class="tab-active"
                active-tab-class="active-tab-class"
                @activate-tab="handleTabChange"
                nav-class="nav-class-custom"
                nav-wrapper-class="app-tab position-relative "
              >
                <template #tabs-start>
                  <div class="tab-overlay tab-overlay--left"></div>
                </template>
                <b-tab
                  lazy
                  v-for="(subject, i) in configHighSchoolCourseSubjects"
                  :title-link-class="[
                    isSubjectCompleted(subject.id)
                      ? 'completed-tab tab-title-link-class'
                      : 'tab-title-link-class',
                  ]"
                  :key="i"
                >
                  <template #title>
                    {{ subject.subjectName }}
                    <font-awesome-icon
                      v-if="isSubjectCompleted(subject.id)"
                      class="completed-icon text-success"
                      icon="fa-check-circle"
                      aria-label="menu icon"
                    ></font-awesome-icon>
                  </template>
                  <div
                    v-if="isEligibleToFillDetails"
                    class="mt-space-sm col-lg-8 col-12 text-dark-1 text-xs"
                    v-html="pageData.highSchoolCourses.subjects[i].description"
                  ></div>
                </b-tab>
                <template #tabs-end>
                  <div class="tab-overlay tab-overlay--right"></div>
                </template>
              </b-tabs>
              <div class="position-relative">
                <div
                  class="table-wrapper mt-space-lg mb-space-sm pl-gutter table-responsive-sm position-relative"
                  data-cy="my-high-school-grades-course-work-table"
                >
                  <table class="table" v-if="activeSubjectCourses.length > 0">
                    <thead>
                      <tr>
                        <th scope="col" class="border-top-0">
                          Subject and courses
                        </th>
                        <th scope="col" colspan="2" class="border-top-0">
                          Grades
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="(subject, i) in activeSubjectCourses" :key="i">
                        <td class="text-wrap text-break">
                          {{
                            !MyHighSchoolConstants.courseNameOther.includes(
                              subject.courseName.text
                            )
                              ? subject.courseName.text
                              : subject.customeCourseName
                          }}
                        </td>
                        <td>
                          {{ displayGrades(subject.grades) }}
                        </td>
                        <td>
                          <button
                            data-cy="my-high-school-grades-course-work-edit"
                            class="edit-underline btn btn-link p-0 mx-space-xs my-space-xxs rounded-0"
                            @click="editItem(subject.id)"
                            v-b-tooltip.hover
                            title="Edit"
                          >
                            <font-awesome-icon
                              icon="fa-solid fa-pencil"
                              size="xs"
                            />
                            <span class="ml-space-xxs">Edit</span>
                          </button>
                          <button
                            data-cy="my-high-school-grades-course-work-delete"
                            class="btn btn-link course-work-delete-btn position-relative"
                            @click="deleteAnItem(subject.id)"
                            v-b-tooltip.hover
                            title="Delete"
                          >
                            <font-awesome-icon
                              class="text-dark-3"
                              icon="fa-circle-xmark"
                            />
                          </button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div class="table-wrapper-overlay"></div>
              </div>
            </section>
            <!-- Course inputs -->
            <!-- Add a course -->
            <template v-if="isCourseInputsVisible">
              <h2 class="h2-small pb-space-sm pl-gutter">
                {{ pageData.addCourse.title }}
              </h2>
              <section
                id="add_new_courses"
                class="pl-gutter"
                data-cy="my-high-school-grades-add-new-courses"
              >
                <transition name="fade">
                  <section-new-courses
                    :key="activeSubjectTab"
                    btnTitle="Save course"
                    :pageData="pageData"
                    @add-new-course="handleAddNewCourse"
                    :gradingSystem="form.overallAcademics.gradingSystem?.value"
                    :subject="activeSubjectTab"
                    :onlySeniorYear="
                      !isEligibleToFillDetails && isFutureGraduate
                    "
                  ></section-new-courses>
                </transition>
              </section>
            </template>
          </template>
        </template>
        <!-- Modals--------------------------------------------------------------------------------------------------------->
        <!-- edit modal -->
        <b-modal
          id="update-course-modal"
          title="Edit course"
          lazy
          v-model="showUpdateCourseModal"
          hide-footer
          body-class="modal-border px-space-lg pb-space-lg"
          header-class="border-0"
          title-class="h3-large font-weight-bold px-space-md pt-space-sm"
          centered
        >
          <section-new-courses
            data-cy="my-high-school-grades-course-work-edit-modal"
            :pageData="pageData"
            formState="edit"
            @update-course="handleUpdateCourse"
            btnTitle="Update course"
            :updateHighSchoolCourse="toUpdateHighSchoolCourse"
            :subject="toUpdateHighSchoolCourse?.subject"
            :onlySeniorYear="!isEligibleToFillDetails && isFutureGraduate"
          />
        </b-modal>
        <!-- delete confirm modal -->
        <b-modal
          id="delete-course-modal"
          v-model="showDeleteModal"
          hide-footer
          body-class="modal-border px-space-lg p-0"
          header-class="border-0"
          title-class="py-0 font-weight-bold p-0"
          centered
        >
          <h3 class="h3-large">Are you sure you want to delete?</h3>
          <p class="mt-space-md">This action cannot be undone.</p>
          <hr />
          <div class="form-actions float-right pb-space-xs">
            <button
              class="btn btn-link text-dark-1 font-weight-bold"
              @click="showDeleteModal = false"
              data-cy="my-high-school-grades-cancel-button"
            >
              Cancel
            </button>
            <button
              class="btn btn-dark-3"
              @click="deleteAnItem()"
              data-cy="my-high-school-grades-delete-button"
            >
              Delete
            </button>
          </div>
        </b-modal>
      </div>
    </div>
  </main>
</template>

<script>
import pageData from "@/content/my-high-school-grades.json";
import {
  BFormGroup,
  BFormInput,
  BTabs,
  BTab,
  BFormInvalidFeedback,
  VBTooltip,
} from "bootstrap-vue";
import BaseRadioCard from "@/components/base-components/BaseRadioCard.vue";
import BaseSelect from "@/components/base-components/BaseSelect.vue";
import BaseAlert from "@/components/base-components/BaseAlert.vue";
import SectionNewCourses from "@/components/ugapp-components/my-high-school-grades/SectionNewCourses.vue";
import * as _ from "lodash";
import { isEmpty } from "radash";
import { validationMixin } from "vuelidate";
import {
  requiredIf,
  numeric,
  maxLength,
  minValue,
} from "vuelidate/lib/validators";
import { EnumPageNames, EnumApiConstants } from "@/content/enum-app.js";
import {
  EnumNameTypes,
  MyProgramConstants,
} from "@/content/enum-ug-application.js";
import { MyHighSchoolConstants } from "@/content/enum-ug-application.js";
import AcceptedVisaTypes from "@/content/valid-visa-types.json";
import { mapActions, mapState } from "pinia";
import { useUgApplicationStore } from "@/stores/ug-application-store.js";
import { useAppStore } from "@/stores/app-store.js";
import { useUserStore } from "@/stores/user-store.js";
import { useConfigStore } from "@/stores/config-store.js";
import { useAuthStore } from "@/stores/auth-store.js";
import { extractGoogleClientId } from "@/services/UtilityService.js";
import certificate from "@/assets/img/certificate.svg";
import list from "@/assets/img/list.svg";
export default {
  name: "UgAppMyHighSchoolGradesView",
  mixins: [validationMixin],
  components: {
    "base-select": BaseSelect,
    "section-new-courses": SectionNewCourses,
    "b-form-group": BFormGroup,
    "b-form-input": BFormInput,
    "b-tabs": BTabs,
    "b-tab": BTab,
    "base-alert": BaseAlert,
    "base-radio-card": BaseRadioCard,
    "b-form-invalid-feedback": BFormInvalidFeedback,
  },
  directives: {
    "b-tooltip": VBTooltip,
  },
  metaInfo() {
    return {
      title: `${this.pageData.title} | Undergraduate Application`,
      titleTemplate: "%s - Arizona State University",
    };
  },
  data() {
    return {
      MyHighSchoolConstants: MyHighSchoolConstants,
      images: {
        certificate,
        list,
      },
      appId: null,
      isCoursesAdded: false,
      activeSubjectTab: "",
      isFutureDatedHighschoolGraduation: false,
      toUpdateHighSchoolCourse: null,
      toDeleteHighSchoolCourse: null,
      updatedTimeStamp: 0,
      seniorYearFilled: null,
      gradeFields: [],
      isSeniorYearCourseWorkFilled: false,
      form: {
        gradePath: null,
        overallAcademics: {
          unweightedGpa: null,
          gpaScale: null,
          gradingSystem: null,
          classRankSize: {
            rank: null,
            size: null,
          },
        },
        highSchoolCourses: [],
      },
      pageData: pageData,
      showUpdateCourseModal: false,
      showDeleteModal: false,
      initialFormData: {},
      isDataBindingComplete: false,
      footerSubmitActionListenner: null,
    };
  },
  watch: {
    form: {
      handler(newValue) {
        if (
          this.isDataBindingComplete &&
          !_.isEqual(newValue, this.initialFormData)
        ) {
          this.applicationUpdateCurrentPageUnsavedChanges(true);
        } else {
          this.applicationUpdateCurrentPageUnsavedChanges(false);
        }
        this.applicationUpdateCurrentPageStatus({
          anyDirty: this.$v.$anyDirty,
          anyError: this.$v.$anyError,
        });
      },
      deep: true,
    },
  },
  validations: {
    form: {
      gradePath: {
        required: requiredIf(function () {
          return this.isEligibleToFillDetails;
        }),
      },
      overallAcademics: {
        unweightedGpa: {
          required: requiredIf(function () {
            return this.isInputsVisible;
          }),
          maxLength: maxLength(6),
          // Regex to accept only integer or decimal values no special characters

          numeric: function (value) {
            return !this.isInputsVisible || /^[+-]?\d+(\.\d+)?$/.test(value);
          },
        },
        gpaScale: {
          required: requiredIf(function () {
            return this.isInputsVisible;
          }),
        },
        gradingSystem: {
          required: requiredIf(function () {
            return this.isInputsVisible;
          }),
        },
        classRankSize: {
          rank: {
            required: requiredIf((event) => {
              return !isEmpty(event.size);
            }),
            numeric,
            minValue: minValue(1),
            maxLength: maxLength(4),
          },
          size: {
            required: requiredIf((event) => {
              return !isEmpty(event.rank);
            }),
            numeric,
            minValue: function (value) {
              return (
                isEmpty(this.form.overallAcademics.classRankSize.rank) ||
                parseInt(this.form.overallAcademics.classRankSize.rank) <=
                  parseInt(value)
              );
            },
            maxLength: maxLength(4),
          },
        },
      },
    },
    isSeniorYearFilled: {
      hasError: function (value) {
        return value;
      },
    },
    isMinCourseWorkFilled: {
      hasError: function (value) {
        return value;
      },
    },
  },
  computed: {
    ...mapState(useAuthStore, { authToken: "token" }),
    ...mapState(useUgApplicationStore, {
      applicationMyHighSchoolGradesSar: "myHighSchoolGradesSar",
      applicationHighSchoolCourseWorks: "highSchoolCourseWorks",
      applicationHighSchools: "highSchools",
      applicationCurrentScreen: "currentScreen",
      applicationPreviousScreen: "previousScreen",
      applicationHighSchoolAcademics: "highSchoolAcademics",
    }),
    ...mapState(useConfigStore, {
      configHighSchoolGpaScales: "highSchoolGpaScales",
      configHighSchoolGradeScaleTypes: "highSchoolGradeScaleTypes",
      configHighSchoolCourseSubjects: "highSchoolCourseSubjects",
      configHighSchoolAcademicYears: "highSchoolAcademicYears",
      configHighSchoolCourses: "highSchoolCourses",
      configHighSchoolTermTypes: "highSchoolTermTypes",
      configHighSchoolCourseLevels: "highSchoolCourseLevels",
      configHighSchoolGrades: "highSchoolGrades",
    }),
    ...mapState(useUserStore, {
      userCitizenCountry: "citizenCountry",
      userVisaCode: "visaCode",
      userType: "userType",
    }),
    ...mapState(useAppStore, {
      apisCount: "apisCount",
    }),
    hasFutureGraduateError() {
      return (
        this.isCourseInputsVisible &&
        this.$v.$dirty &&
        !this.$v.isSeniorYearFilled.hasError
      );
    },
    hasMinCourseWorkError() {
      return (
        this.isCourseInputsVisible &&
        this.$v.$dirty &&
        !this.$v.isMinCourseWorkFilled.hasError
      );
    },
    isResident() {
      return this.userVisaCode === MyHighSchoolConstants.residentVisaCode;
    },
    isNonResident() {
      return this.userVisaCode === MyHighSchoolConstants.nonResidentVisaCode;
    },
    isFutureGraduate() {
      const highschool = this.applicationHighSchools
        .slice()
        .filter((item) => item.gradYear && item.gradMonth);
      if (highschool.length > 0) {
        const currentDate = new Date();
        const month = parseInt(highschool[0].gradMonth);
        const year = parseInt(highschool[0].gradYear);
        return (
          (year > currentDate.getFullYear() ||
            (year === currentDate.getFullYear() &&
              month > currentDate.getMonth())) &&
          highschool[0].extOrgId !== "1100040290"
        );
      }
      return false;
    },
    isInputsVisible() {
      return (
        (this.isEligibleToFillDetails &&
          this.form.gradePath === MyHighSchoolConstants.gradePathYes) ||
        (!this.isEligibleToFillDetails && this.isFutureGraduate) ||
        this.isFutureGraduate
      );
    },
    isSeniorYearFilled() {
      // If its not future graduate returning true
      if (
        !this.isFutureGraduate ||
        this.form.gradePath === MyHighSchoolConstants.gradePathNo
      ) {
        return true;
      }
      const seniorYear = this.configHighSchoolAcademicYears
        .slice()
        .filter(
          (item) => item.acadYear === MyHighSchoolConstants.seniorAcadYear
        );
      return this.form.highSchoolCourses.some(
        (item) =>
          item.academicYear.id === seniorYear[0]?.id &&
          (!item.type || item.type !== MyHighSchoolConstants.typeDelete)
      );
    },
    isMinCourseWorkFilled() {
      // If its not future graduate || not eligible to fill returning true
      if (
        !this.isFutureGraduate &&
        (!this.isEligibleToFillDetails ||
          this.form.gradePath === MyHighSchoolConstants.gradePathNo)
      ) {
        return true;
      } else {
        const courses = this.form.highSchoolCourses?.filter(
          (item) => !item.type || item.type !== MyHighSchoolConstants.typeDelete
        );
        return courses?.length > 0;
      }
    },
    isValidVisaType() {
      return AcceptedVisaTypes.some((item) => item.value === this.userVisaCode);
    },
    isEligibleToFillDetails() {
      return (
        this.userCitizenCountry === MyHighSchoolConstants.usCountryCode ||
        this.isValidVisaType
      );
    },
    isCourseWorkSectionVisible() {
      return (
        !isEmpty(this.form.overallAcademics.gradingSystem) ||
        this.form.highSchoolCourses.filter(
          (item) => !item.type || item.type !== MyHighSchoolConstants.typeDelete
        ).length > 0
      );
    },
    isCourseInputsVisible() {
      return !isEmpty(this.form.overallAcademics.gradingSystem);
    },
    validateGradedPathOption() {
      const messages = [];
      const { $dirty, required } = this.$v.form.gradePath;
      if ($dirty && !required) {
        messages.push("Please select an option for grade reporting");
      }
      return messages;
    },
    validateUnweightedGpa() {
      const { $dirty, required, numeric, maxLength, $error } =
        this.$v.form.overallAcademics.unweightedGpa;
      if ($dirty) {
        return {
          state: !$error,
          isRequired: !required,
          isNumeric: !numeric,
          isMaxLength: !maxLength,
        };
      } else {
        return {
          state: null,
          isRequired: !required,
          isNumeric: !numeric,
          isMaxLength: !maxLength,
        };
      }
    },
    validateGpaScale() {
      const messages = [];
      const { $dirty, required } = this.$v.form.overallAcademics.gpaScale;
      if ($dirty && !required) {
        messages.push("Please select an option for GPA scale");
      }
      return messages;
    },
    validateClassRank() {
      const { $dirty, required, numeric, maxLength, minValue, $error } =
        this.$v.form.overallAcademics.classRankSize.rank;
      if ($dirty) {
        return {
          state: !$error,
          message: "Please enter a valid GPA",
          isRequired: !required,
          isNumeric: !numeric,
          isMaxLength: !maxLength,
          isMinValue: !minValue,
        };
      } else {
        return {
          state: null,
          message: "",
          isRequired: !required,
          isNumeric: !numeric,
          isMaxLength: !maxLength,
          isMinValue: !minValue,
        };
      }
    },
    validateClassSize() {
      const { $dirty, required, numeric, minValue, maxLength, $error } =
        this.$v.form.overallAcademics.classRankSize.size;
      if ($dirty) {
        return {
          state: !$error,
          isRequired: !required,
          isNumeric: !numeric,
          minValue: !minValue,
          isMaxLength: !maxLength,
        };
      } else {
        return {
          state: null,
          message: "",
          isRequired: !required,
          isNumeric: !numeric,
          minValue: !minValue,
          isMaxLength: !maxLength,
        };
      }
    },
    validateGradingSystem() {
      const messages = [];
      const { $dirty, required } = this.$v.form.overallAcademics.gradingSystem;
      if ($dirty && !required) {
        messages.push("Please select an option for grading system");
      }
      return messages;
    },
    activeSubjectCourses() {
      return this.form.highSchoolCourses.filter(
        (item) =>
          item.subject == this.activeSubjectTab &&
          (!item.type || item.type !== MyHighSchoolConstants.typeDelete)
      );
    },
  },
  methods: {
    ...mapActions(useConfigStore, {
      selectHighSchoolGpaScale: "selectHighSchoolGpaScale",
      deselectHighSchoolGpaScale: "deselectHighSchoolGpaScale",
      selectHighSchoolGradeScaleType: "selectHighSchoolGradeScaleType",
      deselectHighSchoolGradeScaleType: "deselectHighSchoolGradeScaleType",
    }),
    ...mapActions(useUgApplicationStore, {
      submitMyHighSchoolGrades: "submitMyHighSchoolGrades",
      applicationPatchUiViewInfo: "patchUiViewInfo",
      applicationUpdateCurrentPageUnsavedChanges:
        "updateCurrentPageUnsavedChanges",
      applicationUpdateCurrentPageStatus: "updateCurrentPageStatus",
      applicationCreateNotification: "createNotification",
    }),
    ...mapActions(useAppStore, {
      updateCancelApiCallsStatus: "updateCancelApiCallsStatus",
      resetProgressBarRequests: "resetProgressBarRequests",
      updateProgressBarLoaderTotalRequests:
        "updateProgressBarLoaderTotalRequests",
      resetApiCallsCount: "resetApiCallsCount",
    }),
    scrollToErrorInput() {
      this.$nextTick(() => {
        const errorInputs = document.getElementsByClassName("is-invalid");
        if (errorInputs.length > 0) {
          errorInputs[0].scrollIntoView({
            behavior: "smooth",
            block: "center",
          });
        }
      });
    },
    async handleSaveClick() {
      this.$v.$touch();
      if (
        this.$v.$anyError &&
        (this.isEligibleToFillDetails || this.isFutureGraduate)
      ) {
        this.scrollToErrorInput();
        return;
      }

      // check if the values has to be deleted from database based on eligibility for the page

      // checking if the page is not visible resetting the complete form
      // else if the page is visible and user choose for transcripts only
      // else if the page is visible only because of future graduate date in highschool ressetting the fields which are not asked
      if (!this.isEligibleToFillDetails && !this.isFutureGraduate) {
        this.form.gradePath = null;
        this.resetFormDetails();
      } else if (
        this.isEligibleToFillDetails &&
        this.form.gradePath === MyHighSchoolConstants.gradePathNo
      ) {
        this.resetFormDetails();
        // deleting the overall academics data from the object
      } else if (!this.isEligibleToFillDetails || this.isFutureGraduate) {
        this.form.gradePath = MyHighSchoolConstants.gradePathYes;
      }
      let isResponseHasError = false;
      this.$track({
        event: "form",
        action: "click",
        name: "onclick",
        type: "click",
        region: "footer",
        section: "primary footer",
        text: "save",
        current_screen: EnumPageNames.PageUndergradMyHighSchoolGrades,
        previous_screen: EnumPageNames.PageUndergradMySchools,
      });

      // Calculating the total number of API's that will be called during the submit
      this.updateCancelApiCallsStatus(true);
      // Note: All the functions or stores actions which contains an API call is called here
      // to get the total count of the API calls that will be happening during the submit
      await this.submitMyHighSchoolGrades(
        this.authToken,
        this.appId,
        this.form
      );
      await this.createNotification();
      await this.updateUiViewInfo();
      this.updateCancelApiCallsStatus(false);
      this.updateProgressBarLoaderTotalRequests(this.apisCount);
      this.resetApiCallsCount();

      // step-1: submit my high school grades record
      const formResponses = await this.submitMyHighSchoolGrades(
        this.authToken,
        this.appId,
        this.form
      );
      formResponses.forEach((error) => {
        if (error.value.code !== 200 && error.value.code !== 201) {
          isResponseHasError = true;
          // fire error data layer event
          this.triggerErrorGtm(error.value.code, error.value?.errors);
        }
      });
      this.applicationUpdateCurrentPageUnsavedChanges(false);
      if (isResponseHasError) {
        this.$router.push({ name: EnumPageNames.PageError });
      } else {
        // step-2: notification for edplus-salesforce
        const notificationResponse = await this.createNotification();
        if (notificationResponse.code !== 200) {
          // fire error data layer event;
          this.triggerErrorGtm(
            notificationResponse.code,
            notificationResponse.errors
          );
        }
        // step-3: update ui-view-info record
        const uiViewInfoResponse = await this.updateUiViewInfo();
        if (uiViewInfoResponse.code === 201) {
          this.$track({
            event: "form",
            action: "submit",
            name: "onsubmit",
            type: "submit",
            region: "footer",
            section: "primary footer",
            text: "save",
            current_screen: this.applicationCurrentScreen,
            previous_screen: this.applicationPreviousScreen,
          });
          this.$router.push({
            name: this.applicationCurrentScreen,
            params: { id: this.appId },
          });
        } else {
          this.triggerErrorGtm(
            uiViewInfoResponse.code,
            uiViewInfoResponse.errors
          );
          this.$router.push({ name: EnumPageNames.PageError });
        }
      }
    },
    async createNotification() {
      return await this.applicationCreateNotification(
        this.authToken,
        this.appId,
        EnumApiConstants.SalesforceEdPlus,
        {
          googleClientId: extractGoogleClientId(),
        }
      );
    },
    async updateUiViewInfo() {
      const payload = {
        appId: this.appId,
        currentScreen:
          this.applicationPreviousScreen === EnumPageNames.PageUndergradReview
            ? EnumPageNames.PageUndergradReview
            : EnumPageNames.PageUndergradArizonaResidency,
        previousScreen:
          this.applicationPreviousScreen === EnumPageNames.PageUndergradReview
            ? EnumPageNames.PageUndergradArizonaResidency
            : EnumPageNames.PageUndergradMyHighSchoolGrades,
      };
      return await this.applicationPatchUiViewInfo(
        this.authToken,
        this.appId,
        payload
      );
    },
    resetFormDetails() {
      this.resetOverallAcademics();
      let courses = [];
      this.form.highSchoolCourses.forEach((item) => {
        if (item.highSchoolCourseworkId) {
          let courseDetail = item;
          courseDetail.type = MyHighSchoolConstants.typeDelete;
          courses.push(courseDetail);
        }
      });
      this.form.highSchoolCourses = courses;
    },
    resetOverallAcademics() {
      this.form.overallAcademics = {
        unweightedGpa: null,
        gpaScale: null,
        gradingSystem: null,
        classRankSize: {
          rank: null,
          size: null,
        },
        // helps to delete the details in the store submit action
        delete: true,
      };
    },

    handleGpaScalesSelect(event) {
      this.deselectHighSchoolGpaScale();
      this.selectHighSchoolGpaScale(event);
    },
    handleGradingSystemSelect(event) {
      this.deselectHighSchoolGradeScaleType();
      this.selectHighSchoolGradeScaleType(event);
      this.$refs.myHighschoolNewCourses?.resetSubjectsForm();
    },
    handleGradedPathOptionChange({ value, text }) {
      if (value === MyHighSchoolConstants.gradePathYes) {
        this.$nextTick(() => {
          this.$refs["overall_academics"].scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
          this.$v.form.overallAcademics.$reset;
        });
      }
      this.$track({
        event: "select",
        action: "click",
        name: "onclick",
        type: "checkbox",
        region: "main content",
        section: "my high school grades",
        text: text.toLowerCase(),
      });
    },
    displayGrades(grades) {
      return Object.keys(grades)
        .map((grade) => grades[grade].text)
        .join(", ");
    },
    deleteAnItem(id = null) {
      if (id) {
        this.showDeleteModal = true;
        this.deleteItemId = id;
      } else {
        let courseWorks = this.form.highSchoolCourses.map((item) => {
          return item;
        });
        const index = courseWorks.findIndex(
          (course) => course.id === this.deleteItemId
        );
        if (index >= 0 && courseWorks[index].highSchoolCourseworkId) {
          courseWorks[index]["type"] = MyHighSchoolConstants.typeDelete;
        } else {
          courseWorks = this.form.highSchoolCourses.filter(
            (course) => course.id !== this.deleteItemId
          );
        }
        this.form.highSchoolCourses = courseWorks;
        this.showDeleteModal = false;
      }
    },
    handleTabChange(newTabIndex) {
      this.activeSubjectTab =
        this.configHighSchoolCourseSubjects[newTabIndex].id;
      this.$track({
        event: "link",
        action: "click",
        name: "onclick",
        type: "internal link",
        region: "main content",
        section: "enter your required high school courses",
        text: this.configHighSchoolCourseSubjects[
          newTabIndex
        ]?.subjectName?.toLowerCase(),
      });
    },
    handleAddNewCourse(payload) {
      payload["subject"] = this.activeSubjectTab;
      const createGrades = Object.keys(payload.grades).reduce(
        (result, grade) => {
          result[MyProgramConstants.grades[grade]] =
            payload.grades[grade].text.toLowerCase();
          return result;
        },
        {}
      );
      this.$track({
        event: "form",
        action: "click",
        name: "onclick",
        type: "click",
        region: "main content",
        section: "add a course",
        text: "save course",
        component: "my high school grades",
        academic_year: payload.academicYear.text.toLowerCase(),
        course_name:
          payload.customeCourseName ?? payload.courseName.text.toLowerCase(),
        duration: payload.duration.text.toLowerCase(),
        course_level: payload.courseLevel.text.toLowerCase(),
        ...createGrades,
      });
      this.form.highSchoolCourses.push(payload);
      this.isCoursesAdded = true;
    },
    editItem(id) {
      this.toUpdateHighSchoolCourse = this.form.highSchoolCourses.find(
        (course) => course.id === id
      );
      this.showUpdateCourseModal = true;
    },
    handleUpdateCourse(payload) {
      this.showUpdateCourseModal = false;
      this.form.highSchoolCourses = this.form.highSchoolCourses.map(
        (course) => {
          if (course.id === payload.id) {
            return payload;
          }
          return course;
        }
      );
    },
    isSubjectCompleted(id) {
      if (!this.isEligibleToFillDetails && this.isFutureGraduate) {
        const courseCount = this.form.highSchoolCourses.filter(
          (item) =>
            item.subject == id &&
            (!item.type || item.type !== MyHighSchoolConstants.typeDelete) &&
            item.academicYear.text === MyHighSchoolConstants.seniorAcadYear
        );
        return courseCount.length > 0;
      } else {
        const courseCount = this.form.highSchoolCourses.filter(
          (item) =>
            item.subject == id &&
            (!item.type || item.type !== MyHighSchoolConstants.typeDelete)
        );
        const subject = this.configHighSchoolCourseSubjects.filter(
          (item) => item.id == id
        );
        return (
          courseCount.length >=
          parseInt(
            subject[0]?.minYearsRequired > 0
              ? subject[0]?.minYearsRequired
              : subject[0]?.minYearsRequired + 1
          )
        );
      }
    },
    updateHighSchoolCourseWithState() {
      this.applicationHighSchoolCourseWorks.forEach((element) => {
        const data = {
          id: Math.random().toString(36).slice(2),
          highSchoolCourseworkId: element.highSchoolCourseworkId,
          academicYear: null,
          courseName: null,
          customeCourseName: element.courseTitleAlternateText,
          duration: null,
          courseLevel: null,
          gradingSystemOption: null,
          subject: element.subjectId,
          grades: {},
        };
        // academic year
        const academicYear = this.configHighSchoolAcademicYears.filter(
          (item) => item.id === element.academicYearId
        );
        if (academicYear.length > 0) {
          data.academicYear = academicYear[0];
        }
        // course name
        const courseName = this.configHighSchoolCourses.filter(
          (item) => item.id === element.courseId
        );
        if (courseName.length > 0) {
          data.courseName = courseName[0];
        }
        // duration
        const duration = this.configHighSchoolTermTypes.filter(
          (item) => item.id === element.termTypeId
        );
        if (duration.length > 0) {
          data.duration = duration[0];
        }
        // course level
        const courseLevel = this.configHighSchoolCourseLevels.filter(
          (item) => item.id === element.courseLevelId
        );
        if (courseLevel.length > 0) {
          data.courseLevel = courseLevel[0];
        }
        // grades
        const gradesKey = this.pageData.addCourse.grades.type.filter(
          (item) => item.text === data.duration.text
        );
        let gradeScaleTypeId = null;
        if (gradesKey.length > 0) {
          gradesKey[0].gradeFields.forEach((gradeKey, index) => {
            const grade = this.configHighSchoolGrades.filter(
              (item) => item.id === element.grades[index].gradeId
            );
            if (grade.length > 0) {
              data.grades[gradeKey.fieldId] = grade[0];
              gradeScaleTypeId = grade[0].gpaScaleTypeId;
            }
          });
        }
        // gradingSystemOption
        const gradeScaleType = this.configHighSchoolGradeScaleTypes.filter(
          (item) => item.id === gradeScaleTypeId
        );
        if (gradeScaleType.length > 0) {
          data.gradingSystemOption = gradeScaleType[0].value;
        }
        // pushing data to form highschoolcourses
        this.form.highSchoolCourses.push(data);
      });
    },
    updateOverallAcademicsWithState() {
      if (this.applicationHighSchoolAcademics) {
        // unweightedGpa
        this.form.overallAcademics.unweightedGpa =
          this.applicationHighSchoolAcademics.currentUnweightedGpa;
        // Class rank
        this.form.overallAcademics.classRankSize.rank =
          this.applicationHighSchoolAcademics.classRank;
        // Class size
        this.form.overallAcademics.classRankSize.size =
          this.applicationHighSchoolAcademics.classSize;
        // GPA scales
        const gpaScale = this.configHighSchoolGpaScales.filter(
          (item) =>
            item.value === this.applicationHighSchoolAcademics.gpaScaleId
        );
        if (gpaScale.length > 0) {
          this.form.overallAcademics.gpaScale = gpaScale[0];
        }
        // gradingSystem
        const gradingSystem = this.configHighSchoolGradeScaleTypes.filter(
          (item) =>
            item.id === this.applicationHighSchoolAcademics.gradingScaleId
        );
        if (gradingSystem.length > 0) {
          this.form.overallAcademics.gradingSystem = gradingSystem[0];
        }
      }
    },
    triggerErrorGtm(code, errors) {
      this.$track({
        event: "app_error",
        action: "my_highschool_grades",
        location: this.$router.currentRoute.fullPath,
        code: code,
        message: errors?.toString(),
      });
    },
  },
  async created() {
    this.footerSubmitActionListenner = useUgApplicationStore().$onAction(
      async ({ name }) => {
        if (name === "submitForm") {
          this.handleSaveClick();
        }
      }
    );
    this.form.gradePath = this.applicationMyHighSchoolGradesSar.gradePath;
    const response = await Promise.allSettled([
      this.updateHighSchoolCourseWithState(),
      this.updateOverallAcademicsWithState(),
    ]);
    response.forEach((item) => {
      if (item.status === "fulfilled") {
        this.isDataBindingComplete = true;
      }
    });
    this.initialFormData = _.cloneDeep(this.form);
    this.appId = this.$route.params.id;
    this.activeSubjectTab = this.configHighSchoolCourseSubjects[0].id;

    // Resetting the progress bar requests value once the created hook is completed
    this.resetProgressBarRequests();
  },
  async mounted() {
    // if userthpe is admin and my information page is not submitted redirecting them to my info page
    if (
      this.userType === EnumNameTypes.UserTypeAdmin &&
      !this.userCitizenCountry
    ) {
      const payload = {
        appId: this.appId,
        currentScreen: EnumPageNames.PageUndergradMyInformation,
        previousScreen: EnumPageNames.PageUndergradReview,
      };
      await this.applicationPatchUiViewInfo(
        this.authToken,
        this.appId,
        payload
      );
      this.$router.push({
        name: this.applicationCurrentScreen,
        params: { id: this.appId },
      });
    }

    if (this.isFutureGraduate) {
      this.form.gradePath = MyHighSchoolConstants.gradePathYes;
    }
  },
  destroyed() {
    this.footerSubmitActionListenner();
  },
};
</script>

<style lang="scss" scoped>
.vertical-line {
  width: 2px;
  transform: rotate(20deg);
}
.tab-overlay {
  @media (width<991px) {
    position: absolute;
    top: 0;
    bottom: 0;
    width: 30px;
    z-index: 2;
    background: linear-gradient(
      to right,
      rgba(255, 255, 255, 1) 0%,
      rgba(255, 255, 255, 0) 100%
    );
    &--right {
      right: 0;
      background: linear-gradient(to right, #19191900 0%, #19191933 100%);
    }
  }
}
.table-wrapper-overlay {
  @media (width<991px) {
    right: 0;
    background: linear-gradient(
      to right,
      rgba(25, 25, 25, 0) 0%,
      rgba(25, 25, 25, 0.2) 100%
    );
    position: absolute;
    height: 100%;
    width: 30px;
    top: 0;
  }
}
.my-highschool-grades {
  border-radius: 19px;
}
.course-work-delete-btn {
  z-index: 2;
}
.edit-underline {
  border-bottom: 2px solid var(--primary);
  line-height: normal;
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>
