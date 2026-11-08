
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DetallePedido, Pedido } from '../pedidos';
import { PizzeriaApiService } from '../pedidosapi.service';

@Component({
    imports: [CommonModule, ReactiveFormsModule],
    selector: 'app-agregar',
    templateUrl: './agregar.html',
})
export class Agregar {

    formulario: FormGroup;

    detalle: DetallePedido[] = [];

    total: number = 0;

    precioBase: number = 0;

    precioIngredientes: number = 0;

    subtotal: number = 0;

    ingredientesSeleccionados: string[] = [];

    precios: any = {
        Chica: 40,
        Mediana: 80,
        Grande: 120
    };

    constructor(
        private fb: FormBuilder,
        public pizzeriaApi: PizzeriaApiService,
        private router: Router
    ) {
        this.formulario = this.fb.group({
            nombre_cliente: ['', Validators.required],
            direccion: ['', Validators.required],
            telefono: ['', [
                Validators.required,
                Validators.pattern('^[0-9]{10}$')
            ]],
            fecha_pedido: ['', Validators.required],
            tamano: [''],
            jamon: [false],
            pina: [false],
            champinones: [false],
            cantidad: [1]
        });
    }

    calcularSubtotal(): void {

        let tamano = this.formulario.value.tamano;
        let cantidad = Number(this.formulario.value.cantidad);

        this.precioBase = this.precios[tamano] || 0;

        this.precioIngredientes = 0;

        if (this.formulario.value.jamon) {
            this.precioIngredientes = this.precioIngredientes + 10;
        }

        if (this.formulario.value.pina) {
            this.precioIngredientes = this.precioIngredientes + 10;
        }

        if (this.formulario.value.champinones) {
            this.precioIngredientes = this.precioIngredientes + 10;
        }

        this.subtotal = (this.precioBase + this.precioIngredientes) * cantidad;
    }

    agregarPizza(): void {

        if (
            !this.formulario.value.tamano ||
            Number(this.formulario.value.cantidad) <= 0
        ) {
            alert('Selecciona el tamaño y una cantidad válida.');
            return;
        }

        this.calcularSubtotal();

        this.ingredientesSeleccionados = [];

        if (this.formulario.value.jamon) {
            this.ingredientesSeleccionados.push('Jamón');
        }

        if (this.formulario.value.pina) {
            this.ingredientesSeleccionados.push('Piña');
        }

        if (this.formulario.value.champinones) {
            this.ingredientesSeleccionados.push('Champiñones');
        }

        let ingredientes = this.ingredientesSeleccionados.length > 0
            ? this.ingredientesSeleccionados.join(', ')
            : 'Sin ingredientes extra';

        let pizza: DetallePedido = {
            tamano: this.formulario.value.tamano,
            ingredientes: ingredientes,
            cantidad: Number(this.formulario.value.cantidad),
            subtotal: this.subtotal
        };

        this.detalle.push(pizza);

        this.total = 0;

        for (let i = 0; i < this.detalle.length; i++) {
            this.total = this.total + Number(this.detalle[i].subtotal);
        }

        this.formulario.patchValue({
            tamano: '',
            jamon: false,
            pina: false,
            champinones: false,
            cantidad: 1
        });

        this.precioBase = 0;
        this.precioIngredientes = 0;
        this.subtotal = 0;
    }

    quitarPizza(i: number): void {

        this.detalle.splice(i, 1);

        this.total = 0;

        for (let i = 0; i < this.detalle.length; i++) {
            this.total = this.total + Number(this.detalle[i].subtotal);
        }
    }

    terminarPedido(): void {

        if (
            this.formulario.get('nombre_cliente')?.invalid ||
            this.formulario.get('direccion')?.invalid ||
            this.formulario.get('telefono')?.invalid ||
            this.formulario.get('fecha_pedido')?.invalid ||
            this.detalle.length === 0
        ) {
            alert('Completa los datos del cliente y agrega al menos una pizza.');
            return;
        }

        this.total = 0;

        for (let i = 0; i < this.detalle.length; i++) {
            this.total = this.total + Number(this.detalle[i].subtotal);
        }

        let pedido: Pedido = {
            nombre_cliente: this.formulario.value.nombre_cliente,
            direccion: this.formulario.value.direccion,
            telefono: this.formulario.value.telefono,
            fecha_pedido: this.formulario.value.fecha_pedido,
            total: this.total,
            detalle: this.detalle
        };

        if (confirm('El total del pedido es $' + this.total + '. ¿Deseas guardar el pedido?')) {

            this.pizzeriaApi.agregarPedido(pedido).subscribe({
                next: (response) => {
                    alert('¡Pedido registrado correctamente!');
                    this.router.navigate(['/pizzeria/pedidos']);
                },
                error: (error) => {
                    console.error(error);
                    alert('Error al registrar el pedido.');
                }
            });
        }
    }

    regresar(): void {
        this.router.navigate(['/pizzeria/pedidos']);
    }
}
