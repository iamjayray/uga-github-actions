import ugApplicationApi from "@/api/ug-application-api.js";
import userApi from "@/api/user-api.js";
import ugSupportApi from "@/api/ug-support-api.js";
import { defineStore } from "pinia";

export const useAppStore = defineStore({
  id: "app",

  state: () => ({
    undergradApplications: [],
    userAccounts: null,
    errors: [],
    applicationSubmissionInProgress: false,
    progressBarValue: 1,
    isPaymentTypePayNow: false,

    axiosRequest: 0,
    progressBarLoaderTotalRequests: 0,
    progressBarLoaderCurrentRequest: 0,
    isApiCallsCancled: false,
    apisCount: 0,
    isGeneralProgressBarCompleted: false,
    isGeneralLoaderVisible: true, // this boolean variable is used to handle the visibility of general loader during the API call
  }),
  getters: {
    loading() {
      return (
        this.isGeneralLoaderVisible &&
        (this.progressBarLoaderTotalRequests > 0 || this.axiosRequest > 0)
      );
    },
    hasUndergradApplications(state) {
      return state.undergradApplications.length > 0;
    },
    selectedUndergradApplication(state) {
      const selected = this.hasUndergradApplications
        ? state.undergradApplications.filter((item) => item.selected)
        : [];
      return selected.length > 0 ? selected[0] : null;
    },
    selectedUndergradApplicationId() {
      return this.selectedUndergradApplication
        ? this.selectedUndergradApplication.appId
        : null;
    },
    formattedSubmissionDate(state) {
      return new Date(
        state.undergradApplications[0]?.submittedAt
      ).toLocaleDateString("en-US", {
        month: "long",
        day: "2-digit",
        year: "numeric",
      });
    },
    isUndergradApplicationSubmitted() {
      return this.selectedUndergradApplication?.submitted === "Y" ?? false;
    },
    generalProgressBarPercentage() {
      if (this.isGeneralProgressBarCompleted) {
        return 100;
      } else {
        const data =
          (this.progressBarLoaderCurrentRequest /
            this.progressBarLoaderTotalRequests) *
          100;
        return data < 95 ? data : 95;
      }
    },
  },
  actions: {
    // undergradApplications
    async populateUndergradApplications(token) {
      try {
        // get all undergrad applications
        const { data } = await ugApplicationApi.fetchAllApplication(token);
        if (data.code === 200) {
          // add attributes to collection's object
          const collection = data.data.map((item) => {
            return {
              ...item,
              createdAtDate: new Date(item.createdAt),
              selected: false,
            };
          });

          // sort the collection based on createdAtDate
          const sortResult = collection.sort(
            (a, b) => b.createdAtDate.getTime() - a.createdAtDate.getTime()
          );

          // update the state's undergradApplications
          this.undergradApplications = sortResult;

          // select the 1st item of collection
          if (this.hasUndergradApplications) {
            this.undergradApplications[0]["selected"] = true;
          }
        }
        return data;
      } catch (error) {
        return error.response.data;
      }
    },
    selectUndergradApplication(application) {
      const index = this.undergradApplications.findIndex(
        (item) => item.appId === application.appId
      );

      if (index !== -1) {
        this.undergradApplications[index]["selected"] = true;
      }
    },
    deselectUndergradApplication(application) {
      const index = this.undergradApplications.findIndex(
        (item) => item.appId === application.appId
      );

      if (index !== -1) {
        this.undergradApplications[index]["selected"] = false;
      }
    },
    // supportTickets
    async addSupportTicket(
      accessToken,
      ticketType,
      subject,
      description,
      applicationId
    ) {
      try {
        const { data } = await ugSupportApi.createSupportTicket(
          accessToken,
          ticketType,
          subject,
          description,
          applicationId
        );

        return data;
      } catch (error) {
        return error.response.data;
      }
    },
    // User accounts
    async populateUserAccounts(token) {
      try {
        // get all undergrad applications
        const { data } = await userApi.fetchUserAccounts(token);
        if (data.code === 200) {
          this.userAccounts = data.data;
        }
        return data;
      } catch (error) {
        return error.response.data;
      }
    },
    // errors
    setError(errors) {
      this.errors = errors;
    },
    appSubmitApplicationClicked(status) {
      this.applicationSubmissionInProgress = status;
    },
    appProgressBarValue(value) {
      this.progressBarValue = value;
    },
    updateSelectedPaymentType() {
      this.isPaymentTypePayNow = !this.isPaymentTypePayNow;
    },

    startAxiosRequest() {
      this.axiosRequest++;
    },
    endAxiosRequest() {
      if (
        this.progressBarLoaderCurrentRequest <
        this.progressBarLoaderTotalRequests
      ) {
        this.progressBarLoaderCurrentRequest++;
      }
      setTimeout(() => {
        if (this.axiosRequest > 0) {
          this.axiosRequest--;
        }
      }, 500);
    },
    updateProgressBarLoaderTotalRequests(value) {
      this.progressBarLoaderTotalRequests = value;
    },
    updateProgressBarLoaderCurrentRequests(value) {
      this.progressBarLoaderCurrentRequest = value;
    },
    resetProgressBarRequests() {
      this.isGeneralProgressBarCompleted = true;
      setTimeout(() => {
        this.progressBarLoaderTotalRequests = 0;
        this.progressBarLoaderCurrentRequest = 0;
        this.isGeneralProgressBarCompleted = false;
      }, 500);
    },
    incrementApiCount() {
      this.apisCount++;
    },
    resetApiCallsCount() {
      this.apisCount = 0;
    },
    updateCancelApiCallsStatus(status) {
      this.isApiCallsCancled = status;
    },
    updateisGeneralLoaderVisibleStatus(value) {
      this.isGeneralLoaderVisible = value;
    },
  },
});
