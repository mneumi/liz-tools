import { createApp } from "vue"
import { initApp } from "./global"
import App from "./App.vue"

createApp(App).use(initApp).mount("#app")
