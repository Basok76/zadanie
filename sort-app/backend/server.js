const express = require('express');
const bodyParser = require('body-parser');
const { Pool } = require('pg');
const cors = require('cors');
const app = express();
const port = 5000;

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'web_postgres',
    password: '123asd',
    port: 5432,
});
app.use(cors());
app.use(bodyParser.json());

const createTables = async () => {
    const client = await pool.connect();
    try {
        await client.query(`
            CREATE TABLE IF NOT EXISTS sorted_arrays (
                id SERIAL PRIMARY KEY
            );
        `);
        await client.query(`
            CREATE TABLE IF NOT EXISTS sorted_elements (
                id SERIAL PRIMARY KEY,
                array_id INTEGER REFERENCES sorted_arrays(id),
                element INTEGER
            );
        `);
    } catch (err) {
        console.error(err);
    } finally {
        client.release();
    }
};

createTables().then(() => {
    app.listen(port, () => {
        console.log(`Сервер запущен: http://localhost:${port}`);
    });
}).catch(err => {
    console.error(err);
});


app.post('/save-sorted', async (req, res) => {
    const numbers = req.body.numbers;
    try {
        const client = await pool.connect();
        const result = await client.query('INSERT INTO sorted_arrays DEFAULT VALUES RETURNING id');
        const arrayId = result.rows[0].id;
        await Promise.all(numbers.map(async (number) => {
            await client.query('INSERT INTO sorted_elements (array_id, element) VALUES ($1, $2)', [arrayId, number]);
        }));
        client.release();
    } catch (err) {
        console.error(err);
    }
});

app.get('/get-sorted/:id', async (req, res) => {
    const arrayId = req.params.id; 
    try {
        const client = await pool.connect();
        const result = await client.query('SELECT element FROM sorted_elements WHERE array_id = $1 ORDER BY id', [arrayId]);
        client.release();
        if (result.rows.length > 0) {
            const elements = result.rows.map(row => row.element); 
            res.status(200).json(elements); 
        } else {
            res.status(404).send("");
        }
    } catch (err) {
        console.error(err);
    }
});

// C:\Program Files\PostgreSQL\17\bin

