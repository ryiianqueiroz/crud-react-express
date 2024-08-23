import express from 'express';
import cors from 'cors';

const app = express();

const allowedOrigins = ['http://localhost:5173', 'https://crud-express-sigma.vercel.app'];
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Origin not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Métodos HTTP permitidos
  allowedHeaders: ['Content-Type', 'Authorization', 'type', 'id-reply', 'gain', 'content'], // Cabeçalhos permitidos, incluindo os personalizados
  credentials: true // Permitir envio de cookies e credenciais
}));

app.options('*', cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Origin not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'type', 'id-reply', 'gain', 'content'],
  credentials: true
}));


const PORT = 5000;

app.use(express.json());

// Variável contendo os dados
let data = {
  "currentUser": {
    "image": {
      "png": "./images/avatars/image-juliusomo.png",
      "webp": "./images/avatars/image-juliusomo.webp"
    },
    "username": "juliusomo"
  },
  "comments": [
    {
      "id": 1,
      "content": "Impressive! Though it seems the drag feature could be improved. But overall it looks incredible. You've nailed the design and the responsiveness at various breakpoints works really well.",
      "createdAt": "1 month ago",
      "score": 12,
      "user": {
        "image": {
          "png": "../assets/images/avatars/image-amyrobson.png",
          "webp": "./images/avatars/image-amyrobson.webp"
        },
        "username": "amyrobson"
      },
      "replies": []
    },
    {
      "id": 2,
      "content": "Woah, your project looks awesome! How long have you been coding for? I'm still new, but think I want to dive into React as well soon. Perhaps you can give me an insight on where I can learn React? Thanks!",
      "createdAt": "2 weeks ago",
      "score": 5,
      "user": {
        "image": {
          "png": "./images/avatars/image-maxblagun.png",
          "webp": "./images/avatars/image-maxblagun.webp"
        },
        "username": "maxblagun"
      },
      "replies": [
        {
          "idReply": "sdfsdfee-34kmfd",
          "content": "If you're still new, I'd recommend focusing on the fundamentals of HTML, CSS, and JS before considering React. It's very tempting to jump ahead but lay a solid foundation first.",
          "createdAt": "1 week ago",
          "score": 4,
          "replyingTo": "maxblagun",
          "user": {
            "image": {
              "png": "./images/avatars/image-ramsesmiron.png",
              "webp": "./images/avatars/image-ramsesmiron.webp"
            },
            "username": "ramsesmiron"
          }
        },
        {
          "idReply": "asdasd-98wer",
          "content": "I couldn't agree more with this. Everything moves so fast and it always seems like everyone knows the newest library/framework. But the fundamentals are what stay constant.",
          "createdAt": "2 days ago",
          "score": 2,
          "replyingTo": "ramsesmiron",
          "user": {
            "image": {
              "png": "./images/avatars/image-juliusomo.png",
              "webp": "./images/avatars/image-juliusomo.webp"
            },
            "username": "juliusomo"
          }
        }
      ]
    }
  ]
};

// Rota GET para obter os comentários
app.get('/', (req, res) => {
  console.log('GET / chamado');
  res.json(data.comments);
  console.log('Resposta enviada com sucesso');
});

// Rota POST para adicionar um novo comentário
app.post('/', (req, res) => {
  console.log('POST / chamado:', req.body);
  
  const newComment = req.body;
  newComment.id = data.comments.length + 1;
  data.comments.push(newComment);
  
  res.status(201).json(newComment);
  console.log('Novo comentário adicionado com sucesso');
});

// Rota POST para adicionar uma resposta a um comentário
app.post('/:id', (req, res) => {
  console.log(`POST //${req.params.id} chamado:`, req.body);
  const idComment = parseInt(req.params.id, 10);

  const commentIndex = data.comments.findIndex(comment => comment.id === idComment);

  if (commentIndex === -1) {
    return res.status(404).json({ message: 'Comentário não encontrado' });
  }

  const replies = data.comments[commentIndex].replies || [];
  const newReply = req.body;
  newReply.idReply = replies.length + 1; // Atribuindo um ID à nova resposta
  replies.push(newReply);
  data.comments[commentIndex].replies = replies;

  res.status(201).json(newReply);
  console.log('Resposta adicionada com sucesso');
});

// Rota DELETE para remover um comentário ou uma resposta
app.delete('/:id', (req, res) => {
  const idComment = parseInt(req.params.id, 10);
  console.log(`DELETE //${idComment} chamado`);

  const commentIndex = data.comments.findIndex(comment => comment.id === idComment);

  if (commentIndex === -1) {
    return res.status(404).json({ message: 'Comentário não encontrado' });
  }

  if (req.headers.type === 'reply') {
    console.log('Deletando uma resposta');
    const replies = data.comments[commentIndex].replies || [];
    const replyID = parseInt(req.headers['id-reply'], 10);
    const replyIndex = replies.findIndex(reply => reply.idReply === replyID);

    if (replyIndex === -1) {
      return res.status(404).json({ message: 'Resposta não encontrada' });
    }

    replies.splice(replyIndex, 1);
    data.comments[commentIndex].replies = replies;
  } else {
    console.log('Deletando um comentário');
    data.comments.splice(commentIndex, 1);
  }

  res.status(200).json({ message: 'Comentário removido com sucesso!' });
});

// Rota PUT para atualizar um comentário ou resposta
app.put('/:id', (req, res) => {
  const idComment = parseInt(req.params.id, 10);
  const content = req.headers['content'];
  const gain = req.headers['gain'];
  const idReply = parseInt(req.headers['id-reply'], 10);

  const commentIndex = data.comments.findIndex(comment => comment.id === idComment);

  if (commentIndex === -1) {
    return res.status(404).json({ message: 'Comentário não encontrado' });
  }

  if (idReply === -1) {
    // Atualizar conteúdo ou escore do comentário
    const comment = data.comments[commentIndex];
    if (content) comment.content = content;
    if (gain) comment.score = gain;
  } else {
    // Atualizar conteúdo ou escore de uma resposta
    const replies = data.comments[commentIndex].replies || [];
    const replyIndex = replies.findIndex(reply => reply.idReply === idReply);

    if (replyIndex === -1) {
      return res.status(404).json({ message: 'Resposta não encontrada' });
    }

    const reply = replies[replyIndex];
    if (content) reply.content = content;
    if (gain) reply.score = gain;
  }

  res.status(200).json({ message: 'Atualização realizada com sucesso' });
});

// Inicia o servidor
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
