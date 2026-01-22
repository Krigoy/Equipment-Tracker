const db = require('../db');

async function listEquipment() {
  const result = await db.query(
    'SELECT id, name, type, status, last_cleaned_date FROM equipment ORDER BY id ASC'
  );
  return result.rows;
}

async function createEquipment({ name, type, status, last_cleaned_date }) {
  const result = await db.query(
    `INSERT INTO equipment (name, type, status, last_cleaned_date)
     VALUES ($1, $2, $3, $4)
     RETURNING id, name, type, status, last_cleaned_date`,
    [name, type, status, last_cleaned_date]
  );
  return result.rows[0];
}

async function updateEquipment(id, { name, type, status, last_cleaned_date }) {
  const result = await db.query(
    `UPDATE equipment
     SET name = $1, type = $2, status = $3, last_cleaned_date = $4
     WHERE id = $5
     RETURNING id, name, type, status, last_cleaned_date`,
    [name, type, status, last_cleaned_date, id]
  );
  return result.rows[0] || null;
}

async function deleteEquipment(id) {
  const result = await db.query('DELETE FROM equipment WHERE id = $1 RETURNING id', [id]);
  return result.rowCount > 0;
}

module.exports = {
  listEquipment,
  createEquipment,
  updateEquipment,
  deleteEquipment,
};


