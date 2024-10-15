const axios = require("../../../extensions/axios/rajaOngkirAxios");
const qs = require("qs");

module.exports = {
  async costs(ctx, next) {
    const rawData = ctx.request.body?.data;

    if (!rawData || typeof rawData !== "object") {
      return ctx.badRequest("Data harus dalam format JSON");
    }

    const {
      origin,
      originType,
      destination,
      destinationType,
      weight,
      courier,
    } = JSON.parse(JSON.stringify(rawData));

    let body = qs.stringify({
      origin,
      originType,
      destination,
      destinationType,
      weight,
      courier,
    });

    let config = {
      // "api/cost" - pro
      method: "post",
      maxBodyLength: Infinity,
      url: "api/cost",
      headers: {
        "content-type": "application/x-www-form-urlencoded",
      },
      data: body,
    };

    try {
      const { data } = await axios.request(config);
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

  async cekresi(ctx, next) {
    const rawData = ctx.request.body?.data;

    if (!rawData || typeof rawData !== "object") {
      return ctx.badRequest("Data harus dalam format JSON");
    }

    const { noresi, courier } = JSON.parse(JSON.stringify(rawData));

    let body = qs.stringify({
      waybill: noresi,
      courier,
    });

    let config = {
      // "api/waybill" - pro
      method: "post",
      maxBodyLength: Infinity,
      url: "api/waybill",
      headers: {
        "content-type": "application/x-www-form-urlencoded",
      },
      data: body,
    };

    try {
      const { data } = await axios.request(config);
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
