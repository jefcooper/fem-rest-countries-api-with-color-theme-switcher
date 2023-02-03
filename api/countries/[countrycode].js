import { promises as fs } from "fs";
import path from "path";

export default async function (request, response) {
  const dataDir = path.join(process.cwd(), "data");
  const countrycode = request.query.countrycode;
  try {
    const countryData = await fs.readFile(
      dataDir + "/data/" + countrycode + ".json",
      "utf8"
    );
    response.status(200).json(JSON.parse(countryData));
  } catch (err) {
    response.status(404).send({
      status: 404,
      message: "Not Found",
    });
  }
}
