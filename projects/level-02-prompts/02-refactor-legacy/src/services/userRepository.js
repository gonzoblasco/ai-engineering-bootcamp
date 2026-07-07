// src/services/userRepository.js
// Responsabilidad única: persistir/leer usuarios.
// Inyecta el filesystem para ser testeable sin tocar disco.

const { FILE_PATHS } = require('../config/constants');

class UserRepository {
  constructor(fs, filePath = FILE_PATHS.USERS) {
    this.fs = fs;
    this.filePath = filePath;
  }

  save(userDTO) {
    return new Promise((resolve, reject) => {
      this.fs.writeFile(this.filePath, JSON.stringify(userDTO), 'utf8', (err) => {
        if (err) return reject(err);
        resolve(userDTO);
      });
    });
  }

  findById(id) {
    return new Promise((resolve, reject) => {
      this.fs.readFile(this.filePath, 'utf8', (err, data) => {
        if (err) return reject(err);
        try {
          const user = JSON.parse(data);
          resolve(user.id === id ? user : null);
        } catch (parseErr) {
          reject(parseErr);
        }
      });
    });
  }
}

module.exports = UserRepository;