const { client } = require('../db/client');
const {
  createPet,
  createParent,
  createTrick,
  getPets,
  getPetById,
  getParents,
  updatePet,
  updatePetAge,
  addTrickToPet,
  getTricksByPetId,
} = require('../db');
const { pets, parents, tricks } = require('./ourPetData');

const dropTables = async () => {
  try {
    console.log('Begin dropping tables!');
    await client.query(`
    DROP TABLE IF EXISTS pet_tricks;
    DROP TABLE IF EXISTS pets;
    DROP TABLE IF EXISTS parents;
    DROP TABLE IF EXISTS tricks;
    `);

    console.log('All tables dropped!');
  } catch (error) {
    console.error(error);
  }
};

const createTables = async () => {
  try {
    console.log('Starting to create tables!');
    await client.query(`
    CREATE TABLE parents(
      id SERIAL PRIMARY KEY,
      name VARCHAR(75) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL
    );

    CREATE TABLE pets(
      id SERIAL PRIMARY KEY,
      name VARCHAR(75) NOT NULL,
      breed VARCHAR(255) DEFAULT 'unknown',
      age INTEGER DEFAULT 0,
      sex VARCHAR(1) DEFAULT '?',
      color VARCHAR(75),
      weight NUMERIC(6, 2) NOT NULL,
      "parentId" INTEGER REFERENCES parents(id)
    );

    CREATE TABLE tricks(
      id SERIAL PRIMARY KEY,
      title VARCHAR(255) UNIQUE NOT NULL
    );

    CREATE TABLE pet_tricks(
      "petId" INTEGER REFERENCES pets(id),
      "trickId" INTEGER REFERENCES tricks(id),
      UNIQUE("petId", "trickId")
    );


    `);

    console.log("All tables created! Let's add some data! :)");
  } catch (error) {
    console.error(error);
  }
};

const init = async () => {
  try {
    await client.connect();
    await dropTables();
    await createTables();
    console.log('Creating Parents');
    // await createParent({ id: 1, name: 'Sean', password: 'Pa$$word01!!' });
    await Promise.all(parents.map(createParent)); //es6 createParents
    await Promise.all(pets.map(createPet)); //es6 createParents
    await Promise.all(tricks.map(createTrick));
    await addTrickToPet({ petId: 21, trickId: 21 });
    await addTrickToPet({ petId: 14, trickId: 13 });
    await addTrickToPet({ petId: 14, trickId: 22 });
    console.log('Getting all Parents!');
    await getParents();
    console.log('Getting all Pets!');
    await getPets();
    console.log('updating pet 16 with age 35');
    await updatePetAge(16, 35);
    await getPetById(21);
    await updatePet(21, { name: 'The Don', breed: 'crazy dogo' });
    await getPetById(14);
    console.log('your database is filled with data! :)');
  } catch (error) {
    console.error(error);
  } finally {
    client.end(() => {
      console.log('client has ended');
    });
  }
};

init();
