<template>
  <v-app>
    <v-main v-if="isMounted">
      <Toolbar />
      <v-container class="mt-2">
        <v-row class="d-flex align-center" style="justify-content: center">
          <v-col cols="3" class="d-flex">
            <v-menu
              ref="menuDates"
              v-model="menuDatesVisible"
              transition="scale-transition"
              :close-on-content-click="false"
              max-width="290"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-text-field
                  v-model="dateRangeText"
                  label="Date range"
                  prepend-icon="mdi-calendar"
                  readonly
                  v-bind="attrs"
                  v-on="on"
                ></v-text-field>
              </template>
              <v-date-picker
                v-model="dateRange"
                range
                no-title
                @change="menuDatesVisible = false"
              ></v-date-picker>
            </v-menu>
          </v-col>
          <!-- <span>Store:</span> -->
          <v-col cols="3">
            <v-autocomplete
              v-model="selectedItem"
              :items="storesName"
              :search-input.sync="search"
              color="white"
              label="Select Store"
              placeholder="Start typing to Search"
              prepend-icon="mdi-database-search"
              return-object
            ></v-autocomplete>
            <!-- <v-select
              class="mx-2"
              label="Select Store"
              v-model="selectedItem"
              item-text="name"
              item-value=".id"
              :items="stores"
              append-icon="keyboard_arrow_down"
              color="black"
            >
            </v-select> -->
          </v-col>
        </v-row>
        <v-row>
          <storeIcon
            v-for="(icon, i) of icons"
            :key="i"
            :keyId="i"
            :icon="icon"
            :isActive="currentCategory === i"
            :data="storeCardData"
            @changeKeyId="updateIndex"
          ></storeIcon>
        </v-row>
        <v-row class="chart-wrapper mt-16">
          <v-chart :option="option"></v-chart>
        </v-row>
      </v-container>
    </v-main>
    <!-- {{ option }} -->
  </v-app>
</template>

<script>
import storeIcon from "@/components/storeIcon.vue";
import Toolbar from "../components/Toolbar";
export default {
  name: "Dashboard",
  data: () => ({
    //
    currentCategory: 0,
    selectedItem: null,
    icons: ["units_sold", "revenue", "cost", "profit"],
    //
    option: {
      xAxis: {
        data: [],
      },
      yAxis: {
        type: "value",
      },
      series: [
        {
          type: "line",
          data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        },
      ],
      title: {
        text: "Units Sold",
        x: "center",
        textStyle: {
          fontSize: 18,
        },
      },
      color: ["black"],
    },
    //
    menuDatesVisible: false,

    isMounted: false,
    stores: [],
    storesName: [],
    dateRange: [new Date(), new Date()],
    //
    storeCardData: {
      cost: 0,
      profit: 0,
      revenue: 0,
      units_sold: 0,
    },
    //
    yearDateRanges: [],
    chartData: [12],
    search: null,
  }),
  components: {
    storeIcon,
    Toolbar,
  },
  async mounted() {
    this.stores = [{ id: null, name: "All Stores" }].concat(
      await this.$store.getters.strapi.getEntries("stores")
    );
    this.storesName = this.stores.map((store) => store.name);
    this.selectedItem = this.stores[0].id;

    var start = new Date();
    start.setDate(1);

    var end = new Date();
    end.setDate(0);
    end.setMonth(end.getMonth() + 1);

    this.dateRange = [
      start.toISOString().substring(0, 10),
      end.toISOString().substring(0, 10),
    ];

    this.option.xAxis.data = [];

    for (let i = 0; i < 12; i++) {
      this.yearDateRanges.push(
        start.toISOString().substring(0, 10),
        end.toISOString().substring(0, 10)
      );

      this.option.xAxis.data.push(start.toUTCString().substring(8, 16));

      start.setMonth(start.getMonth() - 1);
      end.setMonth(end.getMonth() - 1);
    }

    this.option.xAxis.data.reverse();

    this.updateChart();
    this.isMounted = true;
  },
  methods: {
    getSlicedObj() {
      return {};
    },
    capitalize(str) {
      return str.charAt(0).toUpperCase() + str.slice(1);
    },
    sortObj(initialObj) {
      const sortedObj = Object.keys(initialObj)
        .sort()
        .reduce((obj, key) => {
          obj[key] = initialObj[key];
          return obj;
        }, {});
      return sortedObj;
    },
    updateIndex(i) {
      this.currentCategory = i;
    },
    async updateChart() {
      try {
        let analyticsRequest = await this.$store.getters.strapi.request(
          "POST",
          "/analytics/getStatistics",
          {
            data: {
              startDate: this.dateRange[0],
              endDate: this.dateRange[1],
              storeId: this.selectedItem,
            },
          }
        );

        let getStatsTwelveMonthRequest = await this.$store.getters.strapi.request(
          "POST",
          "/analytics/getStatsTwelveMonth",
          {
            data: {
              storeId: this.selectedItem,
            },
          }
        );

        this.chartData = getStatsTwelveMonthRequest.reverse();

        let category;
        switch (this.currentCategory) {
          case 0:
            category = "utitsSold";
            break;
          case 1:
            category = "revenue";
            break;
          case 2:
            category = "totalCost";
            break;
          case 3:
            category = "profit";
            break;
        }

        this.option.series[0].data = this.chartData.map(
          (item) => item[category]
        );
        console.log(
          "this.chartData.map((item) => item[category])",
          this.chartData.map((item) => item[category])
        );

        this.storeCardData = {
          cost: analyticsRequest.bottomStatistics.totalCost,
          profit: analyticsRequest.bottomStatistics.profit,
          revenue: analyticsRequest.bottomStatistics.revenue,
          units_sold: analyticsRequest.bottomStatistics.utitsSold,
        };

        this.$forceUpdate();
      } catch (err) {
        console.error(err);
      }
    },
  },
  computed: {
    dateRangeText() {
      const formattedDateRange = this.dateRange.map((date) => {
        return new Date(date).toLocaleDateString("en-US").replaceAll("/", "-");
      });

      return this.dateRange ? formattedDateRange.join(" ~ ") : "";
    },
    getIconTitle() {
      const str = this.icons[this.currentCategory].replace(/_/g, " ");
      return str.split(" ").map(this.capitalize).join(" ");
    },
  },
  watch: {
    currentCategory: function () {
      this.option.title.text = this.getIconTitle;
      let category;
      switch (this.currentCategory) {
        case 0:
          category = "utitsSold";
          break;
        case 1:
          category = "revenue";
          break;
        case 2:
          category = "totalCost";
          break;
        case 3:
          category = "profit";
          break;
      }

      this.option.series[0].data = this.chartData.map((item) => item[category]);
      this.$forceUpdate();
      // this.updateChart();
    },
    dateRange() {
      this.updateChart();
    },
    selectedItem() {
      this.updateChart();
    },
    search() {
      // Items have already been loaded
      if (this.items.length > 0) return;

      // Items have already been requested
      if (this.isLoading) return;

      this.isLoading = true;

      // Lazily load input items
      fetch("https://api.publicapis.org/entries")
        .then((res) => res.json())
        .then((res) => {
          const { count, entries } = res;
          this.count = count;
          this.entries = entries;
        })
        .catch((err) => {
          console.log(err);
        })
        .finally(() => (this.isLoading = false));
    },
  },
};
</script>

<style lang="scss" scoped>
.chart-wrapper {
}
.echarts {
  max-width: 800px;
  height: 500px;
  margin: 0 auto;
}
.container {
  max-width: 1400px;
}

.v-toolbar__title {
  cursor: pointer;
}
</style>
