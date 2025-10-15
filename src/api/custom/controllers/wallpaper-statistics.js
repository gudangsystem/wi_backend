"use strict";

module.exports = {
  async findRelationCount(ctx) {
    try {
      const { category, value } = ctx.request.body;

      if (!category || !value) {
        return ctx.badRequest("Category dan value wajib diisi.");
      }

      let mainCollection = "";
      let relatedCollections = [];

      // Tentukan koleksi utama dan relasi lainnya
      switch (category) {
        case "wallpaper-by-style":
          mainCollection = "api::wallpaper-by-style.wallpaper-by-style";
          relatedCollections = [
            "api::wallpaper-by-color.wallpaper-by-color",
            "api::wallpaper-by-designer.wallpaper-by-designer",
          ];
          break;

        case "wallpaper-by-color":
          mainCollection = "api::wallpaper-by-color.wallpaper-by-color";
          relatedCollections = [
            "api::wallpaper-by-style.wallpaper-by-style",
            "api::wallpaper-by-designer.wallpaper-by-designer",
          ];
          break;

        case "wallpaper-by-designer":
          mainCollection = "api::wallpaper-by-designer.wallpaper-by-designer";
          relatedCollections = [
            "api::wallpaper-by-style.wallpaper-by-style",
            "api::wallpaper-by-color.wallpaper-by-color",
          ];
          break;

        default:
          return ctx.badRequest("Category tidak dikenali.");
      }

      // Ambil semua data di koleksi utama
      const allMainData = await strapi.entityService.findMany(mainCollection, {
        populate: { products: true },
      });

      // Cari data utama (misal Anak Anak)
      const mainMatched = allMainData.find(
        (item) =>
          item.name === value || item.title === value || item.label === value
      );

      if (!mainMatched) {
        return ctx.notFound(`Data dengan value '${value}' tidak ditemukan.`);
      }

      // Produk yang terkait dengan value utama
      const relatedProducts = mainMatched.products || [];
      const productIds = relatedProducts.map((p) => p.id);

      const result = {};

      // 🔹 Tambahkan bagian utama juga ke result
      const mainFormatted = allMainData.map((item) => ({
        name: item.name || item.title || item.label,
        count: item.products?.length || 0,
      }));

      result[category] = mainFormatted;

      // 🔹 Loop untuk setiap koleksi relasi (color/designer/dst)
      for (const collection of relatedCollections) {
        const allData = await strapi.entityService.findMany(collection, {
          populate: { products: true },
        });

        const formatted = allData.map((item) => {
          const count = item.products.filter((p) =>
            productIds.includes(p.id)
          ).length;

          return {
            name: item.name || item.title || item.label,
            count,
          };
        });

        result[collection.split(".")[1]] = formatted;
      }

      return result;
    } catch (error) {
      console.error("Error in findRelationCount:", error);
      return ctx.internalServerError("Terjadi kesalahan server.");
    }
  },
};
