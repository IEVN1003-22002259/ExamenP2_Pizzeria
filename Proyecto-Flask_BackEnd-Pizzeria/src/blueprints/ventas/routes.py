from flask import Blueprint, jsonify
from database import mysql

pizza_bp = Blueprint(
    'pizza',
    __name__,
    url_prefix='/pizzeria_ventas'
)

# CONSULTAR VENTAS POR DIA DE LA SEMANA
@pizza_bp.route('/dia/<string:dia>', methods=['GET'])
def ventas_por_dia(dia):
    try:
        dias = {
            'lunes': 0,
            'martes': 1,
            'miercoles': 2,
            'miércoles': 2,
            'jueves': 3,
            'viernes': 4,
            'sabado': 5,
            'sábado': 5,
            'domingo': 6
        }

        dia = dia.lower()

        if dia not in dias:
            return jsonify({'mensaje': 'Dia no valido'}), 400

        cursor = mysql.connection.cursor()

        cursor.execute("""
            SELECT *
            FROM pedidos
            WHERE WEEKDAY(fecha_pedido) = %s
        """, (dias[dia],))

        datos = cursor.fetchall()

        columnas = [columna[0] for columna in cursor.description]
        pedidos = []

        for fila in datos:
            pedidos.append(dict(zip(columnas, fila)))

        cursor.close()

        return jsonify(pedidos)

    except Exception as ex:
        print(ex)
        return jsonify({'mensaje': 'Error al consultar las ventas del dia'}), 500



@pizza_bp.route('/mes/<string:mes>', methods=['GET'])
def ventas_por_mes(mes):
    try:
        meses = {
            'enero': 1,
            'febrero': 2,
            'marzo': 3,
            'abril': 4,
            'mayo': 5,
            'junio': 6,
            'julio': 7,
            'agosto': 8,
            'septiembre': 9,
            'setiembre': 9,
            'octubre': 10,
            'noviembre': 11,
            'diciembre': 12
        }

        mes = mes.lower()

        if mes not in meses:
            return jsonify({'mensaje': 'Mes no valido'}), 400

        cursor = mysql.connection.cursor()

        cursor.execute("""
            SELECT *
            FROM pedidos
            WHERE MONTH(fecha_pedido) = %s
            ORDER BY fecha_pedido DESC
        """, (meses[mes],))

        datos = cursor.fetchall()

        columnas = [columna[0] for columna in cursor.description]
        pedidos = []

        for fila in datos:
            pedidos.append(dict(zip(columnas, fila)))

        cursor.execute("""
            SELECT
                COUNT(id_pedido) AS cantidad_pedidos,
                COALESCE(SUM(total), 0) AS total_ventas
            FROM pedidos
            WHERE MONTH(fecha_pedido) = %s
        """, (meses[mes],))

        resumen = cursor.fetchone()

        cursor.close()

        return jsonify({
            'pedidos': pedidos,
            'cantidad_pedidos': resumen[0],
            'total_ventas': resumen[1]
        })

    except Exception as ex:
        print(ex)
        return jsonify({'mensaje': 'Error al consultar las ventas del mes'}), 500



# CONSULTAR DETALLE DE UNA VENTA
@pizza_bp.route('/detalle/<int:id_pedido>', methods=['GET'])
def detalle_venta(id_pedido):
    try:
        cursor = mysql.connection.cursor()

        cursor.execute("""
            SELECT
                p.id_pedido,
                p.nombre_cliente,
                p.fecha_pedido,
                p.total,
                d.id_detalle,
                d.tamano,
                d.ingredientes,
                d.cantidad,
                d.subtotal
            FROM pedidos p
            INNER JOIN detalle_pedido d
            ON p.id_pedido = d.id_pedido
            WHERE p.id_pedido = %s
        """, (id_pedido,))

        datos = cursor.fetchall()

        columnas = [columna[0] for columna in cursor.description]
        detalle = []

        for fila in datos:
            detalle.append(dict(zip(columnas, fila)))

        cursor.close()

        if not detalle:
            return jsonify({'mensaje': 'No se encontró el detalle del pedido'}), 404

        return jsonify(detalle)

    except Exception as ex:
        print(ex)
        return jsonify({'mensaje': 'Error al consultar el detalle de la venta'}), 500
