const corsOptions = {
    origin: 'http://localhost:5174',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
}

export default corsOptions