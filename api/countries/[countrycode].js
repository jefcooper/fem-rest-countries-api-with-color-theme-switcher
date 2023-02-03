import { promises as fs } from "fs";

export default async function (request, response) {
  const countrycode = request.query.countrycode;
  try {
    const countryData = await fs.readFile(
      "api/data/" + countrycode + ".json",
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
