import express from "express";
import bootstrap from "./app.controller.js";
import { scheduler } from "./utils/cron-job/schedule.js";

const app = express();
const PORT = 3000;

scheduler()

bootstrap(app, express);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
