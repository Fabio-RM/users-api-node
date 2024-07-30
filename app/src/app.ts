import express from 'express'
import UserRoutes from './routes/UserRoutes';
import path from 'path';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
 
app.use('/api/v1', UserRoutes);

app.listen(PORT, async () => {
    console.log(`Server is running on port ${PORT}`);
})