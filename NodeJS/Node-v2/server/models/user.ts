import instances from './instances/user';

export default (sequelize, DataTypes) => {
  const user = sequelize.define('User', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    email: { type: DataTypes.STRING(200), unique: true },
    phoneNumber: {
      type: DataTypes.STRING(50),
      unique: true
    },
    firstName: DataTypes.STRING(50),
    entities: {
      type: DataTypes.STRING(1000),
      defaultValue: ''
    },
    associatedChargerGeoRegionId: DataTypes.INTEGER,
    userType: DataTypes.STRING(16),
    lastName: DataTypes.STRING(50),
    deleted: DataTypes.BOOLEAN,
    countryCode: DataTypes.STRING(50),
    appRated: DataTypes.BOOLEAN,
    chargerConfirmedTerms: DataTypes.BOOLEAN,
    riderConfirmedTerms: DataTypes.BOOLEAN,
    dateChargerAcceptedTermsAndConditions: DataTypes.DATE,
    dateRiderAcceptedTermsAndConditions: DataTypes.DATE,
    referralCode: DataTypes.STRING(10),
    signUpLocation: DataTypes.GEOMETRY('POINT'),
    dateAcceptedConvenienceFeeTerms: DataTypes.DATE,
    isBlocked: DataTypes.BOOLEAN,
    blockReason: DataTypes.STRING(1000)
  });

  user.associate = models => {
    // associations can be defined here
    //user.hasOne(models.AuthoriseDate, { foreignKey: 'userId' });
    //user.belongsTo(models.GeoRegion, {
    //  foreignKey: 'associatedChargerGeoRegionId'
    //});
    //user.hasMany(models.Trip, { foreignKey: 'userId' });
    //user.hasMany(models.UserVehicleCharges, { foreignKey: 'userId' });

  };

  user.prototype.addRole = instances.prototype.addRole;
  user.prototype.hasRole = instances.prototype.hasRole;
  user.prototype.getRole = instances.prototype.getRole;
  user.prototype.removeRole = instances.prototype.removeRole;
  user.prototype.isUser = instances.prototype.isUser;
  user.prototype.isAccount = instances.prototype.isAccount;
  user.prototype.getLastAwardedTrip = instances.prototype.getLastAwardedTrip(
    sequelize
  );
  user.prototype.setEntities = instances.prototype.setEntities;
  user.prototype.addEntities = instances.prototype.addEntities;
  user.prototype.getEntities = instances.prototype.getEntities;
  user.prototype.getEntityName = instances.prototype.getEntityName;
  user.prototype.getFullPhoneNumber = instances.prototype.getFullPhoneNumber;

  return user;
};
