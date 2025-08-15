// orders-service/index.js

const express = require('express');
const { Pool } = require('pg');
const { Kafka } = require('kafkajs');
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 8080; // Puerto del servicio, coincidiendo con el Deployment

// --- Configuración de PostgreSQL ---
const pool = new Pool({
    user: process.env.DB_USERNAME,
    host: process.env.DB_HOST || 'orders-postgres-service', // Nombre del servicio de K8s para PostgreSQL
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT || 5432,
});

// Verificar conexión a la base de datos
pool.on('connect', () => {
    console.log('Conectado a PostgreSQL');
});

pool.on('error', (err) => {
    console.error('Error inesperado en el pool de PostgreSQL', err);
    process.exit(-1); // Salir si hay un error crítico de DB
});

// --- Configuración de Kafka ---
const kafka = new Kafka({
    clientId: 'orders-service',
    brokers: [process.env.KAFKA_BROKERS || 'kafka-service:9092'], // Nombre del servicio de K8s para Kafka
});

const producer = kafka.producer();

// Conectar productor de Kafka
async function connectKafkaProducer() {
    try {
        await producer.connect();
        console.log('Productor de Kafka conectado exitosamente');
    } catch (error) {
        console.error('Error al conectar el productor de Kafka:', error);
        // Intentar reconectar o manejar el error de forma robusta en un entorno de producción
    }
}

connectKafkaProducer();

// Middleware
app.use(bodyParser.json());

// --- Rutas de la API ---

// Endpoint para crear un pedido
app.post('/orders', async (req, res) => {
    const { userId, items, totalAmount } = req.body;

    if (!userId || !items || !totalAmount) {
        return res.status(400).json({ message: 'Faltan campos obligatorios: userId, items, totalAmount' });
    }

    try {
        // Iniciar transacción de base de datos
        const client = await pool.connect();
        try {
            await client.query('BEGIN');

            // 1. Guardar el pedido en PostgreSQL
            const insertOrderQuery = `
                INSERT INTO orders (user_id, items, total_amount, created_at)
                VALUES ($1, $2, $3, NOW()) RETURNING id;
            `;
            const result = await client.query(insertOrderQuery, [userId, JSON.stringify(items), totalAmount]);
            const orderId = result.rows[0].id;

            // 2. Publicar evento a Kafka
            const orderCreatedEvent = {
                orderId: orderId,
                userId: userId,
                items: items,
                totalAmount: totalAmount,
                createdAt: new Date().toISOString(),
            };

            await producer.send({
                topic: 'order-created-topic',
                messages: [{ value: JSON.stringify(orderCreatedEvent) }],
            });

            await client.query('COMMIT');
            console.log(`Pedido ${orderId} creado y evento enviado.`);
            res.status(201).json({ message: 'Pedido creado exitosamente', orderId: orderId });

        } catch (error) {
            await client.query('ROLLBACK');
            console.error('Error al crear el pedido o enviar el evento de Kafka:', error);
            res.status(500).json({ message: 'Error interno del servidor al crear el pedido' });
        } finally {
            client.release(); // Liberar el cliente de la pool
        }

    } catch (dbConnectError) {
        console.error('Error al conectar con la base de datos:', dbConnectError);
        res.status(500).json({ message: 'Error al conectar con la base de datos' });
    }
});

// Endpoint para obtener un pedido por ID 
app.get('/orders/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('SELECT * FROM orders WHERE id = $1', [id]);
        if (result.rows.length > 0) {
            res.status(200).json(result.rows[0]);
        } else {
            res.status(404).json({ message: 'Pedido no encontrado' });
        }
    } catch (error) {
        console.error('Error al obtener el pedido:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
});


// --- Iniciar el servidor ---
app.listen(port, () => {
    console.log(`Orders Service escuchando en el puerto ${port}`);
});

// Manejo de cierre para desconectar Kafka
process.on('SIGTERM', async () => {
    console.log('Cerrando Orders Service...');
    await producer.disconnect();
    await pool.end();
    console.log('Conexiones cerradas.');
    process.exit(0);
});
