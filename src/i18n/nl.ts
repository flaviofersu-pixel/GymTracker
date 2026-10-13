import type { Messages } from './en';
import { mealIdeasNl } from './mealIdeas.nl';
import { mealStepsNl } from './mealSteps.nl';

const plural = (n: number, one: string, many: string) => `${String(n)} ${n === 1 ? one : many}`;

export const nl: Messages = {
  locale: 'nl-NL',
  languageName: 'Nederlands',

  app: {
    name: 'GymTracker',
    tagline: (goal, days) => `${goal} · ${String(days)} dagen per week`,
    tabs: {
      today: 'Vandaag',
      meals: 'Maaltijden',
      weight: 'Gewicht',
      training: 'Training',
      progress: 'Voortgang',
    },
    language: 'Taal',
  },

  today: {
    budgetTitle: 'Calorieën van vandaag',
    left: 'Over',
    protein: 'Eiwit',
    ofKcal: (eaten, target) => `${String(eaten)} van ${String(target)} kcal`,
    ofProtein: (eaten, target) => `${String(eaten)} van ${String(target)} g`,
    kcalEaten: 'Gegeten calorieën',
    proteinEaten: 'Gegeten eiwit',
    mealsTitle: 'Maaltijden van vandaag',
    mealCount: (n) => plural(n, 'maaltijd', 'maaltijden'),
    empty:
      'Nog niets gelogd vandaag. Beschrijf een maaltijd, maak een foto of tik op een van de snelle keuzes.',
    delete: (name) => `${name} verwijderen`,
    proteinShort: 'g eiwit',
  },

  composer: {
    title: 'Maaltijd toevoegen',
    describe: 'Wat zit erin (zonder weegschaal)',
    placeholder: 'Bijv. een bord pasta met 2 blikjes tonijn, tomatenblokjes en een scheutje olie',
    photo: 'Foto (optioneel)',
    photoPick: 'Foto maken of kiezen',
    estimate: 'Schatten met AI',
    estimating: 'Bezig met schatten…',
    manual: 'Handmatig invoeren',
    needInput: 'Beschrijf de maaltijd of voeg een foto toe',
    quickAdds: 'Snelle keuzes',
    added: (kcal) => `Toegevoegd: ${String(kcal)} kcal`,
    saved: 'Maaltijd opgeslagen',
  },

  review: {
    name: 'Naam',
    kcal: 'kcal',
    protein: 'Eiwit (g)',
    confidence: 'Betrouwbaarheid van de schatting:',
    confidenceLevel: { high: 'hoog', medium: 'gemiddeld', low: 'laag' },
    save: 'Maaltijd opslaan',
    cancel: 'Annuleren',
    needKcal: 'Vul de calorieën in',
    defaultName: 'Maaltijd',
  },

  suggestions: {
    ask: 'Wat moet ik nog eten vandaag?',
    loading: 'Opties bedenken…',
    done: 'Je hebt je doel van vandaag al gehaald.',
    add: 'Toevoegen',
    added: 'Toegevoegd',
    summary: (kcal, protein, minutes) =>
      `${String(kcal)} kcal · ${String(protein)} g eiwit · ${String(minutes)} min`,
  },

  weight: {
    title: 'Gewicht van vandaag',
    kg: 'Nuchter gewicht (kg)',
    waist: 'Taille (cm)',
    save: 'Gewicht opslaan',
    invalid: 'Vul een geldig gewicht in',
    saved: 'Gewicht opgeslagen',
    trend: 'Gewichtstrend',
    avg7: 'Gemiddelde 7 dagen',
    vsLastWeek: 'vs vorige week',
    toGo: 'Nog te gaan',
    paceUnknown: 'Weeg je 3-4 ochtenden per week. Na twee weken zie je of je op schema ligt.',
    pace: {
      below: (range) =>
        `Buiten je doel van ${range} kg per week. Gebeurt dat volgende week weer, eet dan zo’n 150-200 kcal meer.`,
      'on-track': (range) => `Binnen je doel van ${range} kg per week. Ga zo door.`,
      above: (range) =>
        `Buiten je doel van ${range} kg per week. Gebeurt dat volgende week weer, eet dan zo’n 150-200 kcal minder.`,
    },
    paceLabel: {
      gain: { below: 'Te langzaam', 'on-track': 'Op schema', above: 'Te snel' },
      lose: { below: 'Te snel', 'on-track': 'Op schema', above: 'Te langzaam' },
      maintain: { below: 'Dalend', 'on-track': 'Stabiel', above: 'Stijgend' },
    },
    range: (min, max) => `${min} tot ${max}`,
    chartCaption: (range) =>
      `Stippen: dagelijks gewicht. Lijn: gemiddelde van 7 dagen. Je doel: ${range} kg per week.`,
    chartLabel: (weeks) => `Gewicht van de afgelopen ${String(weeks)} weken`,
    chartEmpty: 'Nog geen gegevens',
    log: 'Metingen',
    logEmpty: 'Je eerste weging verschijnt hier.',
    delete: (day) => `Gewicht van ${day} verwijderen`,
  },

  training: {
    nextUp: (name) => `Volgende: ${name}`,
    pickRoutine: 'Kies een schema',
    rir: 'Houd 1-2 herhalingen in reserve.',
    exercisesOf: (name) => `Oefeningen van ${name}`,
    save: 'Training opslaan',
    saved: 'Training opgeslagen',
    needSet: 'Log minstens één set',
    historyTitle: 'Recente trainingen',
    historyEmpty:
      'Zodra je je eerste training opslaat, zie je hier je geschiedenis en vertelt de app wanneer je zwaarder kunt.',
    sets: (n) => plural(n, 'set', 'sets'),
    deleteSession: (day) => `Training van ${day} verwijderen`,
    last: (day, sets) => `Vorige keer (${day}): ${sets}.`,
    setLabel: (exercise, n, field) =>
      `${exercise}, set ${String(n)}, ${field === 'kg' ? 'kg' : field === 'reps' ? 'herhalingen' : 'seconden'}`,
    seconds: 'sec',
    reps: 'reps',
    hint: {
      firstTime: (target) =>
        `Eerste keer: kies een gewicht waarmee je ${target} haalt met 1-2 herhalingen in reserve.`,
      increaseLoad: (kg, reps) => [
        '',
        `Ga naar ${kg} kg`,
        ` en zak terug naar ${String(reps)} reps.`,
      ],
      addRep: (target) => [
        'Zelfde gewicht, probeer ',
        '+1 rep',
        ` tot je ${String(target)} haalt.`,
      ],
      addTime: (seconds) => ['Doel: ', `${String(seconds)} s`, ' per set.'],
    },
  },

  progress: {
    weekTitle: 'Weekcheck',
    checks: {
      weight: (range) => `Wekelijkse verandering van ${range} kg`,
      weightNoData: 'Wegingen van twee weken nodig',
      weightDetail: (delta) => `Verandering: ${delta} kg`,
      sessions: (n) => `${plural(n, 'keer', 'keer')} getraind`,
      sessionsDetail: (n) => `${String(n)} deze week`,
      improved: 'Meer gewicht of herhalingen bij minstens één oefening',
      improvedNone: 'Nog geen oefening verbeterd',
      protein: (target) => `Ongeveer ${String(target)} g eiwit op de meeste dagen`,
      proteinNoData: 'Geen maaltijden gelogd',
      proteinDetail: (hit, logged) => `${String(hit)} van ${String(logged)} gelogde dagen`,
      sleep: 'De meeste nachten 7+ uur geslapen',
      sleepDetail: 'Dat weet alleen jij',
    },
  },

  analysis: {
    title: 'AI-analyse',
    none: 'Nog geen',
    overdue: (days) => `${String(days)} dagen geleden`,
    last: (days) =>
      days === 0 ? 'Laatste: vandaag' : `Laatste: ${plural(days, 'dag', 'dagen')} geleden`,
    intro:
      'De AI bekijkt je gewicht, trainingen en maaltijden van de afgelopen weken en vertelt je wat je kunt aanpassen. Eén keer per week werkt het best.',
    run: 'Analyseer mijn voortgang',
    running: 'Bezig met analyseren…',
    stop: 'Stop',
    thinking: 'Even denken… dit kan een minuut duren.',
    pastTitle: 'Eerdere analyses',
    pastEmpty: 'Je analyses worden hier bewaard, zodat je week voor week kunt vergelijken.',
  },

  profile: {
    welcome: 'Welkom',
    intro:
      'Vertel iets over jezelf. We berekenen je dagelijkse calorieën en eiwitten en kiezen een trainingsschema dat past bij de dagen dat je kunt trainen. Je kunt alles later aanpassen.',
    title: 'Je profiel',
    sex: 'Geslacht',
    sexes: { male: 'Man', female: 'Vrouw' },
    age: 'Leeftijd',
    height: 'Lengte (cm)',
    weight: 'Gewicht (kg)',
    goal: 'Doel',
    goals: { gain: 'Spiermassa opbouwen', maintain: 'Op gewicht blijven', lose: 'Vet verliezen' },
    goalWeight: 'Streefgewicht (kg)',
    activity: 'Activiteit buiten de sportschool',
    activities: { low: 'Laag', moderate: 'Gemiddeld', high: 'Hoog' },
    activityHint: {
      low: 'Zittend werk, minder dan 6.000 stappen per dag',
      moderate: 'Deels op de been, 6.000-10.000 stappen',
      high: 'Fysiek werk of meer dan 10.000 stappen per dag',
    },
    days: 'Dagen dat je kunt trainen per week',
    split: (routines) => `Je rotatie: ${routines}`,
    rotation: 'Trainingsschema',
    rotations: {
      recommended: 'Aanbevolen',
      fullBody: 'Full body',
      upperLower: 'Bovenlichaam / Benen',
      ppl: 'Push / Pull / Benen',
      pplArms: 'PPL + Armen',
      pplUpperLower: 'PPL + Bovenlichaam / Benen',
      pplArmsUpperLower: 'PPL + Armen + Bovenlichaam / Benen',
      custom: 'Eigen schema',
    },
    recommendedSplit: (days, routines) => `Aanbevolen voor ${String(days)} dagen: ${routines}`,
    customHint: (days) =>
      `Tik tot ${String(days)} schema’s aan in de volgorde waarin je ze wilt trainen. Tik nog een keer om er een te verwijderen.`,
    customEmpty: 'Kies minstens één schema',
    targets: 'Dagelijkse doelen',
    kcal: 'Calorieën per dag',
    protein: 'Eiwit per dag (g)',
    targetsHint:
      'Aanbevolen op basis van je profiel. Pas ze aan als je je eigen cijfers al kent; de wekelijkse gewichtstrend laat zien of je moet bijsturen.',
    start: 'Starten',
    save: 'Profiel opslaan',
    saved: 'Profiel opgeslagen',
    invalid: 'Controleer de getallen',
  },

  settings: {
    title: 'AI',
    apiKey: 'Anthropic API-sleutel',
    apiKeyHelp:
      'Met een sleutel antwoordt de AI in de app zelf. Zonder sleutel zet de app elke vraag klaar om in je eigen Claude-app te plakken; dat werkt met Claude Pro. De sleutel wordt alleen op dit apparaat bewaard en alleen naar de Anthropic API gestuurd. Maak er een aan op',
    save: 'Sleutel opslaan',
    saved: 'Sleutel opgeslagen',
  },

  backup: {
    title: 'Back-up',
    intro:
      'Je gegevens staan op dit apparaat. Download af en toe een kopie, of om ze naar een andere telefoon te zetten. De API-sleutel zit er niet in.',
    download: 'Back-up downloaden',
    restore: 'Back-up terugzetten',
    confirm: (file) => ['Als je ', file, ' terugzet, worden al je huidige gegevens vervangen.'],
    replace: 'Mijn gegevens vervangen',
    cancel: 'Annuleren',
    restored: (weights, sessions) =>
      `Back-up teruggezet: ${plural(weights, 'weging', 'wegingen')}, ${plural(sessions, 'training', 'trainingen')}`,
    invalid: 'Dat bestand is geen geldige GymTracker-back-up',
  },

  manual: {
    intro: 'Geen API-sleutel, dus je kunt je eigen Claude-app gebruiken (werkt met Claude Pro).',
    copy: '1. Kopieer de vraag',
    copied: 'Vraag gekopieerd',
    open: 'Claude openen',
    photo: 'Voeg je foto ook toe in Claude.',
    paste: '2. Plak hier het antwoord van Claude',
    use: 'Antwoord gebruiken',
    cancel: 'Annuleren',
  },

  errors: {
    missingKey: 'Voeg je Anthropic API-sleutel toe bij Voortgang → AI.',
    invalidKey: 'De API-sleutel is niet geldig.',
    permission: 'Je sleutel mag dit model niet gebruiken.',
    rateLimited: 'Te veel verzoeken, of geen tegoed meer. Probeer het later opnieuw.',
    offline: 'Je bent offline. Controleer je verbinding.',
    service: 'De AI-dienst werkte niet. Probeer het opnieuw.',
    refused: 'De AI kon hier niets mee. Probeer het anders te beschrijven.',
    photo: 'Die foto kon niet worden gelezen. Probeer een andere.',
    badReply:
      'Dat antwoord kon niet worden gelezen. Plak het hele antwoord van Claude, inclusief het deel tussen { en }.',
    unknown: 'Er ging iets mis met de AI. Probeer het opnieuw.',
  },

  routines: {
    push: { name: 'Push', focus: 'Borst, schouders en triceps' },
    pull: { name: 'Pull', focus: 'Rug en biceps' },
    legs: { name: 'Benen', focus: 'Quadriceps, hamstrings, billen en kuiten' },
    arms: { name: 'Armen & schouders', focus: 'Armen, schouders en buikspieren' },
    upper: { name: 'Bovenlichaam', focus: 'Borst, rug, schouders en armen' },
    lower: { name: 'Benen & core', focus: 'Benen en core' },
    fullA: { name: 'Full A', focus: 'Full body' },
    fullB: { name: 'Full B', focus: 'Full body' },
    fullC: { name: 'Full C', focus: 'Full body' },
  },

  exercises: {
    benchPress: 'Bankdrukken',
    inclineDumbbellPress: 'Schuin bankdrukken met dumbbells',
    dumbbellShoulderPress: 'Schouderdrukken met dumbbells',
    cableFly: 'Cable fly of pec deck',
    lateralRaise: 'Lateral raise',
    tricepsPushdown: 'Triceps pushdown',
    pullUp: 'Optrekken of lat pulldown',
    barbellRow: 'Roeien met barbell of machine',
    oneArmDumbbellRow: 'Eenarmig roeien met dumbbell',
    facePull: 'Face pull',
    barbellCurl: 'Barbell curl',
    squat: 'Squat of leg press',
    romanianDeadlift: 'Roemeense deadlift',
    legPressOrSplitSquat: 'Leg press of Bulgaarse split squat',
    legCurl: 'Leg curl',
    legExtension: 'Leg extension',
    calfRaise: 'Kuitheffen',
    overheadPress: 'Overhead press met barbell of machine',
    rearDeltFly: 'Rear delt fly',
    inclineDumbbellCurl: 'Schuine dumbbell curl',
    dipsOrSkullCrusher: 'Dips of skull crusher',
    hammerCurl: 'Hammer curl',
    overheadTricepsExtension: 'Triceps extension boven het hoofd',
    hangingLegRaise: 'Hangend benen heffen',
    cableCrunch: 'Cable crunch',
    plank: 'Plank',
    lunge: 'Lunge',
    machineRow: 'Roeien op machine',
  },

  presets: {
    breakfastShake: {
      name: 'Ontbijtshake',
      details: '400 ml volle melk, 60 g havermout, 1 banaan, 1 el pindakaas',
    },
    breakfastShakeWhey: {
      name: 'Ontbijtshake + whey',
      details: 'De gewone shake plus 1 schep whey',
    },
    chickenRiceSkillet: {
      name: 'Kip met rijst uit de pan',
      details: '200 g kippendij of gehakt, rijst, groenten, 1 el olie',
    },
    yogurtNuts: {
      name: 'Griekse yoghurt met noten',
      details: '250 g yoghurt of kwark, een handje noten, fruit',
    },
    eggsBreadTuna: {
      name: 'Eieren, brood en tonijn',
      details: '3 eieren, 2-3 sneetjes brood, 1 blikje tonijn, tomaat met olie',
    },
    glassOfMilk: { name: 'Glas volle melk', details: '250 ml' },
    banana: { name: 'Banaan', details: '1 middelgrote' },
    peanuts: { name: 'Pinda’s', details: 'Een handje, ongeveer 30 g' },
  },

  meals: {
    title: 'Maaltijdideeën',
    intro:
      'Kant-en-klare maaltijden met hoeveelheden. Tik op Toevoegen om er een te loggen als nu gegeten.',
    left: (kcal, protein) => `Nog over vandaag: ${String(kcal)} kcal · ${String(protein)} g eiwit`,
    categories: {
      breakfast: 'Ontbijt',
      lunch: 'Lunch',
      dinner: 'Diner',
      snack: 'Snacks',
      shake: 'Shakes',
    },
    summary: (kcal, protein) => `${String(kcal)} kcal · ${String(protein)} g eiwit`,
    ingredients: 'Ingrediënten',
    add: 'Toevoegen',
    addLabel: (name) => `${name} toevoegen`,
    howTo: 'Zo maak je het',
  },

  mealIdeas: mealIdeasNl,
  mealSteps: mealStepsNl,
};
