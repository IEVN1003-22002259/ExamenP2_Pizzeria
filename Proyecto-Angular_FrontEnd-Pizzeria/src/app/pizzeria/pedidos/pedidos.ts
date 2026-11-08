
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Pedido } from '../pedidos';
import { PizzeriaApiService } from '../pedidosapi.service';

@Component({
    imports: [CommonModule],
    selector: 'app-pedidos',
    templateUrl: './pedidos.html',
})
export class Pedidos implements OnInit {

    dataSource: Pedido[] = [];

    constructor(
        public pizzeriaApi: PizzeriaApiService,
        private router: Router,
        private cdr: ChangeDetectorRef
    ) { }

    ngOnInit(): void {
        this.cargarPedidos();
    }

    cargarPedidos(): void {
        this.pizzeriaApi.getPedidos().subscribe({
            next: (response) => {
                console.log('Datos recibidos del API:', response);

                this.dataSource = response;

                this.cdr.detectChanges();

                console.log('Total de pedidos:', this.dataSource.length);
            },
            error: (error) => {
                console.error('Error al consultar los pedidos:', error);
            }
        });
    }

    agregarPedido(): void {
        this.router.navigate(['/pizzeria/agregar']);
    }

    editarPedido(id_pedido: number): void {
        this.router.navigate(['/pizzeria/editar', id_pedido]);
    }

    eliminarPedido(id_pedido: number): void {
        this.router.navigate(['/pizzeria/eliminar', id_pedido]);
    }

    verDetalle(id_pedido: number): void {
        this.router.navigate(['/pizzeria/detalle', id_pedido]);
    }
}
