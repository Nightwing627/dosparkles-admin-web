<template>
  <v-col class="d-flex justify-center flex-column align-center px-0">
    <v-card
      @click="emitIndex"
      width="100"
      height="100"
      class="d-flex justify-center align-center mb-2 icon"
      :class="{active: isActive}"
    >
      <template>
        <img
          :src="require(`@/assets/store-icons/${icon}.svg`)"
          height="50"
          width="50"
        />
      </template>
    </v-card>
    <span class="value">{{icon === 'units_sold' ? '' : '$ '}}{{data[icon]}}</span>
    <span>{{ getIconTitle }}</span>
  </v-col>
</template>

<script>
export default {
  props: ["icon", 'isActive', 'data', 'keyId'],
  computed: {
    getIconTitle() {
      const str = this.icon.replace(/_/g, " ");
      return str.split(" ").map(this.capitalize).join(" ");
    },
  },
  methods: {
    capitalize(str) {
      return str.charAt(0).toUpperCase() + str.slice(1);
    },
    emitIndex() {
      this.$emit('changeKeyId', this.keyId)
    }
  },
};
</script>

<style scoped>
img {
  filter: grayscale(100%);
}
.active {
  background: #000;
}
.icon {
  transition: background .5s;
}
.icon:hover {
  background: #000;
}
</style>
