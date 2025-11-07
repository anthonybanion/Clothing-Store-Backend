import Person from '../models/personModel.js';
import { NotFoundError } from '../errors/businessError.js';
import {
  validateUniqueness,
  validateRequiredFields,
} from '../utils/validationUtils.js';
import {
  saveImageAndGetUrl,
  deleteImageFiles,
  processImageUpdate,
} from '../utils/imageUtils.js';

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
    if (data.image && Buffer.isBuffer(data.image)) {
      const imageUrls = await saveImageAndGetUrl(
        data.image,
        'persons',
        'person'
      );
      data.image = imageUrls; // Replace buffer with URL
    } else {
      data.image = null;
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

    // Save the old image for possible deletion
    const oldImage = person.image;

    // Process image using helper function
    if (data.image !== undefined) {
      data.image = await processImageUpdate(data.image, 'persons', 'person');

      // If updating with a new image, delete old ones
      if (data.image && oldImage) {
        await deleteImageFiles(oldImage, 'persons');
      }
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

    // Process image using helper function
    if (updates.image !== undefined) {
      // If there is a current image, get it for possible deletion
      let oldImage = null;
      // Only fetch current image if updating with a new buffer
      if (updates.image && Buffer.isBuffer(updates.image)) {
        const currentPerson = await Person.findById(id).select('image').exec();
        oldImage = currentPerson?.image;
      }

      updates.image = await processImageUpdate(
        updates.image,
        'persons',
        'person'
      );

      // If updating with a new image, delete the old ones
      if (updates.image && oldImage) {
        await deleteImageFiles(oldImage, 'persons');
      }
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
   * Delete only person image
   * param {String} id - Person ID
   * returns {Promise<Object>} Updated person document
   * throws {NotFoundError} If person not found
   */
  async deleteImage(id) {
    // Search for person and only select the image field for efficiency
    const person = await Person.findById(id).select('image').exec();
    if (!person) {
      throw new NotFoundError('Person', id);
    }

    // If image exists, delete it from filesystem
    if (person.image) {
      await deleteImageFiles(person.image, 'persons');
    }

    // Update in the database in a single operation
    const updatedPerson = await Person.findByIdAndUpdate(
      id,
      { image: null },
      { new: true }
    ).exec();

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
    // Delete images using the helper function
    if (deletedPerson.image) {
      await deleteImageFiles(deletedPerson.image, 'persons');
    }
    return deletedPerson;
  }
}

export default new PersonService();
