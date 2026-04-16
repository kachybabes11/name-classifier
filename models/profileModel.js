import pool from "../config/db.js";

export async function findByName(name) {
  const res = await pool.query(
    "SELECT * FROM profiles WHERE name=$1",
    [name]
  );
  return res.rows[0];
}

export async function findById(id) {
  const res = await pool.query(
    "SELECT * FROM profiles WHERE id=$1",
    [id]
  );
  return res.rows[0];
}

export async function getAll(filters) {
  let { gender, country_id, age_group } = filters;

  let query = "SELECT * FROM profiles WHERE 1=1";
  let values = [];

  if (gender) {
    values.push(gender.toLowerCase());
    query += ` AND LOWER(gender)=$${values.length}`;
  }

  if (country_id) {
    values.push(country_id.toUpperCase());
    query += ` AND country_id=$${values.length}`;
  }

  if (age_group) {
    values.push(age_group.toLowerCase());
    query += ` AND age_group=$${values.length}`;
  }

  const res = await pool.query(query, values);
  return res.rows;
}

export async function create(profile) {
  await pool.query(
    `INSERT INTO profiles 
    (id, name, gender, gender_probability, sample_size, age, age_group, country_id, country_probability, created_at)
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)`,
    Object.values(profile)
  );
}

export async function deleteById(id) {
  const res = await pool.query(
    "DELETE FROM profiles WHERE id=$1",
    [id]
  );
  return res.rowCount;
}