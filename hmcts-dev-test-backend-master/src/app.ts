import express from "express";
import cors from "cors";
import helmet from "helmet";

require('dotenv').config();

if (!process.env.PORT) {
    console.log(`No port value specified...`);
}

const PORT = parseInt(process.env.PORT as string, 10);

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(helmet());

app.listen(process.env.PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
})