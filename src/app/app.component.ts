import { Component } from '@angular/core';
import { ClienteComponent } from './components/cliente/cliente.component'; 
import { ProductoComponent } from './components/producto/producto.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ClienteComponent, ProductoComponent], 
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'], // Cambiado a styleUrls
})
export class AppComponent {}
