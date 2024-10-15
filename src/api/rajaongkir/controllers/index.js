const axios = require("../../../extensions/axios/rajaOngkirAxios");

function generateUrl(url, params) {
  // Mengecek apakah URL sudah memiliki parameter
  const tambahanParams = Object.keys(params)
    .map((key) => params[key] && `${key}=${encodeURIComponent(params[key])}`)
    .join("&");
  const separator = url.includes("?") ? "&" : "?";

  // Menggabungkan URL dengan parameter tambahan
  const urlBaru = `${url}${separator}${tambahanParams}`;

  return urlBaru;
}

module.exports = {
  async courier(ctx, next) {
    ctx.response.set("Content-Type", "application/json");
    ctx.body = {
      msg: "Kode Kurir Yang tersedia.",
      data: [
        "jne",
        "jnt",
        "tiki",
        "sicepat",
        "lion",
        "wahana",
        "pos",
        "anteraja",
        // "sap",
        // "jet",
        // "dse",
        // "first",
        // "ninja",
        // "idl",
        // "rex",
        // "ide",
        // "sentral",
        // "jtl",
        // "star",
      ],
    };
  },

  async city(ctx, next) {
    const { id, province } = ctx.params;
    // let url = `api/city?province=${province}`;
    const urlAwal = "api/city";
    const params = {
      province,
      id,
    };

    const url = generateUrl(urlAwal, params);

    try {
      const { data } = await axios.get(url);
      ctx.response.set("Content-Type", "application/json");
      ctx.body = data;
    } catch (error) {
      ctx.response.set("Content-Type", "application/json");
      ctx.body = {
        error: true,
        msg: error?.response?.data || "Terjadi Kesalahan.",
      };
    }
  },

  async provincies(ctx, next) {
    const { id } = ctx.params;
    // let url = "api/province";
    let urlAwal = "api/province";

    const params = {
      id,
    };

    const url = generateUrl(urlAwal, params);

    try {
      const { data } = await axios.get(url);
      ctx.response.set("Content-Type", "application/json");
      ctx.body = data;
    } catch (error) {
      ctx.response.set("Content-Type", "application/json");
      ctx.body = {
        error: true,
        msg: error?.response?.data || "Terjadi Kesalahan.",
      };
    }
  },

  async subDistrict(ctx, next) {
    const { id, city } = ctx.params;
    // let url = `api/subdistrict?city=${city}`;
    let urlAwal = `api/subdistrict`;

    const params = {
      city,
      id,
    };

    const url = generateUrl(urlAwal, params);

    try {
      const { data } = await axios.get(url);
      ctx.response.set("Content-Type", "application/json");
      ctx.body = data;
    } catch (error) {
      ctx.response.set("Content-Type", "application/json");
      ctx.body = {
        error: true,
        msg: error?.response?.data || "Terjadi Kesalahan.",
      };
    }
  },
};
