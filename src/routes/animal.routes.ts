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
	deleteUserAnimalSchema,
	addAnimalQuestionSchema,
	animalDetailsBasedOnAnimalTypeSchema,
	uploadAnimalImageSchema,
} from '@/validations/animal.validation'
import { AnimalQuestionsBasedOnCategoryController } from '@/controllers/animal_questions_based_on_category.controller'
import { uploadAnimalImage } from '@/middlewares/multer.middleware'

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

/**
 * @swagger
 * /get_animal_number/{animal_id}:
 *   get:
 *     summary: Get animal number by animal ID
 *     tags: [Animal]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: animal_id
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
	'/get_animal_number/:animal_id',
	authenticate,
	wrapAsync(AnimalController.getAnimalNumberByAnimalId),
)

/**
 * @swagger
 * /delete_user_animal:
 *   post:
 *     summary: Delete user animal
 *     tags: [Animal]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User animal deleted successfully
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
	'/delete_user_animal',
	authenticate,
	wrapAsync(authorize(['SuperAdmin'])),
	validateRequest(deleteUserAnimalSchema),
	wrapAsync(AnimalController.deleteUserAnimal),
)

/**
 * @swagger
 * /user_animal_count:
 *   get:
 *     summary: Get user animal count
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
	'/user_animal_count',
	authenticate,
	wrapAsync(AnimalController.farmAnimalCount),
)

/**
 * @swagger
 * /animal_info/{animal_id}:
 *   get:
 *     summary: Get animal info by ID
 *     tags: [Animal]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: animal_id
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
	'/animal_info/:animal_id',
	authenticate,
	wrapAsync(AnimalController.animalInfo),
)

/**
 * @swagger
 * /update_animal_number_answer:
 *   put:
 *     summary: Update animal number answer
 *     tags: [Animal]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Animal number answer updated successfully
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
	'/update_animal_number_answer',
	authenticate,
	wrapAsync(AnimalController.updateAnimalNumberAnswer),
)

/**
 * @swagger
 * /add_animal_question:
 *   post:
 *     summary: Add animal-question mappings
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
 *               question_id:
 *                 type: array
 *                 items:
 *                   type: integer
 *             required:
 *               - animal_id
 *               - question_id
 *     responses:
 *       201:
 *         description: Animal-question mappings added successfully
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
	'/add_animal_question',
	authenticate,
	wrapAsync(authorize(['SuperAdmin'])),
	validateRequest(addAnimalQuestionSchema),
	wrapAsync(AnimalController.addAnimalQuestion),
)

/**
 * @swagger
 * /delete_animal_question/{id}:
 *   delete:
 *     summary: Delete animal-question mapping by id
 *     tags: [Animal]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: AnimalQuestion ID
 *     responses:
 *       200:
 *         description: Animal-question mapping deleted successfully
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
 *         description: Not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FailureResponse'
 */
router.delete(
	'/delete_animal_question/:id',
	authenticate,
	wrapAsync(authorize(['SuperAdmin'])),
	wrapAsync(AnimalController.deleteAnimalQuestion),
)

/**
 * @swagger
 * /get_animal_question/{id}/{language_id}:
 *   get:
 *     summary: Get questions mapped to an animal, optionally filtered by language
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
 *       - in: path
 *         name: language_id
 *         schema:
 *           type: integer
 *         required: false
 *         description: Language ID (optional)
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
 *         description: Not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FailureResponse'
 */
router.get(
	'/get_animal_question/:id/:language_id?',
	authenticate,
	wrapAsync(authorize(['SuperAdmin'])),
	wrapAsync(AnimalController.getAnimalQuestionById),
)

/**
 * @swagger
 * /animal_question_basic_details/{animal_id}/{language_id}:
 *   get:
 *     summary: Get animal questions for basic details category (category_id=1) in a language
 *     tags: [Animal]
 *     parameters:
 *       - in: path
 *         name: animal_id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Animal ID
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
 *       404:
 *         description: Not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FailureResponse'
 */
router.get(
	'/animal_question_basic_details/:animal_id/:language_id',
	authenticate,
	wrapAsync(
		AnimalQuestionsBasedOnCategoryController.animalQuestionBasedOnBasicDetailsCategory,
	),
)

/**
 * @swagger
 * /animal_question_breeding_details/{animal_id}/{language_id}:
 *   get:
 *     summary: Get animal questions for breeding details category (category_id=2) in a language
 *     tags: [Animal]
 *     parameters:
 *       - in: path
 *         name: animal_id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Animal ID
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
 *       404:
 *         description: Not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FailureResponse'
 */
router.get(
	'/animal_question_breeding_details/:animal_id/:language_id',
	authenticate,
	wrapAsync(
		AnimalQuestionsBasedOnCategoryController.animalQuestionBasedOnBreedingDetailsCategory,
	),
)

/**
 * @swagger
 * /animal_question_milk_details/{animal_id}/{language_id}:
 *   get:
 *     summary: Get animal questions for milk details category (category_id=3) in a language
 *     tags: [Animal]
 *     parameters:
 *       - in: path
 *         name: animal_id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Animal ID
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
 *       404:
 *         description: Not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FailureResponse'
 */
router.get(
	'/animal_question_milk_details/:animal_id/:language_id',
	authenticate,
	wrapAsync(authorize(['SuperAdmin'])),
	wrapAsync(
		AnimalQuestionsBasedOnCategoryController.animalQuestionBasedOnMilkDetailsCategory,
	),
)

/**
 * @swagger
 * /animal_question_birth_details/{animal_id}/{language_id}:
 *   get:
 *     summary: Get animal questions for birth details category (category_id=4) in a language
 *     tags: [Animal]
 *     parameters:
 *       - in: path
 *         name: animal_id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Animal ID
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
 *       404:
 *         description: Not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FailureResponse'
 */
router.get(
	'/animal_question_birth_details/:animal_id/:language_id',
	authenticate,
	wrapAsync(authorize(['SuperAdmin'])),
	wrapAsync(
		AnimalQuestionsBasedOnCategoryController.animalQuestionBasedOnBirthDetailsCategory,
	),
)

/**
 * @swagger
 * /animal_question_health_details/{animal_id}/{language_id}:
 *   get:
 *     summary: Get animal questions for health details category (category_id=5) in a language
 *     tags: [Animal]
 *     parameters:
 *       - in: path
 *         name: animal_id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Animal ID
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
 *       404:
 *         description: Not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FailureResponse'
 */
router.get(
	'/animal_question_health_details/:animal_id/:language_id',
	authenticate,
	wrapAsync(authorize(['SuperAdmin'])),
	wrapAsync(
		AnimalQuestionsBasedOnCategoryController.animalQuestionBasedOnHealthDetailsCategory,
	),
)

/**
 * @swagger
 * /get_user_animal_delete_questions/{language_id}:
 *   get:
 *     summary: Get user animal delete questions (category_id=10, tags 43,44)
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
 *       404:
 *         description: Not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FailureResponse'
 */
router.get(
	'/get_user_animal_delete_questions/:language_id',
	authenticate,
	wrapAsync(AnimalQuestionsBasedOnCategoryController.userAnimalDeleteQuestions),
)

/**
 * @swagger
 * /get_user_animal_delete_questions_options/{language_id}/{option}:
 *   get:
 *     summary: Get user animal delete questions based on option (category_id=10, tag 45/46)
 *     tags: [Animal]
 *     parameters:
 *       - in: path
 *         name: language_id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Language ID
 *       - in: path
 *         name: option
 *         schema:
 *           type: string
 *         required: true
 *         description: Option (sold_off or animal_dead)
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       404:
 *         description: Not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FailureResponse'
 */
router.get(
	'/get_user_animal_delete_questions_options/:language_id/:option',
	authenticate,
	wrapAsync(
		AnimalQuestionsBasedOnCategoryController.userAnimalDeleteQuestionsBasedOnOptions,
	),
)

/**
 * @swagger
 * /farm_animal_count:
 *   get:
 *     summary: Get total farm animals of a user
 *     tags: [Animal]
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
	'/farm_animal_count',
	authenticate,
	wrapAsync(AnimalQuestionsBasedOnCategoryController.farmAnimalCount),
)

/**
 * @swagger
 * /animal_details_based_on_animal_type:
 *   post:
 *     summary: Get animal details based on animal type
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
 *                 description: ID of the animal
 *               type:
 *                 type: string
 *                 description: Animal type (e.g., cow, buffalo, heifer, bull)
 *             required:
 *               - animal_id
 *               - type
 *     responses:
 *       200:
 *         description: Animal details response
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     animal_name:
 *                       type: string
 *                     pregnant_animal:
 *                       type: integer
 *                     non_pregnant_animal:
 *                       type: integer
 *                     lactating:
 *                       type: integer
 *                     nonLactating:
 *                       type: integer
 *                     animal_data:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           animal_number:
 *                             type: string
 *                           date_of_birth:
 *                             type: string
 *                           weight:
 *                             type: string
 *                           lactating_status:
 *                             type: string
 *                           pregnant_status:
 *                             type: string
 *                 message:
 *                   type: string
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FailureResponse'
 *       422:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FailureResponse'
 */
router.post(
	'/animal_details_based_on_animal_type',
	authenticate,
	validateRequest(animalDetailsBasedOnAnimalTypeSchema),
	wrapAsync(AnimalController.animalDetailsBasedOnAnimalType),
)

/**
 * @swagger
 * /animal_breeding_history/{animal_id}/{animal_number}:
 *   get:
 *     summary: Get animal breeding (calving) history
 *     tags: [Animal]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: animal_id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Animal ID
 *       - in: path
 *         name: animal_number
 *         schema:
 *           type: string
 *         required: true
 *         description: Mother animal number
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     aiHistory:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           dateOfAI:
 *                             type: string
 *                           bullNumber:
 *                             type: string
 *                           motherYield:
 *                             type: string
 *                           semenCompanyName:
 *                             type: string
 *                     deliveryHistory:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           dateOfDelivery:
 *                             type: string
 *                           typeOfDelivery:
 *                             type: string
 *                           calfNumber:
 *                             type: string
 *                             nullable: true
 *                     heatHistory:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           heatDate:
 *                             type: string
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FailureResponse'
 *       404:
 *         description: No breeding history found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FailureResponse'
 */
router.get(
	'/animal_breeding_history/:animal_id/:animal_number',
	authenticate,
	wrapAsync(AnimalController.animalBreedingHistory),
)

/**
 * @swagger
 * /upload_animal_image:
 *   post:
 *     summary: Upload animal profile image
 *     tags: [Animal]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               animal_id:
 *                 type: integer
 *               animal_number:
 *                 type: string
 *               image:
 *                 type: string
 *                 format: binary
 *             required:
 *               - animal_id
 *               - animal_number
 *               - image
 *     responses:
 *       200:
 *         description: Animal image added successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       400:
 *         description: Bad request
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
	'/upload_animal_image',
	authenticate,
	uploadAnimalImage.single('image'),
	validateRequest(uploadAnimalImageSchema),
	wrapAsync(AnimalController.uploadAnimalImage),
)

/**
 * @swagger
 * /animal_profile:
 *   get:
 *     summary: Get animal profile (general, lactation, vaccination, pedigree, image)
 *     tags: [Animal]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: animal_id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Animal ID
 *       - in: query
 *         name: animal_number
 *         schema:
 *           type: string
 *         required: true
 *         description: Animal Number
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     profile_img:
 *                       type: object
 *                       properties:
 *                         image:
 *                           type: string
 *                     general:
 *                       type: object
 *                       properties:
 *                         animal_type:
 *                           type: string
 *                         birth:
 *                           type: string
 *                         weight:
 *                           type: string
 *                         age:
 *                           type: integer
 *                         breed:
 *                           type: string
 *                         lactation_number:
 *                           type: string
 *                     breeding_details:
 *                       type: object
 *                       properties:
 *                         pregnant_status:
 *                           type: string
 *                         lactating_status:
 *                           type: string
 *                         last_delivery_date:
 *                           type: string
 *                         days_in_milk:
 *                           type: integer
 *                         last_breeding_bull_no:
 *                           type: string
 *                     milk_details:
 *                       type: object
 *                       properties:
 *                         average_daily_milk:
 *                           type: number
 *                         current_lactation_milk_yield:
 *                           type: number
 *                         last_lactation_milk_yield:
 *                           type: number
 *                         last_known_snf:
 *                           type: number
 *                         last_known_fat:
 *                           type: number
 *                     vaccination_details:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           type:
 *                             type: string
 *                           date:
 *                             type: string
 *                     pedigree:
 *                       type: object
 *                       properties:
 *                         mother:
 *                           type: object
 *                           properties:
 *                             tag_no:
 *                               type: string
 *                             milk_yield:
 *                               type: number
 *                         father:
 *                           type: object
 *                           properties:
 *                             tag_no:
 *                               type: string
 *                             semen_co_name:
 *                               type: string
 *                             sire_dam_yield:
 *                               type: number
 *                             daughter_yield:
 *                               type: string
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FailureResponse'
 */
router.get(
	'/animal_profile',
	authenticate,
	wrapAsync(AnimalController.animalProfile),
)

export default router
