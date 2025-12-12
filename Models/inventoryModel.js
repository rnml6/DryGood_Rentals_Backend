import pool from './database.js'

export const addAttire = async attireData => {
  const {
    name,
    category,
    gender,
    size,
    color,
    rentalPrice,
    material,
    status,
    img,
    dateAdded,
    description
  } = attireData

  const [result] = await pool.query(
    `INSERT INTO rental_inventory 
      (name, category, gender, size, color, price, material, status, date_added, description, image)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      name,
      category,
      gender,
      size,
      color,
      rentalPrice,
      material,
      status,
      dateAdded,
      description,
      img
    ]
  )
  return result
}

export const getAttires = async () => {
  const [rows] = await pool.query('SELECT * FROM rental_inventory')
  return rows
}

export const deleteAttire = async attireId => {
  const [result] = await pool.query(
    'DELETE FROM rental_inventory WHERE id= ?',
    [attireId]
  )
  return result.affectedRows
}

export const updateAttire = async (
  name,
  category,
  gender,
  size,
  color,
  price,
  material,
  status,
  date_added,
  description,
  image,
  id
) => {
  const [result] = await pool.query(
    `UPDATE rental_inventory 
     SET name=?, category=?, gender=?, size=?, color=?, price=?, 
         material=?, status=?, date_added=?, description=?,
         image = COALESCE(?, image)
     WHERE id=?`,
    [
      name,
      category,
      gender,
      size,
      color,
      price,
      material,
      status,
      date_added,
      description,
      image,
      id
    ]
  )

  return result.affectedRows
}


export const updateInventoryStatus = async (attire_id, status) => {
  const [result] = await pool.query(
    `UPDATE rental_inventory SET status = ? WHERE id = ?`,
    [status, attire_id]
  );
  return result;
};
