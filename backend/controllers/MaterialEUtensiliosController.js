const MaterialEUtensilio = require("../models/materialEUtensilio");

module.exports = class AuthController {

  static async createMaterialEUtensilio(req, res) {
    const {
      nome,
      categoria,
      quantidade,
      unidade,
      valor_unitario,
      ultimo_pedido,
      status_material,
    } = req.body;

    /* Verificando se o aluno já existe */
    // const checkIfMaterialEUtensilioExists = await MaterialEUtensilio.findOne({
    //   where: { cpf: cpf },
    // });
    // if (checkIfMaterialEUtensilioExists) {
    //   res.render("register");
    //   return;
    // }

    try {

      const materialEUtensilio = {
        nome,
        categoria,
        quantidade,
        unidade,
        valor_unitario,
        ultimo_pedido,
        status_material,
      };

      const createdMaterialEUtensilio = await MaterialEUtensilio.create(materialEUtensilio);
    } catch (error) {
      console.error(error);
      res.render('register', { error: 'Erro ao criar material' });
    }
  }
};
