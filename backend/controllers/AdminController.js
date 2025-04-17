
const Admin = require("../models/admin");
const supabase = require("../db/supabaseCilent");

// Função para criar um usuário no Supabase Auth
async function createSupabaseUser(nome, email, password, role) {
  try {
    const { user, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          displayName: nome,
          role, // Definir o papel do usuário (aluno, admin ou admin)
        },
      },
    });

    if (error) {
      console.error("Erro ao criar usuário:", error.message);
      return null;
    }

    return user;
  } catch (err) {
    console.error("Erro ao criar usuário:", err);
    return null;
  }
}

module.exports = class AdminsController {
  static async listAdmins(req, res) {
    try {
      const admins = await Admin.findAll();
      res.status(200).json(admins);
    } catch (error) {
      console.error("Erro ao listar admins:", error);
      res.status(500).json({ error: "Erro ao listar admins" });
    }
  }

  static async createAdmin(req, res) {
    const {
      nome,
      email,
      telefone,
      role,
      password
    } = req.body;

    try {
      const adminExists = await Admin.findOne({
        where: { email: email },
      });

      if (adminExists) {
        return res
          .status(400)
          .json({ error: "Admin já cadastrado com este email" });
      }

      const admin = {
        nome,
        email,
        telefone,
        role,
        password,
      };

      // Converter para minúsculas com exceções
      const adminLowercase = Object.fromEntries(
        Object.entries(admin).map(([key, value]) => [
          key,
          typeof value === "string" &&
            key !== "nome"
            ? value.toLowerCase()
            : value,
        ])
      );
      console.log(adminLowercase, 'antes do await');

      const createdAdmin = await Admin.create(adminLowercase);
      console.log('depois do create', createdAdmin)
      await createSupabaseUser(adminLowercase.nome, adminLowercase.email, adminLowercase.password, "admin");

      const newAdmin = await Admin.findOne({
        where: { id: createdAdmin.id }
      });

      res.status(201).json(newAdmin);
    } catch (error) {
      console.error("Erro ao criar admin:", error);
      res.status(500).json({ error: "Erro ao criar admin" });
    }
  }

  static async getAdminById(req, res) {
    const { id } = req.params;

    try {
      const admin = await Admin.findOne({
        where: { id: id },
      });

      if (!admin) {
        return res.status(404).json({ error: "Admin não encontrado" });
      }

      res.status(200).json(admin);
    } catch (error) {
      console.error("Erro ao buscar admin:", error);
      res.status(500).json({ error: "Erro ao buscar admin" });
    }
  }

  static async updateAdmin(req, res) {
    const { id } = req.params;
    const {
      nome,
      email,
      telefone,
      role,
      password
    } = req.body;

    try {
      const admin = await Admin.findByPk(id);

      if (!admin) {
        return res.status(404).json({ error: "Admin não encontrado" });
      }

      // Verifica se o novo email já está em uso por outro admin
      if (email && email !== admin.email) {
        const emailExists = await Admin.findOne({
          where: { email: email },
        });
        if (emailExists) {
          return res.status(400).json({ error: "Email já está em uso" });
        }
      }

      await admin.update({
        nome,
        email,
        telefone,
        role,
        password
      });

      const updatedAdmin = await Admin.findOne({
        where: { id: id },
      });

      res.status(200).json(updatedAdmin);
    } catch (error) {
      console.error("Erro ao atualizar admin:", error);
      res.status(500).json({ error: "Erro ao atualizar admin" });
    }
  }

  static async deleteAdmin(req, res) {
    const { id } = req.params;

    try {
      const admin = await Admin.findByPk(id);

      if (!admin) {
        return res.status(404).json({ error: "Admin não encontrado" });
      }

      await admin.destroy();
      res.status(204).send();
    } catch (error) {
      console.error("Erro ao deletar admin:", error);
      res.status(500).json({ error: "Erro ao deletar admin" });
    }
  }
};