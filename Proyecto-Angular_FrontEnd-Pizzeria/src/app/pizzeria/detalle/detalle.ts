
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { PizzeriaApiService } from '../pedidosapi.service';

@Component({
    imports: [CommonModule],
    selector: 'app-detalle',
    templateUrl: './detalle.html',
})
export class Detalle implements OnInit {

    detalle: any[] = [];
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

        this.pizzeriaApi.getDetalleVenta(this.id_pedido).subscribe({
            next: (response) => {
                this.detalle = response;
                this.cdr.detectChanges();
            },
            error: (error) => {
                console.error('Error al consultar el detalle:', error);
                alert('Error al consultar el detalle del pedido.');
            }
        });
    }

    regresar(): void {
        this.router.navigate(['/pizzeria/ventas']);
    }
}
