import { shake } from "radash";
const AppAnalytics = {
  install(Vue) {
    Vue.prototype.$track = tagManager;
  },
};

export const tagManager = ({
  type,
  region,
  section,
  text,
  component,
  event,
  name,
  action,
  ...rest
}) => {
  if (!event) {
    event = "link";
    name = "onclick";
    action = "click";
  }
  trackEvent({
    event: event,
    name: name,
    action: action,
    type: type,
    region: region,
    section: section,
    text: text,
    component: component,
    ...rest,
  });
};
const trackEvent = (eventObject) => {
  try {
    //check for required params and throw error if missing nothing will be tracked if error is thrown
    if (eventObject.event !== "app_error") {
      checkRequiredParams(eventObject);
    }
    if (typeof window === "undefined" && window === null)
      throw new Error("window is not defined");
    //trigger log in dev mode
    // TODO: trigger the console log only development
    if (!window.dataLayer) throw new Error("window.dataLayer is not defined");
    // toggle the below on local to test the dataLayer
    // console.log("google", shake(eventObject));
    // Removing any undefined values from eventObject using radash "shake"
    window.dataLayer.push(shake(eventObject));
  } catch (err) {
    console.error(err);
  }
};

export const checkRequiredParams = (eventObject) => {
  const requiredParams = ["event", "name", "action", "type", "region", "text"];
  requiredParams.forEach((param) => {
    if (
      !eventObject[param] ||
      eventObject[param] === null ||
      eventObject[param] === "" ||
      /[A-Z]/.test(eventObject[param]) // check for uppercase
    ) {
      throw new Error(`Missing required param: ${param}`);
    }
  });
};

export default AppAnalytics;
