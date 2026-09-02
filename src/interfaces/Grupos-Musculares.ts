interface GruposMusculares {
    success: boolean;
    data: Data[];
  }
  interface Data {
    id: number;
    nombre: string;
    imagen: string;
    descripcion: string;
    updated_at: string;
    created_at: string;
  }