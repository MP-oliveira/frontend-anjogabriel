static async createConta(req, res) {
  const { nome, numero_conta, saldo_atual } = req.body;

  try {
    const novaConta = await ContaBancaria.create({
      nome,
      numero_conta,
      saldo_atual
    });
    res.status(201).json(novaConta);
  } catch (error) {
    console.error('Erro ao criar conta:', error);
    res.status(500).json({ erro: 'Erro ao criar conta' });
  }
} 