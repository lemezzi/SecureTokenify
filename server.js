const express = require('express');
const app = express();
let jwt = require("jsonwebtoken");

app.use(express.json());

// Route pour générer le token
app.post('/mezzi', (req, res) => {
  const { password } = req.body;
  if (password === "mezzi") {
    let token = jwt.sign({ userId: 10 }, "mezmez10");

    // Ajouter le token dans le header de la réponse
    res.header('Authorization', 'Bearer ' + token);

    res.json({ token });  
  } else {
    res.status(401).json({ message: "login invalide" });
  }
});

// Middleware pour vérifier le token
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Récupère le token après "Bearer "

  if (token == null) return res.sendStatus(401); 

  jwt.verify(token, "mezmez10", (err, user) => {
    if (err) return res.sendStatus(403); 
    req.user = user; // Ajouter les informations du token décodé à la requête
    next(); 
  });
}


app.get('/protected', authenticateToken, (req, res) => {
  res.json({ message: "Accès autorisé à la route protégée", user: req.user });
});

app.listen(3000, () => {
  console.log("listening");  
});
