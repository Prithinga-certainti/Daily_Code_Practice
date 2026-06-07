const pool = require('../models/db');

const getOrderReport = async ({ from, to, status }) => {
  let query = `
    SELECT o.id, o.status, o.total_amount, o.created_at,
           u.name AS customer_name, r.name AS restaurant_name
    FROM orders o
    JOIN users u ON o.user_id = u.id
    JOIN restaurants r ON o.restaurant_id = r.id
    WHERE o.created_at BETWEEN $1 AND $2
  `;
  const params = [from, to];
  if (status) {
    params.push(status);
    query += ` AND o.status = $${params.length}`;
  }
  query += ' ORDER BY o.created_at DESC';
  const { rows } = await pool.query(query, params);
  return rows;
};

const getSalesReport = async ({ from, to, restaurantId }) => {
  let query = `
    SELECT r.id AS restaurant_id, r.name AS restaurant_name,
           COUNT(o.id) AS total_orders,
           SUM(o.total_amount) AS total_revenue,
           AVG(o.total_amount) AS avg_order_value
    FROM orders o
    JOIN restaurants r ON o.restaurant_id = r.id
    WHERE o.created_at BETWEEN $1 AND $2
      AND o.status = 'completed'
  `;
  const params = [from, to];
  if (restaurantId) {
    params.push(restaurantId);
    query += ` AND r.id = $${params.length}`;
  }else{
  query += ' GROUP BY r.id, r.name ORDER BY total_revenue DESC';
  const { rows } = await pool.query(query, params);
  return rows;
};
};