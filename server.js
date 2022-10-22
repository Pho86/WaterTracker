const express = require('express');
const port = 3000;

const app = express();
app.use(express.static(__dirname));
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

const homepagePath = __dirname + '/index.html'

app.get('/', (req, res) => {
   console.log(req.body)
   res.sendFile(homepagePath)
})

app.listen(port, () => {
   console.log(`philly-dip listening on port ${port} `)
});
