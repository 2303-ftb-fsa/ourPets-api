const router = require('express').Router();

const {
  getPets,
  createPet,
  getPetById,
  getPetsByParentId,
  updatePet,
} = require('../db');
const { requireUser } = require('./utils');

// GET: /api/pets
router.get('/', async (req, res, next) => {
  try {
    const pets = await getPets();
    if (!pets) {
      next({
        name: 'PetsNotFoundError',
        message: "Sorry can't find the pets!",
        status: 404,
      });
    }
    console.log('these are pets: ', pets);
    res.send(pets);
  } catch (error) {
    next(error);
  }
});

// POST: /api/pets
router.post('/', requireUser, async (req, res, next) => {
  try {
    console.log(req.body);
    const { name, breed, parentId } = req.body;

    const newPet = await createPet({ name, breed, parentId });

    res.send(newPet);
  } catch (error) {
    next(error);
  }
});

// GET: /api/pets/:id
router.get('/:id', async (req, res, next) => {
  try {
    console.log(req.params);
    const { id } = req.params;
    const pets = await getPetById(id);
    res.send(pets);
  } catch (error) {
    next(error);
  }
});

// GET: /api/pets/parent/:id
router.get('/parent/:id', async (req, res, next) => {
  try {
    console.log(req.params);
    const { id } = req.params;
    const pets = await getPetsByParentId(id);
    res.send(pets);
  } catch (error) {
    next(error);
  }
});

// PATCH: /api/pets/:id
router.patch('/:id', requireUser, async (req, res, next) => {
  try {
    console.log('parent in patch: ', req.parent);
    const { parent } = req;
    const { id } = req.params;
    // console.log(req.body);
    const pet = await getPetById(id);
    if (pet.parentId !== parent.id) {
      next({
        name: 'Credential Mismatch',
        message: 'You must be the parent of this pet to update.',
      });
    } else {
      const updatedPet = await updatePet(id, req.body);
      res.send(updatedPet);
    }
  } catch (error) {
    next(error);
  }
});

module.exports = router;
