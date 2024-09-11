'use strict';

/**
 * customer-service router
 */

const { createCoreRouter } = require('@strapi/strapi').factories;

module.exports = createCoreRouter('api::customer-service.customer-service');
