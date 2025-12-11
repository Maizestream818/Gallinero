import bcrypt from 'bcryptjs';
import { User } from '../models/user.model.js';

export const authController = {

  // Registro
  async register(req, res) {
    try {
      const { fullName, email, password, avatar } = req.body;

      // Validar si existe
      const existing = await User.findByEmail(email);
      if (existing) return res.status(400).json({ message: "El usuario ya existe" });

      // Encriptar password
      const hashed = await bcrypt.hash(password, 10);

      // Crear usuario
      const id = await User.create({
        fullName,
        email,
        password: hashed,
        avatar
      });

      res.json({ message: "Usuario creado", id });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Error al registrar" });
    }
  },

  // Login
  async login(req, res) {
    try {
      const { email, password } = req.body;

      const user = await User.findByEmail(email);
      if (!user) return res.status(400).json({ message: "Credenciales incorrectas" });

      // Comparar password
      const valid = await bcrypt.compare(password, user.password);
      if (!valid) return res.status(400).json({ message: "Credenciales incorrectas" });

      // Enviar usuario sin el password
      delete user.password;

      res.json({ message: "Login exitoso", user });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Error al iniciar sesión" });
    }
  },

  // Actualizar perfil
  async updateProfile(req, res) {
    try {
      const { id } = req.params;
      const { fullName, email, avatar } = req.body;

      await User.updateProfile(id, { fullName, email, avatar });

      res.json({ message: "Perfil actualizado" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Error al actualizar" });
    }
  }
};
