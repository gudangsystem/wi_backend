module.exports = {
  routes: [
    {
      method: "GET",
      path: "/rajaongkir/courier",
      handler: "index.courier",
    },
    {
      method: "GET",
      path: "/rajaongkir/provincies",
      handler: "index.provincies",
    },
    {
      method: "GET",
      path: "/rajaongkir/provincies/:id",
      handler: "index.provincies",
    },
    // City
    {
      method: "GET",
      path: "/rajaongkir/city",
      handler: "index.city",
    },
    {
      method: "GET",
      path: "/rajaongkir/city/:province",
      handler: "index.city",
    },
    {
      method: "GET",
      path: "/rajaongkir/city/:province/:id",
      handler: "index.city",
    },
    // Subdistrict
    {
      method: "GET",
      path: "/rajaongkir/subdistrict",
      handler: "index.subDistrict",
    },
    {
      method: "GET",
      path: "/rajaongkir/subdistrict/:city",
      handler: "index.subDistrict",
    },
    {
      method: "GET",
      path: "/rajaongkir/subdistrict/:city/:id",
      handler: "index.subDistrict",
    },
    // mengetahui tarif pengiriman (ongkos kirim)
    {
      method: "POST",
      path: "/rajaongkir/cost",
      handler: "posts.costs",
    },
    // “waybill” untuk digunakan melacak/mengetahui status pengiriman berdasarkan nomor resi.
    {
      method: "POST",
      path: "/rajaongkir/cekresi",
      handler: "posts.cekresi",
    },
  ],
};
