const axios = require("axios");

const apikey =
  process.env.api_key_rajaongkir || "5b31ad9f730d74c3b1360e4eb39691c8";

// Buat instance Axios dengan konfigurasi default
const axiosInstance = axios.create({
  baseURL: "https://pro.rajaongkir.com/", // Ganti dengan URL yang sesuai
  timeout: 5000, // Sesuaikan dengan timeout yang diinginkan
  headers: {
    "Content-Type": "application/json",
    key: apikey,
  },
});

module.exports = axiosInstance;
