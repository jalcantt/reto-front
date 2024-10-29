// cliente.component.ts
import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ModeEnum } from '../../models/mode.enum';
import { ClienteService } from '../../services/cliente.service';
import { Cliente } from '../../models/cliente.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-cliente',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './cliente.component.html',
  styleUrls: ['./cliente.component.scss']
})
export class ClienteComponent implements OnInit {
  private clienteService = inject(ClienteService);
  private fb = inject(FormBuilder);
  
  form = this.fb.group({
    id: [0],
    nombre: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    telefono: ['', Validators.required],
  });

  ModeEnum = ModeEnum;
  clientes!: Cliente[];
  mode = ModeEnum.NON;

  ngOnInit(): void {
    this.setClientes();
  }

  private setClientes() {
    this.clienteService.getAllClientes().subscribe({
      next: (data) => {
        this.clientes = data;
      },
      error: (error) => {
        console.error('Error fetching clientes:', error);
      }
    });
  }

  addCliente() {
    this.mode = ModeEnum.ADD;
    this.form.reset();
  }

  editCliente(cliente: Cliente) {
    this.mode = ModeEnum.EDIT;
    this.form.setValue(cliente);
  }

  saveCliente() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    
    const cliente = this.form.value as Cliente;
  
    if (this.mode === ModeEnum.ADD) {      
      this.clienteService.addCliente(cliente).subscribe({
        next: (newCliente) => {
          console.log('Cliente added:', newCliente);
          this.setClientes();
          this.cancel();
        },
        error: (err) => {
          console.error('Error adding cliente:', err);
        }
      });
    } else {
      this.clienteService.updateCliente(cliente).subscribe({
        next: () => {
          console.log('Cliente updated:', cliente);
          this.setClientes();
          this.cancel();
        },
        error: (err) => {
          console.error('Error updating cliente:', err);
        }
      });
    }
  }

  removeCliente(cliente: Cliente) {
    this.clienteService.deleteCliente(cliente.id).subscribe({
      next: () => {
        console.log('Cliente deleted:', cliente.id);
        this.setClientes();
      },
      error: (err) => {
        console.error('Error deleting cliente:', err);
      }
    });
  }

  cancel() {
    this.form.reset();
    this.mode = ModeEnum.NON;
  }
}
