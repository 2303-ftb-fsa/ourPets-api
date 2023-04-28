const router = require('express').Router();
const { client } = require('../db/client');
const {
  createTrick,
  getAllTricks,
  addTrickToPet,
  getTricksByPetId,
  destroyTrick,
  getTrickById,
  getPetById,
} = require('../db');
const { requireUser } = require('./utils');

// /api/tricks
// GET: api/tricks
router.get('/', async (req, res, next) => {
  try {
    const tricks = await getAllTricks();
    res.send(tricks);
  } catch (error) {
    next(error);
  }
});

// POST: /api/tricks
router.post('/', requireUser, async (req, res, next) => {
  try {
    console.log(req.body);
    const { title } = req.body;

    const newTrick = await createTrick({ title });

    res.send(newTrick);
  } catch (error) {
    next(error);
  }
});

// GET: /api/tricks/:id
router.get('/:id', async (req, res, next) => {
  const { id } = req.params;
  console.log(id);
  try {
    const tricks = await getTricksByPetId(+id);
    if (!tricks) {
      next({
        name: 'ParentsNotFoundError',
        message: "Sorry can't find tricks for this pet!",
        status: 404,
      });
    }
    if (!tricks.length) {
      res.send(`Pet by id: ${id} hasn't learned any tricks!`);
    } else {
      console.log(`these are tricks for pet with id: ${id}: `, tricks);
      res.send(tricks);
    }
  } catch (error) {
    next(error);
  }
});
// POST: /api/tricks/:trickId/pet/:petId
router.post('/:trickId/pet/:petId', requireUser, async (req, res, next) => {
  try {
    const { trickId, petId } = req.params;
    const trickToAdd = await getTrickById(trickId);
    const petToAddTrick = await getPetById(petId);

    if (!trickToAdd || !petToAddTrick) {
      next({
        name: 'MissingTrickOrPet',
        message: 'Please select a valid trick or pet',
      });
    } else {
      await addTrickToPet({ petId, trickId });

      res.send(
        `Your pet: ${petToAddTrick.name} can now perform ${trickToAdd.title} as a trick! Woooohooooo!`
      );
    }
  } catch (error) {
    next(error);
  }
});

// DELETE: /api/tricks/:id
router.delete('/:id', requireUser, async (req, res, next) => {
  try {
    const { id } = req.params;

    const findTrick = await getTrickById(id);

    if (findTrick) {
      const deletedTrick = await destroyTrick(id);
      res.send(
        `you've successfully deleted the trick with title: ${deletedTrick.title}. Sad day :/`
      );
    } else {
      res.send(`No trick with id: ${id}`);
    }
  } catch (error) {
    next(error);
  }
});
module.exports = router;
