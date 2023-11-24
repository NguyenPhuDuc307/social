import { Route } from 'core/interfaces';
import express from 'express';
import mongoose from 'mongoose';
import dotenv from "dotenv";

class App {
    public app: express.Application;
    public port: string | number;

    constructor(routes: Route[]) {
        this.app = express();
        this.port = process.env.PORT || 3000;

        // Ensure dotenv is initialized before accessing environment variables
        dotenv.config();

        this.initializeRoutes(routes);
        this.connectToDatabase();
    }

    private initializeRoutes(routes: Route[]) {
        routes.forEach(route => {
            this.app.use('/', route.router);
        })
    }

    public listen() {
        this.app.listen(this.port, () => {
            console.log(`Server listening on ${this.port}`);
        });
    }

    private async connectToDatabase() {
        try {
            const connectionString = process.env.MONGO_CONNECTION;

            if (!connectionString) {
                console.log(`Connection string is invalid`);
                return;
            }

            await mongoose.connect(connectionString);

            console.log('Database connected');

        } catch (error) {
            console.log('Error connecting to database');
        }
    }
}

export default App