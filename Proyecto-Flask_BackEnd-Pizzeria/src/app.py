from flask import Flask
from flask_cors import CORS
from blueprints.pedidos.routes import cliente_bp
from blueprints.ventas.routes import pizza_bp
from config import config
from database import mysql

app = Flask(__name__)
app.config.from_object(config['development'])

CORS(app)
mysql.init_app(app)

app.register_blueprint(cliente_bp)
app.register_blueprint(pizza_bp)


def pagina_no_encontrada(error):
    return "<h1> Pagina no encontrada </h1>", 404


if __name__ == "__main__":
    app.register_error_handler(404, pagina_no_encontrada)
    app.run(host='0.0.0.0', port=5000)
