var config = {
  user : process.env.MYSQL_DATABASE_USER || '<yourusername>',
  password : process.env.MYSQL_DATABASE_PASSWORD || '<yourpassword>',
  host : '127.0.0.1', 
  database: process.env.MYSQL_DATABASE || '<yourdatabasename>'
};

module.exports = config;
