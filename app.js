const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3000;

app.use(express.static(path.join(__dirname, 'public')));

app.set('views', path.join(__dirname, 'templates'));
app.set('view engine', 'ejs');

function titleCase(string) {
  return string
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'templates', 'index.html'));
});

app.get('/search/:query', (req, res) => {
  const query = req.params.query;
  const trago = titleCase(query);
  let receta = '';
  let encontrado = false;

  const filePath = path.join(__dirname, 'recetario.txt');

  fs.readFile(filePath, 'utf-8', (error, data) => {
    if (error) {
      console.error(error);
      return res.sendStatus(500);
    }

    const lines = data.split('\n');
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (line === trago) {
        encontrado = true;
      } else if (encontrado && line === '*') {
        break;
      } else if (encontrado && line !== '*') {
        receta += line + '<br>';
      }
    }

    if (receta) {
      const image_path = `/search_image/${query}`;
      res.render('./templates/bueno.ejs', { query: trago, results: receta, image_path });
    } else {
      res.render('error');
    }
  });
});


app.get('/search_image/:query', (req, res) => {
  const query = req.params.query;
  const query_modified = query.toLowerCase().replace(" ", "");
  const imagePath = path.join(__dirname, 'images', `${query_modified}.png`);
  console.log('Image Path:', imagePath); // <-- Agregado para depuración
  res.sendFile(imagePath);
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
