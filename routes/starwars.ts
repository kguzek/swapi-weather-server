import express from "express";
import { Optional, WhereOptions } from "sequelize";
import { SWPerson } from "../sequelize";
const fetch = require("node-fetch");
const router = express.Router();

const SWAPI_URL = "https://swapi.dev/api/people/?format=json";

/** Tries to retrieve the first row of the database. Returns `true` if no row was found, otherwise `false`. */
async function isDatabaseEmpty() {
  const person = await SWPerson.findOne();
  return !person;
}

/** Fetches each page of the Star Wars API `people` endpoint. */
async function fetchPeople(reject: Function) {
  // Fetch first page to establish the number of entries
  let initialResponse;
  try {
    initialResponse = await fetch(SWAPI_URL);
  } catch (err) {
    return void reject((err as Error).message);
  }
  // Number of pages can be calculated using the number of entries per page
  const data = await initialResponse.json();
  const numPeople: number = data?.count ?? 0;
  const numPages = Math.ceil(numPeople / data?.results?.length ?? 10);

  // Fetch all remaining pages
  const requests: Promise<Response>[] = [];
  // Start on second page since page 1 has already been fetched
  for (let page = 2; page <= numPages; page++) {
    requests.push(fetch(`${SWAPI_URL}&page=${page}`));
  }
  let responses: Response[] = [];
  try {
    responses = await Promise.all(requests);
  } catch (err) {
    return void reject((err as Error).message);
  }
  // Merge all result arrays
  let people: object[] = data.results ?? [];
  for (const response of responses) {
    const data = await response.json();
    const results = data.results ?? [];
    people = [...people, ...results];
  }
  return people;
}

/** Retrieves the people either from the database or the API. */
async function getPeople(reject: Function, where?: WhereOptions) {
  if (await isDatabaseEmpty()) {
    // Populate the database with API data
    const people = await fetchPeople(reject);
    if (!people) return;
    await SWPerson.bulkCreate(people as Optional<any, string>[]);
  }
  // Filter can be undefined or an object { where: { x: y } }
  const filter = where ? { where } : undefined;
  return await SWPerson.findAll(filter);
}

router.get("/getall", async (_req: express.Request, res: express.Response) => {
  function reject(message: string) {
    console.error(message);
    res.status(500).json({ error: "Could not fetch from the remote API." });
  }
  const people = await getPeople(reject);
  if (people) {
    res.status(200).json(people);
  }
});

export default router;
