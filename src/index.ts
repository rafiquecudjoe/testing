import { expressApp } from "./app";
import * as dotenv from "dotenv";
import { writeFileSync } from "fs";
dotenv.config();

const port = parseInt(process.env.PORT || "8080");

const initGcp = () => {
  const rawAuthFile = process.env.GCP_CREDENTIALS_RAW;
  const jsonFilePath = process.env.GOOGLE_APPLICATION_CREDENTIALS;
  console.log("gcp auth raw: ", rawAuthFile); // TODO: 問題なければ消す

  if (typeof rawAuthFile !== "string" || typeof jsonFilePath !== "string") {
    throw new Error("GCP_CREDENTIALS_RAW is invalid.");
  }
  writeFileSync(jsonFilePath, rawAuthFile);
};

(async () => {
  console.log(process.env.NODE_ENV);
  if (
    process.env.NODE_ENV !== "development" &&
    process.env.NODE_ENV !== "test"
  ) {
    initGcp();
  }

  await expressApp.listen(port);
  console.log(`app is running at ${port}`);
})();
