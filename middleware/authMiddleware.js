const jwt = require('jsonwebtoken'); // Importa o módulo 'jsonwebtoken' para gerar e verificar tokens JWT.

/**
 * Middleware para verificar JWT
 */
exports.authenticateJWT = (req, res, next) => {
  // Tenta extrair o token do cabeçalho 'Authorization' da requisição.
  const token = req.headers['authorization']?.split(' ')[1];
  
  // Se o token não for fornecido, retorna um erro 403 (proibido) com a mensagem 'Token não fornecido.'
  if (!token) return res.status(403).json({ message: 'Token não fornecido.' });

  // Verifica a validade do token usando a chave secreta armazenada nas variáveis de ambiente.
  jwt.verify(token, process.env.JWT_SECRET_KEY, (err, user) => {
    // Se ocorrer erro ao verificar o token, retorna um erro 403 (token inválido).
    if (err) return res.status(403).json({ message: 'Token inválido.' });
    
    // Se o token for válido, adiciona os dados do usuário (extraídos do token) ao objeto 'req.user'
    req.user = user;
    
    // Chama o próximo middleware ou função de rota
    next();
  });
};

/**
 * Middleware para verificar se o usuário é admin
 */
exports.adminOnly = (req, res, next) => {
  // Verifica se o papel (role) do usuário é 'admin'. Se não for, retorna um erro 403 (acesso restrito).
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Acesso restrito apenas a administradores.' });
  }
  
  // Se o usuário for um administrador, chama o próximo middleware ou função de rota
  next();
};
