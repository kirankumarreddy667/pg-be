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

/**
 * @swagger
 * tags:
 *   name: Animal
 *   description: Animal management endpoints
 */

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
 *             required:
 *               - name
 *               - language_id
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Cow"
 *                 description: The name of the animal
 *               language_id:
 *                 type: integer
 *                 example: 1
 *                 description: The language ID for the animal
 *     responses:
 *       200:
 *         description: Animal added successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Animal added successfully
 *                 data:
 *                   type: array
 *                   items: {}
 *                   example: []
 *                 status:
 *                   type: integer
 *                   example: 200
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: The name field is required.
 *                 data:
 *                   type: array
 *                   items: {}
 *                   example: []
 *                 status:
 *                   type: integer
 *                   example: 400
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Unauthorized
 *                 data:
 *                   type: array
 *                   items: {}
 *                   example: []
 *                 status:
 *                   type: integer
 *                   example: 401
 *       422:
 *         description: Validation error (duplicate name or invalid language_id)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: The given data was invalid.
 *                 errors:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: array
 *                       items:
 *                         type: string
 *                       example: ["The name has already been taken."]
 *                     language_id:
 *                       type: array
 *                       items:
 *                         type: string
 *                       example: ["The selected language id is invalid."]
 *                 status:
 *                   type: integer
 *                   example: 422
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Internal server error
 *                 data:
 *                   type: array
 *                   items: {}
 *                   example: []
 *                 status:
 *                   type: integer
 *                   example: 500
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
 *             required:
 *               - name
 *               - language_id
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Buffalo"
 *                 description: The new name of the animal
 *               language_id:
 *                 type: integer
 *                 example: 2
 *                 description: The new language ID of the animal
 *     responses:
 *       200:
 *         description: Animal details updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Animal details updated successfully
 *                 data:
 *                   type: array
 *                   items: {}
 *                   example: []
 *                 status:
 *                   type: integer
 *                   example: 200
 *       400:
 *         description: Bad request (e.g., missing required fields)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: The name field is required.
 *                 data:
 *                   type: array
 *                   items: {}
 *                   example: []
 *                 status:
 *                   type: integer
 *                   example: 400
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Unauthorized
 *                 data:
 *                   type: array
 *                   items: {}
 *                   example: []
 *                 status:
 *                   type: integer
 *                   example: 401
 *       404:
 *         description: Animal not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Not found
 *                 data:
 *                   type: array
 *                   items: {}
 *                   example: []
 *                 status:
 *                   type: integer
 *                   example: 404
 *       422:
 *         description: Validation error (duplicate name or invalid language_id)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: The given data was invalid.
 *                 errors:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: array
 *                       items:
 *                         type: string
 *                       example: ["The name has already been taken."]
 *                     language_id:
 *                       type: array
 *                       items:
 *                         type: string
 *                       example: ["The selected language id is invalid."]
 *                 status:
 *                   type: integer
 *                   example: 422
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Internal server error
 *                 data:
 *                   type: array
 *                   items: {}
 *                   example: []
 *                 status:
 *                   type: integer
 *                   example: 500
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
 *     summary: Delete a daily record question (soft delete)
 *     tags: [Animal]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the daily record question to delete
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Daily record question deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Daily record question deleted successfully."
 *                 status:
 *                   type: integer
 *                   example: 200
 *                 data:
 *                   type: array
 *                   items: {}
 *                   example: []
 *       400:
 *         description: Bad Request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Bad request. Invalid question ID."
 *                 status:
 *                   type: integer
 *                   example: 400
 *                 data:
 *                   type: array
 *                   items: {}
 *                   example: []
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Unauthorized access."
 *                 status:
 *                   type: integer
 *                   example: 401
 *                 data:
 *                   type: array
 *                   items: {}
 *                   example: []
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Internal server error."
 *                 status:
 *                   type: integer
 *                   example: 500
 *                 data:
 *                   type: array
 *                   items: {}
 *                   example: []
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
 *         description: Animal found successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: Success
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 2
 *                     name:
 *                       type: string
 *                       example: Buffalo
 *                     created_at:
 *                       type: string
 *                       nullable: true
 *                       example: null
 *                     updated_at:
 *                       type: string
 *                       format: date-time
 *                       example: "2019-03-18 11:05:17"
 *                     language_id:
 *                       type: integer
 *                       example: 2
 *       400:
 *         description: Bad Request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 400
 *                 message:
 *                   type: string
 *                   example: Something went wrong. Please try again
 *                 data:
 *                   type: array
 *                   items: {}
 *                   example: []
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 401
 *                 message:
 *                   type: string
 *                   example: Unauthorized
 *                 data:
 *                   type: array
 *                   items: {}
 *                   example: []
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 500
 *                 message:
 *                   type: string
 *                   example: Internal server error
 *                 data:
 *                   type: array
 *                   items: {}
 *                   example: []
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
 *             required:
 *               - type
 *             properties:
 *               type:
 *                 type: string
 *                 example: "Herbivore"
 *                 description: The name of the type
 *     responses:
 *       200:
 *         description: Type added successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Animal type added successfully
 *                 data:
 *                   type: array
 *                   items: {}
 *                   example: []
 *                 status:
 *                   type: integer
 *                   example: 200
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: The type field is required.
 *                 data:
 *                   type: array
 *                   items: {}
 *                   example: []
 *                 status:
 *                   type: integer
 *                   example: 400
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Unauthorized
 *                 data:
 *                   type: array
 *                   items: {}
 *                   example: []
 *                 status:
 *                   type: integer
 *                   example: 401
 *       422:
 *         description: Validation error (duplicate type)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: The given data was invalid.
 *                 errors:
 *                   type: object
 *                   properties:
 *                     type:
 *                       type: array
 *                       items:
 *                         type: string
 *                       example: ["The type has already been taken."]
 *                 status:
 *                   type: integer
 *                   example: 422
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Internal server error
 *                 data:
 *                   type: array
 *                   items: {}
 *                   example: []
 *                 status:
 *                   type: integer
 *                   example: 500
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
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Success
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         example: 1
 *                       type:
 *                         type: string
 *                         example: Herbivore
 *                       created_at:
 *                         type: string
 *                         format: date-time
 *                         example: "2024-08-28 11:05:17"
 *                       updated_at:
 *                         type: string
 *                         format: date-time
 *                         example: "2024-08-28 11:05:17"
 *                 status:
 *                   type: integer
 *                   example: 200
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Unauthorized
 *                 data:
 *                   type: array
 *                   items: {}
 *                   example: []
 *                 status:
 *                   type: integer
 *                   example: 401
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Internal server error
 *                 data:
 *                   type: array
 *                   items: {}
 *                   example: []
 *                 status:
 *                   type: integer
 *                   example: 500
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
 *     summary: Get type by ID
 *     tags: [Animal]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Type ID
 *     responses:
 *       200:
 *         description: Type found successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: Success
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     type:
 *                       type: string
 *                       example: Herbivore
 *                     created_at:
 *                       type: string
 *                       format: date-time
 *                       example: "2024-08-28 11:05:17"
 *                     updated_at:
 *                       type: string
 *                       format: date-time
 *                       example: "2024-08-28 11:05:17"
 *       404:
 *         description: Type not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 404
 *                 message:
 *                   type: string
 *                   example: Not found
 *                 data:
 *                   type: array
 *                   items: {}
 *                   example: []
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 401
 *                 message:
 *                   type: string
 *                   example: Unauthorized
 *                 data:
 *                   type: array
 *                   items: {}
 *                   example: []
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 500
 *                 message:
 *                   type: string
 *                   example: Internal server error
 *                 data:
 *                   type: array
 *                   items: {}
 *                   example: []
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
 *         description: Type ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - type
 *             properties:
 *               type:
 *                 type: string
 *                 example: "Carnivore"
 *                 description: The updated type name
 *     responses:
 *       200:
 *         description: Type updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Animal details updated successfull
 *                 data:
 *                   type: array
 *                   items: {}
 *                   example: []
 *                 status:
 *                   type: integer
 *                   example: 200
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: The type field is required.
 *                 data:
 *                   type: array
 *                   items: {}
 *                   example: []
 *                 status:
 *                   type: integer
 *                   example: 400
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Unauthorized
 *                 data:
 *                   type: array
 *                   items: {}
 *                   example: []
 *                 status:
 *                   type: integer
 *                   example: 401
 *       404:
 *         description: Type not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Not found
 *                 data:
 *                   type: array
 *                   items: {}
 *                   example: []
 *                 status:
 *                   type: integer
 *                   example: 404
 *       422:
 *         description: Validation error (duplicate type)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: The given data was invalid.
 *                 errors:
 *                   type: object
 *                   properties:
 *                     type:
 *                       type: array
 *                       items:
 *                         type: string
 *                       example: ["The type has already been taken."]
 *                 status:
 *                   type: integer
 *                   example: 422
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Internal server error
 *                 data:
 *                   type: array
 *                   items: {}
 *                   example: []
 *                 status:
 *                   type: integer
 *                   example: 500
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
 *         description: Type ID
 *     responses:
 *       200:
 *         description: Type deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Success
 *                 data:
 *                   type: array
 *                   items: {}
 *                   example: []
 *                 status:
 *                   type: integer
 *                   example: 200
 *       400:
 *         description: Bad request (invalid type id or delete failed)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Something went wrong. Please try again
 *                 data:
 *                   type: array
 *                   items: {}
 *                   example: []
 *                 status:
 *                   type: integer
 *                   example: 400
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Unauthorized
 *                 data:
 *                   type: array
 *                   items: {}
 *                   example: []
 *                 status:
 *                   type: integer
 *                   example: 401
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Internal server error
 *                 data:
 *                   type: array
 *                   items: {}
 *                   example: []
 *                 status:
 *                   type: integer
 *                   example: 500
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
 *             required:
 *               - animal_id
 *               - type_id
 *             properties:
 *               animal_id:
 *                 type: integer
 *                 example: 1
 *                 description: The ID of the animal
 *               type_id:
 *                 type: integer
 *                 example: 2
 *                 description: The ID of the type
 *     responses:
 *       200:
 *         description: Type added to animal successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Success
 *                 data:
 *                   type: array
 *                   items: {}
 *                   example: []
 *                 status:
 *                   type: integer
 *                   example: 200
 *       400:
 *         description: Bad request (duplicate animal type or missing fields)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: This animal type already exists
 *                 data:
 *                   type: array
 *                   items: {}
 *                   example: []
 *                 status:
 *                   type: integer
 *                   example: 400
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Unauthorized
 *                 data:
 *                   type: array
 *                   items: {}
 *                   example: []
 *                 status:
 *                   type: integer
 *                   example: 401
 *       422:
 *         description: Validation error (invalid animal_id or type_id)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: The given data was invalid.
 *                 errors:
 *                   type: object
 *                   properties:
 *                     animal_id:
 *                       type: array
 *                       items:
 *                         type: string
 *                       example: ["The selected animal id is invalid."]
 *                     type_id:
 *                       type: array
 *                       items:
 *                         type: string
 *                       example: ["The selected type id is invalid."]
 *                 status:
 *                   type: integer
 *                   example: 422
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Internal server error
 *                 data:
 *                   type: array
 *                   items: {}
 *                   example: []
 *                 status:
 *                   type: integer
 *                   example: 500
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
 *         required: true
 *         description: Animal ID
 *         schema:
 *           type: integer
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
 *                   example: Success
 *                 data:
 *                   type: object
 *                   additionalProperties:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         animal_type_id:
 *                           type: integer
 *                           example: 5
 *                         animal_id:
 *                           type: integer
 *                           example: 1
 *                         type_id:
 *                           type: integer
 *                           example: 2
 *                         animal_name:
 *                           type: string
 *                           example: Cow
 *                         animal_type:
 *                           type: string
 *                           example: Herbivore
 *                 status:
 *                   type: integer
 *                   example: 200
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 401
 *                 message:
 *                   type: string
 *                   example: Unauthorized
 *                 data:
 *                   type: array
 *                   items: {}
 *                   example: []
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 500
 *                 message:
 *                   type: string
 *                   example: Internal server error
 *                 data:
 *                   type: array
 *                   items: {}
 *                   example: []
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
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Success
 *                 data:
 *                   type: object
 *                   additionalProperties:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         animal_type_id:
 *                           type: integer
 *                           example: 5
 *                         animal_id:
 *                           type: integer
 *                           example: 1
 *                         type_id:
 *                           type: integer
 *                           example: 2
 *                         animal_name:
 *                           type: string
 *                           example: Cow
 *                         animal_type:
 *                           type: string
 *                           example: Herbivore
 *                 status:
 *                   type: integer
 *                   example: 200
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 401
 *                 message:
 *                   type: string
 *                   example: Unauthorized
 *                 data:
 *                   type: array
 *                   items: {}
 *                   example: []
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 500
 *                 message:
 *                   type: string
 *                   example: Internal server error
 *                 data:
 *                   type: array
 *                   items: {}
 *                   example: []
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
 *         required: true
 *         description: Animal Type ID
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Animal type deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Deleted successfully
 *                 data:
 *                   type: array
 *                   items: {}
 *                   example: []
 *                 status:
 *                   type: integer
 *                   example: 200
 *       400:
 *         description: Bad request (invalid animal type id or delete failed)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Something went wrong. Please try again.
 *                 data:
 *                   type: array
 *                   items: {}
 *                   example: []
 *                 status:
 *                   type: integer
 *                   example: 400
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Unauthorized
 *                 data:
 *                   type: array
 *                   items: {}
 *                   example: []
 *                 status:
 *                   type: integer
 *                   example: 401
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Internal server error
 *                 data:
 *                   type: array
 *                   items: {}
 *                   example: []
 *                 status:
 *                   type: integer
 *                   example: 500
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
 *         description: Animals fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: Success
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         example: 1
 *                       name:
 *                         type: string
 *                         example: Lion
 *                       language_id:
 *                         type: integer
 *                         example: 1
 *       400:
 *         description: Bad Request - Invalid Language ID
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 400
 *                 message:
 *                   type: string
 *                   example: Invalid language_id
 *                 data:
 *                   type: array
 *                   example: []
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 500
 *                 message:
 *                   type: string
 *                   example: Internal Server Error
 *                 data:
 *                   type: array
 *                   example: []
 */
router.get(
	'/get_all_animals/:language_id',
	wrapAsync(AnimalController.getAllAnimals),
)

/**
 * @swagger
 * /get_animal_number/{animal_id}:
 *   get:
 *     summary: Get animal number(s) by animal ID
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
 *         description: Success - returns distinct animal numbers
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Success
 *                 data:
 *                   type: array
 *                   items:
 *                     type: string
 *                   example: ["ANML-001", "ANML-002"]
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Unauthorized
 *                 data:
 *                   type: array
 *                   items: {}
 *                   example: []
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User not found
 *                 data:
 *                   type: array
 *                   items: {}
 *                   example: []
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Internal server error
 *                 data:
 *                   type: array
 *                   items: {}
 *                   example: []
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
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - animal_id
 *               - animal_number
 *               - answers
 *             properties:
 *               animal_id:
 *                 type: integer
 *                 example: 2
 *               animal_number:
 *                 type: string
 *                 example: "ANML-001"
 *               answers:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required:
 *                     - question_id
 *                     - answer
 *                   properties:
 *                     question_id:
 *                       type: integer
 *                       example: 5
 *                     answer:
 *                       type: string
 *                       example: "Yes"
 *     responses:
 *       200:
 *         description: User animal deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: Success
 *                 data:
 *                   type: array
 *                   items: {}
 *                   example: []
 *       400:
 *         description: Bad request (e.g., user not found, invalid animal id/number, or deletion failed)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 400
 *                 message:
 *                   type: string
 *                   example: Something went wrong
 *                 data:
 *                   type: array
 *                   items: {}
 *                   example: []
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 401
 *                 message:
 *                   type: string
 *                   example: Unauthorized
 *                 data:
 *                   type: array
 *                   items: {}
 *                   example: []
 *       422:
 *         description: Validation error (duplicate name or invalid language_id)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: The given data was invalid.
 *                 errors:
 *                   type: object
 *                   properties:
 *                     animal_id:
 *                       type: array
 *                       items:
 *                         type: string
 *                       example: ["The animal id field is required."]
 *                     animal_number:
 *                       type: array
 *                       items:
 *                         type: string
 *                       example: ["The selected animal number is invalid."]
 *                 status:
 *                   type: integer
 *                   example: 422
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 500
 *                 message:
 *                   type: string
 *                   example: Internal server error
 *                 data:
 *                   type: array
 *                   items: {}
 *                   example: []
 */
router.post(
	'/delete_user_animal',
	authenticate,
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
 *         description: Success - returns animal counts by name and ID
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Success
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       animal_id:
 *                         type: integer
 *                         example: 12
 *                       "{animal_name}":
 *                         type: integer
 *                         description: Dynamic animal name as key with count as value
 *                         example: 5
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Unauthorized
 *                 data:
 *                   type: array
 *                   example: []
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User not found
 *                 data:
 *                   type: array
 *                   example: []
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Internal server error
 *                 data:
 *                   type: array
 *                   example: []
 */
router.get(
	'/user_animal_count',
	authenticate,
	wrapAsync(AnimalController.userAnimalCount),
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
 *         description: Success - returns animal info with counts
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: Success
 *                 data:
 *                   type: array
 *                   description: Array of objects containing animal name and counts
 *                   items:
 *                     type: object
 *                     additionalProperties:
 *                       type: integer
 *                   example:
 *                     - { "Cow": 3 }
 *                     - { "male": 0 }
 *                     - { "female": 0 }
 *                     - { "heifer": 0 }
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Unauthorized
 *                 data:
 *                   type: array
 *                   example: []
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User not found
 *                 data:
 *                   type: array
 *                   example: []
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Error retrieving animal info
 *                 data:
 *                   type: array
 *                   example: []
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
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: array
 *                   example: []
 *       401:
 *         description: Unauthorized - User is not authenticated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Unauthorized
 *                 data:
 *                   type: array
 *                   example: []
 *       422:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Validation error
 *                 data:
 *                   type: array
 *                   example: []
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Internal server error
 *                 data:
 *                   type: array
 *                   example: []
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
 *                 example: 1
 *               question_id:
 *                 type: array
 *                 items:
 *                   type: integer
 *                 example: [2, 3, 4]
 *             required:
 *               - animal_id
 *               - question_id
 *     responses:
 *       200:
 *         description: Animal-question mappings added successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Success
 *                 data:
 *                   type: array
 *                   example: []
 *       401:
 *         description: Unauthorized - user not authenticated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Unauthorized
 *                 data:
 *                   type: array
 *                   example: []
 *       422:
 *         description: Validation error - invalid animal_id or question_id
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Validation error
 *                 data:
 *                   type: object
 *                   example:
 *                     animal_id: ["The selected animal id is invalid."]
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Internal server error
 *                 data:
 *                   type: array
 *                   example: []
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
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Success"
 *                 data:
 *                   type: array
 *                   items: {}
 *       400:
 *         description: Bad Request - deletion failed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Something went wrong. Please try again"
 *                 data:
 *                   type: array
 *                   items: {}
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Unauthorized"
 *                 data:
 *                   type: array
 *                   items: {}
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Internal server error"
 *                 data:
 *                   type: array
 *                   items: {}
 */
router.delete(
	'/delete_animal_question/:id',
	authenticate,
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
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Success"
 *                 status:
 *                   type: integer
 *                   example: 200
 *                 data:
 *                   type: object
 *                   additionalProperties:
 *                     type: object
 *                     additionalProperties:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           animal_id:
 *                             type: integer
 *                           validation_rule:
 *                             type: string
 *                           master_question:
 *                             type: string
 *                           language_question:
 *                             type: string
 *                           question_id:
 *                             type: integer
 *                           form_type:
 *                             type: string
 *                           date:
 *                             type: integer
 *                           form_type_value:
 *                             type: string
 *                             nullable: true
 *                           question_language_id:
 *                             type: integer
 *                           constant_value:
 *                             type: integer
 *                           question_unit:
 *                             type: string
 *                           question_tag:
 *                             type: string
 *                           language_form_type_value:
 *                             type: string
 *                             nullable: true
 *                           hint:
 *                             type: string
 *                             nullable: true
 *       400:
 *         description: Bad Request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Invalid request parameters"
 *                 data:
 *                   type: array
 *                   items: {}
 *                 status:
 *                   type: integer
 *                   example: 400
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Unauthorized"
 *                 data:
 *                   type: array
 *                   items: {}
 *                   example: []
 *                 status:
 *                   type: integer
 *                   example: 401
 *       404:
 *         description: Not Found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "No questions found for the given animal ID"
 *                 data:
 *                   type: array
 *                   items: {}
 *                   example: []
 *                 status:
 *                   type: integer
 *                   example: 404
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Internal server error"
 *                 data:
 *                   type: array
 *                   items: {}
 *                   example: []
 *                 status:
 *                   type: integer
 *                   example: 500
 */

router.get(
	'/get_animal_question/:id/:language_id?',
	authenticate,
	wrapAsync(AnimalController.getAnimalQuestionById),
)

/**
 * @swagger
 * /animal_question_basic_details/{animal_id}/{language_id}:
 *   get:
 *     summary: Get animal questions for basic details category (category_id=1) in a language
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
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Success"
 *                 status:
 *                   type: integer
 *                   example: 200
 *                 data:
 *                   type: object
 *                   additionalProperties:
 *                     type: object
 *                     additionalProperties:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           animal_id:
 *                             type: integer
 *                           validation_rule:
 *                             type: string
 *                           master_question:
 *                             type: string
 *                           language_question:
 *                             type: string
 *                           question_id:
 *                             type: integer
 *                           form_type:
 *                             type: string
 *                           date:
 *                             type: boolean
 *                           form_type_value:
 *                             type: string
 *                             nullable: true
 *                           question_language_id:
 *                             type: integer
 *                           constant_value:
 *                             type: string
 *                           question_unit:
 *                             type: string
 *                             nullable: true
 *                           question_tag:
 *                             type: string
 *                             nullable: true
 *                           language_form_type_value:
 *                             type: string
 *                             nullable: true
 *                           hint:
 *                             type: string
 *                             nullable: true
 *                           sequence_number:
 *                             type: integer
 *                             nullable: true
 *                           question_created_at:
 *                             type: string
 *                             format: date-time
 *                             nullable: true
 *       400:
 *         description: Bad Request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Invalid request parameters"
 *                 data:
 *                   type: array
 *                   items: {}
 *                 status:
 *                   type: integer
 *                   example: 400
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Unauthorized"
 *                 data:
 *                   type: array
 *                   items: {}
 *                   example: []
 *                 status:
 *                   type: integer
 *                   example: 401
 *       404:
 *         description: Not Found - no basic details found for given animal/language
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "No questions found for the given animal and language"
 *                 data:
 *                   type: array
 *                   items: {}
 *                   example: []
 *                 status:
 *                   type: integer
 *                   example: 404
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Internal server error"
 *                 data:
 *                   type: array
 *                   items: {}
 *                   example: []
 *                 status:
 *                   type: integer
 *                   example: 500
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
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Success"
 *                 status:
 *                   type: integer
 *                   example: 200
 *                 data:
 *                   type: object
 *                   additionalProperties:
 *                     type: object
 *                     additionalProperties:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           animal_id:
 *                             type: integer
 *                             example: 1
 *                           validation_rule:
 *                             type: string
 *                             example: "required"
 *                           master_question:
 *                             type: string
 *                             example: "What is the daily milk yield?"
 *                           language_question:
 *                             type: string
 *                             example: "दैनिक दूध उत्पादन कितना है?"
 *                           question_id:
 *                             type: integer
 *                             example: 101
 *                           form_type:
 *                             type: string
 *                             example: "number"
 *                           date:
 *                             type: boolean
 *                             example: false
 *                           form_type_value:
 *                             type: string
 *                             example: "liters"
 *                           question_language_id:
 *                             type: integer
 *                             example: 55
 *                           constant_value:
 *                             type: string
 *                             example: ">=0"
 *                           question_unit:
 *                             type: string
 *                             example: "liters"
 *                           question_tag:
 *                             type: string
 *                             example: "milk_yield"
 *                           language_form_type_value:
 *                             type: string
 *                             example: "लीटर"
 *                           hint:
 *                             type: string
 *                             example: "Enter average daily milk yield"
 *                           sequence_number:
 *                             type: integer
 *                             example: 1
 *       400:
 *         description: Bad Request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Invalid request parameters"
 *                 data:
 *                   type: array
 *                   items: {}
 *                 status:
 *                   type: integer
 *                   example: 400
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Unauthorized"
 *                 data:
 *                   type: array
 *                   items: {}
 *                   example: []
 *                 status:
 *                   type: integer
 *                   example: 401
 *       404:
 *         description: Not Found - no milk details found for given animal/language
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "No questions found for the given animal and language"
 *                 data:
 *                   type: array
 *                   items: {}
 *                   example: []
 *                 status:
 *                   type: integer
 *                   example: 404
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Internal server error"
 *                 data:
 *                   type: array
 *                   items: {}
 *                   example: []
 *                 status:
 *                   type: integer
 *                   example: 500
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
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Success"
 *                 status:
 *                   type: integer
 *                   example: 200
 *                 data:
 *                   type: object
 *                   additionalProperties:
 *                     type: object
 *                     additionalProperties:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           animal_id:
 *                             type: integer
 *                             example: 1
 *                           validation_rule:
 *                             type: string
 *                             example: "required"
 *                           master_question:
 *                             type: string
 *                             example: "What is the daily milk yield?"
 *                           language_question:
 *                             type: string
 *                             example: "दैनिक दूध उत्पादन कितना है?"
 *                           question_id:
 *                             type: integer
 *                             example: 101
 *                           form_type:
 *                             type: string
 *                             example: "number"
 *                           date:
 *                             type: boolean
 *                             example: false
 *                           form_type_value:
 *                             type: string
 *                             example: "liters"
 *                           question_language_id:
 *                             type: integer
 *                             example: 55
 *                           constant_value:
 *                             type: string
 *                             example: ">=0"
 *                           question_unit:
 *                             type: string
 *                             example: "liters"
 *                           question_tag:
 *                             type: string
 *                             example: "milk_yield"
 *                           language_form_type_value:
 *                             type: string
 *                             example: "लीटर"
 *                           hint:
 *                             type: string
 *                             example: "Enter average daily milk yield"
 *                           sequence_number:
 *                             type: integer
 *                             example: 1
 *       400:
 *         description: Bad Request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Invalid request parameters"
 *                 data:
 *                   type: array
 *                   items: {}
 *                 status:
 *                   type: integer
 *                   example: 400
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Unauthorized"
 *                 data:
 *                   type: array
 *                   items: {}
 *                   example: []
 *                 status:
 *                   type: integer
 *                   example: 401
 *       404:
 *         description: Not Found - no milk details found for given animal/language
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "No questions found for the given animal and language"
 *                 data:
 *                   type: array
 *                   items: {}
 *                   example: []
 *                 status:
 *                   type: integer
 *                   example: 404
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Internal server error"
 *                 data:
 *                   type: array
 *                   items: {}
 *                   example: []
 *                 status:
 *                   type: integer
 *                   example: 500
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
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Success"
 *                 status:
 *                   type: integer
 *                   example: 200
 *                 data:
 *                   type: object
 *                   additionalProperties:
 *                     type: object
 *                     additionalProperties:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           animal_id:
 *                             type: integer
 *                             example: 1
 *                           validation_rule:
 *                             type: string
 *                             example: "required"
 *                           master_question:
 *                             type: string
 *                             example: "What is the daily milk yield?"
 *                           language_question:
 *                             type: string
 *                             example: "दैनिक दूध उत्पादन कितना है?"
 *                           question_id:
 *                             type: integer
 *                             example: 101
 *                           form_type:
 *                             type: string
 *                             example: "number"
 *                           date:
 *                             type: boolean
 *                             example: false
 *                           form_type_value:
 *                             type: string
 *                             example: "liters"
 *                           question_language_id:
 *                             type: integer
 *                             example: 55
 *                           constant_value:
 *                             type: string
 *                             example: ">=0"
 *                           question_unit:
 *                             type: string
 *                             example: "liters"
 *                           question_tag:
 *                             type: string
 *                             example: "milk_yield"
 *                           language_form_type_value:
 *                             type: string
 *                             example: "लीटर"
 *                           hint:
 *                             type: string
 *                             example: "Enter average daily milk yield"
 *                           sequence_number:
 *                             type: integer
 *                             example: 1
 *       400:
 *         description: Bad Request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Invalid request parameters"
 *                 data:
 *                   type: array
 *                   items: {}
 *                 status:
 *                   type: integer
 *                   example: 400
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Unauthorized"
 *                 data:
 *                   type: array
 *                   items: {}
 *                   example: []
 *                 status:
 *                   type: integer
 *                   example: 401
 *       404:
 *         description: Not Found - no milk details found for given animal/language
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "No questions found for the given animal and language"
 *                 data:
 *                   type: array
 *                   items: {}
 *                   example: []
 *                 status:
 *                   type: integer
 *                   example: 404
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Internal server error"
 *                 data:
 *                   type: array
 *                   items: {}
 *                   example: []
 *                 status:
 *                   type: integer
 *                   example: 500
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
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Success"
 *                 status:
 *                   type: integer
 *                   example: 200
 *                 data:
 *                   type: object
 *                   additionalProperties:
 *                     type: object
 *                     additionalProperties:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           animal_id:
 *                             type: integer
 *                             example: 1
 *                           validation_rule:
 *                             type: string
 *                             example: "required"
 *                           master_question:
 *                             type: string
 *                             example: "What is the daily milk yield?"
 *                           language_question:
 *                             type: string
 *                             example: "दैनिक दूध उत्पादन कितना है?"
 *                           question_id:
 *                             type: integer
 *                             example: 101
 *                           form_type:
 *                             type: string
 *                             example: "number"
 *                           date:
 *                             type: boolean
 *                             example: false
 *                           form_type_value:
 *                             type: string
 *                             example: "liters"
 *                           question_language_id:
 *                             type: integer
 *                             example: 55
 *                           constant_value:
 *                             type: string
 *                             example: ">=0"
 *                           question_unit:
 *                             type: string
 *                             example: "liters"
 *                           question_tag:
 *                             type: string
 *                             example: "milk_yield"
 *                           language_form_type_value:
 *                             type: string
 *                             example: "लीटर"
 *                           hint:
 *                             type: string
 *                             example: "Enter average daily milk yield"
 *                           sequence_number:
 *                             type: integer
 *                             example: 1
 *       400:
 *         description: Bad Request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Invalid request parameters"
 *                 data:
 *                   type: array
 *                   items: {}
 *                 status:
 *                   type: integer
 *                   example: 400
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Unauthorized"
 *                 data:
 *                   type: array
 *                   items: {}
 *                   example: []
 *                 status:
 *                   type: integer
 *                   example: 401
 *       404:
 *         description: Not Found - no milk details found for given animal/language
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "No questions found for the given animal and language"
 *                 data:
 *                   type: array
 *                   items: {}
 *                   example: []
 *                 status:
 *                   type: integer
 *                   example: 404
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Internal server error"
 *                 data:
 *                   type: array
 *                   items: {}
 *                   example: []
 *                 status:
 *                   type: integer
 *                   example: 500
 */
router.get(
	'/animal_question_health_details/:animal_id/:language_id',
	authenticate,
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
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: language_id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Language ID
 *     responses:
 *       200:
 *         description: Questions fetched successfully
 *         content:
 *           application/json:
 *             example:
 *               data:
 *                 DeleteAnimal:
 *                   "":
 *                     - validation_rule: "TYPE_CLASS_NUMBER"
 *                       master_question: "Selling price of animal?"
 *                       language_question: "Selling price of animal?"
 *                       question_id: 27
 *                       form_type: "EditText"
 *                       date: 0
 *                       form_type_value: null
 *                       question_language_id: 27
 *                       constant_value: 2
 *                       question_unit: "Total Cost"
 *                       question_tag: "SoldPriceInDelete"
 *                       language_form_type_value: null
 *                       hint: null
 *               message: "Success"
 *               status: 200
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             example:
 *               message: "Bad request"
 *               status: 400
 *               data: []
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             example:
 *               message: "Unauthorized"
 *               status: 401
 *               data: []
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             example:
 *               message: "Internal server error"
 *               status: 500
 *               data: []
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
 *     security:
 *       - bearerAuth: []
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
 *           enum: [sold_off, animal_dead]
 *         required: true
 *         description: Option (sold_off or animal_dead)
 *     responses:
 *       200:
 *         description: Questions fetched successfully
 *         content:
 *           application/json:
 *             example:
 *               data:
 *                 DeleteAnimal:
 *                   "":
 *                     - validation_rule: "TYPE_CLASS_NUMBER"
 *                       master_question: "Selling price of animal?"
 *                       language_question: "Selling price of animal?"
 *                       question_id: 27
 *                       form_type: "EditText"
 *                       date: 0
 *                       form_type_value: null
 *                       question_language_id: 27
 *                       constant_value: 2
 *                       question_unit: "Total Cost"
 *                       question_tag: "SoldPriceInDelete"
 *                       language_form_type_value: null
 *                       hint: null
 *               message: "Success"
 *               status: 200
 *       400:
 *         description: Bad request (e.g., invalid option)
 *         content:
 *           application/json:
 *             example:
 *               message: "Invalid option"
 *               status: 400
 *               data: []
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             example:
 *               message: "Unauthorized"
 *               status: 401
 *               data: []
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             example:
 *               message: "Internal server error"
 *               status: 500
 *               data: []
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
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             example:
 *               message: "Success"
 *               status: 200
 *               data:
 *                 - Buffalo: 0
 *                 - Cow: 3
 *                 - Goat: 0
 *                 - bull: 0
 *                 - female_cow: 0
 *                 - male_cow: 0
 *                 - buffalo_male: 0
 *                 - buffalo_female: 0
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             example:
 *               message: "User not found"
 *               status: 401
 *               data: []
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             example:
 *               message: "Internal server error"
 *               status: 500
 *               data: []
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
 *                   example: "Success"
 *                 status:
 *                   type: integer
 *                   example: 200
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             example:
 *               message: "User not found"
 *               status: 401
 *               data: []
 *       422:
 *         description: Validation error  (invalid animal_id)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: The given data was invalid.
 *                 errors:
 *                   type: object
 *                   properties:
 *                     animal_id:
 *                       type: array
 *                       items:
 *                         type: string
 *                       example: ["The selected animal id is invalid."]
 *                 status:
 *                   type: integer
 *                   example: 422
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             example:
 *               message: "Internal server error"
 *               status: 500
 *               data: []
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
 *             example:
 *               message: "User not found"
 *               status: 401
 *               data: []
 *       404:
 *         description: No breeding history found
 *         content:
 *           application/json:
 *             example:
 *               message: "No breeding history found"
 *               status: 404
 *               data: []
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             example:
 *               message: "Internal server error"
 *               status: 500
 *               data: []
 */
router.get(
	'/animal_breeding_history/:animal_id/:animal_number',
	authenticate,
	wrapAsync(AnimalController.animalBreedingHistory),
)

/**
 * @swagger
 * /upload_image:
 *   post:
 *     summary: Upload or update animal profile image
 *     description: |
 *       Uploads a new profile image for an animal or updates an existing one.
 *       The system will:
 *       - Validate the animal exists and belongs to the authenticated user
 *       - Create both original and thumbnail versions of the image
 *       - Replace existing image if one already exists
 *       - Support common image formats (JPEG, PNG, JPG)
 *
 *       **File Requirements:**
 *       - Maximum file size: 3MB
 *       - Supported formats: JPEG, PNG, JPG
 *       - Thumbnail will be automatically generated (100x100px)
 *     tags: [Animal]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - animal_id
 *               - animal_number
 *               - image
 *             properties:
 *               animal_id:
 *                 type: integer
 *                 minimum: 1
 *                 description: Unique identifier of the animal in the database
 *                 example: 123
 *               animal_number:
 *                 type: string
 *                 minLength: 1
 *                 description: Animal's identification number/tag number
 *                 example: "COW001"
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: Image file to upload (JPEG, PNG, JPG - max 3MB)
 *           examples:
 *             upload_example:
 *               summary: Example upload request
 *               value:
 *                 animal_id: 123
 *                 animal_number: "COW001"
 *                 image: "(binary file data)"
 *     responses:
 *       200:
 *         description: Animal image uploaded/updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Animal image added successfully"
 *                 status:
 *                   type: integer
 *                   example: 200
 *                 data:
 *                   type: array
 *                   items: {}
 *                   example: []
 *             examples:
 *               success:
 *                 summary: Successful image upload
 *                 value:
 *                   message: "Animal image added successfully"
 *                   status: 200
 *                   data: []
 *       400:
 *         description: Bad request - Validation errors or missing required fields
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 status:
 *                   type: integer
 *                   example: 400
 *                 data:
 *                   oneOf:
 *                     - type: array
 *                       items: {}
 *                       example: []
 *                     - type: object
 *                       properties:
 *                         animal_id:
 *                           type: array
 *                           items:
 *                             type: string
 *                           example: ["The animal id field is required."]
 *                         animal_number:
 *                           type: array
 *                           items:
 *                             type: string
 *                           example: ["The animal number field is required."]
 *             examples:
 *               missing_image:
 *                 summary: Image file not provided
 *                 value:
 *                   message: "Image file is required"
 *                   status: 400
 *                   data: []
 *               validation_error_required_fields:
 *                 summary: Required field validation errors
 *                 value:
 *                   message: "Validation failed"
 *                   status: 400
 *                   data:
 *                     animal_id: ["The animal id field is required."]
 *                     animal_number: ["The animal number field is required."]
 *               validation_error_invalid_data:
 *                 summary: Invalid animal ID or number
 *                 value:
 *                   message: "Validation failed"
 *                   status: 400
 *                   data:
 *                     animal_id: ["The selected animal id is invalid."]
 *                     animal_number: ["The selected animal_number is invalid."]
 *               file_too_large:
 *                 summary: File size exceeds limit
 *                 value:
 *                   message: "File size exceeds the maximum limit of 3MB"
 *                   status: 400
 *                   data: []
 *               invalid_file_type:
 *                 summary: Invalid file type
 *                 value:
 *                   message: "Only image files are allowed"
 *                   status: 400
 *                   data: []
 *               invalid_number_format:
 *                 summary: Invalid animal_id format
 *                 value:
 *                   message: "Validation failed"
 *                   status: 400
 *                   data:
 *                     animal_id: ["The animal id field is required.", "The animal id must be a number."]
 *               empty_string_validation:
 *                 summary: Empty string validation
 *                 value:
 *                   message: "Validation failed"
 *                   status: 400
 *                   data:
 *                     animal_number: ["The animal number field is required."]
 *       401:
 *         description: Unauthorized - Invalid or missing authentication token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User not found"
 *                 status:
 *                   type: integer
 *                   example: 401
 *                 data:
 *                   type: array
 *                   items: {}
 *                   example: []
 *             examples:
 *               unauthorized:
 *                 summary: User not authenticated
 *                 value:
 *                   message: "User not found"
 *                   status: 401
 *                   data: []
 *               invalid_token:
 *                 summary: Invalid JWT token
 *                 value:
 *                   message: "Invalid authentication token"
 *                   status: 401
 *                   data: []
 *               expired_token:
 *                 summary: Expired JWT token
 *                 value:
 *                   message: "Authentication token has expired"
 *                   status: 401
 *                   data: []
 *       413:
 *         description: Payload too large - File size exceeds 3MB limit
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "File size exceeds the maximum limit of 3MB"
 *                 status:
 *                   type: integer
 *                   example: 413
 *                 data:
 *                   type: array
 *                   items: {}
 *                   example: []
 *             examples:
 *               file_too_large:
 *                 summary: File too large
 *                 value:
 *                   message: "File size exceeds the maximum limit of 3MB"
 *                   status: 413
 *                   data: []
 *       415:
 *         description: Unsupported media type - Invalid image format
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Only image files are allowed"
 *                 status:
 *                   type: integer
 *                   example: 415
 *                 data:
 *                   type: array
 *                   items: {}
 *                   example: []
 *             examples:
 *               unsupported_format:
 *                 summary: Unsupported file format
 *                 value:
 *                   message: "Only image files are allowed"
 *                   status: 415
 *                   data: []
 *               non_image_file:
 *                 summary: Non-image file uploaded
 *                 value:
 *                   message: "Only image files are allowed"
 *                   status: 415
 *                   data: []
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Internal server error"
 *                 status:
 *                   type: integer
 *                   example: 500
 *                 data:
 *                   type: array
 *                   items: {}
 *                   example: []
 *             examples:
 *               server_error:
 *                 summary: Internal server error
 *                 value:
 *                   message: "Internal server error"
 *                   status: 500
 *                   data: []
 *               database_error:
 *                 summary: Database connection error
 *                 value:
 *                   message: "Database connection failed"
 *                   status: 500
 *                   data: []
 *               file_processing_error:
 *                 summary: Image processing error
 *                 value:
 *                   message: "Failed to process image file"
 *                   status: 500
 *                   data: []
 */
router.post(
	'/upload_image',
	authenticate,
	uploadAnimalImage.single('image'),
	validateRequest(uploadAnimalImageSchema),
	wrapAsync(AnimalController.uploadAnimalImage),
)

/**
 * @swagger
 * /animal_profile/{animal_id}/{animal_number}:
 *   get:
 *     summary: Get animal profile (general, lactation, vaccination, pedigree, image)
 *     tags: [Animal]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: animal_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Animal ID
 *       - in: path
 *         name: animal_number
 *         required: true
 *         schema:
 *           type: string
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
 *                   example: "Success"
 *                 data:
 *                   type: object
 *                   properties:
 *                     profile_img:
 *                       type: object
 *                       properties:
 *                         image:
 *                           type: string
 *                           example: "http://localhost:8888/animal.jpg"
 *                     general:
 *                       type: object
 *                       properties:
 *                         animal_type:
 *                           type: string
 *                           example: "Cow"
 *                         birth:
 *                           type: string
 *                           example: "2022-01-15"
 *                         weight:
 *                           type: string
 *                           example: "450kg"
 *                         age:
 *                           type: integer
 *                           example: 3
 *                         breed:
 *                           type: string
 *                           example: "Holstein"
 *                         lactation_number:
 *                           type: string
 *                           example: "2"
 *                     breeding_details:
 *                       type: object
 *                       properties:
 *                         pregnant_status:
 *                           type: string
 *                           example: "Yes"
 *                         lactating_status:
 *                           type: string
 *                           example: "Yes"
 *                         last_delivery_date:
 *                           type: string
 *                           example: "2025-06-20"
 *                         days_in_milk:
 *                           type: integer
 *                           example: 150
 *                         last_breeding_bull_no:
 *                           type: string
 *                           example: "BULL123"
 *                     milk_details:
 *                       type: object
 *                       properties:
 *                         average_daily_milk:
 *                           type: number
 *                           example: 12.5
 *                         current_lactation_milk_yield:
 *                           type: number
 *                           example: 1500
 *                         last_lactation_milk_yield:
 *                           type: number
 *                           example: 3200
 *                         last_known_snf:
 *                           type: number
 *                           example: 8.5
 *                         last_known_fat:
 *                           type: number
 *                           example: 4.2
 *                     vaccination_details:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           type:
 *                             type: string
 *                             example: "FMD"
 *                           date:
 *                             type: string
 *                             example: "2025-07-10"
 *                     pedigree:
 *                       type: object
 *                       properties:
 *                         mother:
 *                           type: object
 *                           properties:
 *                             tag_no:
 *                               type: string
 *                               example: "M123"
 *                             milk_yield:
 *                               type: number
 *                               example: 3000
 *                         father:
 *                           type: object
 *                           properties:
 *                             tag_no:
 *                               type: string
 *                               example: "F456"
 *                             semen_co_name:
 *                               type: string
 *                               example: "AgroSemen Ltd"
 *                             sire_dam_yield:
 *                               type: number
 *                               example: 3500
 *                             daughter_yield:
 *                               type: string
 *                               example: "3200"
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User not found"
 *                 data:
 *                   type: array
 *                   example: []
 *                 status:
 *                   type: integer
 *                   example: 401
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Internal server error"
 *                 data:
 *                   type: array
 *                   example: []
 *                 status:
 *                   type: integer
 *                   example: 500
 */
router.get(
	'/animal_profile/:animal_id/:animal_number',
	authenticate,
	wrapAsync(AnimalController.animalProfile),
)

/**
 * @swagger
 * /user/animal/{animal_id}/deleted_history:
 *   get:
 *     summary: Get deleted animal history for a specific animal
 *     tags: [Animal]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: animal_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Animal ID
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
 *                   example: "Success"
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       animal_number:
 *                         type: string
 *                         example: "A001"
 *                       type:
 *                         type: string
 *                         enum: ["Sold", "Died", "Removed"]
 *                         example: "Sold"
 *                       reason:
 *                         type: string
 *                         example: "Low milk production"
 *                       date:
 *                         type: string
 *                         example: "2024-12-15"
 *                       selling_price:
 *                         type: string
 *                         example: "50000"
 *                         description: "Present only when type is 'Sold'"
 *                       death_reason:
 *                         type: string
 *                         example: "Disease"
 *                         description: "Present only when type is 'Died'"
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Unauthorized"
 *                 data:
 *                   type: array
 *                   example: []
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Internal server error"
 *                 data:
 *                   type: array
 *                   example: []
 *                 status:
 *                   type: integer
 *                   example: 500
 */
router.get(
	'/user/animal/:animal_id/deleted_history',
	authenticate,
	wrapAsync(AnimalController.deletedHistory),
)
export default router
