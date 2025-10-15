"use strict";

module.exports = {
  async filterProducts(ctx) {
    try {
      const { category, value, filterAddOn = [] } = ctx.request.body;

      if (!category || !value) {
        return ctx.badRequest("Field 'category' dan 'value' wajib diisi.");
      }

      const collectionMap = {
        "wallpaper-by-style": "api::wallpaper-by-style.wallpaper-by-style",
        "wallpaper-by-color": "api::wallpaper-by-color.wallpaper-by-color",
        "wallpaper-by-designer":
          "api::wallpaper-by-designer.wallpaper-by-designer",
      };

      const mainCollection = collectionMap[category];
      if (!mainCollection) {
        return ctx.badRequest(`Category '${category}' tidak dikenali.`);
      }

      // --- 1️⃣ Ambil data utama (misal: style = Anak Anak)
      const allMainData = await strapi.entityService.findMany(mainCollection, {
        populate: { products: true },
      });

      const mainMatched = allMainData.find(
        (item) =>
          item.name === value || item.title === value || item.label === value
      );

      if (!mainMatched) {
        return ctx.notFound(`Data dengan value '${value}' tidak ditemukan.`);
      }

      // Produk dengan style Anak Anak
      let finalProducts = mainMatched.products || [];

      // --- 2️⃣ Kelompokkan filter berdasarkan kategori
      const colorFilters = filterAddOn
        .filter((f) => f.category === "wallpaper-by-color")
        .map((f) => f.value);
      const designerFilters = filterAddOn
        .filter((f) => f.category === "wallpaper-by-designer")
        .map((f) => f.value);

      // --- 3️⃣ Ambil semua relasi warna & designer
      const colorCollection = collectionMap["wallpaper-by-color"];
      const designerCollection = collectionMap["wallpaper-by-designer"];

      // Ambil produk berdasarkan warna
      let colorProductIds = [];
      if (colorFilters.length > 0) {
        const allColors = await strapi.entityService.findMany(colorCollection, {
          populate: { products: true },
        });

        colorFilters.forEach((colorVal) => {
          const colorItem = allColors.find(
            (c) =>
              c.name === colorVal ||
              c.title === colorVal ||
              c.label === colorVal
          );
          if (colorItem) {
            colorProductIds.push(...colorItem.products.map((p) => p.id));
          }
        });
        colorProductIds = [...new Set(colorProductIds)]; // hapus duplikat
      }

      // Ambil produk berdasarkan designer
      let designerProductIds = [];
      if (designerFilters.length > 0) {
        const allDesigners = await strapi.entityService.findMany(
          designerCollection,
          {
            populate: { products: true },
          }
        );

        designerFilters.forEach((designerVal) => {
          const designerItem = allDesigners.find(
            (d) =>
              d.name === designerVal ||
              d.title === designerVal ||
              d.label === designerVal
          );
          if (designerItem) {
            designerProductIds.push(...designerItem.products.map((p) => p.id));
          }
        });
        designerProductIds = [...new Set(designerProductIds)];
      }

      // --- 4️⃣ Filter produk berdasarkan kombinasi
      finalProducts = finalProducts.filter((p) => {
        const matchColor =
          colorFilters.length === 0 || colorProductIds.includes(p.id);
        const matchDesigner =
          designerFilters.length === 0 || designerProductIds.includes(p.id);
        return matchColor && matchDesigner;
      });

      // --- 5️⃣ Hasil akhir
      return {
        base: {
          category,
          value,
          totalProducts: finalProducts.length,
        },
        filters: filterAddOn,
        products: finalProducts.map((p) => ({
          id: p.id,
          title: p.title || p.name,
          slug: p.slug,
        })),
      };
    } catch (error) {
      console.error("Error in filterProducts:", error);
      return ctx.internalServerError("Terjadi kesalahan server.");
    }
  },
};
