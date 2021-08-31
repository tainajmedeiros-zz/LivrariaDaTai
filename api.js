const express = require("express");
const api = express();

api.use(express.json());
api.use(express.urlencoded({ extended: true }));

var bandoDeDados = {
  autores: [
    {
      id: 1,
      nome: "Machado de Assis",
      nacionalidade: "Brasileiro",
    },
    {
      id: 2,
      nome: "José de Alencar",
      nacionalidade: "Brasileiro",
    },
    {
      id: 3,
      nome: "J. K. Rowling",
      nacionalidade: "Britânica",
    },
  ],
  livros: [
    {
      id: 1,
      nome: "Dom Casmurro",
      descricao: "bla bla ble Casmurro",
      autor: 1,
      publicacao: 1899,
      preco: 25,
      estado: "Novo",
    },
    {
      id: 2,
      nome: "Memórias Póstumas de Brás Cubas.",
      descricao: "blah blah blah",
      autor: 1,
      publicacao: 1881,
      preco: 20,
      estado: "Usado",
    },
    {
      id: 3,
      nome: "O Sertanejo.",
      descricao: "blah blah blah",
      autor: 2,
      publicacao: 1875,
      preco: 30,
      estado: "Usado",
    },
    {
      id: 4,
      nome: "Iracema.",
      descricao: "blah blah blah",
      autor: 2,
      publicacao: 1886,
      preco: 28.5,
      estado: "Novo",
    },
    {
      id: 5,
      nome: "Harry Potter e a Pedra Filosofal.",
      descricao: "blah blah blah",
      autor: 2,
      publicacao: 1997,
      preco: 28.5,
      estado: "Novo",
    },
    {
      id: 6,
      nome: "Harry Potter e a Câmara Secreta.",
      descricao: "blah blah blah",
      autor: 2,
      publicacao: 1998,
      preco: 28.5,
      estado: "Novo",
    },
  ],
  usuarios: []
};

var qtdeLivros = ++bandoDeDados.livros.length

api.listen(3000, function () {
  console.log("Servidor tá em pé.....");
});

api.get("/livros", (req, res) => {
    let response = [];

    if (req.query.nome) {
        for (let i = 0; i < bancoDeDados.livros.length; i++) {
            pesquisa = req.query.nome.toLowerCase()
            nome = bancoDeDados.livros[i].nome.toLowerCase()

            if (nome.includes(pesquisa)) {
                response.push({
                    id: bancoDeDados.livros[i].id,
                    nome: bancoDeDados.livros[i].nome,
                    estado: bancoDeDados.livros[i].estado,
                })
            }
        }
    } else {
        for (let i = 0; i < bancoDeDados.livros.length; i++) {
            response.push({
                id: bancoDeDados.livros[i].id,
                nome: bancoDeDados.livros[i].nome,
                estado: bancoDeDados.livros[i].estado,
            })
        }
    }

    res.json(response);
});

api.get("/livro/:id", (req, res) => {
  if (isNaN(req.params.id)) {
    res.sendStatus(400);
  } else {
    var id = parseInt(req.params.id);
    var livro = bandoDeDados.livros.find((livro) => livro.id == id);

    if (livro == undefined) {
      res.sendStatus(404);
    } else {
      res.json(livro);
      res.sendStatus(200);
    }
  }
});

api.post("/livro", (req, res) => {
    var { nome, descricao, autor, publicacao, preco, estado } = req.body

    if(nome == undefined || estado == undefined || autor == undefined){
        res.sendStatus(400)
    } else {
        let autorId = parseInt(autor)
        let autorAchado = bandoDeDados.autores.find((autor) => autor.id == autorId)
        if(autorAchado == undefined) {
            res.sendStatus(404)
        } else {
            bandoDeDados.livros.push({
                id: qtdeLivros,
                nome,
                descricao,
                autor : autorAchado.id,
                publicacao,
                preco,
                estado
            })
            qtdeLivros++
            res.sendStatus(201)
        }
    }
})

api.get("/autores", (req, res) => {
    res.json(bancoDeDados.autores);
});

api.get("/autores/:id", (req, res) => {
    if (isNaN(req.params.id)) {
        res.statusCode = 404;
        res.json({ "message": "Autor nao existe" });
    } else {
        var id = parseInt(req.params.id);
        var autor = bancoDeDados.autores.find((autor) => autor.id == id);

        if (autor == undefined) {
            res.statusCode = 404;
            res.json({ "message": "Autor nao existe" });
        } else {
            res.json(autor);
            res.statusCode = 200;
        }
    }
});

api.get("/autores/:id/livros", (req, res) => {
    if (isNaN(req.params.id)) {
        res.statusCode = 404;
        res.json({ "message": "Autor nao existe" });
    } else {
        var id = parseInt(req.params.id);
        var livros = bancoDeDados.livros.filter((livro) => livro.autor == id);

        if (livros == undefined || livros.length == 0) {
            res.statusCode = 404;
            res.json({ "message": "Autor nao existe" });
        } else {
            res.json(livros);
        }
    }
});

function enviarEmail(corpo, para) {
    console.log("Enviando email!");
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            var deuErro = false;
            if (!deuErro) {
                resolve({ email: para, time: "4s" }); 
            } else {
                reject(para);
            }
        }, 4000)
    });
};

api.post("/usuarios", (req, res) => {
    var { nome, email, telefone } = req.body;
    // Campos obrigatórios
    if (nome == null || email == null) {
        res.statusCode = 400;
        res.json({ "message": "nome e email são campos obrigatorios." });
        return;
    }
    // Verificando Email
    var re = /\S+@\S+\.\S+/;
    if (!re.test(email)) {
        res.statusCode = 400;
        res.json({ "message": "formato de email inválido" });
        return;
    }
    var id = bancoDeDados.usuarios.length + 1

    bancoDeDados.usuarios.push({
        id: id,
        nome,
        email,
        telefone,
        status: "avaliacao",
    });

    enviarEmail("Oi, seja bem vind@!", email).then(({ email, time }) => {
        console.log(`O email enviado para o usuário: ${id}`);
    }).catch((email) => {
        console.log(`Houve um erro ao enviar email para ${email}!`);
    });

    res.json({ "id": id });
    res.statusCode = 200;
});