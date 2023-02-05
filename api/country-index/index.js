import { promises as fs } from "fs";
import path from "path";

export default async function (request, response) {
  const dataDir = path.join(process.cwd(), "data");
  const countriesData = await fs.readFile(
    dataDir + "/countries-index.json",
    "utf8"
  );
  const data = JSON.parse(countriesData);
  response.status(200).json(data);
}
