import express, {Request, Response} from 'express';

const app = express();
const PORT = 8081;

app.get('/api/signup', (req: Request, res: Response) => {
  res.send(`
    <h1>Hola mundo</h1>
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

app.listen(PORT, () => {
  console.log(`auth-service is up and running on port ${PORT}`);
});