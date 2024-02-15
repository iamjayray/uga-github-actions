import { prepareAndPrefillDynamicContent } from "@/services/UtilityService.js";
export default {
  methods: {
    validateSelect(field) {
      if (field) {
        const { $dirty, required } = field;
        const messages = [];
        if ($dirty) {
          if (!required) messages.push("This is a required field");
        }
        return messages;
      }
    },
    formatContent(content) {
      return prepareAndPrefillDynamicContent(content);
    },
  },
};
