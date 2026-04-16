import { uuidv7 } from "uuidv7";
import {
  findByName,
  findById,
  getAll,
  create,
  deleteById,
} from "../models/profileModel.js";
import { fetchExternalData } from "../services/externalApiService.js";
import { getAgeGroup, pickBestCountry } from "../utils/helpers.js";

// CREATE PROFILE
export async function createProfile(req, res) {
  try {
    let { name } = req.body;

    if (!name) {
      return res.status(400).json({
        status: "error",
        message: "Missing or empty name",
      });
    }

    if (typeof name !== "string") {
      return res.status(422).json({
        status: "error",
        message: "Invalid type",
      });
    }

    name = name.trim().toLowerCase();

    const existing = await findByName(name);
    if (existing) {
      return res.json({
        status: "success",
        message: "Profile already exists",
        data: existing,
      });
    }

    const { gender, age, nationality } = await fetchExternalData(name);

    // Edge cases
    if (!gender.gender || gender.count === 0) {
      return res.status(502).json({
        status: "error",
        message: "Genderize returned an invalid response",
      });
    }

    if (!age.age) {
      return res.status(502).json({
        status: "error",
        message: "Agify returned an invalid response",
      });
    }

    if (!nationality.country || nationality.country.length === 0) {
      return res.status(502).json({
        status: "error",
        message: "Nationalize returned an invalid response",
      });
    }

    const bestCountry = pickBestCountry(nationality.country);

    const profile = {
      id: uuidv7(),
      name,
      gender: gender.gender,
      gender_probability: gender.probability,
      sample_size: gender.count,
      age: age.age,
      age_group: getAgeGroup(age.age),
      country_id: bestCountry.country_id,
      country_probability: bestCountry.probability,
      created_at: new Date().toISOString(),
    };

    await create(profile);

    return res.status(201).json({
      status: "success",
      data: profile,
    });

  } catch (err) {
    return res.status(500).json({
      status: "error",
      message: err.message,
    });
  }
}

// GET SINGLE
export async function getSingleProfile(req, res) {
  const profile = await findById(req.params.id);

  if (!profile) {
    return res.status(404).json({
      status: "error",
      message: "Profile not found",
    });
  }

  res.json({
    status: "success",
    data: profile,
  });
}

// GET ALL
export async function getProfiles(req, res) {
  const profiles = await getAll(req.query);

  res.json({
    status: "success",
    count: profiles.length,
    data: profiles,
  });
}

// DELETE
export async function deleteProfile(req, res) {
  const deleted = await deleteById(req.params.id);

  if (!deleted) {
    return res.status(404).json({
      status: "error",
      message: "Profile not found",
    });
  }

  res.status(204).send();
}