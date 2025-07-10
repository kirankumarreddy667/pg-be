import { Router } from 'express'
import { AnimalController } from '@/controllers/animal.controller'
import { TypeController } from '@/controllers/type.controller'
import { authenticate, authorize } from '@/middlewares/auth.middleware'
import { wrapAsync } from '@/utils/asyncHandler'
import { validateRequest } from '@/middlewares/validateRequest'
import {
	createTypeSchema,
	createAnimalSchema,
	addTypeOfAnAnimalSchema,
} from '@/validations/animal.validation'

const router: Router = Router()

/**
 * @swagger
 * /add_animal:
 *   post:
 *     summary: Add a new animal
 *     tags: [Animal]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               language_id:
 *                 type: integer
 *             required:
 *               - name
 *               - language_id
 *     responses:
 *       201:
 *         description: Animal added successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FailureResponse'
 */
router.post(
	'/add_animal',
	authenticate,
	wrapAsync(authorize(['SuperAdmin'])),
	validateRequest(createAnimalSchema),
	wrapAsync(AnimalController.addAnimal),
)

/**
 * @swagger
 * /update_animal_details/{id}:
 *   put:
 *     summary: Update animal details
 *     tags: [Animal]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Animal ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               language_id:
 *                 type: integer
 *             required:
 *               - name
 *               - language_id
 *     responses:
 *       200:
 *         description: Animal updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FailureResponse'
 *       404:
 *         description: Animal not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FailureResponse'
 */
router.put(
	'/update_animal_details/:id',
	authenticate,
	wrapAsync(authorize(['SuperAdmin'])),
	validateRequest(createAnimalSchema),
	wrapAsync(AnimalController.updateAnimalDetails),
)

/**
 * @swagger
 * /delete_animals/{id}:
 *   delete:
 *     summary: Delete an animal
 *     tags: [Animal]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Animal ID
 *     responses:
 *       200:
 *         description: Animal deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FailureResponse'
 *       404:
 *         description: Animal not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FailureResponse'
 */
router.delete(
	'/delete_animals/:id',
	authenticate,
	wrapAsync(authorize(['SuperAdmin'])),
	wrapAsync(AnimalController.deleteAnimal),
)

/**
 * @swagger
 * /animal/{id}:
 *   get:
 *     summary: Get animal by ID
 *     tags: [Animal]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Animal ID
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FailureResponse'
 *       404:
 *         description: Animal not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FailureResponse'
 */
router.get(
	'/animal/:id',
	authenticate,
	wrapAsync(authorize(['SuperAdmin'])),
	wrapAsync(AnimalController.getAnimalById),
)

/**
 * @swagger
 * /type:
 *   post:
 *     summary: Add a new type
 *     tags: [Animal]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               type:
 *                 type: string
 *             required:
 *               - type
 *     responses:
 *       201:
 *         description: Type added successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FailureResponse'
 */
router.post(
	'/type',
	authenticate,
	wrapAsync(authorize(['SuperAdmin'])),
	validateRequest(createTypeSchema),
	wrapAsync(TypeController.addType),
)

/**
 * @swagger
 * /type:
 *   get:
 *     summary: Get all types
 *     tags: [Animal]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FailureResponse'
 */
router.get(
	'/type',
	authenticate,
	wrapAsync(authorize(['SuperAdmin'])),
	wrapAsync(TypeController.getAllTypes),
)

/**
 * @swagger
 * /type/{id}:
 *   get:
 *     summary: Get type by id
 *     tags: [Animal]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Type id
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FailureResponse'
 */
router.get(
	'/type/:id',
	authenticate,
	wrapAsync(authorize(['SuperAdmin'])),
	wrapAsync(TypeController.getTypeById),
)

/**
 * @swagger
 * /type/{id}:
 *   put:
 *     summary: Update type
 *     tags: [Animal]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Type id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               type:
 *                 type: string
 *             required:
 *               - type
 *     responses:
 *       200:
 *         description: Type details updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FailureResponse'
 */
router.put(
	'/type/:id',
	authenticate,
	wrapAsync(authorize(['SuperAdmin'])),
	validateRequest(createTypeSchema),
	wrapAsync(TypeController.updateType),
)

/**
 * @swagger
 * /type/{id}:
 *   delete:
 *     summary: Delete type
 *     tags: [Animal]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Type id
 *     responses:
 *       200:
 *         description: Type deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FailureResponse'
 */
router.delete(
	'/type/:id',
	authenticate,
	wrapAsync(authorize(['SuperAdmin'])),
	wrapAsync(TypeController.deleteType),
)

/**
 * @swagger
 * /add_type_of_an_animal:
 *   post:
 *     summary: Add type of an animal
 *     tags: [Animal]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               animal_id:
 *                 type: integer
 *               type_id:
 *                 type: integer
 *             required:
 *               - animal_id
 *               - type_id
 *     responses:
 *       201:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       400:
 *         description: Already exists
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FailureResponse'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FailureResponse'
 */
router.post(
	'/add_type_of_an_animal',
	authenticate,
	wrapAsync(authorize(['SuperAdmin'])),
	validateRequest(addTypeOfAnAnimalSchema),
	wrapAsync(AnimalController.addTypeOfAnAnimal),
)

/**
 * @swagger
 * /get_types_of_an_animal/{id}:
 *   get:
 *     summary: Get types of an animal
 *     tags: [Animal]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Animal ID
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FailureResponse'
 */
router.get(
	'/get_types_of_an_animal/:id',
	authenticate,
	wrapAsync(authorize(['SuperAdmin'])),
	wrapAsync(AnimalController.getTypesOfAnAnimal),
)

/**
 * @swagger
 * /get_all_animals_with_their_types:
 *   get:
 *     summary: Get all animals with their types
 *     tags: [Animal]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FailureResponse'
 */
router.get(
	'/get_all_animals_with_their_types',
	authenticate,
	wrapAsync(authorize(['SuperAdmin'])),
	wrapAsync(AnimalController.getAllAnimalsWithTheirTypes),
)

/**
 * @swagger
 * /delete_animal_type/{animal_type_id}:
 *   delete:
 *     summary: Delete animal type
 *     tags: [Animal]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: animal_type_id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Animal Type ID
 *     responses:
 *       200:
 *         description: Deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       400:
 *         description: Something went wrong
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FailureResponse'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FailureResponse'
 */
router.delete(
	'/delete_animal_type/:animal_type_id',
	authenticate,
	wrapAsync(authorize(['SuperAdmin'])),
	wrapAsync(AnimalController.deleteAnimalType),
)

/**
 * @swagger
 * /get_all_animals/{language_id}:
 *   get:
 *     summary: Get all animals by language
 *     tags: [Animal]
 *     parameters:
 *       - in: path
 *         name: language_id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Language ID
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 */
router.get(
	'/get_all_animals/:language_id',
	wrapAsync(AnimalController.getAllAnimals),
)

export default router
