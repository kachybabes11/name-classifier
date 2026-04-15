import db from "../config/db.js";

export async function findProfileByName(name) {
  const result = await db.query(
    "SELECT * FROM profiles WHERE name = $1",
    [name]
  );
  return result.rows[0];
}

export async function findProfileById(id) {
  const result = await db.query(
    "SELECT * FROM profiles WHERE id = $1",
    [id]
  );
  return result.rows[0];
}

export async function createProfile(data) {
  try {
    console.log("INSERT INPUT:", data);

    const result = await db.query(
      `INSERT INTO profiles (
        id, name, gender, gender_probability, sample_size,
        age, age_group, country_id, country_probability, created_at
      )
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
      RETURNING *`,
      [
        data.id,
        data.name,
        data.gender,
        data.gender_probability,
        data.sample_size,
        data.age,
        data.age_group,
        data.country_id,
        data.country_probability,
        data.created_at
      ]
    );

    console.log("INSERT SUCCESS:", result.rows[0]);

    return result.rows[0];
  } catch (err) {
    console.error("INSERT ERROR:", err);
    throw err;
  }
}

export async function getAllProfiles(filters) {
  let query = `
    SELECT id, name, gender, age, age_group, country_id 
    FROM profiles WHERE 1=1
  `;
  const values = [];

  if (filters.gender) {
    values.push(filters.gender.toLowerCase());
    query += ` AND LOWER(gender) = $${values.length}`;
  }

  if (filters.country_id) {
    values.push(filters.country_id.toUpperCase());
    query += ` AND country_id = $${values.length}`;
  }

  if (filters.age_group) {
    values.push(filters.age_group.toLowerCase());
    query += ` AND age_group = $${values.length}`;
  }

  const result = await db.query(query, values);
  return result.rows;
}

export async function deleteProfile(id) {
  await db.query("DELETE FROM profiles WHERE id = $1", [id]);
}