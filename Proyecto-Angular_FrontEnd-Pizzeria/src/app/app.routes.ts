import { Routes } from '@angular/router';

export const routes: Routes = [
  {
      path: 'pizzeria',
      children: [
          {
              path: 'pedidos',
              loadComponent: () =>
                  import('./pizzeria/pedidos/pedidos').then(c => c.Pedidos)
          },
          {
              path: 'agregar',
              loadComponent: () =>
                  import('./pizzeria/agregar/agregar').then(c => c.Agregar)
          },
          {
              path: 'editar/:id_pedido',
              loadComponent: () =>
                  import('./pizzeria/editar/editar').then(c => c.Editar)
          },
          {
              path: 'eliminar/:id_pedido',
              loadComponent: () =>
                  import('./pizzeria/eliminar/eliminar').then(c => c.Eliminar)
          },
          {
              path: 'ventas',
              loadComponent: () =>
                  import('./pizzeria/ventas/ventas').then(c => c.Ventas)
          },
          {
              path: 'detalle/:id_pedido',
              loadComponent: () =>
                  import('./pizzeria/detalle/detalle').then(c => c.Detalle)
          }
      ]
  },

  { path: '', redirectTo: 'pizzeria/pedidos', pathMatch: 'full' },
  { path: '**', redirectTo: 'pizzeria/pedidos' }

];
