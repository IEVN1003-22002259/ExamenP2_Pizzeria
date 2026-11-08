export interface DetallePedido {
    id_detalle?: number;
    tamano: string;
    ingredientes: string;
    cantidad: number;
    subtotal: number;
}

export interface Pedido {
    id_pedido?: number;
    nombre_cliente: string;
    direccion: string;
    telefono: string;
    fecha_pedido: string;
    total?: number | string;
    detalle?: DetallePedido[];
}

export interface VentaMes {
    mes: string;
    cantidad_pedidos: number;
    total_ventas: number;
}