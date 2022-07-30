<template>
  <v-menu
    ref="menu"
    v-model="menu"
    :close-on-content-click="false"
    transition="scale-transition"
    offset-y
    min-width="auto"
  >
    <template v-slot:activator="{ on, attrs }">
      <v-text-field
        class="mx-2"
        :value="getDateName"
        :label="title"
        readonly
        v-bind="attrs"
        v-on="on"
        append-icon="event"
        color="black"
      >
      </v-text-field>
    </template>
    <v-date-picker
      color="black"
      ref="picker"
      v-model="date"
      type="month"
      :max="new Date().toISOString().substr(0, 10)"
      min="1950-01-01"
      @change="save"
      :allowed-dates="allowedDates"
    ></v-date-picker>
  </v-menu>
</template>

<script>
import { mapMutations } from "vuex";

export default {
  data: () => ({
    date: null,
    menu: false,
    monthes: [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ],
  }),
  methods: {
    ...mapMutations({
      updateStoreDate: "UPDATE_STORE_DATE",
      updateStoreData: "UPDATE_STORE_DATA",
    }),
    save(date) {
      this.updateStoreDate([this.type, date]);
      this.$refs.menu.save(date);
      if (!this.$store.state.storeItems[this.currentStore].data[date]) {
        this.updateStoreData([
          this.currentStore,
          date,
          {
            units_sold: 0,
            revenue: 0,
            cost: 0,
            profit: 0,
          },
        ]);
      }
      this.$emit('updateDate')
    },
    allowedDates(val) {
      const type = this.type === "dateTo" ? "dateFrom" : "dateTo";
      const date = this.$store.state[type].split("-");
      const values = val.split("-");
      if (type === "dateTo") {
        return +date[0] >= +values[0] && +date[1] >= +values[1];
      }
      return +date[0] <= +values[0] && +date[1] <= +values[1];
    },
  },
  props: ["title", "type", "currentStore"],
  computed: {
    getDateName() {
      if (!this.date) {
        const date = this.$store.state[this.type].split('-')
        return `${this.monthes[date[1] - 1]} ${date[0]}`;
      }
      const date = this.date.split("-");
      return `${this.monthes[date[1] - 1]} ${date[0]}`;
    },
  },
  watch: {
    menu(val) {
      val && setTimeout(() => (this.$refs.picker.activePicker = "MONTH"));
    },
  },
};
</script>

<style lang="scss" scoped></style>
