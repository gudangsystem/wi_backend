module.exports = {
  routes: [
    {
      method: "POST",
      path: "/wallpaper-filter",
      handler: "wallpaper-filter.filterProducts",
      config: {
        auth: false,
      },
    },
  ],
};
