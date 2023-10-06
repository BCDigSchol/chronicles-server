// call app core logic
const app = require('./app.js');

// start webserver
const PORT = process.env.WEB_PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});