export interface Ejercicio {
    success: boolean;
    data:    Datum[];
}

export interface Datum {
    id:          number;
    rutina_id:   number;
    nombre:      string;
    descripcion: string;
    imagen:      string;
    status:      string;
    created_at:  Date;
    updated_at:  Date;
}
