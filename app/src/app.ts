import express from 'express'
import UserRoutes from './routes/UserRoutes';
import cors from 'cors';
import corsOptions from './config/cors';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors(corsOptions));

app.use(express.json());
 
app.use('/api/v1', UserRoutes);

app.listen(PORT, async () => {
    console.log(`Server is running on port ${PORT}`);
})