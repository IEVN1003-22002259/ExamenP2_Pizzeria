
import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Pedido } from '../pedidos';
import { PizzeriaApiService } from '../pedidosapi.service';

@Component({
    imports: [CommonModule],
    selector: 'app-ventas',
    templateUrl: './ventas.html',
})
export class Ventas {

    diaSeleccionado: string = 'lunes';

    mesSeleccionado: string = 'enero';

    ventasDia: Pedido[] = [];

    ventasMes: Pedido[] = [];

    cantidadPedidos: number = 0;

    totalVentas: number = 0;

    mensajeDia: string = '';

    mensajeMes: string = '';

    constructor(
        public pizzeriaApi: PizzeriaApiService,
        private router: Router,
        private cdr: ChangeDetectorRef
    ) { }

    consultarDia(): void {

        this.mensajeDia = '';

        this.pizzeriaApi.getVentasDia(this.diaSeleccionado).subscribe({
            next: (response) => {

                this.ventasDia = response;

                if (this.ventasDia.length === 0) {
                    this.mensajeDia = 'No hay ventas registradas para este día.';
                }

                this.cdr.detectChanges();
            },
            error: (error) => {
                console.error(error);
                this.mensajeDia = 'Error al consultar las ventas.';
            }
        });
    }

    consultarMes(): void {

        this.mensajeMes = '';

        this.pizzeriaApi.getVentasMes(this.mesSeleccionado).subscribe({
            next: (response) => {

                this.ventasMes = response.pedidos;
                this.cantidadPedidos = response.cantidad_pedidos;
                this.totalVentas = Number(response.total_ventas);

                if (this.ventasMes.length === 0) {
                    this.mensajeMes = 'No hay ventas registradas para este mes.';
                }

                this.cdr.detectChanges();
            },
            error: (error) => {
                console.error(error);
                this.mensajeMes = 'Error al consultar las ventas del mes.';
            }
        });
    }

    verDetalle(id_pedido: number): void {
        this.router.navigate(['/pizzeria/detalle', id_pedido]);
    }
}
