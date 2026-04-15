import { v7 as uuidv7 } from "uuid";
import { fetchExternalData } from "../services/externalApiService.js";
import { getAgeGroup, getTopCountry } from "../utils/helpers.js";
import {
  findProfileByName,
  findProfileById,
  createProfile,
  getAllProfiles,
  deleteProfile
} from "../models/profileModel.js";

export async function createProfileController(req, res) {
  try {
    let { name } = req.body;

    if (!name || name.trim() === "") {
      return res.status(400).json({
        status: "error",
        message: "Missing or empty name"
      });
    }

    name = name.toLowerCase().trim();

    const existing = await findProfileByName(name);
    if (existing) {
      return res.status(200).json({
        status: "success",
        message: "Profile already exists",
        data: existing
      });
    }

    const { gender, age, nationality } = await fetchExternalData(name);

    if (!gender.gender || gender.count === 0) {
      return res.status(502).json({
        status: "error",
        message: "Genderize returned an invalid response"
      });
    }

    if (!age.age) {
      return res.status(502).json({
        status: "error",
        message: "Agify returned an invalid response"
      });
    }

    if (!nationality.country.length) {
      return res.status(502).json({
        status: "error",
        message: "Nationalize returned an invalid response"
      });
    }

    const topCountry = getTopCountry(nationality.country);

    const newProfile = {
      id: uuidv7(),
      name,
      gender: gender.gender,
      gender_probability: gender.probability,
      sample_size: gender.count,
      age: age.age,
      age_group: getAgeGroup(age.age),
      country_id: topCountry.country_id,
      country_probability: topCountry.probability,
      created_at: new Date().toISOString()
    };

    const saved = await createProfile(newProfile);

    res.status(201).json({
      status: "success",
      data: saved
    });

  } catch (err) {
  console.error("FULL ERROR:", err);

  res.status(500).json({
    status: "error",
    message: err.message,
    detail: err
  });
}
}

export async function getProfileByIdController(req, res) {
  const profile = await findProfileById(req.params.id);

  if (!profile) {
    return res.status(404).json({
      status: "error",
      message: "Profile not found"
    });
  }

  res.json({
    status: "success",
    data: profile
  });
}

export async function getAllProfilesController(req, res) {
  const data = await getAllProfiles(req.query);

  res.json({
    status: "success",
    count: data.length,
    data
  });
}

export async function deleteProfileController(req, res) {
  await deleteProfile(req.params.id);
  res.status(204).send();
}