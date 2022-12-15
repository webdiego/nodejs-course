const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });
// console.log(app.get('env')); //development set by express
// console.log(process.env); // from node

const app = require('./app');

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Listen on port ${port}`);
});
