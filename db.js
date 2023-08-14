const { createPool } = require('mysql2');

const pool = createPool({
    host: "localhost",
    user: "mariacosmina",
    password: "28Avocado28.",
    database: "db1",
    connectionLimit: 10
});

pool.query('SELECT * FROM users', (err, res) => {
    if (err) {
        console.error('Error executing query:', err);
        return;
    }
    console.log('Query results:', res);
});
