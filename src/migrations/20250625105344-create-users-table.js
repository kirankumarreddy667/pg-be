'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      email: {
        type: Sequelize.STRING,
        allowNull: true,
        unique: true
      },
      password: {
        type: Sequelize.STRING,
        allowNull: true
      },
      phone_number: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      farm_name: {
        type: Sequelize.STRING,
        allowNull: true,
        unique: true
      },
      address: {
        type: Sequelize.STRING,
        allowNull: true
      },
      pincode: {
        type: Sequelize.STRING,
        allowNull: true
      },
      taluka: {
        type: Sequelize.STRING,
        allowNull: true
      },
      district: {
        type: Sequelize.STRING,
        allowNull: true
      },
      state: {
        type: Sequelize.STRING,
        allowNull: true
      },
      country: {
        type: Sequelize.STRING,
        allowNull: true
      },
      payment_status: {
        type: Sequelize.STRING,
        defaultValue: 'free'
      },
      remember_token: {
        type: Sequelize.STRING,
        allowNull: true
      },
      village: {
        type: Sequelize.STRING,
        allowNull: true
      },
      otp_status: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      firebase_token: {
        type: Sequelize.STRING,
        allowNull: true
      },
      device_id: {
        type: Sequelize.STRING,
        allowNull: true
      },
      device_type: {
        type: Sequelize.STRING,
        allowNull: true
      },
      language_id: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      record_milk_refresh: {
        type: Sequelize.STRING(20),
        allowNull: true
      },
      deleted_at: {
        type: Sequelize.DATE,
        allowNull: true
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },

  async down(queryInterface, _sequelize) {
    await queryInterface.dropTable('users');
  }
};
