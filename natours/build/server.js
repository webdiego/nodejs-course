const dotenv = require('dotenv');
// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
    console.log('UNCAUGHT EXCEPTION!(sync)💥 Shutting down...');
    console.log(err.name, err.message);
    process.exit(1);
});
dotenv.config({ path: './.env' });
// console.log(app.get('env')); //development set by express
// console.log(process.env); // from node
const app = require('./app');
const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
    console.log(`Listen on port ${port}`);
});
// Handle unhandled promise rejections async
process.on('unhandledRejection', (err) => {
    console.log('UNHANDLED REJECTION (async)! 💥 Shutting down...');
    console.log(err.name, err.message);
    // Server.close() is an async function, so we need to wait for it to finish before shutting down the process
    server.close(() => {
        process.exit(1);
    });
});
