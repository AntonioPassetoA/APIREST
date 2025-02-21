const fs = require('fs'); // Módulo 'fs' para manipulação de arquivos.
const bcrypt = require('bcrypt'); // Módulo 'bcrypt' para criptografar senhas.
const usersFile = './data/users.json'; // Caminho do arquivo onde os usuários serão armazenados.


// Função para criar um administrador padrão durante a instalação
exports.installAdmin = (req, res) => {
  // Definindo os dados do administrador padrão
  const admin = { 
    username: 'admin', 
    password: 'admin123',  // Senha do administrador (será criptografada)
    role: 'admin',         // Papel do usuário, neste caso, 'admin'
    nome: 'Admin'          // Nome do administrador
  };

  // Criptografando a senha do administrador
  bcrypt.hash(admin.password, 10, (err, hashedPassword) => {
    if (err) return res.status(500).json({ message: 'Erro ao processar a senha.' });  // Retorna erro caso a criptografia falhe

    // Substituindo a senha original pela versão criptografada
    const newAdmin = { ...admin, password: hashedPassword };
    // Colocando o novo administrador em um array (a lista de usuários)
    const users = [newAdmin];

    // Gravando os dados do novo administrador no arquivo JSON
    fs.writeFileSync(usersFile, JSON.stringify(users));

    // Retornando uma resposta de sucesso ao cliente
    res.status(200).json({ message: 'Administrador padrão criado com sucesso.' });
  });
};
