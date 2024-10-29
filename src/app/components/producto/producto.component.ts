import { Component, OnInit, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ModeEnum } from '../../models/mode.enum';
import { ProductoService } from '../../services/producto.service';
import { Producto } from '../../models/producto.model';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-producto',
  standalone: true,
  imports: [RouterOutlet, ReactiveFormsModule, CommonModule],
  templateUrl: './producto.component.html',
  styleUrl: './producto.component.scss'
})
export class ProductoComponent implements OnInit {
  private productoService = inject(ProductoService);
  private fb = inject(FormBuilder);
  form = this.fb.group({
    id: [0],
    nombre: ['', Validators.required],
    descripcion: [''],
    precio: [0, [Validators.required, Validators.min(0)]], // Asegurarse de que sea un número positivo
    fechaCreacion: [new Date().toISOString(), Validators.required], // Inicializar con la fecha actual en formato ISO
    estado: ['', Validators.required],
  });
  ModeEnum = ModeEnum;
  productos!: Producto[];
  mode = ModeEnum.NON;

  ngOnInit(): void {
    this.setProductos();
  }

  private setProductos() {
    this.productoService.getAllProductos().subscribe({
      next: (data) => {
        this.productos = data;
      },
      error: (error) => {
        console.error('Error fetching productos:', error);
      }
    });
  }

  addProducto() {
    this.mode = ModeEnum.ADD;
  }

  editProducto(producto: Producto) {
    this.mode = ModeEnum.EDIT;
    this.form.setValue(producto);
  }
  saveProducto() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    
    const producto = this.form.value as Producto;
  
    if (this.mode === ModeEnum.ADD) {      
      this.productoService.addProducto(producto).subscribe({
        next: (newProducto) => {
          console.log('Producto added:', newProducto);
          this.setProductos(); // Refresca la lista de productos después de agregar
          this.cancel(); // Resetea el formulario
        },
        error: (err) => {
          console.error('Error adding producto:', err); // Manejo de errores
        }
      });
    } else {
      this.productoService.updateProducto(producto).subscribe({
        next: () => {
          console.log('Producto updated:', producto);
          this.setProductos(); // Refresca la lista de productos después de actualizar
          this.cancel(); // Resetea el formulario
        },
        error: (err) => {
          console.error('Error updating producto:', err); // Manejo de errores
        }
      });
    }
  }
  

  removeProducto(producto: Producto) {
    this.productoService.deleteProducto(producto.id).subscribe({
      next: () => {
        console.log('Producto deleted:', producto.id);
        this.setProductos(); // Refresca la lista de clientes después de eliminar
      },
      error: (err) => {
        console.error('Error deleting producto:', err); // Manejo de errores
      }
    });
  }
  

  cancel() {
    this.form.reset();
    this.mode = ModeEnum.NON;
  }

}
