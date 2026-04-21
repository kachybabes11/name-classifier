export function parseQuery(q) {
  if (!q) return null;

  q = q.toLowerCase();

  const filters = {};

  if (q.includes("male")) filters.gender = "male";
  if (q.includes("female")) filters.gender = "female";

  
  if (q.includes("young")) {
    filters.min_age = 16;
    filters.max_age = 24;
  }

  if (q.includes("above")) {
    const match = q.match(/above (\d+)/);
    if (match) filters.min_age = parseInt(match[1]);
  }


  if (q.includes("adult")) filters.age_group = "adult";
  if (q.includes("teenager")) filters.age_group = "teenager";
  if (q.includes("child")) filters.age_group = "child";

  
  const countries = {
    nigeria: "NG",
    kenya: "KE",
    angola: "AO",
  };

  for (let key in countries) {
    if (q.includes(key)) {
      filters.country_id = countries[key];
    }
  }

  return Object.keys(filters).length ? filters : null;
}