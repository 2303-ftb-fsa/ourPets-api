const { client } = require('./client');
const { buildSetString } = require('../utils');
const bcrypt = require('bcrypt');
const saltRounds = 10;

// Inserts a Parent
const createParent = async (parent) => {
  try {
    const { name, password } = parent;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    console.log(hashedPassword);
    const {
      rows: [newParent],
    } = await client.query(
      `
     INSERT INTO parents(name, password)
     VALUES ($1, $2)
     RETURNING *;
    `,
      [name, hashedPassword]
    );
    // console.log(newParent);
    return newParent;
  } catch (error) {
    console.error(error);
  }
};

// Get all parents
async function getParents() {
  try {
    const { rows: parents } = await client.query(`
    SELECT id, name FROM parents;
    `);

    // console.log(parents);
    return parents;
  } catch (error) {
    console.error(error);
  }
}

async function getParentById(parentId) {
  try {
    const {
      rows: [parent],
    } = await client.query(
      `
    SELECT id, name FROM parents
    WHERE id=$1;
    `,
      [parentId]
    );

    const { rows: pets } = await client.query(
      `
      SELECT * FROM pets
      WHERE "parentId" = $1;
      `,
      [parentId]
    );

    parent.pets = pets;
    delete parent.password;

    // console.log(parent);

    return parent;
  } catch (error) {
    console.error(error);
  }
}

async function getParentByName(parentName) {
  try {
    const {
      rows: [parent],
    } = await client.query(
      `
    SELECT * FROM parents
    WHERE name=$1;
    `,
      [parentName]
    );

    console.log(parent);
    return parent;
  } catch (error) {
    console.error(error);
  }
}

const updateParent = async (id, fields = {}) => {
  const setString = await buildSetString(fields);

  try {
    const {
      rows: [parent],
    } = await client.query(
      `
    UPDATE parents
    SET ${setString}
    WHERE id = ${id}
    RETURNING id, name;
    `,
      Object.values(fields)
    );
    const { rows: pets } = await client.query(
      `
    SELECT * FROM pets
    WHERE "parentId" = $1;
    `,
      [id]
    );

    parent.pets = pets;

    return parent;
  } catch (error) {
    console.error(error);
  }
};

module.exports = {
  createParent,
  getParents,
  getParentById,
  getParentByName,
  updateParent,
};
