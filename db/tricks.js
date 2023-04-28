const { client } = require('./client');

// const addTrickToPet = async (petsTrick) => {
//   const {petId, trickId} = petsTrick;
const addTrickToPet = async ({ petId, trickId }) => {
  try {
    const {
      rows: [petTrick],
    } = await client.query(
      `
     INSERT INTO pet_tricks("petId", "trickId")
     VALUES ($1, $2)
     ON CONFLICT ("petId", "trickId") DO NOTHING
     RETURNING *;
    `,
      [petId, trickId]
    );
    // console.log(petTrick);

    return petTrick;
  } catch (error) {
    console.error(error);
  }
};

const createTrick = async (trick) => {
  try {
    const { title } = trick;

    const {
      rows: [newTrick],
    } = await client.query(
      `
     INSERT INTO tricks(title)
     VALUES ($1)
     RETURNING *;
    `,
      [title]
    );

    return newTrick;
  } catch (error) {
    console.error(error);
  }
};

const getAllTricks = async () => {
  try {
    const { rows: tricks } = await client.query(`
    SELECT * FROM tricks;
    `);
    // console.log('these are our tricks: ', tricks);
    return tricks;
  } catch (error) {
    console.error(error);
  }
};

// select a list of tricks by pet id
async function getTricksByPetId(id) {
  try {
    const { rows: listOfTricks } = await client.query(
      `
      SELECT tricks.* FROM tricks
      JOIN pet_tricks ON pet_tricks."trickId" = tricks.id
      WHERE "petId"=$1;
    `,
      [id]
    );
    // console.log(listOfTricks);
    return listOfTricks;
  } catch (error) {
    console.error(error);
  }
}

const destroyTrick = async (id) => {
  try {
    await client.query(
      `
    DELETE FROM pet_tricks
    WHERE "trickId" = $1;
    `,
      [id]
    );

    const {
      rows: [trick],
    } = await client.query(
      `
    DELETE FROM tricks
    WHERE id = $1
    RETURNING *;
    `,
      [id]
    );

    return trick;
  } catch (error) {
    console.error(error);
  }
};

const getTrickById = async (id) => {
  try {
    const {
      rows: [trick],
    } = await client.query(
      `
    SELECT * FROM tricks
    WHERE id = $1
    `,
      [id]
    );
    // console.log('these are our tricks: ', tricks);
    return trick;
  } catch (error) {
    console.error(error);
  }
};

module.exports = {
  createTrick,
  getAllTricks,
  addTrickToPet,
  getTricksByPetId,
  destroyTrick,
  getTrickById,
};
