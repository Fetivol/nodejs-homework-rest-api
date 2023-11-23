import mongoose from "mongoose";

import app from "./app.js";

// import { DB_HOST } from "./config.js";
const { DB_HOST } = process.env;
mongoose
  .connect(DB_HOST, (PORT = 3000))
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running. Use our API on port: ${PORT}`);
    });
    console.log("Database connection successful");
  })
  .catch((error) => {
    console.log(error.message);
    process.exit(1);
  });
