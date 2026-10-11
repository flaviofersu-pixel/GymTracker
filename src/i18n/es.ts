import type { Messages } from './en';

const plural = (n: number, one: string, many: string) => `${String(n)} ${n === 1 ? one : many}`;

export const es: Messages = {
  locale: 'es-ES',
  languageName: 'Español',

  app: {
    name: 'Cuaderno',
    tagline: (goal, days) => `${goal} · ${String(days)} días por semana`,
    tabs: { today: 'Hoy', weight: 'Peso', training: 'Entreno', progress: 'Progreso' },
    language: 'Idioma',
  },

  today: {
    budgetTitle: 'Calorías de hoy',
    left: 'Te quedan',
    protein: 'Proteína',
    ofKcal: (eaten, target) => `${String(eaten)} de ${String(target)} kcal`,
    ofProtein: (eaten, target) => `${String(eaten)} de ${String(target)} g`,
    kcalEaten: 'Calorías consumidas',
    proteinEaten: 'Proteína consumida',
    mealsTitle: 'Comidas de hoy',
    mealCount: (n) => plural(n, 'comida', 'comidas'),
    empty:
      'Aún no has apuntado nada hoy. Describe tu comida, sácale una foto o toca una de las rápidas.',
    delete: (name) => `Borrar ${name}`,
    proteinShort: 'g prot',
  },

  composer: {
    title: 'Añadir comida',
    describe: 'Qué lleva, sin pesar',
    placeholder: 'Ej: plato de pasta con 2 latas de atún, tomate triturado y un chorro de aceite',
    photo: 'Foto (opcional)',
    photoPick: 'Hacer o elegir foto',
    estimate: 'Calcular con IA',
    estimating: 'Calculando…',
    manual: 'Meter a mano',
    needInput: 'Describe la comida o añade una foto',
    quickAdds: 'Rápidas',
    added: (kcal) => `Añadido: ${String(kcal)} kcal`,
    saved: 'Comida guardada',
  },

  review: {
    name: 'Nombre',
    kcal: 'kcal',
    protein: 'Proteína (g)',
    confidence: 'Confianza de la estimación:',
    confidenceLevel: { high: 'alta', medium: 'media', low: 'baja' },
    save: 'Guardar comida',
    cancel: 'Cancelar',
    needKcal: 'Pon las kcal',
    defaultName: 'Comida',
  },

  suggestions: {
    ask: '¿Qué como para cerrar el día?',
    loading: 'Pensando opciones…',
    done: 'Ya has llegado a tu objetivo de hoy.',
    add: 'Añadir',
    added: 'Añadido',
    summary: (kcal, protein, minutes) =>
      `${String(kcal)} kcal · ${String(protein)} g prot · ${String(minutes)} min`,
  },

  weight: {
    title: 'Peso de hoy',
    kg: 'Peso en ayunas (kg)',
    waist: 'Cintura (cm)',
    save: 'Guardar peso',
    invalid: 'Escribe un peso válido',
    saved: 'Peso guardado',
    trend: 'Tendencia de peso',
    avg7: 'Media 7 días',
    vsLastWeek: 'vs semana anterior',
    toGo: 'Falta',
    paceUnknown:
      'Pésate 3-4 mañanas por semana. Con dos semanas de datos verás si vas al ritmo de tu objetivo.',
    pace: {
      below: (range) =>
        `Fuera de tu objetivo de ${range} kg por semana. Si se repite otra semana, sube unas 150-200 kcal.`,
      'on-track': (range) => `Dentro de tu objetivo de ${range} kg por semana. Sigue así.`,
      above: (range) =>
        `Fuera de tu objetivo de ${range} kg por semana. Si se repite otra semana, baja unas 150-200 kcal.`,
    },
    paceLabel: {
      gain: { below: 'Muy lento', 'on-track': 'En rango', above: 'Muy rápido' },
      lose: { below: 'Muy rápido', 'on-track': 'En rango', above: 'Muy lento' },
      maintain: { below: 'Bajando', 'on-track': 'Estable', above: 'Subiendo' },
    },
    range: (min, max) => `${min} a ${max}`,
    chartCaption: (range) =>
      `Puntos: peso diario. Línea: media de 7 días. Tu objetivo: ${range} kg por semana.`,
    chartLabel: (weeks) => `Peso de las últimas ${String(weeks)} semanas`,
    chartEmpty: 'Sin datos todavía',
    log: 'Registros',
    logEmpty: 'Tu primer peso aparecerá aquí.',
    delete: (day) => `Borrar peso del ${day}`,
  },

  training: {
    nextUp: (name) => `Toca hoy: ${name}`,
    pickRoutine: 'Elegir rutina',
    rir: 'Deja 1-2 repeticiones en reserva.',
    exercisesOf: (name) => `Ejercicios de ${name}`,
    save: 'Guardar sesión',
    saved: 'Sesión guardada',
    needSet: 'Apunta al menos una serie',
    historyTitle: 'Últimas sesiones',
    historyEmpty:
      'Cuando guardes tu primera sesión, aquí verás el historial y la app te dirá cuándo subir peso.',
    sets: (n) => plural(n, 'serie', 'series'),
    deleteSession: (day) => `Borrar sesión del ${day}`,
    last: (day, sets) => `Última (${day}): ${sets}.`,
    setLabel: (exercise, n, field) =>
      `${exercise}, serie ${String(n)}, ${field === 'kg' ? 'kg' : field === 'reps' ? 'repeticiones' : 'segundos'}`,
    seconds: 'seg',
    reps: 'reps',
    hint: {
      firstTime: (target) =>
        `Primera vez: elige un peso con el que hagas ${target} dejando 1-2 en reserva.`,
      increaseLoad: (kg, reps) => ['', `Sube a ${kg} kg`, ` y vuelve a ${String(reps)} reps.`],
      addRep: (target) => ['Mismo peso, busca ', '+1 rep', ` hasta llegar a ${String(target)}.`],
      addTime: (seconds) => ['Objetivo: ', `${String(seconds)} s`, ' por serie.'],
    },
  },

  progress: {
    weekTitle: 'Control de la semana',
    checks: {
      weight: (range) => `Cambio semanal de ${range} kg`,
      weightNoData: 'Faltan pesos de dos semanas',
      weightDetail: (delta) => `Cambio: ${delta} kg`,
      sessions: (n) => `Entrené ${plural(n, 'vez', 'veces')}`,
      sessionsDetail: (n) => `${String(n)} esta semana`,
      improved: 'Subí peso o repeticiones en algún ejercicio',
      improvedNone: 'Ningún ejercicio mejorado todavía',
      protein: (target) => `Unos ${String(target)} g de proteína la mayoría de días`,
      proteinNoData: 'Sin comidas registradas',
      proteinDetail: (hit, logged) => `${String(hit)} de ${String(logged)} días registrados`,
      sleep: 'Dormí 7 horas o más la mayoría de noches',
      sleepDetail: 'Esto solo lo sabes tú',
    },
  },

  analysis: {
    title: 'Análisis con IA',
    none: 'Aún no hay ninguno',
    overdue: (days) => `Hace ${String(days)} días`,
    last: (days) => (days === 0 ? 'Último: hoy' : `Último: hace ${plural(days, 'día', 'días')}`),
    intro:
      'La IA revisa tu peso, entrenos y comidas de las últimas semanas y te dice qué ajustar. Lo ideal es una vez por semana.',
    run: 'Analizar mi progreso',
    running: 'Analizando…',
    stop: 'Parar',
    thinking: 'Pensando… puede tardar un minuto.',
    pastTitle: 'Análisis anteriores',
    pastEmpty: 'Tus análisis se guardan aquí para comparar semana a semana.',
  },

  profile: {
    welcome: 'Te damos la bienvenida',
    intro:
      'Cuéntanos un poco sobre ti. Calcularemos tus calorías y proteína diarias y elegiremos una rutina que encaje con los días que puedes entrenar. Puedes cambiarlo todo después.',
    title: 'Tu perfil',
    sex: 'Sexo',
    sexes: { male: 'Hombre', female: 'Mujer' },
    age: 'Edad',
    height: 'Altura (cm)',
    weight: 'Peso (kg)',
    goal: 'Objetivo',
    goals: { gain: 'Ganar músculo', maintain: 'Mantener', lose: 'Perder grasa' },
    goalWeight: 'Peso objetivo (kg)',
    activity: 'Actividad fuera del gimnasio',
    activities: { low: 'Baja', moderate: 'Media', high: 'Alta' },
    activityHint: {
      low: 'Trabajo sentado, menos de 6.000 pasos al día',
      moderate: 'De pie parte del día, 6.000-10.000 pasos',
      high: 'Trabajo físico o más de 10.000 pasos al día',
    },
    days: 'Días que puedes entrenar por semana',
    split: (routines) => `Tu rotación: ${routines}`,
    targets: 'Objetivos diarios',
    kcal: 'Calorías al día',
    protein: 'Proteína al día (g)',
    targetsHint:
      'Recomendados según tu perfil. Cámbialos si ya conoces tus números; la tendencia de peso semanal te dirá si hay que ajustar.',
    start: 'Empezar',
    save: 'Guardar perfil',
    saved: 'Perfil guardado',
    invalid: 'Revisa los números',
  },

  settings: {
    title: 'IA',
    apiKey: 'Clave de la API de Anthropic',
    apiKeyHelp:
      'Con clave, la IA responde dentro de la app. Sin clave, la app te prepara cada pregunta para pegarla en tu propia app de Claude, y eso sirve con Claude Pro. La clave se guarda solo en este dispositivo y se envía únicamente a la API de Anthropic. Créala en',
    save: 'Guardar clave',
    saved: 'Clave guardada',
  },

  backup: {
    title: 'Copia de seguridad',
    intro:
      'Tus datos viven en este dispositivo. Descarga una copia de vez en cuando o para pasarlos a otro móvil. La clave de la API no se incluye.',
    download: 'Descargar copia',
    restore: 'Restaurar copia',
    confirm: (file) => ['Restaurar ', file, ' reemplaza todos tus registros actuales.'],
    replace: 'Reemplazar mis datos',
    cancel: 'Cancelar',
    restored: (weights, sessions) =>
      `Copia restaurada: ${plural(weights, 'peso', 'pesos')}, ${plural(sessions, 'sesión', 'sesiones')}`,
    invalid: 'Ese archivo no es una copia válida de Cuaderno',
  },

  manual: {
    intro:
      'No tienes clave de API, así que puedes usar tu propia app de Claude (sirve con Claude Pro).',
    copy: '1. Copiar la pregunta',
    copied: 'Pregunta copiada',
    open: 'Abrir Claude',
    photo: 'Adjunta también tu foto en Claude.',
    paste: '2. Pega aquí la respuesta de Claude',
    use: 'Usar respuesta',
    cancel: 'Cancelar',
  },

  errors: {
    missingKey: 'Añade tu clave de la API de Anthropic en Progreso → IA.',
    invalidKey: 'La clave de la API no es válida.',
    permission: 'Tu clave no tiene permiso para usar este modelo.',
    rateLimited: 'Demasiadas consultas seguidas o sin saldo. Prueba más tarde.',
    offline: 'Sin conexión. Revisa tu internet.',
    service: 'El servicio de IA falló. Inténtalo otra vez.',
    refused: 'La IA no pudo con eso. Prueba a describirlo de otra forma.',
    photo: 'No se pudo leer la foto. Prueba con otra.',
    badReply:
      'No se pudo leer esa respuesta. Pega la respuesta completa de Claude, incluida la parte entre { y }.',
    unknown: 'Algo falló al hablar con la IA. Inténtalo otra vez.',
  },

  routines: {
    push: { name: 'Push', focus: 'Pecho, hombro y tríceps' },
    pull: { name: 'Pull', focus: 'Espalda y bíceps' },
    legs: { name: 'Pierna', focus: 'Cuádriceps, femorales, glúteos y gemelos' },
    arms: { name: 'Brazos y hombros', focus: 'Brazos, hombros y abdominales' },
    upper: { name: 'Torso', focus: 'Pecho, espalda, hombros y brazos' },
    lower: { name: 'Pierna y core', focus: 'Piernas y abdomen' },
    fullA: { name: 'Full A', focus: 'Cuerpo completo' },
    fullB: { name: 'Full B', focus: 'Cuerpo completo' },
    fullC: { name: 'Full C', focus: 'Cuerpo completo' },
  },

  exercises: {
    benchPress: 'Press banca',
    inclineDumbbellPress: 'Press inclinado con mancuernas',
    dumbbellShoulderPress: 'Press militar con mancuernas',
    cableFly: 'Aperturas en polea o pec deck',
    lateralRaise: 'Elevaciones laterales',
    tricepsPushdown: 'Extensión de tríceps en polea',
    pullUp: 'Dominadas o jalón al pecho',
    barbellRow: 'Remo con barra o en máquina',
    oneArmDumbbellRow: 'Remo con mancuerna a una mano',
    facePull: 'Face pull',
    barbellCurl: 'Curl de bíceps con barra',
    squat: 'Sentadilla o prensa',
    romanianDeadlift: 'Peso muerto rumano',
    legPressOrSplitSquat: 'Prensa o búlgaras',
    legCurl: 'Curl femoral',
    legExtension: 'Extensión de cuádriceps',
    calfRaise: 'Gemelos',
    overheadPress: 'Press militar con barra o máquina',
    rearDeltFly: 'Pájaros',
    inclineDumbbellCurl: 'Curl inclinado con mancuernas',
    dipsOrSkullCrusher: 'Fondos o press francés',
    hammerCurl: 'Curl martillo',
    overheadTricepsExtension: 'Extensión de tríceps sobre la cabeza',
    hangingLegRaise: 'Elevación de piernas colgado',
    cableCrunch: 'Crunch en polea',
    plank: 'Plancha',
    lunge: 'Zancadas',
    machineRow: 'Remo en máquina',
  },

  presets: {
    breakfastShake: {
      name: 'Batido de desayuno',
      details: '400 ml leche entera, 60 g avena, 1 plátano, 1 cda crema de cacahuete',
    },
    breakfastShakeWhey: {
      name: 'Batido de desayuno con whey',
      details: 'El batido de siempre más 1 scoop de whey',
    },
    chickenRiceSkillet: {
      name: 'Sartén de pollo y arroz',
      details: '200 g contramuslo o picada, vaso de arroz, verduras, 1 cda aceite',
    },
    yogurtNuts: {
      name: 'Yogur griego con frutos secos',
      details: '250 g yogur o queso batido, puñado de frutos secos, fruta',
    },
    eggsBreadTuna: {
      name: 'Huevos, pan y atún',
      details: '3 huevos, 2-3 rebanadas de pan, 1 lata de atún, tomate con aceite',
    },
    glassOfMilk: { name: 'Vaso de leche entera', details: '250 ml' },
    banana: { name: 'Plátano', details: '1 mediano' },
    peanuts: { name: 'Cacahuetes', details: 'Un puñado, unos 30 g' },
  },
};
