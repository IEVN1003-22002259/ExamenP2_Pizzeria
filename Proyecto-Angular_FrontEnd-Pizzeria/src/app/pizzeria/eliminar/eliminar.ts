
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { PizzeriaApiService } from '../pedidosapi.service';

@Component({
    imports: [CommonModule],
    selector: 'app-eliminar',
    templateUrl: './eliminar.html',
})
export class Eliminar implements OnInit {

    pedido: any = {};
    id_pedido: number = 0;

    constructor(
        public pizzeriaApi: PizzeriaApiService,
        private route: ActivatedRoute,
        private router: Router,
        private cdr: ChangeDetectorRef
    ) { }

    ngOnInit(): void {

        this.id_pedido = Number(
            this.route.snapshot.paramMap.get('id_pedido')
        );

        this.pizzeriaApi.getPedido(this.id_pedido).subscribe({
            next: (response) => {
                this.pedido = response.pedido ? response.pedido : response;
                this.cdr.detectChanges();
            },
            error: (error) => {
                console.error(error);
                alert('Error al consultar el pedido.');
            }
        });
    }

    confirmarEliminar(): void {

        if (confirm('¿Estás seguro de que deseas eliminar este pedido?')) {

            this.pizzeriaApi.eliminarPedido(this.id_pedido).subscribe({
                next: (response) => {
                    alert('Pedido eliminado correctamente.');
                    this.router.navigate(['/pizzeria/pedidos']);
                },
                error: (error) => {
                    console.error(error);
                    alert('Error al eliminar el pedido.');
                }
            });

        }
    }

    regresar(): void {
        this.router.navigate(['/pizzeria/pedidos']);
    }
}
