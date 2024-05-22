import pika


class MQ:
    def __init__(self):
        self.connection = pika.BlockingConnection(pika.ConnectionParameters('localhost'))
        self.channel = self.connection.channel()
        self.channel.queue_declare(queue='img_move')


    def send(self, message):
        self.channel.basic_publish(exchange='',
                                   routing_key='img_move',
                                   body=message)
        print(f" [x] Sent {message}")
        self.connection.close()


    def consume(self):
        method_frame, header_frame, body = self.channel.basic_get(queue='img_move')
        if method_frame:
            print(f" [x] Received {body}")
            self.channel.basic_ack(delivery_tag=method_frame.delivery_tag)
            return body
        return None