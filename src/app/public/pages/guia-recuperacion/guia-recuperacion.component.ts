import { Component, OnInit } from '@angular/core';
declare var bootstrap: any;
@Component({
  selector: 'app-guia-recuperacion',
  templateUrl: './guia-recuperacion.component.html',
  styleUrls: ['./guia-recuperacion.component.css'],
})
export class GuiaRecuperacionComponent implements OnInit {
  lesiones: { titulo: string; descripcion: string; modal: string }[] = [];
  lesionSeleccionada: {
    titulo: string;
    descripcion: string;
    modal: string;
  } | null = null;

  ngOnInit(): void {
    this.lesiones = [
      {
        titulo: 'Tendinitis',
        descripcion:
          'Inflamación de un tendón debido al uso excesivo, tensión repetitiva o lesiones...',
        modal: `
          <h6 class="fw-bold text-primary mt-3">🔍 Entendiendo la condición</h6>
          <p>La tendinitis es la inflamación de un tendón, la estructura fibrosa que conecta el músculo al hueso. Generalmente es causada por el uso excesivo o movimientos repetitivos. Suele presentarse en articulaciones como hombros, codos, muñecas, rodillas y tobillos.</p>
          <h6 class="fw-bold text-primary mt-4">📅 Cuándo consultar a un especialista</h6>
          <ul>
            <li>Dolor intenso que limita la función</li>
            <li>Persistencia de síntomas por más de unas semanas</li>
            <li>Pérdida súbita de movilidad en la articulación</li>
            <li>Dolor que reaparece con frecuencia</li>
          </ul>
          <h6 class="fw-bold text-primary mt-4">⏱️ Tiempos de recuperación</h6>
          <p>Casos leves pueden mejorar en 2 a 3 semanas con reposo y cuidados en casa. Los casos graves pueden tardar 4 a 6 semanas o más, requiriendo fisioterapia, medicamentos o inyecciones. En casos raros se considera cirugía.</p>

          <h6 class="fw-bold text-primary mt-4">✅ Qué hacer</h6>
          <ul>
            <li>Reposar el tendón evitando actividades dolorosas (2-3 días iniciales)</li>
            <li>Aplicar hielo 20 minutos cada 2-3 horas</li>
            <li>Usar vendaje elástico o soporte sin apretar demasiado</li>
            <li>Movilizar suavemente la zona una vez que disminuya el dolor</li>
            <li>Calentar antes de entrenar y estirar después</li>
          </ul>
          <h6 class="fw-bold text-danger mt-4">🚫 Qué evitar</h6>
          <ul>
            <li>Hacer ejercicio o cargar peso con dolor</li>
            <li>Realizar movimientos repetitivos sin descansos</li>
            <li>Practicar deportes sin recuperación total</li>
            <li>Comenzar deportes sin práctica previa</li>
            <li>Ignorar señales de sobrecarga muscular</li>
          </ul>
        `,
      },
      {
        titulo: 'Lumbalgia',
        descripcion:
          'Dolor en la zona lumbar de la espalda, puede variar en intensidad y duración.',
        modal: `
    <h6 class="fw-bold text-primary mt-3">🧠 Entendiendo la condición</h6>
    <p>La lumbalgia, o dolor lumbar, es una afección común que puede ser aguda, subaguda o crónica, a menudo sin una causa específica identificable.</p>

    <h6 class="fw-bold text-primary mt-4">📅 Cuándo consultar a un especialista</h6>
    <ul>
      <li>Incapacidad para mover una pierna</li>
      <li>Debilidad, hormigueo o entumecimiento en piernas, abdomen o glúteos</li>
      <li>Pérdida de control de vejiga o intestinos</li>
      <li>Fiebre, pérdida de peso inexplicable o malestar general</li>
      <li>Dolor que no mejora después de 14 días</li>
    </ul>

    <h6 class="fw-bold text-primary mt-4">⏱️ Tiempos de recuperación</h6>
    <p>La mayoría de los casos agudos mejoran en 4 a 5 días. El dolor intenso disminuye en 2-3 días. Si dura más de 14 días, puede indicar otro problema.</p>

    <h6 class="fw-bold text-primary mt-4">✅ Qué hacer</h6>
    <ul>
      <li>Volver a las actividades diarias tan pronto como sea posible</li>
      <li>Ejercicio suave como caminar</li>
      <li>Buena postura al sentarse y al estar de pie</li>
      <li>Mecánica corporal adecuada al levantar objetos</li>
      <li>Soporte lumbar al sentarse</li>
      <li>Posiciones adecuadas para dormir</li>
      <li>Reducir el estrés</li>
    </ul>

    <h6 class="fw-bold text-danger mt-4">🚫 Qué evitar</h6>
    <ul>
      <li>Doblarse excesivamente o levantar objetos pesados</li>
      <li>Reposo en cama prolongado</li>
      <li>Actividades que empeoren el dolor</li>
    </ul>
  `,
      },
      {
        titulo: 'Roturas de fibras',
        descripcion:
          'Lesiones musculares que implican estiramiento o desgarro de fibras musculares.',
        modal: `
    <h6 class="fw-bold text-primary mt-3">🧠 Entendiendo la condición</h6>
    <p>Las roturas de fibras musculares se clasifican en tres grados según la gravedad y afectan comúnmente a isquiotibiales, cuádriceps y músculos de la pantorrilla.</p>

    <h6 class="fw-bold text-primary mt-4">📅 Cuándo consultar a un especialista</h6>
    <ul>
      <li>No mejora tras aplicar protocolo RICE en 1-2 días</li>
      <li>Dolor intenso y dificultad para mover la extremidad</li>
      <li>Hematomas o deformidad muscular visible</li>
      <li>Entumecimiento u hormigueo</li>
      <li>Desgarros musculares recurrentes</li>
    </ul>

    <h6 class="fw-bold text-primary mt-4">⏱️ Tiempos de recuperación</h6>
    <p>Grado 1: días a 2 semanas. Grado 2: semanas a más de un mes. Grado 3: puede requerir cirugía y meses de rehabilitación.</p>

    <h6 class="fw-bold text-primary mt-4">✅ Qué hacer</h6>
    <ul>
      <li>Proteger la zona (muletas si es necesario)</li>
      <li>Reposar el músculo afectado</li>
      <li>Aplicar frío cada 2-4 horas</li>
      <li>Comprimir con vendaje elástico</li>
      <li>Elevar la extremidad lesionada</li>
      <li>Usar analgésicos de venta libre</li>
      <li>Estiramientos suaves cuando disminuya el dolor</li>
      <li>Reintegración gradual con plan de rehabilitación</li>
      <li>Buena hidratación y nutrición</li>
      <li>Calentamiento y estiramiento adecuado en el futuro</li>
    </ul>

    <h6 class="fw-bold text-danger mt-4">🚫 Qué evitar</h6>
    <ul>
      <li>Usar el músculo lesionado si hay dolor</li>
      <li>Aplicar calor en las primeras 48-72 horas</li>
      <li>Masajes en fase aguda</li>
      <li>Reanudar actividad intensa antes de tiempo</li>
      <li>Ignorar signos de lesión severa</li>
      <li>Omitir calentamiento y enfriamiento adecuado</li>
    </ul>
  `,
      },
      {
        titulo: 'Contracturas',
        descripcion:
          'Contracción involuntaria y sostenida de un músculo que causa dolor y limitación del movimiento.',
        modal: `
    <h6 class="fw-bold text-primary mt-3">🧠 Entendiendo la condición</h6>
    <p>Las contracturas implican endurecimiento y acortamiento muscular sin rotura. Pueden surgir por esfuerzos intensos, mala preparación física o traumatismos leves.</p>

    <h6 class="fw-bold text-primary mt-4">📅 Cuándo consultar a un especialista</h6>
    <ul>
      <li>Dolor intenso o persistente</li>
      <li>Duración mayor a una semana</li>
      <li>Incertidumbre sobre el diagnóstico</li>
      <li>Consulta con fisioterapeuta o médico deportivo recomendada</li>
    </ul>

    <h6 class="fw-bold text-primary mt-4">⏱️ Tiempos de recuperación</h6>
    <p>Generalmente entre pocos días a una semana, dependiendo de la gravedad, ubicación y cuidados individuales.</p>

    <h6 class="fw-bold text-primary mt-4">✅ Qué hacer</h6>
    <ul>
      <li>Aplicar calor para relajar el músculo</li>
      <li>Masajes suaves</li>
      <li>Descanso adecuado</li>
      <li>Estiramientos sin dolor</li>
      <li>Hidratación adecuada</li>
      <li>Analgésicos o relajantes musculares si es necesario</li>
      <li>Crioterapia si hay inflamación</li>
    </ul>

    <h6 class="fw-bold text-danger mt-4">🚫 Qué evitar</h6>
    <ul>
      <li>Ignorar dolor intenso o persistente</li>
      <li>Forzar estiramientos</li>
      <li>Volver a la actividad física muy pronto</li>
      <li>Omitir calentamiento adecuado</li>
      <li>Estiramientos bruscos</li>
    </ul>
  `,
      },
      {
        titulo: 'Lesiones en la rodilla',
        descripcion:
          'Lesiones comunes que afectan estructuras como ligamentos, meniscos, tendones, rótula y cartílago...',
        modal: `
    <h6 class="fw-bold text-primary mt-3">🧠 Entendiendo la condición</h6>
    <p>Las lesiones de rodilla son comunes y pueden afectar diferentes estructuras, incluyendo ligamentos (esguinces o roturas de ligamentos cruzados, colaterales), meniscos (desgarros), tendones (tendinitis rotuliana, tendinitis del cuádriceps), la rótula (subluxación o luxación), o el cartílago (osteoartritis, condromalacia rotuliana). Las causas pueden variar desde traumatismos directos y movimientos de torsión hasta el uso excesivo y una técnica inadecuada durante el ejercicio.</p>

    <h6 class="fw-bold text-primary mt-4">📅 Cuándo consultar a un especialista</h6>
    <ul>
      <li>Dolor intenso</li>
      <li>Incapacidad para soportar peso</li>
      <li>Deformidad visible</li>
      <li>Chasquido o bloqueo de la rodilla</li>
      <li>Hinchazón rápida</li>
      <li>Dolor que no mejora con autocuidado</li>
      <li>Inestabilidad o sensación de falla</li>
      <li>Sospecha de rotura de ligamento o menisco</li>
    </ul>
    <h6 class="fw-bold text-primary mt-4">⏱️ Tiempos de recuperación</h6>
    <p>Varían ampliamente según el tipo y gravedad de la lesión. Esguinces leves: semanas a 2 meses. Desgarros de menisco: 4-6 semanas con fisioterapia, o cirugía con tiempo similar. Roturas de ligamentos cruzados: cirugía y rehabilitación de 6-9 meses. Tendinitis rotuliana: 3-6 semanas con manejo conservador. Osteoartritis: condición crónica con manejo a largo plazo.</p>

    <h6 class="fw-bold text-primary mt-4">✅ Qué hacer</h6>
    <ul>
      <li>Seguir el protocolo RICE (Reposo, Hielo, Compresión, Elevación)</li>
      <li>Usar analgésicos según necesidad</li>
      <li>Utilizar rodillera o muletas si lo recomienda un médico</li>
      <li>Realizar fisioterapia para restaurar función</li>
      <li>Volver gradualmente a la actividad con guía profesional</li>
      <li>Mantener peso saludable</li>
      <li>Usar calzado adecuado</li>
    </ul>
    <h6 class="fw-bold text-danger mt-4">🚫 Qué evitar</h6>
    <ul>
      <li>Continuar actividad que causó la lesión</li>
      <li>Inmovilización prolongada sin indicación médica</li>
      <li>Volver a la actividad completa sin aprobación profesional</li>
      <li>Ignorar dolor persistente o inestabilidad</li>
      <li>Realizar ejercicios incorrectamente</li>
    </ul>
    <h6 class="fw-bold text-primary mt-4">📌 Conclusión</h6>
    <p>Las lesiones de rodilla requieren manejo cuidadoso y rehabilitación. La gravedad dicta el tratamiento y tiempo de recuperación. La fisioterapia es clave en la restauración de la función.</p>
  `,
      },

      {
        titulo: 'Tendinopatías',
        descripcion:
          'Dolor en tendones común por sobreuso, técnica inadecuada o falta de recuperación...',
        modal: `
    <h6 class="fw-bold text-primary mt-3">🧠 Entendiendo la condición</h6>
    <p>Las tendinopatías son lesiones por sobreuso que afectan los tendones, estructuras que conectan los músculos con los huesos. Suelen presentarse con dolor localizado, rigidez matutina o al iniciar la actividad, y sensibilidad a la palpación. Pueden afectar diferentes áreas como el manguito rotador (hombro), codo (epicondilitis), rodilla (tendinitis rotuliana), talón (tendón de Aquiles) u otras regiones. La causa común es el estrés repetitivo sin adecuada recuperación, técnica incorrecta o debilidad muscular.</p>

    <h6 class="fw-bold text-primary mt-4">📅 Cuándo consultar a un especialista</h6>
    <ul>
      <li>Dolor persistente por más de 2 semanas</li>
      <li>Dificultad para realizar movimientos básicos</li>
      <li>Inflamación evidente o enrojecimiento</li>
      <li>Debilidad en la zona afectada</li>
      <li>Empeoramiento a pesar de reposo</li>
    </ul>

    <h6 class="fw-bold text-primary mt-4">⏱️ Tiempos de recuperación</h6>
    <p>Depende de la severidad y el tratamiento aplicado. Con manejo adecuado: de 2 semanas a 3 meses. Casos crónicos o mal tratados pueden extenderse por más de 6 meses. La fisioterapia y reentrenamiento funcional son clave para la recuperación completa.</p>

    <h6 class="fw-bold text-primary mt-4">✅ Qué hacer</h6>
    <ul>
      <li>Aplicar hielo en la zona afectada (15-20 min)</li>
      <li>Reposar la articulación o músculo implicado</li>
      <li>Realizar ejercicios de fortalecimiento progresivo con supervisión</li>
      <li>Corregir técnica de entrenamiento</li>
      <li>Acudir con fisioterapeuta</li>
      <li>Utilizar ortesis o vendajes si es necesario</li>
    </ul>

    <h6 class="fw-bold text-danger mt-4">🚫 Qué evitar</h6>
    <ul>
      <li>Continuar actividad que causa dolor</li>
      <li>Ejercicios excéntricos sin guía profesional</li>
      <li>Masajes agresivos sin evaluación previa</li>
      <li>Automedicación con corticoides sin supervisión</li>
      <li>Ignorar señales de fatiga o dolor</li>
    </ul>

    <h6 class="fw-bold text-primary mt-4">📌 Conclusión</h6>
    <p>Las tendinopatías requieren un enfoque gradual y guiado. La intervención temprana evita la cronificación. La corrección de técnica y el fortalecimiento son esenciales para prevenir recaídas.</p>
  `,
      },
      {
        titulo: 'Esguince',
        descripcion:
          'Lesión de los ligamentos por estiramiento o desgarro. Común en tobillos, muñecas y rodillas.',
        modal: `
<h6 class="fw-bold text-primary mt-3">🧠 Entendiendo la condición</h6>
<p>Un esguince es una lesión de los ligamentos causada por un estiramiento o desgarro. Se clasifican en:</p>
<ul>
  <li>Grado 1: estiramiento leve</li>
  <li>Grado 2: desgarro parcial</li>
  <li>Grado 3: desgarro completo</li>
</ul>

<h6 class="fw-bold text-primary mt-3">👩‍⚕️ Cuándo consultar a un especialista</h6>
<ul>
  <li>Dolor intenso o incapacidad para soportar peso</li>
  <li>Deformidad visible o hinchazón significativa</li>
  <li>Persistencia de síntomas tras unos días</li>
</ul>

<h6 class="fw-bold text-primary mt-3">⏳ Tiempo estimado de recuperación</h6>
<ul>
  <li>Grado 1: unas pocas semanas</li>
  <li>Grado 2: varias semanas a meses</li>
  <li>Grado 3: varios meses y posible cirugía</li>
</ul>

<h6 class="fw-bold text-primary mt-3">✅ Qué hacer</h6>
<ul>
  <li>Aplicar RICE (reposo, hielo, compresión, elevación)</li>
  <li>Usar analgésicos y soportes (vendajes, tobilleras)</li>
  <li>Realizar fisioterapia progresiva</li>
</ul>

<h6 class="fw-bold text-danger mt-3">🚫 Qué evitar</h6>
<ul>
  <li>Poner peso si duele</li>
  <li>Aplicar calor en primeras 48-72h</li>
  <li>Volver a la actividad demasiado pronto</li>
</ul>
    `,
      },

      {
        titulo: 'Hernia discal',
        descripcion:
          'Desplazamiento del núcleo de un disco intervertebral que puede presionar nervios y causar dolor.',
        modal: `
<h6 class="fw-bold text-primary mt-3">🧠 Entendiendo la condición</h6>
<p>La hernia discal ocurre cuando el núcleo de un disco intervertebral se desplaza, presionando los nervios.</p>

<h6 class="fw-bold text-primary mt-3">👩‍⚕️ Cuándo consultar a un especialista</h6>
<ul>
  <li>Dolor intenso que no mejora</li>
  <li>Dolor irradiado a extremidades</li>
  <li>Entumecimiento, debilidad o pérdida de control de esfínteres</li>
</ul>

<h6 class="fw-bold text-primary mt-3">⏳ Tiempo estimado de recuperación</h6>
<ul>
  <li>Conservador: semanas o meses</li>
  <li>Cirugía si no mejora: recuperación postoperatoria de varias semanas o meses</li>
</ul>

<h6 class="fw-bold text-primary mt-3">✅ Qué hacer</h6>
<ul>
  <li>Reposo modificado, mantenerse activo dentro de lo posible</li>
  <li>Ejercicios de fisioterapia</li>
  <li>Aplicar calor o frío según alivie</li>
</ul>

<h6 class="fw-bold text-danger mt-3">🚫 Qué evitar</h6>
<ul>
  <li>Reposo en cama prolongado</li>
  <li>Levantamientos pesados o torsiones</li>
  <li>Ignorar síntomas nuevos o que empeoran</li>
</ul>
    `,
      },

      {
        titulo: 'Lesión del manguito rotador',
        descripcion:
          'Lesiones en los tendones del hombro que afectan la movilidad y fuerza del brazo.',
        modal: `
<h6 class="fw-bold text-primary mt-3">🧠 Entendiendo la condición</h6>
<p>Incluye tendinitis, tendinopatía y desgarros en los tendones del manguito rotador, debido a traumatismos, uso excesivo o envejecimiento.</p>

<h6 class="fw-bold text-primary mt-3">👩‍⚕️ Cuándo consultar a un especialista</h6>
<ul>
  <li>Dolor persistente que afecta el sueño</li>
  <li>Dificultad para levantar el brazo o alcanzar sobre la cabeza</li>
  <li>Debilidad o lesión súbita</li>
</ul>

<h6 class="fw-bold text-primary mt-3">⏳ Tiempo estimado de recuperación</h6>
<ul>
  <li>Tendinitis/tendinopatía: semanas o meses</li>
  <li>Desgarros parciales: meses con fisioterapia</li>
  <li>Desgarros completos: cirugía y hasta 6 meses de rehabilitación</li>
</ul>

<h6 class="fw-bold text-primary mt-3">✅ Qué hacer</h6>
<ul>
  <li>Descansar el hombro</li>
  <li>Aplicar hielo</li>
  <li>Seguir fisioterapia guiada</li>
</ul>

<h6 class="fw-bold text-danger mt-3">🚫 Qué evitar</h6>
<ul>
  <li>Usar el brazo lesionado sin control</li>
  <li>Levantar objetos pesados</li>
  <li>Volver demasiado pronto sin rehabilitación adecuada</li>
</ul>
    `,
      },

      {
        titulo: 'Fractura por estrés',
        descripcion:
          'Fisura ósea causada por sobrecarga repetitiva, común en tibia y metatarsianos.',
        modal: `
<h6 class="fw-bold text-primary mt-3">🧠 Entendiendo la condición</h6>
<p>Fractura pequeña causada por impacto repetitivo, sin trauma agudo. Afecta huesos que soportan peso como tibia o pie.</p>

<h6 class="fw-bold text-primary mt-3">👩‍⚕️ Cuándo consultar a un especialista</h6>
<ul>
  <li>Dolor que empeora con actividad</li>
  <li>Hinchazón o sensibilidad ósea</li>
</ul>

<h6 class="fw-bold text-primary mt-3">⏳ Tiempo estimado de recuperación</h6>
<ul>
  <li>6-8 semanas de reposo de impacto</li>
  <li>Posible uso de bota o muletas</li>
  <li>Fisioterapia para retorno progresivo</li>
</ul>

<h6 class="fw-bold text-primary mt-3">✅ Qué hacer</h6>
<ul>
  <li>Reposar, aplicar hielo, tomar analgésicos</li>
  <li>Usar muletas o inmovilización si es necesario</li>
  <li>Actividades de bajo impacto (natación, bicicleta sin resistencia)</li>
</ul>

<h6 class="fw-bold text-danger mt-3">🚫 Qué evitar</h6>
<ul>
  <li>Volver a la actividad demasiado pronto</li>
  <li>Ignorar dolor persistente</li>
</ul>
    `,
      },

      {
        titulo: 'Bursitis',
        descripcion:
          'Inflamación de las bolsas sinoviales que amortiguan las articulaciones.',
        modal: `
<h6 class="fw-bold text-primary mt-3">🧠 Entendiendo la condición</h6>
<p>La bursitis es la inflamación de las bursas, que amortiguan el roce entre huesos, tendones y músculos.</p>

<h6 class="fw-bold text-primary mt-3">👩‍⚕️ Cuándo consultar a un especialista</h6>
<ul>
  <li>Dolor incapacitante o fiebre</li>
  <li>Hinchazón, enrojecimiento o imposibilidad de mover la articulación</li>
</ul>

<h6 class="fw-bold text-primary mt-3">⏳ Tiempo estimado de recuperación</h6>
<ul>
  <li>En pocas semanas con reposo y cuidados</li>
</ul>

<h6 class="fw-bold text-primary mt-3">✅ Qué hacer</h6>
<ul>
  <li>Reposo, hielo 3–4 veces al día</li>
  <li>Inmovilizadores suaves</li>
</ul>

<h6 class="fw-bold text-danger mt-3">🚫 Qué evitar</h6>
<ul>
  <li>Posturas o movimientos que compriman la bursa</li>
  <li>Volver a cargar la zona sin estar recuperado</li>
</ul>
    `,
      },

      {
        titulo: 'Síndrome de la banda iliotibial',
        descripcion:
          'Inflamación por fricción en la cara externa de la rodilla, común en corredores.',
        modal: `
<h6 class="fw-bold text-primary mt-3">🧠 Entendiendo la condición</h6>
<p>Inflamación de la banda iliotibial al rozar contra el fémur. Dolor en la parte externa de la rodilla, especialmente al flexionar a 30°.</p>

<h6 class="fw-bold text-primary mt-3">👩‍⚕️ Cuándo consultar a un especialista</h6>
<ul>
  <li>Dolor que no cede con descanso y hielo</li>
  <li>Inestabilidad o bloqueo de la rodilla</li>
</ul>

<h6 class="fw-bold text-primary mt-3">⏳ Tiempo estimado de recuperación</h6>
<ul>
  <li>4–8 semanas con tratamiento conservador</li>
  <li>Si persiste >6 meses, posible cirugía</li>
</ul>

<h6 class="fw-bold text-primary mt-3">✅ Qué hacer</h6>
<ul>
  <li>Aplicar RICE</li>
  <li>Estiramientos de banda, glúteos y fascia lata</li>
  <li>Fortalecer cuádriceps y glúteos</li>
  <li>Usar AINEs o inyecciones si hay mucha inflamación</li>
</ul>

<h6 class="fw-bold text-danger mt-3">🚫 Qué evitar</h6>
<ul>
  <li>Correr en pendientes o superficies irregulares sin preparación</li>
  <li>Aumentar volumen/intensidad del entrenamiento abruptamente</li>
  <li>Ignorar el dolor y continuar sin ajustes</li>
</ul>
    `,
      },
      {
        titulo: 'Epicondilitis (codo de tenista)',
        descripcion:
          'Inflamación del tendón extensor en el epicóndilo lateral, provocando dolor en la cara externa del codo.',
        modal: `
      <h6 class="fw-bold text-primary mt-3">🧠 Entendiendo la condición:</h6>
      <p>La epicondilitis lateral es la inflamación degenerativa del tendón extensor corto radial del carpo en el epicóndilo lateral, provocando dolor y sensibilidad en la cara externa del codo.</p>

      <h6 class="fw-bold text-primary mt-3">🩺 Cuándo consultar a un especialista:</h6>
      <p>Si el dolor persiste más de 6–12 meses a pesar de reposo y AINEs, o hay pérdida de fuerza en la mano, se recomienda evaluación por un ortopedista.</p>

      <h6 class="fw-bold text-primary mt-3">⏳ Tiempos de recuperación estimados:</h6>
      <p>La mayoría de los casos se resuelven espontáneamente en 1–2 años, aunque los síntomas suelen mejorar gradualmente en 6–12 meses con tratamiento conservador.</p>

      <h6 class="fw-bold text-primary mt-3">✅ Qué hacer:</h6>
      <ul>
        <li>Reposar el brazo 2–3 semanas</li>
        <li>Aplicar hielo 15 min 2–3 veces al día</li>
        <li>Usar férulas o bandas compresivas</li>
        <li>Ejercicios excéntricos y fisioterapia</li>
        <li>Tomar AINEs según indicación médica</li>
      </ul>

      <h6 class="fw-bold text-danger mt-3">🚫 Qué evitar:</h6>
      <ul>
        <li>Movimientos repetitivos de extensión de muñeca y agarre fuerte</li>
        <li>Cargar peso con la mano afectada</li>
        <li>Ignorar el dolor y volver a la actividad sin progresión</li>
      </ul>
    `,
      },

      {
        titulo: 'Fascitis plantar',
        descripcion:
          'Inflamación de la fascia plantar que conecta el talón con los dedos, causando dolor en el arco del pie.',
        modal: `
      <h6 class="fw-bold text-primary mt-3">🧠 Entendiendo la condición:</h6>
      <p>La fascitis plantar es la inflamación de la fascia plantar, un tejido fibroso que une el hueso del talón a los dedos y soporta el arco del pie.</p>

      <h6 class="fw-bold text-primary mt-3">🩺 Cuándo consultar a un especialista:</h6>
      <p>Se debe acudir si el dolor persiste más de unas semanas pese a reposo en hielo, o si aparece hinchazón grave, entumecimiento o imposibilidad de apoyar el pie.</p>

      <h6 class="fw-bold text-primary mt-3">⏳ Tiempos de recuperación estimados:</h6>
      <p>Con tratamiento conservador (estiramiento, hielo, modificación de actividades), la recuperación suele completarse en varios meses (3–6 meses).</p>

      <h6 class="fw-bold text-primary mt-3">✅ Qué hacer:</h6>
      <ul>
        <li>Reposo relativo evitando actividades que provoquen dolor</li>
        <li>Aplicar hielo 15–20 min 3 veces al día</li>
        <li>Ejercicios de estiramiento de la fascia y el tendón de Aquiles</li>
        <li>Uso de ortesis o calzado con buen soporte</li>
        <li>Fisioterapia y AINEs según sea necesario</li>
      </ul>

      <h6 class="fw-bold text-danger mt-3">🚫 Qué evitar:</h6>
      <ul>
        <li>Caminar largas distancias o estar de pie en superficies duras</li>
        <li>Actividades de impacto como correr hasta que el dolor ceda</li>
        <li>Calzado inadecuado o sin soporte</li>
      </ul>
    `,
      },

      {
        titulo: 'Luxaciones',
        descripcion:
          'Desplazamiento de los huesos de una articulación, causando dolor intenso y deformidad.',
        modal: `
      <h6 class="fw-bold text-primary mt-3">🧠 Entendiendo la condición:</h6>
      <p>Una luxación ocurre cuando los extremos de los huesos en una articulación se desplazan de su posición normal, provocando deformidad y dolor intenso.</p>

      <h6 class="fw-bold text-primary mt-3">🩺 Cuándo consultar a un especialista:</h6>
      <p>Es una urgencia; se debe buscar atención médica inmediata ante cualquier sospecha de luxación.</p>

      <h6 class="fw-bold text-primary mt-3">⏳ Tiempos de recuperación estimados:</h6>
      <p>Tras la reducción y estabilización, la articulación suele recuperar su función en unas pocas semanas, dependiendo de la gravedad y la inmovilización aplicada.</p>

      <h6 class="fw-bold text-primary mt-3">✅ Qué hacer:</h6>
      <ul>
        <li>Inmovilizar con férulas, cabestrillos y vendajes</li>
        <li>Acudir a urgencias para la reducción</li>
        <li>Seguir indicaciones de rehabilitación y ejercicios de movilidad temprana</li>
      </ul>

      <h6 class="fw-bold text-danger mt-3">🚫 Qué evitar:</h6>
      <ul>
        <li>Intentar reducir la luxación por cuenta propia</li>
        <li>Forzar movimientos de la articulación</li>
        <li>Apoyar peso sobre la extremidad afectada antes de tiempo</li>
      </ul>
    `,
      },

      {
        titulo: 'Síndrome compartimental',
        descripcion:
          'Aumento de presión en compartimentos musculares, comprometiendo circulación y nervios.',
        modal: `
      <h6 class="fw-bold text-primary mt-3">🧠 Entendiendo la condición:</h6>
      <p>Es el aumento de presión dentro de un compartimento muscular cerrado por fascia, que puede comprometer la circulación y causar lesión muscular y nerviosa.</p>

      <h6 class="fw-bold text-primary mt-3">🩺 Cuándo consultar a un especialista:</h6>
      <p>El síndrome compartimental agudo es una emergencia quirúrgica; acuda a urgencias si hay dolor desproporcionado, tensión firme al tacto, parestesias o pérdida de función.</p>

      <h6 class="fw-bold text-primary mt-3">⏳ Tiempos de recuperación estimados:</h6>
      <p>Tras la fasciotomía, la mayoría de los pacientes puede retomar actividades de bajo impacto en semanas, aunque el retorno completo al deporte puede tardar varios meses.</p>

      <h6 class="fw-bold text-primary mt-3">✅ Qué hacer:</h6>
      <ul>
        <li>Descanso relativo tras cirugía</li>
        <li>Fisioterapia progresiva para recuperar fuerza y rango de movimiento</li>
        <li>Seguimiento de la herida y control de complicaciones</li>
      </ul>

      <h6 class="fw-bold text-danger mt-3">🚫 Qué evitar:</h6>
      <ul>
        <li>Reanudar actividades de alta intensidad sin autorización médica</li>
        <li>Ignorar signos de infección o dolor intenso persistente</li>
      </ul>
    `,
      },

      {
        titulo: 'Cervicalgia',
        descripcion:
          'Dolor en la región del cuello, relacionado con músculos, ligamentos o discos cervicales.',
        modal: `
      <h6 class="fw-bold text-primary mt-3">🧠 Entendiendo la condición:</h6>
      <p>La cervicalgia es el dolor en la región cervical que puede originarse en músculos, ligamentos, discos o articulaciones de la columna vertebral.</p>

      <h6 class="fw-bold text-primary mt-3">🩺 Cuándo consultar a un especialista:</h6>
      <p>Llame al médico si el dolor no mejora en 1 semana con autocuidados, o si presenta entumecimiento, hormigueo, debilidad en brazos, dolor nocturno o pérdida de control vesical/intestino.</p>

      <h6 class="fw-bold text-primary mt-3">⏳ Tiempos de recuperación estimados:</h6>
      <p>La mayoría de los episodios agudos de dolor cervical mejora significativamente en 1–2 semanas con reposo, postura adecuada y ejercicios suaves.</p>

      <h6 class="fw-bold text-primary mt-3">✅ Qué hacer:</h6>
      <ul>
        <li>Aplicar frío o calor local</li>
        <li>Mantener buena ergonomía y postura</li>
        <li>Estiramientos y ejercicios de movilidad cervical</li>
        <li>Analgésicos de venta libre según indicación</li>
      </ul>

      <h6 class="fw-bold text-danger mt-3">🚫 Qué evitar:</h6>
      <ul>
        <li>Mantener posturas estáticas prolongadas</li>
        <li>Reposo absoluto excesivo</li>
        <li>Movimientos bruscos o giros forzados del cuello</li>
      </ul>
    `,
      },

      {
        titulo: 'Periostitis tibial',
        descripcion:
          'Inflamación del periostio de la tibia por sobrecarga, común en corredores.',
        modal: `
      <h6 class="fw-bold text-primary mt-3">🧠 Entendiendo la condición:</h6>
      <p>La periostitis tibial o síndrome de estrés tibial medial es la inflamación del periostio y estructuras adyacentes a lo largo del borde interno de la tibia, causada por sobrecarga repetitiva.</p>

      <h6 class="fw-bold text-primary mt-3">🩺 Cuándo consultar a un especialista:</h6>
      <p>Programe consulta si el dolor persiste varias semanas pese a reposo en hielo, o si hay hinchazón que no mejora y limitación de la actividad.</p>

      <h6 class="fw-bold text-primary mt-3">⏳ Tiempos de recuperación estimados:</h6>
      <p>Con reposo y modificación de actividad, suele resolverse en 7–9 semanas; los casos severos pueden prolongarse hasta 3–6 meses.</p>

      <h6 class="fw-bold text-primary mt-3">✅ Qué hacer:</h6>
      <ul>
        <li>Descanso de actividades de impacto</li>
        <li>Hielo en la zona 15–20 min varias veces al día</li>
        <li>Cross‑training (natación, bicicleta)</li>
        <li>Ejercicios de fortalecimiento de gemelos y cuádriceps</li>
        <li>Ortesis si hay alteraciones biomecánicas</li>
      </ul>

      <h6 class="fw-bold text-danger mt-3">🚫 Qué evitar:</h6>
      <ul>
        <li>Correr en superficies duras sin adaptación</li>
        <li>Aumentos bruscos en duración o intensidad del entrenamiento</li>
        <li>Calzado sin amortiguación adecuada</li>
      </ul>
    `,
      },

      {
        titulo: 'Síndrome del túnel carpiano',
        descripcion:
          'Compresión del nervio mediano en la muñeca, generando dolor, entumecimiento y debilidad.',
        modal: `
      <h6 class="fw-bold text-primary mt-3">🧠 Entendiendo la condición:</h6>
      <p>Es la compresión del nervio mediano al pasar por el túnel carpiano en la muñeca, causando dolor, entumecimiento y debilidad en mano y dedos.</p>

      <h6 class="fw-bold text-primary mt-3">🩺 Cuándo consultar a un especialista:</h6>
      <p>Acuda si los síntomas interfieren con las actividades diarias o el sueño, o si aparece debilidad para sujetar objetos, pues puede haber daño nervioso irreversible.</p>

      <h6 class="fw-bold text-primary mt-3">⏳ Tiempos de recuperación estimados:</h6>
      <p>El tratamiento conservador (férula nocturna, AINEs, inyecciones) es más efectivo si los síntomas duran menos de 10 meses; tras cirugía, la mayoría mejora en 3–6 meses, con más del 90% de satisfacción.</p>

      <h6 class="fw-bold text-primary mt-3">✅ Qué hacer:</h6>
      <ul>
        <li>Utilizar férula de muñeca en posición neutral</li>
        <li>Alternar reposo y movilidad suave</li>
        <li>Modificar actividades repetitivas</li>
        <li>Aplicar frío y tomar AINEs</li>
        <li>Considerar infiltraciones de corticoides bajo supervisión</li>
      </ul>

      <h6 class="fw-bold text-danger mt-3">🚫 Qué evitar:</h6>
      <ul>
        <li>Flexión y extensión excesiva de muñeca</li>
        <li>Movimientos repetitivos sin descansos</li>
        <li>Cargar peso sobre la palma de la mano afectada</li>
      </ul>
    `,
      },
    ];
  }
  abrirModal(lesion: { titulo: string; descripcion: string; modal: string }) {
    this.lesionSeleccionada = lesion;
    const modalElement = document.getElementById('modalGuia');
    if (modalElement) {
      const modal = new bootstrap.Modal(modalElement);
      modal.show();
    }
  }
}
