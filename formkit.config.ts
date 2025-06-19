import { defineFormKitConfig } from "@formkit/vue";
import { createAutoHeightTextareaPlugin, createMultiStepPlugin } from "@formkit/addons";

export default defineFormKitConfig({
  plugins: [
    createAutoHeightTextareaPlugin(),
    createMultiStepPlugin(),
  ],
});
