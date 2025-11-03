// ==========================================
// 
// Description: Person controller
//
// File: personController.js
// Author: Anthony Bañon
// Created: 2025-11-03
// Last Updated: 2025-11-03
// ==========================================


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
      message: 'Person retrieved successfully',
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

export const createOnePerson = async (req, res, next) => {
  try {
    // Get new person data from body and file (image)
    const personData = {
      ...req.body,
      image: req.file ? req.file.buffer : null, // Compressed image
    };

    // Create new person via service
    const newPerson = await personService.create(personData);
    // Successful response
    res.status(CODE.CREATED).json({
      message: 'Person created successfully',
      data: newPerson,
    });
  } catch (error) {
    next(error);
  }
};

export const updateOnePerson = async (req, res, next) => {
  try {
    // Get person ID from params and update data from body
    const { id } = req.params;
    const personData = { ...req.body };
    // Only update image if a file is sent
    if (req.file) {
      personData.image = req.file.buffer;
    }
    // Update person via service
    const updatedPerson = await personService.update(id, personData);
    // Successful response
    res.status(CODE.SUCCESS).json({
      message: 'Person updated successfully',
      data: updatedPerson,
    });
  } catch (error) {
    next(error);
  }
};

export const updatePartialPerson = async (req, res, next) => {
  try {
    // Get person ID from params and partial update data from body
    const { id } = req.params;
    const updateData = { ...req.body };
    // Only update image if a file is sent
    if (req.file) {
      updateData.image = req.file.buffer;
    }
    // Partially update person via service
    const updatedPerson = await personService.updatePartial(id, updateData);
    // Successful response
    res.status(CODE.SUCCESS).json({
      message: 'Person partially updated successfully',
      data: updatedPerson,
    });
  } catch (error) {
    next(error);
  }
};

export const updatePersonStatus = async (req, res, next) => {
  try {
    // Get person ID from params and status from body
    const { id } = req.params;
    const { is_active } = req.body;
    // Update person status via service
    const updatedPerson = await personService.updateStatus(id, is_active);
    // Successful response
    res.status(CODE.SUCCESS).json({
      message: `Person ${is_active ? 'restored' : 'deactivated'} successfully`,
      data: {
        id: updatedPerson._id,
        name: updatedPerson.name,
        is_active: updatedPerson.is_active,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const deletePersonImage = async (req, res, next) => {
  try {
    const { id } = req.params;

    const updatedPerson = await personService.deleteImage(id);
    res.status(CODE.SUCCESS).json({
      message: 'Person image deleted successfully',
      data: updatedPerson,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteOnePerson = async (req, res, next) => {
  try {
    // Get person ID from params
    const { id } = req.params;
    // Delete person via service
    await personService.delete(id);
    // Successful response
    res.status(CODE.SUCCESS).json({
      message: 'Person deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
