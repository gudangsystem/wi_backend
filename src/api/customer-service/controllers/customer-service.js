'use strict';

/**
 * customer-service controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::customer-service.customer-service');
