import Person from '../models/personModel.js';
import { NotFoundError } from '../errors/businessError.js';
import {
  validateUniqueness,
  validateRequiredFields,
} from '../utils/validationUtils.js';
import { saveImageAndGetUrl, deleteImageFiles } from '../utils/imageUtils.js';

class PersonService {
  /**
   * Get one person by ID
   * param {String} id - Person ID
   * returns {Promise<Object>} Person document
   * throws {NotFoundError} If person not found
   */
  async getOne(id) {
    const person = await Person.findById(id).exec();
    if (!person) {
      throw new NotFoundError('Person', id);
    }
    return person;
  }

  /**
   * Get all active persons
   * returns {Promise<Array>} List of active persons
   */
  async getAll() {
    return await Person.find({ is_active: true }).exec();
  }

  /**
   * Create a new person
   * param {Object} data - Person data
   * returns {Promise<Object>} Created person document
   * throws {DuplicateError} If dni or email already exists
   * throws {ValidationError} If required fields are missing
   */
  async create(data) {
    // Validate required fields
    validateRequiredFields(data, ['dni', 'first_name', 'email'], 'Person');

    // Validate uniqueness of dni and email
    await validateUniqueness(Person, 'dni', data.dni, null, 'Person');
    await validateUniqueness(Person, 'email', data.email, null, 'Person');

    // If there is an image, save it and get URL
    if (data.image) {
      const imageUrls = await saveImageAndGetUrl(
        data.image,
        'persons',
        'person'
      );
      data.image = imageUrls; // Replace buffer with URL
    }

    // Create and save person
    const person = new Person(data);
    return await person.save();
  }

  /**
   * Update a person (full update)
   * param {String} id - Person ID
   * param {Object} data - Updated person data
   * returns {Promise<Object>} Updated person document
   * throws {NotFoundError} If person not found
   * throws {DuplicateError} If dni or email already exists
   */
  async update(id, data) {
    // Validate uniqueness for updated fields
    if (data.dni) {
      await validateUniqueness(Person, 'dni', data.dni, id, 'Person');
    }
    // Validate uniqueness for updated fields
    if (data.email) {
      await validateUniqueness(Person, 'email', data.email, id, 'Person');
    }
    // Find existing person
    const person = await Person.findById(id).exec();
    // Validate existence
    if (!person) {
      throw new NotFoundError('Person', id);
    }

    // If there is an image, save it and get URL
    if (data.image) {
      const imageUrls = await saveImageAndGetUrl(
        data.image,
        'persons',
        'person'
      );
      data.image = imageUrls; // Replace buffer with URL
    }
    // Full update
    Object.assign(person, data);

    // Update person
    return await person.save();
  }

  /**
   * Partially update a person
   * param {String} id - Person ID
   * param {Object} data - Partial person data
   * returns {Promise<Object>} Updated person document
   * throws {NotFoundError} If person not found
   * throws {DuplicateError} If dni or email already exists
   */
  async updatePartial(id, updates) {
    // Validate uniqueness only for fields being updated
    if (updates.dni) {
      await validateUniqueness(Person, 'dni', updates.dni, id, 'Person');
    }
    if (updates.email) {
      await validateUniqueness(Person, 'email', updates.email, id, 'Person');
    }

    // If there is an image, save it and get URL
    if (data.image) {
      const imageUrls = await saveImageAndGetUrl(
        data.image,
        'persons',
        'person'
      );
      data.image = imageUrls; // Replace buffer with URL
    }
    // Partial update with validators
    const updatedPerson = await Person.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    }).exec();
    // Validate existence
    if (!updatedPerson) {
      throw new NotFoundError('Person', id);
    }
    // Partial update
    return updatedPerson;
  }

  /*
   * Update status
   *
   * @param {String} id - Person ID
   * @param {Boolean} is_active - New status
   * @returns {Promise<Object>} Updated person document
   * throws {NotFoundError} If person not found
   */
  async updateStatus(id, is_active = false) {
    const updatedPerson = await Person.findByIdAndUpdate(
      id,
      { is_active },
      { new: true }
    ).exec();
    // Validate existence
    if (!updatedPerson) {
      throw new NotFoundError('Person', id);
    }
    return updatedPerson;
  }

  /**
   * Delete a person (soft delete)
   * param {String} id - Person ID
   * returns {Promise<Object>} Deleted person document
   * throws {NotFoundError} If person not found
   */
  async delete(id) {
    const deletedPerson = await Person.findByIdAndDelete(id).exec();
    if (!deletedPerson) {
      throw new NotFoundError('Person', id);
    }
    // Delete images
    await deleteImageFiles(deletedPerson.image, 'persons');
    return deletedPerson;
  }
}

export default new PersonService();
