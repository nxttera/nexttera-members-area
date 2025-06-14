import { defineFormKitConfig } from "@formkit/vue";
import { createAutoHeightTextareaPlugin } from "@formkit/addons";

export default defineFormKitConfig({
  plugins: [
    createAutoHeightTextareaPlugin(),
  ],
});
