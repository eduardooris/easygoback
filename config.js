const DB_USER = process.env.DB_USER;
const DB_PASSWORD = encodeURIComponent(process.env.DB_PASSWORD);
module.exports = {
  mongoURI: `mongodb+srv://${DB_USER}:${DB_PASSWORD}@christsocial.yebjs0q.mongodb.net/?retryWrites=true&w=majority&appName=ChristSocial`,
};
