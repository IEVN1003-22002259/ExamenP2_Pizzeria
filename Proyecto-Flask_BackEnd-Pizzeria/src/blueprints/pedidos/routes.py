from flask import Blueprint, jsonify, request
from database import mysql

cliente_bp = Blueprint(
    'cliente',
    __name__,
    url_prefix='/pizzeria_cliente'
)


def fila_a_diccionario(cursor, fila):
    columnas = [columna[0] for columna in cursor.description]
    return dict(zip(columnas, fila))


# CONSULTAR TODOS LOS PEDIDOS
@cliente_bp.route('/', methods=['GET'])
def consultar_pedidos():
    try:
        cursor = mysql.connection.cursor()

        cursor.execute("SELECT * FROM pedidos")
        datos = cursor.fetchall()

        pedidos = []

        for fila in datos:
            pedidos.append(fila_a_diccionario(cursor, fila))

        cursor.close()

        return jsonify(pedidos)

    except Exception as ex:
        print(ex)
        return jsonify({'mensaje': 'Error al consultar los pedidos'}), 500


# CONSULTAR UN PEDIDO POR ID
@cliente_bp.route('/<int:id_pedido>', methods=['GET'])
def consultar_pedido(id_pedido):
    try:
        cursor = mysql.connection.cursor()

        cursor.execute(
            "SELECT * FROM pedidos WHERE id_pedido = %s",
            (id_pedido,)
        )

        dato = cursor.fetchone()

        if dato is None:
            cursor.close()
            return jsonify({'mensaje': 'Pedido no encontrado'}), 404

        pedido = fila_a_diccionario(cursor, dato)

        cursor.execute(
            "SELECT * FROM detalle_pedido WHERE id_pedido = %s",
            (id_pedido,)
        )

        detalles = cursor.fetchall()

        pedido['detalle'] = []

        for fila in detalles:
            pedido['detalle'].append(fila_a_diccionario(cursor, fila))

        cursor.close()

        return jsonify(pedido)

    except Exception as ex:
        print(ex)
        return jsonify({'mensaje': 'Error al consultar el pedido'}), 500


# REGISTRAR UN PEDIDO
@cliente_bp.route('/', methods=['POST'])
def registrar_pedido():
    try:
        datos = request.get_json()

        nombre_cliente = datos['nombre_cliente']
        direccion = datos['direccion']
        telefono = datos['telefono']
        fecha_pedido = datos['fecha_pedido']
        detalle = datos['detalle']

        if not detalle:
            return jsonify({'mensaje': 'El pedido debe incluir al menos una pizza'}), 400

        total = sum(float(pizza['subtotal']) for pizza in detalle)

        cursor = mysql.connection.cursor()

        cursor.execute("""
            INSERT INTO pedidos
            (nombre_cliente, direccion, telefono, fecha_pedido, total)
            VALUES (%s, %s, %s, %s, %s)
        """, (nombre_cliente, direccion, telefono, fecha_pedido, total))

        id_pedido = cursor.lastrowid

        for pizza in detalle:
            cursor.execute("""
                INSERT INTO detalle_pedido
                (id_pedido, tamano, ingredientes, cantidad, subtotal)
                VALUES (%s, %s, %s, %s, %s)
            """, (
                id_pedido,
                pizza['tamano'],
                pizza['ingredientes'],
                pizza['cantidad'],
                pizza['subtotal']
            ))

        mysql.connection.commit()
        cursor.close()

        return jsonify({
            'mensaje': 'Pedido registrado correctamente',
            'id_pedido': id_pedido,
            'total': total
        }), 201

    except Exception as ex:
        mysql.connection.rollback()
        print(ex)
        return jsonify({'mensaje': 'Error al registrar el pedido'}), 500


# MODIFICAR UN PEDIDO
@cliente_bp.route('/<int:id_pedido>', methods=['PUT'])
def modificar_pedido(id_pedido):
    try:
        datos = request.get_json()

        cursor = mysql.connection.cursor()

        cursor.execute(
            "SELECT id_pedido FROM pedidos WHERE id_pedido = %s",
            (id_pedido,)
        )

        if cursor.fetchone() is None:
            cursor.close()
            return jsonify({'mensaje': 'Pedido no encontrado'}), 404

        nombre_cliente = datos['nombre_cliente']
        direccion = datos['direccion']
        telefono = datos['telefono']
        fecha_pedido = datos['fecha_pedido']

        cursor.execute("""
            UPDATE pedidos
            SET nombre_cliente = %s,
                direccion = %s,
                telefono = %s,
                fecha_pedido = %s
            WHERE id_pedido = %s
        """, (
            nombre_cliente,
            direccion,
            telefono,
            fecha_pedido,
            id_pedido
        ))

        if 'detalle' in datos:
            detalle = datos['detalle']

            if not detalle:
                cursor.close()
                return jsonify({'mensaje': 'El pedido debe incluir al menos una pizza'}), 400

            total = sum(float(pizza['subtotal']) for pizza in detalle)

            cursor.execute(
                "DELETE FROM detalle_pedido WHERE id_pedido = %s",
                (id_pedido,)
            )

            for pizza in detalle:
                cursor.execute("""
                    INSERT INTO detalle_pedido
                    (id_pedido, tamano, ingredientes, cantidad, subtotal)
                    VALUES (%s, %s, %s, %s, %s)
                """, (
                    id_pedido,
                    pizza['tamano'],
                    pizza['ingredientes'],
                    pizza['cantidad'],
                    pizza['subtotal']
                ))

            cursor.execute(
                "UPDATE pedidos SET total = %s WHERE id_pedido = %s",
                (total, id_pedido)
            )

        mysql.connection.commit()
        cursor.close()

        return jsonify({'mensaje': 'Pedido modificado correctamente'})

    except Exception as ex:
        mysql.connection.rollback()
        print(ex)
        return jsonify({'mensaje': 'Error al modificar el pedido'}), 500


# ELIMINAR UN PEDIDO
@cliente_bp.route('/<int:id_pedido>', methods=['DELETE'])
def eliminar_pedido(id_pedido):
    try:
        cursor = mysql.connection.cursor()

        cursor.execute(
            "SELECT id_pedido FROM pedidos WHERE id_pedido = %s",
            (id_pedido,)
        )

        if cursor.fetchone() is None:
            cursor.close()
            return jsonify({'mensaje': 'Pedido no encontrado'}), 404

        cursor.execute(
            "DELETE FROM detalle_pedido WHERE id_pedido = %s",
            (id_pedido,)
        )

        cursor.execute(
            "DELETE FROM pedidos WHERE id_pedido = %s",
            (id_pedido,)
        )

        mysql.connection.commit()
        cursor.close()

        return jsonify({'mensaje': 'Pedido eliminado correctamente'})

    except Exception as ex:
        mysql.connection.rollback()
        print(ex)
        return jsonify({'mensaje': 'Error al eliminar el pedido'}), 500
