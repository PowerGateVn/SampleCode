export default {
  up: (queryInterface, Sequelize) =>
    queryInterface.createTable("client", {
      clientId: {
        type: Sequelize.STRING({
          length: 200
        }),
        primaryKey: true,
        allowNull: false
      },
      name: {
        type: Sequelize.STRING({
          length: 500
        })
      },
      clientSecret: {
        type: Sequelize.TEXT
      },
      createdAt: {
        allowNull: false,
        defaultValue: Sequelize.fn("now"),
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        defaultValue: Sequelize.fn("now"),
        type: Sequelize.DATE
      }
    }),
  down: (queryInterface, Sequelize) => queryInterface.dropTable("client")
};
