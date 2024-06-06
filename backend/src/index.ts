import express from 'express';
import { connectDatabase } from './config/database';
import dotenv from 'dotenv';
import routes from './routes/userRoutes';

dotenv.config();

const app = express();
const port = process.env.PORT ?? 3000;

app.use(express.json());
app.use('/api', routes);

app.get('/', (req, res) => {
  res.send('Hello, World!');
});

connectDatabase().then(() => {
  app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });
}).catch(error => console.log(error));
