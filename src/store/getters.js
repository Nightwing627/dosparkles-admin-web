const getters = {
  apiUrl: state => state.app.apiUrl,
  strapi: state => state.app.strapi,
  token: state => state.user.token,
  roles: state => state.user.roles,
  id: state => state.user.id,
};

export default getters;
