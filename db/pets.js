const { client } = require('./client');
const { getTricksByPetId } = require('./tricks');

const createPet = async (pet) => {
  try {
    const { name, breed, age, sex, color, weight, parentId } = pet;

    const {
      rows: [newPet],
    } = await client.query(
      `
     INSERT INTO pets(name, breed, age, sex, color, weight, "parentId")
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     RETURNING *;
    `,
      [name, breed, age, sex, color, weight, parentId]
    );

    return newPet;
  } catch (error) {
    console.error(error);
  }
};

async function getPets() {
  try {
    const { rows: pets } = await client.query(`
      SELECT * FROM pets;
    `);
    // console.log(pets);
    return pets;
  } catch (error) {
    console.error(error);
  }
}

async function getPetById(petId) {
  try {
    const {
      rows: [pet],
    } = await client.query(
      `
      SELECT * FROM pets
      WHERE id=$1;
    `,
      [petId]
    );
    // console.log('without tricks: ', pet);
    if (pet) {
      const tricks = await getTricksByPetId(pet.id);
      pet.tricks = tricks;
    }
    // console.log('with tricks attached: ', pet);
    const {
      rows: [parent],
    } = await client.query(
      `
    SELECT id, name FROM parents
    WHERE id = $1
    `,
      [pet.parentId]
    );

    pet.parent = parent;
    // console.log(pet);
    return pet;
  } catch (error) {
    console.error(error);
  }
}

// Gets a pet by parent id
const getPetsByParentId = async (parentId) => {
  try {
    const { rows: pets } = await client.query(
      `
    SELECT * FROM pets
    WHERE "parentId" = $1;
    `,
      [parentId]
    );

    // console.log(pets);
    return pets;
  } catch (error) {
    console.error(error);
  }
};

const updatePetAge = async (id, age) => {
  try {
    // we want to find a pet by id
    // change the age by a specific value
    const {
      rows: [pet],
    } = await client.query(
      `
    UPDATE pets
    SET age=$2
    WHERE id=$1
    RETURNING *;
    `,
      [id, age]
    );
    // console.log(pet);
    // return the pet
    return pet;
  } catch (error) {
    console.error(error);
  }
};
const updatePet = async (id, fields) => {
  try {
    // we want to find a pet by id
    // strip down the fields object into a string
    // {name: "The Don", breed: "crazy dogo"}
    // name="The Don", breed="crazy dogo"

    const keys = Object.keys(fields);
    // console.log('this is my keys: ', keys);
    for (let key of keys) {
      if (
        ![
          'name',
          'breed',
          'age',
          'sex',
          'color',
          'weight',
          'parentId',
        ].includes(key)
      )
        return;
    }

    const setString = keys
      .map((key, index) => `"${key}"=$${index + 1}`)
      .join(', ');
    // console.log('this is my setString: ', setString);
    // const values = Object.values(fields);
    // console.log('these are values: ', values);
    const {
      rows: [pet],
    } = await client.query(
      `
    UPDATE pets
    SET ${setString}
    WHERE id=${id}
    RETURNING *;
    `,
      // values
      Object.values(fields)
    );
    // console.log(pet);
    // return the pet
    return pet;
  } catch (error) {
    console.error(error);
  }
};

module.exports = {
  createPet,
  getPets,
  getPetById,
  getPetsByParentId,
  updatePet,
  updatePetAge,
};
