import express, {Request, Response} from 'express';
import { MongooseConnection } from './db/mongoose';
import { BadRequestError, DatabaseConnectionError, errorHandler } from '@angelgoezg/common';
import * as dotenv from 'dotenv'
import 'express-async-errors';

import { User } from './models/users';

dotenv.config();

const app = express();
app.use(express.json());

const PORT = parseInt(process.env.SERVER_PORT!);

app.post('/api/signup', async (req: Request, res: Response) => {
  try {
    const user = new User(req.body);
    await user.save();
    res.status(201).send({user});
  } catch (error: any) {
    throw new BadRequestError(error.message);
  }
});

app.post('/api/signin', async (req: Request, res: Response) => {
  try {
    const {email, pwd} = req.body;
    const user = await User.findUserByCredentials(email, pwd);
    const token = await user.generateAuthToken();
    res.send({token});
  } catch (error: any) {
    throw new BadRequestError(error.message);
  }
});

app.get('/api/signup/:document', (req: Request, res: Response) => {
  const { document } = req.params;
  const database: Record<string, string> = {
    "123": "Yordan",
    "234": "Leicy",
  };

  res.send(`
    <h1>Hola mundo, ${database[document] ?? 'Desconocido'}</h1>
    <a href="/api/signout">Cerrar sesión</a>
  `);
});

app.get('/api/signout', (req: Request, res: Response) => {
  res.send('<h1>Adios mundo</h1>');
});

app.get('/api/message', (req: Request, res: Response) => {
  res.send(JSON.stringify({
    message: 'Hola mundo'
  }));
});

app.all('*', (req: Request, res: Response) => {
  res.status(404).send('<h1>Recurso no encontrado</h1>');
});

app.use(errorHandler);

app.listen(PORT, async () => {
  try {
    const connection = await MongooseConnection.connect();
    console.log(connection);
    console.log(`auth-service is up and running on port ${PORT}`);
  } catch (error) {
    throw new DatabaseConnectionError();
  }
});