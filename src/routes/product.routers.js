import {Router} from 'express';

const router = Router();

//GET whit a id
router.get('/:id', (req, res) => {
// Extract the product ID from the request parameters
});

//GET all
router.get('/', (req, res) => {
    // Logic to retrieve all products
});

//POST a new product
router.post('/', (req, res) => {
    // Logic to create a new product
});

//PUT update a product
router.put('/:id', (req, res) => {
    // Logic to update a product completely
});
//PATCH update a product partially
router.patch('/:id', (req, res) => {
    // Logic to update a product partially
});

//DELETE a product
router.delete('/:id', (req, res) => {
    // Logic to delete a product
});
export default router;