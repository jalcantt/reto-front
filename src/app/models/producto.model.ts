export interface Producto {
  id: number;                     // Identificador único del producto
  nombre: string;                 // Nombre del producto
  descripcion: string | null;      // Descripción del producto (opcional, puede ser null)
  precio: number;                 // Precio del producto
  fechaCreacion: string;          // Fecha de creación en formato ISO
  estado: 'Activo' | 'Inactivo';  // Estado del producto
}
