import Strapi from "strapi-sdk-javascript";
const apiUrl =
  process.env.NODE_ENV === "development"
    ? "https://backend.dosparkles.com"
    : "https://backend.dosparkles.com";
const strapi = new Strapi(apiUrl);

const state = {
  strapi,
  apiUrl,
};

const mutations = {};

const actions = {};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
};
