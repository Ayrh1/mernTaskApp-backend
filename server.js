const express = require('express');
const { errorHandler } = require('./middleware/errorMiddleware');
const dotenv = require('dotenv').config();
const connectDB = require('./connect/database');
const Cors = require('cors');
const port = process.env.PORT || 5000;

connectDB();
const app = express(); 

const corsOptions = {
    origin: 'https://classy-daffodil-dcfa9f.netlify.app',
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
  };

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(Cors(corsOptions));

app.use('/api/tasks', require('./routes/taskRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use(errorHandler);

app.listen(port, () => console.log(`Server listening on ${port}`));

// npm run dev 