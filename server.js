const express = require('express');
const app = express();
const PORT = process.env.PORT || 3001;
const packageRouter = require('./routers/packageRouter');

app.use(express.json());
app.use(express.static('public'));
app.use('/packages', packageRouter);

app.listen(PORT, () => {
    console.log(`App running on a port ${PORT}`);
});