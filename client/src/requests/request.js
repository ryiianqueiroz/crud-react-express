export const fetchComments = async () => {
  const response = await fetch("https://crud-express-sigma.vercel.app");
  if (!response.ok) {
      throw new Error('Resposta do servidor não foi ok');
  }
  return response.json();
  };

export const postComment = async (idComment = NaN, content) => {
  const response = await fetch("https://crud-express-sigma.vercel.app", {
      method: 'POST',
      headers: {
      'Content-Type': 'application/json',
      'id-comment': idComment
      },
      body: JSON.stringify(content),
      credentials: 'include'
  });
  if (!response.ok) {
      throw new Error('Resposta do servidor não foi ok');
  }
  return response.json();
};

export const deletarComentario = async (id, type, idReply) => {
try {
  const response = await fetch("https://crud-express-sigma.vercel.app", {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'id-comment': id,
      "type": type,
      "id-reply": idReply
    },
    credentials: 'include'
  });
  return response;
} catch (error) {
  console.error('There was a problem with the fetch operation:', error);
  throw error;
}
};

export const score = async ( idComment, gain, idReply = -1 ) => {
try {
  const response = await fetch("https://crud-express-sigma.vercel.app", {
    method: "PUT",
    headers: {
      'Content-Type': 'application/json',
      'id-comment': idComment,
      "gain": gain,
      "id-reply": idReply
    },
    credentials: 'include'
  })

  return response
} catch ( error ) {
  console.error('There was a problem with the fetch operation:', error);
  throw error;
}
}

export const updateContent = async ( idComment, idReply = -1, contentUpdated ) => {
try {
  const response = await fetch("https://crud-express-sigma.vercel.app", {
    method: "PUT",
    headers: {
      'Content-Type': 'application/json',
      'id-comment': idComment,
      "content": contentUpdated,
      "id-reply": idReply
    },
    credentials: 'include'
  })

  return response
} catch ( error ) {
  console.error('There was a problem with the fetch operation:', error);
  throw error;
}
}