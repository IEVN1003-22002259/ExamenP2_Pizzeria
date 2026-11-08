
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PizzeriaApiService } from '../pedidosapi.service';

@Component({
    imports: [CommonModule, ReactiveFormsModule],
    selector: 'app-editar',
    templateUrl: './editar.html',
})
export class Editar implements OnInit {

    formulario!: FormGroup;
    detalle: any[] = [];
    id_pedido: number = 0;
    total: number = 0;

    constructor(
        private fb: FormBuilder,
        public pizzeriaApi: PizzeriaApiService,
        private route: ActivatedRoute,
        private router: Router,
        private cdr: ChangeDetectorRef
    ) { }

    ngOnInit(): void {

        this.formulario = this.fb.group({
            nombre_cliente: ['', Validators.required],
            direccion: ['', Validators.required],
            telefono: ['', [
                Validators.required,
                Validators.pattern('^[0-9]{10}$')
            ]],
            fecha_pedido: ['', Validators.required]
        });

        this.id_pedido = Number(
            this.route.snapshot.paramMap.get('id_pedido')
        );

        this.pizzeriaApi.getPedido(this.id_pedido).subscribe({
            next: (response) => {

                let pedido = response.pedido ? response.pedido : response;

                let fecha = pedido.fecha_pedido;

                if (fecha) {
                    fecha = new Date(fecha).toISOString().substring(0, 10);
                }

                this.formulario.patchValue({
                    nombre_cliente: pedido.nombre_cliente,
                    direccion: pedido.direccion,
                    telefono: pedido.telefono,
                    fecha_pedido: fecha
                });

                this.detalle = response.detalle
                    ? response.detalle
                    : pedido.detalle || [];

                this.total = Number(pedido.total);

                this.cdr.detectChanges();
            },
            error: (error) => {
                console.error(error);
                alert('Error al consultar el pedido.');
            }
        });
    }

    guardarCambios(): void {

        if (this.formulario.invalid) {
            this.formulario.markAllAsTouched();
            alert('Completa correctamente los datos del cliente.');
            return;
        }

        let datos = this.formulario.value;
        datos.detalle = this.detalle;

        this.pizzeriaApi.modificarPedido(this.id_pedido, datos).subscribe({
            next: (response) => {
                alert('Pedido actualizado correctamente.');
                this.router.navigate(['/pizzeria/pedidos']);
            },
            error: (error) => {
                console.error(error);
                alert('Error al actualizar el pedido.');
            }
        });
    }

    regresar(): void {
        this.router.navigate(['/pizzeria/pedidos']);
    }
}
