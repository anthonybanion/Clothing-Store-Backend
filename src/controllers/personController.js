import personService from '../services/personService.js';
import { CODE } from '../config/constants.js';

export const getOnePerson = async (req, res, next) => {
  try {
    // Get one person by ID
    const { id } = req.params;
    // Fetch person from service
    const person = await personService.getOne(id);
    // Successful response
    res.status(CODE.SUCCESS).json({
      message: 'Product retrieved successfully',
      data: person,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllPersons = async (req, res, next) => {
  try {
    // Get all persons
    const persons = await personService.getAll();
    // Successful response
    res.status(CODE.SUCCESS).json({
      message: 'Persons retrieved successfully',
      data: persons,
    });
  } catch (error) {
    next(error);
  }
};
