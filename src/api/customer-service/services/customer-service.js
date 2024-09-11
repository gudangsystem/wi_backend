'use strict';

/**
 * customer-service service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::customer-service.customer-service');
