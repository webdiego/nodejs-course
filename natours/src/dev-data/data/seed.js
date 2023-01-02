const fs = require('fs');
const prisma = require('../../prisma.client');

//Read file json
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/tours-simple.json`, 'utf-8')
);

const seed = async function () {
  try {
    await prisma.tour.createMany({
      data: tours,
    });
    console.log('Data added in DB');
  } catch (error) {
    console.log(error);
  }
  //Stop process
  process.exit();
};
const deleteMany = async function () {
  try {
    await prisma.tour.deleteMany();
    console.log('Data deleted from DB');
  } catch (error) {
    console.log(error);
  }
  process.exit();
};
if (process.argv[2] === '--import') {
  seed();
}
if (process.argv[2] === '--delete') {
  deleteMany();
}
console.log(process.argv);
