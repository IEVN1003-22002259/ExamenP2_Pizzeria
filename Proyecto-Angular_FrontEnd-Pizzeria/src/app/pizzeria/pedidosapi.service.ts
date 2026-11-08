
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Pedido } from "./pedidos";
import { Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class PizzeriaApiService {

    url = 'http://127.0.0.1:5000';

    constructor(private http: HttpClient) { }

    public getPedidos(): Observable<any> {
        return this.http.get<any>(
            this.url + '/pizzeria_cliente/'
        );
    }

    public getPedido(id: number): Observable<any> {
        return this.http.get<any>(
            this.url + '/pizzeria_cliente/' + id
        );
    }

    agregarPedido(datos: Pedido): Observable<any> {
        return this.http.post(
            this.url + '/pizzeria_cliente/',
            datos
        );
    }

    modificarPedido(id: number, datos: Pedido): Observable<any> {
        return this.http.put(
            this.url + '/pizzeria_cliente/' + id,
            datos
        );
    }

    eliminarPedido(id: number): Observable<any> {
        return this.http.delete(
            this.url + '/pizzeria_cliente/' + id
        );
    }

    public getVentasDia(dia: string): Observable<any> {
        return this.http.get<any>(
            this.url + '/pizzeria_ventas/dia/' + dia
        );
    }

    public getVentasMes(mes: string): Observable<any> {
        return this.http.get<any>(
            this.url + '/pizzeria_ventas/mes/' + mes
        );
    }

    public getDetalleVenta(id: number): Observable<any> {
        return this.http.get<any>(
            this.url + '/pizzeria_ventas/detalle/' + id
        );
    }
}