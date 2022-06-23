import express from "express";
import { Optional, WhereOptions } from "sequelize";
import { SWPerson } from "../sequelize";
import fetch from "node-fetch";
const router = express.Router();

const SWAPI_URL = "https://swapi.dev/api/people/?format=json";

// Get the attributes that can be used to filter the search query
const PERSON_ATTRIBUTES = Object.keys(SWPerson.getAttributes()).filter(
  (prop) => prop !== "id"
);

/** Tries to retrieve the first row of the database. Returns `true` if no row was found, otherwise `false`. */
async function isDatabaseEmpty() {
  const person = await SWPerson.findOne();
  return !person;
}

/** Fetches each page of the Star Wars API `people` endpoint. */
async function fetchPeople(res: express.Response) {
  function reject(message: string) {
    console.error(message);
    res.status(500).json({ error: "Could not fetch from the remote API." });
  }

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
  const requests = [];
  // Start on second page since page 1 has already been fetched
  for (let page = 2; page <= numPages; page++) {
    requests.push(fetch(`${SWAPI_URL}&page=${page}`));
  }
  let responses = [];
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
async function getPeople(res: express.Response, where?: WhereOptions) {
  if (await isDatabaseEmpty()) {
    // Populate the database with API data
    const people = await fetchPeople(res);
    if (!people) return;
    await SWPerson.bulkCreate(people as Optional<any, string>[]);
  }
  // Filter can be undefined or an object { where: { x: y } }
  const filter = where ? { where } : undefined;
  return await SWPerson.findAll(filter);
}

router.get("/getall", async (_req: express.Request, res: express.Response) => {
  const people = await getPeople(res);
  if (!people) return;
  res.status(200).json(people);
});

router.get(
  "/getfiltered",
  async (req: express.Request, res: express.Response) => {
    const where: { [property: string]: string } = {};
    // Get object containing only valid attribute filters
    for (const attribute of PERSON_ATTRIBUTES) {
      if (!req.query[attribute]) continue;
      where[attribute] = req.query[attribute] as string;
    }

    const people = await getPeople(res, where);
    if (!people) return;
    res.status(200).json(people);
  }
);

export default router;
