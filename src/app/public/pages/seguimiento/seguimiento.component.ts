import { Component, OnInit, OnDestroy } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { CustomerService } from 'src/services/customers/customer-service.service';
import { LogService } from 'src/services/logs/log-service.service';

declare var bootstrap: any; // Para manejar el modal de Bootstrap

@Component({
  selector: 'app-seguimiento',
  templateUrl: './seguimiento.component.html',
  styleUrls: ['./seguimiento.component.css'],
})
export class SeguimientoComponent implements OnInit, OnDestroy {
  previewImages: string[] = [];
  base64Images: any[] = [];
  selectedFiles: File[] = [];
  loadedImages: any[] = [];
  uploadedImagesDetails: any[] = []; // Almacena detalles como peso y comentarios
  user = localStorage.getItem('clienteNombre');
  // Variables para la modal
  currentImagePreview: string = '';
  currentImageDetails: any = { peso: '', comentarios: '' };
  currentFileIndex: number = 0;
  nextUploadDate: Date | null = null;
  private commentModal: any; // Referencia a la modal de Bootstrap
  canUpload: boolean = true;
  constructor(
    private customerService: CustomerService,
    private toastr: ToastrService,
    private logService: LogService
  ) {}
  enviarLog(accion: string, contenido: string) {
    this.logService.setLog(accion, contenido).subscribe({
      next: () => {
        console.log('Log registrado exitosamente.');
      },
      error: (logError) => {
        console.error('Error al registrar el log:', logError);
      },
    });
  }
  checkUploadAvailability(): void {
    if (this.loadedImages.length > 0) {
      const lastImageDate = new Date(
        this.loadedImages[this.loadedImages.length - 1].created_at
      );
      this.nextUploadDate = new Date(lastImageDate);
      this.nextUploadDate.setDate(lastImageDate.getDate() + 15);

      const today = new Date();
      this.canUpload = today >= this.nextUploadDate;
    } else {
      this.canUpload = true;
    }
  }
  isDragOver = false;

  triggerFileInput(): void {
    const fileInput = document.getElementById('fileInput') as HTMLInputElement;
    fileInput?.click();
  }

  modalImage: any = null;
  modalImageSrc: string = '';
  modalImageIndex: number = 0;

  openImageModal(img: any, index: number): void {
    this.modalImage = img;
    this.modalImageSrc = this.getImageSrc(img.image);
    this.modalImageIndex = index;

    // Abre el modal usando Bootstrap
    const modal = new bootstrap.Modal(document.getElementById('imageModal')!);
    modal.show();
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    this.isDragOver = true;
  }
  handleFiles(files: FileList): void {
    // Aquí haces lo que necesitas con los archivos
    console.log('[Archivos recibidos]', files);
    const event = { target: { files } };
  this.onFilesSelected(event);
  }
  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    this.isDragOver = false;
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    this.isDragOver = false;

    const files = event.dataTransfer?.files;
    if (files) {
      this.handleFiles(files);
    }
  }
  ngOnInit(): void {
    console.log('hola');
    this.LOAD_IMAGES();
    this.checkUploadAvailability();
    // Crear instancia de la modal al iniciar el componente
    const modalElement = document.getElementById('commentModal');
    this.commentModal = new bootstrap.Modal(modalElement, {
      backdrop: 'static', // Evitar que se cierre al hacer clic fuera de la modal
      keyboard: false, // Evitar que se cierre al presionar la tecla 'Escape'
    });
  }

  ngOnDestroy(): void {
    // Destruir la instancia de la modal al destruir el componente para limpiar recursos
    if (this.commentModal) {
      this.commentModal.dispose();
    }
  }

  LOAD_IMAGES() {
    this.customerService.getImagenes().subscribe(
      (response) => {
        if (response.success && response.data) {
          this.loadedImages = response.data.map((img: any) => ({
            image: 'data:image/png;base64,' + img.image, // Concatenar el prefijo base64 con la imagen
            peso: img.peso, // Asignar el peso recibido
            comentarios: img.comentarios,
            id: img.id, // Asignar los comentarios recibidos
            created_at: new Date(img.created_at), // Convertir la fecha a un objeto de tipo Date
          }));
          this.checkUploadAvailability();
          console.log('Imágenes cargadas:', this.loadedImages);
        }
      },
      (error) => {
        console.error('Error al cargar imágenes:', error);
      }
    );
  }
  deleteImage(imageId: number): void {
    this.customerService.deleteImage(imageId).subscribe({
      next: (response) => {
        // Filtrar la imagen eliminada de la lista
        this.loadedImages = this.loadedImages.filter(
          (img) => img.id !== imageId
        );
        this.enviarLog('Se borro imagen', 'se borro la imagen $imageId'),
          this.showSuccess();
        this.LOAD_IMAGES();
      },
      error: (err) => {
        console.error('Error al eliminar la imagen', err);
        this.showError();
      },
    });
  }

  onFilesSelected(event: any): void {
    this.checkUploadAvailability();
    const files: FileList = event.target.files || event.dataTransfer?.files;
    if (!files) return;

    this.previewImages = [];
    this.selectedFiles = [];
    this.uploadedImagesDetails = [];

    let modalOpened = false;
    const tempPreviews: string[] = [];

    Array.from(files).forEach((file, index) => {
      this.selectedFiles.push(file);

      const reader = new FileReader();
      reader.onload = (e: any) => {
        tempPreviews.push(e.target.result);

        // Solo cuando ya se hayan leído todas las imágenes
        if (tempPreviews.length === files.length) {
          this.previewImages = [...tempPreviews];

          // Mostrar la primera imagen y abrir el modal
          if (!modalOpened) {
            modalOpened = true;
            this.currentImagePreview = tempPreviews[0];
            this.currentFileIndex = 0;
            this.openModal();
          }
        }
      };
      reader.readAsDataURL(file);
    });
  }




  // Método para abrir la modal
  openModal() {
    this.commentModal.show();
  }

  // Método para guardar los detalles de la imagen actual
  saveImageDetails() {
    const { peso, comentarios } = this.currentImageDetails;

    // Agrega los detalles a cada imagen, no solo una por una
    for (let i = this.currentFileIndex; i < this.previewImages.length; i++) {
      this.uploadedImagesDetails.push({
        preview: this.previewImages[i],
        peso,
        comentarios
      });
    }

    // Limpiar campos
    this.currentImageDetails = { peso: '', comentarios: '' };

    // Cierra modal y guarda las imágenes
    this.commentModal.hide();
    this.saveImagesAsBase64();
  }

  getImageSrc(miniatura: string): string {
    if (miniatura.startsWith('https')) {
      // Si la miniatura comienza con "https", es una URL directa (Firebase)
      return miniatura;
    } else {
      // Si no comienza con "https", asumimos que es Base64
      return  miniatura;
    }
  }
  // Convierte las imágenes seleccionadas a Base64
  saveImagesAsBase64() {
    this.base64Images = []; // Limpiar array base64

    const promises: Promise<void>[] = [];

    this.selectedFiles.forEach((file, index) => {
      const reader = new FileReader();
      const promise = new Promise<void>((resolve) => {
        reader.onload = (e: any) => {
          // Agregar imagen en Base64 (sin el encabezado) al array
          this.base64Images.push({
            image: e.target.result.split(',')[1], // Imagen en Base64
            peso: this.uploadedImagesDetails[index].peso, // Peso del detalle asociado
            comentarios: this.uploadedImagesDetails[index].comentarios, // Comentarios del detalle asociado
          });
          resolve();
        };
      });
      reader.readAsDataURL(file); // Convertir la imagen a base64
      promises.push(promise);
    });

    // Esperamos que todas las imágenes se conviertan antes de hacer la llamada al servidor
    Promise.all(promises).then(() => {
      // Llamar al servicio para subir las imágenes
      this.customerService.uploadCustomerImages(this.base64Images).subscribe(
        (response) => {
          this.enviarLog('Subio imagen', 'Subio imagen de seguimiento'),
          this.showSuccess();
          this.LOAD_IMAGES();
          this.previewImages = [];
        },
        (error) => {
          this.showError();
        }
      );
    });
  }

  // Mostrar mensaje de éxito
  showSuccess() {
    this.toastr.info('Completado', 'Imágenes cargadas');
  }

  // Mostrar mensaje de error
  showError() {
    this.toastr.error('Error', 'Ocurrió un error');
  }

  // Elimina una imagen seleccionada
  removeImage(index: number) {
    this.previewImages.splice(index, 1); // Elimina la imagen de la vista previa
    this.selectedFiles.splice(index, 1); // Elimina el archivo correspondiente
  }
}
