var mongodb = require('mongodb');
var mongoClient = mongodb.MongoClient;
var config = require('../config/config.js');
var constant = require('../config/constant.js');
exports.login = function (username, password, type, callback) {
    mongoClient.connect(config.serverApi, function (err, db) {
        if (err) {
            console.log('Unable to connect to the mongoDB server. Error:', err);
        }
        else {
            console.log('Connection established to', config.serverDb);
            var collection = db.collection(constant.DatabaseCollectionUser);
            collection.find({ UserName: username, Password: password, UserType: type, Status: constant.UserStatusActive }).toArray(function (queryErr, docs) {
                if (docs != null && docs.length > 0) {
                    callback({ Status: constant.FunctionStatusSuccess, Data: docs[0] });
                }
                else {
                    callback({ Status: constant.FunctionStatusNotFound, Data: null });
                }
                //Close connection
                db.close();
            });
        }
    });
};
//# sourceMappingURL=user_service.js.map