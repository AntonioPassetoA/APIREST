const fs = require('fs'); // Módulo 'fs' para manipulação de arquivos.
const jwt = require('jsonwebtoken'); // Módulo 'jsonwebtoken' para gerar e verificar tokens JWT.
const bcrypt = require('bcrypt'); // Módulo 'bcrypt' para criptografar senhas.
const usersFile = './data/users.json'; // Caminho do arquivo onde os dados dos usuários são armazenados.

/**
 * Função para registrar um usuário
 */
exports.registerUser = (req, res) => {
  const { username, password, email, nome } = req.body;

  // Verifica se todos os campos obrigatórios foram enviados
  if (!username || !password || !email || !nome) {
    return res.status(400).json({ message: 'Nome de usuário e senha são obrigatórios.' });
  }

  // Criptografa a senha do novo usuário
  bcrypt.hash(password, 10, (err, hashedPassword) => {
    if (err) return res.status(500).json({ message: 'Erro ao processar a senha.' });

    // Cria o novo usuário com a senha criptografada
    const newUser = { username, password: hashedPassword, email, nome };
    
    // Lê o arquivo de usuários e adiciona o novo usuário
    const users = JSON.parse(fs.readFileSync(usersFile, 'utf8'));
    users.push(newUser);

    // Atualiza o arquivo de usuários com o novo usuário
    fs.writeFileSync(usersFile, JSON.stringify(users));

    // Retorna sucesso
    res.status(201).json({ message: 'Usuário registrado com sucesso.' });
  });
};

/**
 * Função de login e geração de token JWT
 */
exports.loginUser = (req, res) => {
  const { username, password } = req.body;

  // Lê o arquivo de usuários e encontra o usuário que está tentando fazer login
  const users = JSON.parse(fs.readFileSync(usersFile, 'utf8'));
  const user = users.find(u => u.username === username);

  // Se o usuário não for encontrado
  if (!user) return res.status(404).json({ message: 'Usuário não encontrado.' });

  // Compara a senha fornecida com a senha criptografada
  bcrypt.compare(password, user.password, (err, result) => {
    if (!result) return res.status(401).json({ message: 'Senha incorreta.' });

    // Gera o token JWT com dados do usuário (username e role)
    const token = jwt.sign({ username: user.username, role: user.role }, process.env.JWT_SECRET_KEY, { expiresIn: '1h' });

    // Retorna o token JWT
    res.status(200).json({ message: 'Login bem-sucedido.', token });
  });
};

/**
 * Função para criar um novo administrador
 */
exports.createAdmin = (req, res) => {
  const { username, password, email } = req.body;

  // Verifica se os dados obrigatórios foram enviados
  if (!username || !password || !email) {
    return res.status(400).json({ message: 'Nome de usuário e senha são obrigatórios.' });
  }

  // Criptografa a senha para o novo administrador
  bcrypt.hash(password, 10, (err, hashedPassword) => {
    if (err) return res.status(500).json({ message: 'Erro ao processar a senha.' });

    // Cria um novo usuário com a role 'admin'
    const newUser = { username, password: hashedPassword, email, role: 'admin' };
    
    // Lê o arquivo de usuários e adiciona o novo administrador
    const users = JSON.parse(fs.readFileSync(usersFile, 'utf8'));
    users.push(newUser);

    // Atualiza o arquivo de usuários
    fs.writeFileSync(usersFile, JSON.stringify(users));

    // Retorna sucesso
    res.status(201).json({ message: 'Usuário administrador registrado com sucesso.' });
  });
};

/**
 * Função para excluir um usuário
 */
exports.deleteUser = (req, res) => {
  const username = req.params.username;

  // Verifica se o nome de usuário foi enviado como parâmetro
  if (!username) return res.status(400).json({ message: 'Usuário não enviado no parametro' });

  // Lê o arquivo de usuários e encontra o usuário a ser excluído
  const users = JSON.parse(fs.readFileSync(usersFile, 'utf8'));
  const user = users.find(u => u.username === username);

  // Se o usuário não for encontrado
  if (!user) return res.status(404).json({ message: 'Usuário não cadastrado' });

  // Impede que administradores sejam excluídos
  if (user.role === 'admin') return res.status(429).json({ message: 'Usuário não pode ser excluído pois é admin' });

  // Exclui o usuário do arquivo
  fs.writeFileSync(usersFile, JSON.stringify(users.filter(user => user.username !== username)));

  // Retorna sucesso
  return res.status(200).json({ message: 'Usuário excluído com sucesso' });
};

/**
 * Função para atualizar dados de um usuário
 */
exports.updateUser = (req, res) => {
  const { email, nome } = req.body;
  const username = req.params.username;

  // Verifica se os dados necessários para atualização foram enviados
  if (!email || !nome) return res.status(400).json({ message: 'Dados não enviados para atualização' });

  // Lê o arquivo de usuários e encontra o usuário a ser atualizado
  const users = JSON.parse(fs.readFileSync(usersFile, 'utf8'));
  const userIndex = users.findIndex(u => u.username === username);

  // Verifica se o usuário está tentando atualizar os dados de outro usuário sem ser administrador
  if (users[userIndex].username !== req.user.username && req.user.role !== 'admin') {
    return res.status(401).json({ message: 'Usuário não autorizado a atualizar outros usuários.' });
  }

  // Atualiza os dados do usuário
  users[userIndex].nome = nome;
  users[userIndex].email = email;

  // Atualiza o arquivo de usuários com as mudanças
  fs.writeFileSync(usersFile, JSON.stringify(users));

  // Retorna sucesso
  res.status(200).json({ message: 'Usuário atualizado com sucesso' });
};
