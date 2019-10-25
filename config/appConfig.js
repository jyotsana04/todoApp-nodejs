let appConfig = {};

appConfig.port = 3020;
appConfig.allowedCorsOrigin = "*";
appConfig.env = "dev";
appConfig.db = {
    uri: 'mongodb://127.0.0.1:27017/myToDoAppDB'
  }
appConfig.apiVersion = '/api/v1';
//appConfig.redisPort = 18020;
//appConfig.redisPassword = 'edwisorDBpassword'
//appConfig.redisHost = 'redis-18020.c81.us-east-1-2.ec2.cloud.redislabs.com'
appConfig.mailId = 'email4testing.04@gmail.com'
appConfig.mailPassword = 'mytestpassword'

module.exports = {
    port: appConfig.port,
    allowedCorsOrigin: appConfig.allowedCorsOrigin,
    environment: appConfig.env,
    db :appConfig.db,
    apiVersion : appConfig.apiVersion,
    //redisPort: appConfig.redisPort,
    //redisPassword: appConfig.redisPassword,
    //redisHost: appConfig.redisHost,
    mailId:appConfig.mailId,
    mailPassword:appConfig.mailPassword
};

