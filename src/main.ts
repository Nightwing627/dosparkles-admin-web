import Vue from "vue";
import App from "./App.vue";
import vuetify from "@/plugins/vuetify.js";
// import "@/plugins/echarts.js";

import ECharts from "vue-echarts";
import { use } from "echarts/core";

// import ECharts modules manually to reduce bundle size
import { CanvasRenderer } from "echarts/renderers";
// import { BarChart } from "echarts/charts";
import { GridComponent } from "echarts/components";
import { LineChart } from 'echarts/charts';
import { TitleComponent } from 'echarts/components';

use([CanvasRenderer, GridComponent, LineChart, TitleComponent]);
Vue.component("v-chart", ECharts);


import "./registerServiceWorker";
import router from "./router";
import './permission'; // permission control
import store from "./store/index.js";

Vue.config.productionTip = false;

new Vue({
  vuetify,
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
