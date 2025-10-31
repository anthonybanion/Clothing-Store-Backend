import Person from '../models/personModel.js';
import { NotFoundError, DuplicateError } from '../errors/businessError.js';

class PersonService {
  /*
   *Get one person by ID
   *
   * @param {String} id - Person ID
   * @returns {Promise<Object>} Person document
   * throws {NotFoundError} If category not found
   */
  async getOne(id) {
    const person = await Person.findById(id).exec();
    if (!person) {
      throw new NotFoundError('Persons', id);
    }
    return person;
  }

  async getAll() {
    return await Person.find({ is_active: true }).exec();
  }
  async create() {}
  async update() {}
  async updatePartial() {}
  async delete() {}
}

export default new PersonService();
