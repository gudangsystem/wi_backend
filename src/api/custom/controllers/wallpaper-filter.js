"use strict";

module.exports = {
  async filterProducts(ctx) {
    try {
      const { category, value, filterAddOn = [] } = ctx.request.body;

      if (!category || !value) {
        return ctx.badRequest("Field 'category' dan 'value' wajib diisi.");
      }

      // Mapping nama koleksi
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

      // Pastikan value selalu array
      const mainValues = Array.isArray(value) ? value : [value];

      // --- 1️⃣ Ambil data utama dengan populate products lengkap
      const allMainData = await strapi.entityService.findMany(mainCollection, {
        populate: {
          products: {
            populate: {
              brands: {
                populate: {
                  discount: true,
                },
              },
              images: {
                fields: ["url"],
              },
            },
          },
        },
      });

      // Ambil semua data yang cocok dengan salah satu value
      const mainMatchedData = allMainData.filter(
        (item) =>
          mainValues.includes(item.name) ||
          mainValues.includes(item.title) ||
          mainValues.includes(item.label)
      );

      if (mainMatchedData.length === 0) {
        return ctx.notFound(
          `Data dengan value '${mainValues.join(", ")}' tidak ditemukan.`
        );
      }

      // Gabungkan semua produk dari semua value utama
      let finalProducts = mainMatchedData.flatMap(
        (item) => item.products || []
      );
      let baseProductIds = [...new Set(finalProducts.map((p) => p.id))];

      // --- 2️⃣ Kelompokkan filter tambahan
      const colorFilters = filterAddOn
        .filter((f) => f.category === "wallpaper-by-color")
        .map((f) => f.value);
      const designerFilters = filterAddOn
        .filter((f) => f.category === "wallpaper-by-designer")
        .map((f) => f.value);

      const colorCollection = collectionMap["wallpaper-by-color"];
      const designerCollection = collectionMap["wallpaper-by-designer"];

      // --- 3️⃣ Ambil produk berdasarkan warna
      let colorProductIds = [];
      if (colorFilters.length > 0) {
        const allColors = await strapi.entityService.findMany(colorCollection, {
          populate: {
            products: {
              populate: {
                brands: {
                  populate: {
                    discount: true,
                  },
                },
                images: {
                  fields: ["url"],
                },
              },
            },
          },
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
        colorProductIds = [...new Set(colorProductIds)];
      }

      // --- 4️⃣ Ambil produk berdasarkan designer
      let designerProductIds = [];
      if (designerFilters.length > 0) {
        const allDesigners = await strapi.entityService.findMany(
          designerCollection,
          {
            populate: {
              products: {
                populate: {
                  brands: {
                    populate: {
                      discount: true,
                    },
                  },
                  images: {
                    fields: ["url"],
                  },
                },
              },
            },
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

      // --- 5️⃣ Filter produk akhir berdasarkan kombinasi
      finalProducts = finalProducts.filter((p) => {
        const matchColor =
          colorFilters.length === 0 || colorProductIds.includes(p.id);
        const matchDesigner =
          designerFilters.length === 0 || designerProductIds.includes(p.id);
        return matchColor && matchDesigner;
      });

      // --- 6️⃣ Hasil akhir
      return {
        base: {
          category,
          value: mainValues,
          totalProducts: finalProducts.length,
        },
        filters: filterAddOn,
        products: finalProducts.map((p) => ({
          id: p.id,
          name: p.name,
          price: p.price,
          brands: p.brands,
          images: p.images,
        })),
      };
    } catch (error) {
      console.error("Error in filterProducts:", error);
      return ctx.internalServerError("Terjadi kesalahan server.");
    }
  },
};
