import express, {Request, Response} from 'express';
import { MongooseConnection } from './db/mongoose';
import { BadRequestError, DatabaseConnectionError } from '@angelgoezg/common';
import * as dotenv from 'dotenv'

import { User } from './models/users';

dotenv.config();

const app = express();
const PORT = parseInt(process.env.SERVER_PORT!);

app.get('/api/signup', async (req: Request, res: Response) => {
  try {
    const user = new User({
      name: "Arlinton Calderon",
      pwd: "12345",
      username: "adcalderon",
      email: "arlinton_calderon23171@elpoli.edu.co",
      userType: "ADMIN",
    });
    await user.save();
    res.status(201).send({user});
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

app.listen(PORT, async () => {
  try {
    const connection = await MongooseConnection.connect();
    console.log(connection);
    console.log(`auth-service is up and running on port ${PORT}`);
  } catch (error) {
    throw new DatabaseConnectionError();
  }
});