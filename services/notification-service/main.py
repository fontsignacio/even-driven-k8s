# notifications-service/main.py

from fastapi import FastAPI
from kafka import KafkaConsumer
import json
import threading # Importamos threading
import logging
import os
# import asyncio # Eliminamos asyncio si no se usa en otras partes

# Configuración de logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

app = FastAPI()

# --- Configuración de Kafka ---
# Obtener los brokers de Kafka de las variables de entorno
KAFKA_BROKERS = os.getenv('KAFKA_BROKERS', 'kafka-service:9092').split(',')
logging.info(f"Conectándose a Kafka brokers: {KAFKA_BROKERS}")

# Nombre de los topics a consumir
USER_CREATED_TOPIC = 'user-created-topic'
ORDER_CREATED_TOPIC = 'order-created-topic'

# Función para consumir mensajes de Kafka (AHORA SÍNCRONA)
def consume_messages(topic: str, group_id: str): # Eliminamos 'async'
    consumer = None
    logging.info(f"Intentando iniciar consumidor para topic '{topic}' con group_id '{group_id}'...") # Añadido para depuración
    try:
        consumer = KafkaConsumer(
            topic,
            bootstrap_servers=KAFKA_BROKERS,
            group_id=group_id,
            auto_offset_reset='earliest', # Empieza a leer desde el principio si no hay offset guardado
            enable_auto_commit=True,
            value_deserializer=lambda x: json.loads(x.decode('utf-8'))
        )
        logging.info(f"Consumidor de Kafka para el topic '{topic}' con group_id '{group_id}' inicializado. Esperando mensajes...")

        for message in consumer:
            event_data = message.value
            logging.info(f"Mensaje recibido del topic '{message.topic}': {event_data}")

            if message.topic == USER_CREATED_TOPIC:
                # Simular envío de notificación de bienvenida
                user_id = event_data.get('id')
                username = event_data.get('username')
                email = event_data.get('email')
                logging.info(f"Simulando envío de notificación de bienvenida para el usuario {username} ({email}) con ID: {user_id}")
                # Aquí iría la lógica real para enviar un email, push notification, etc.

            elif message.topic == ORDER_CREATED_TOPIC:
                # Simular envío de notificación de confirmación de pedido
                order_id = event_data.get('orderId')
                user_id = event_data.get('userId')
                total_amount = event_data.get('totalAmount')
                logging.info(f"Simulando envío de notificación de confirmación para el pedido {order_id} del usuario {user_id}. Total: {total_amount}")
                # Aquí iría la lógica real para enviar un email, push notification, etc.

    except Exception as e:
        logging.error(f"Error en el consumidor de Kafka para el topic '{topic}': {e}")
    finally:
        if consumer:
            consumer.close()
            logging.info(f"Consumidor de Kafka cerrado para el topic '{topic}'")

# Iniciar consumidores de Kafka en hilos separados (AHORA USANDO THREADING)
@app.on_event("startup")
async def startup_event(): # Mantenemos async para el evento de startup de FastAPI
    # Consumidor para eventos de usuarios
    threading.Thread(target=consume_messages, args=(USER_CREATED_TOPIC, 'notifications-user-group'), daemon=True).start()
    # Consumidor para eventos de pedidos
    threading.Thread(target=consume_messages, args=(ORDER_CREATED_TOPIC, 'notifications-order-group'), daemon=True).start()
    logging.info("Servicio de Notificaciones iniciado y consumidores de Kafka lanzados.")

@app.get("/health")
async def health_check():
    return {"status": "ok"}
