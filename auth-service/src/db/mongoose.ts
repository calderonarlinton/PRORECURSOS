import mongoose from 'mongoose';

export class MongooseConnection {
  public static connect() {
    const mongoUri: string = process.env.MONGO_URI!;
    return new Promise((resolve, reject) => {
      mongoose.connection.openUri(mongoUri, (err, res) => {
        if (err) reject(err);
        resolve('Database connected');
      });
    });
  }
}