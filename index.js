// index.js is acting as expreess server.......
// So here Express acts as middleware
//-> It accees the DB updates it, request it 
// Takes response back to user and reflect it on Webpage...

require('dotenv').config();
const express = require('express')
const connec_To_Mongo =require('./db');
const cors = require('cors');
const app = express()

connec_To_Mongo();

const port = process.env.port;
app.use(cors());
app.use(express.json()); // middlware handles data


//Availiable routes =>
  app.use('/api/auth',require('./routes/auth'))
  app.use('/api/review',require('./routes/review'))
  app.use('/api/dashboard',require('./routes/dash'))
  // app.use('/api/dash',require('./routes/dashboard'))
  // app.use('/api/log',require('./routes/log'))
// app.get handles requests for particular routes[/email] and provides responses.
// app.get('/', (req, res) => {
//   res.send('Hello World! Response for Customer feedback')
// })

// app.listen starts the Express.js server on the specified port (e.g., 3000).
app.listen(port, () => {
  console.log(`Customer Feedback listening on port ${port}`)
})

