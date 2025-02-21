// Middleware de tratamento de erros
exports.errorHandler = (err, req, res, next) => {
  // Exibe o erro no console para depuração, mostrando a pilha de erros (stack trace)
  console.error(err.stack); // 'err.stack' fornece o rastreamento do erro para facilitar a depuração

  // Retorna uma resposta genérica ao cliente com o status 500 (Erro interno do servidor)
  res.status(500).json({ message: 'Algo deu errado!' });
};
