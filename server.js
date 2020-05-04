const express = require('express')
const app = express();

app.get('/', (req, res) => res.send('good'))

const PORT = process.env.PORT || 3000

app.listen(PORT, () => console.log(`server on port ${PORT}`));