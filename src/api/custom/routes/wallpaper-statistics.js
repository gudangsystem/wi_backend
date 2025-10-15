module.exports = {
  routes: [
    {
      method: "POST",
      path: "/wallpaper-statistics",
      handler: "wallpaper-statistics.findRelationCount",
      config: {
        auth: false,
      },
    },
  ],
};
