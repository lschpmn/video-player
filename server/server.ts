const express = require('express');

const app = express();

app.get('/api/status:address', (req, res) => {

});

app.listen(3001, () => console.log('server running on port 3000'));