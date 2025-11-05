// src/data/percentRows.ts
export type Row = { month: number; series: string; value: number };

export const percentRows: Row[] = [
  // Ministerio de Hacienda (línea dominante, leve descenso)
  { month: 1, series: "Ministerio de Hacienda", value: 48.0 },
  { month: 2, series: "Ministerio de Hacienda", value: 47.2 },
  { month: 3, series: "Ministerio de Hacienda", value: 46.6 },
  { month: 4, series: "Ministerio de Hacienda", value: 45.8 },
  { month: 5, series: "Ministerio de Hacienda", value: 45.0 },
  { month: 6, series: "Ministerio de Hacienda", value: 44.6 },
  { month: 7, series: "Ministerio de Hacienda", value: 43.8 },
  { month: 8, series: "Ministerio de Hacienda", value: 43.2 },
  { month: 9, series: "Ministerio de Hacienda", value: 42.3 },

  // Educación (ligera tendencia al alza)
  { month: 1, series: "Ministerio de Educación Publica", value: 17.6 },
  { month: 2, series: "Ministerio de Educación Publica", value: 17.5 },
  { month: 3, series: "Ministerio de Educación Publica", value: 17.8 },
  { month: 4, series: "Ministerio de Educación Publica", value: 18.4 },
  { month: 5, series: "Ministerio de Educación Publica", value: 18.7 },
  { month: 6, series: "Ministerio de Educación Publica", value: 19.4 },
  { month: 7, series: "Ministerio de Educación Publica", value: 19.6 },
  { month: 8, series: "Ministerio de Educación Publica", value: 19.7 },
  { month: 9, series: "Ministerio de Educación Publica", value: 20.1 },

  // Vivienda y Asent. Humanos (casi plano, leve alza)
  { month: 1, series: "Ministerio de Vivienda y Asent. Humanos", value: 9.0 },
  { month: 2, series: "Ministerio de Vivienda y Asent. Humanos", value: 9.0 },
  { month: 3, series: "Ministerio de Vivienda y Asent. Humanos", value: 9.0 },
  { month: 4, series: "Ministerio de Vivienda y Asent. Humanos", value: 9.1 },
  { month: 5, series: "Ministerio de Vivienda y Asent. Humanos", value: 9.2 },
  { month: 6, series: "Ministerio de Vivienda y Asent. Humanos", value: 9.3 },
  { month: 7, series: "Ministerio de Vivienda y Asent. Humanos", value: 9.3 },
  { month: 8, series: "Ministerio de Vivienda y Asent. Humanos", value: 9.4 },
  { month: 9, series: "Ministerio de Vivienda y Asent. Humanos", value: 9.5 },

  // Economía, Industria y Comercio
  { month: 1, series: "Ministerio EconomíaIndustria y Comercio", value: 3.2 },
  { month: 2, series: "Ministerio EconomíaIndustria y Comercio", value: 3.1 },
  { month: 3, series: "Ministerio EconomíaIndustria y Comercio", value: 3.2 },
  { month: 4, series: "Ministerio EconomíaIndustria y Comercio", value: 3.3 },
  { month: 5, series: "Ministerio EconomíaIndustria y Comercio", value: 3.4 },
  { month: 6, series: "Ministerio EconomíaIndustria y Comercio", value: 3.5 },
  { month: 7, series: "Ministerio EconomíaIndustria y Comercio", value: 3.6 },
  { month: 8, series: "Ministerio EconomíaIndustria y Comercio", value: 3.6 },
  { month: 9, series: "Ministerio EconomíaIndustria y Comercio", value: 3.7 },

  // Obras Públicas y Transporte
  { month: 1, series: "Ministerio Obras Publicas y Transporte", value: 4.1 },
  { month: 2, series: "Ministerio Obras Publicas y Transporte", value: 4.1 },
  { month: 3, series: "Ministerio Obras Publicas y Transporte", value: 4.0 },
  { month: 4, series: "Ministerio Obras Publicas y Transporte", value: 4.2 },
  { month: 5, series: "Ministerio Obras Publicas y Transporte", value: 4.3 },
  { month: 6, series: "Ministerio Obras Publicas y Transporte", value: 4.2 },
  { month: 7, series: "Ministerio Obras Publicas y Transporte", value: 4.5 },
  { month: 8, series: "Ministerio Obras Publicas y Transporte", value: 4.6 },
  { month: 9, series: "Ministerio Obras Publicas y Transporte", value: 4.7 },

  // Agricultura y Ganadería
  { month: 1, series: "Ministerio de Agricultura y Ganaderia", value: 2.9 },
  { month: 2, series: "Ministerio de Agricultura y Ganaderia", value: 2.8 },
  { month: 3, series: "Ministerio de Agricultura y Ganaderia", value: 2.9 },
  { month: 4, series: "Ministerio de Agricultura y Ganaderia", value: 3.0 },
  { month: 5, series: "Ministerio de Agricultura y Ganaderia", value: 3.0 },
  { month: 6, series: "Ministerio de Agricultura y Ganaderia", value: 3.1 },
  { month: 7, series: "Ministerio de Agricultura y Ganaderia", value: 3.2 },
  { month: 8, series: "Ministerio de Agricultura y Ganaderia", value: 3.3 },
  { month: 9, series: "Ministerio de Agricultura y Ganaderia", value: 3.3 },

  // Ambiente y Energía
  { month: 1, series: "Ministerio de Ambiente y Energía", value: 2.6 },
  { month: 2, series: "Ministerio de Ambiente y Energía", value: 2.6 },
  { month: 3, series: "Ministerio de Ambiente y Energía", value: 2.6 },
  { month: 4, series: "Ministerio de Ambiente y Energía", value: 2.6 },
  { month: 5, series: "Ministerio de Ambiente y Energía", value: 2.6 },
  { month: 6, series: "Ministerio de Ambiente y Energía", value: 2.6 },
  { month: 7, series: "Ministerio de Ambiente y Energía", value: 2.7 },
  { month: 8, series: "Ministerio de Ambiente y Energía", value: 2.7 },
  { month: 9, series: "Ministerio de Ambiente y Energía", value: 2.7 },

  // Ciencia y Tecnología
  { month: 1, series: "Ministerio de Ciencia y Tecnología", value: 1.8 },
  { month: 2, series: "Ministerio de Ciencia y Tecnología", value: 1.8 },
  { month: 3, series: "Ministerio de Ciencia y Tecnología", value: 1.8 },
  { month: 4, series: "Ministerio de Ciencia y Tecnología", value: 1.9 },
  { month: 5, series: "Ministerio de Ciencia y Tecnología", value: 1.9 },
  { month: 6, series: "Ministerio de Ciencia y Tecnología", value: 2.0 },
  { month: 7, series: "Ministerio de Ciencia y Tecnología", value: 2.0 },
  { month: 8, series: "Ministerio de Ciencia y Tecnología", value: 2.0 },
  { month: 9, series: "Ministerio de Ciencia y Tecnología", value: 2.0 },

  // Comercio Exterior
  { month: 1, series: "Ministerio de Comercio Exterior", value: 1.2 },
  { month: 2, series: "Ministerio de Comercio Exterior", value: 1.2 },
  { month: 3, series: "Ministerio de Comercio Exterior", value: 1.2 },
  { month: 4, series: "Ministerio de Comercio Exterior", value: 1.3 },
  { month: 5, series: "Ministerio de Comercio Exterior", value: 1.3 },
  { month: 6, series: "Ministerio de Comercio Exterior", value: 1.3 },
  { month: 7, series: "Ministerio de Comercio Exterior", value: 1.4 },
  { month: 8, series: "Ministerio de Comercio Exterior", value: 1.4 },
  { month: 9, series: "Ministerio de Comercio Exterior", value: 1.4 },

  // Cultura, Juventud y Deportes
  { month: 1, series: "Ministerio de Cultura Juvent. y Deportes", value: 0.9 },
  { month: 2, series: "Ministerio de Cultura Juvent. y Deportes", value: 0.9 },
  { month: 3, series: "Ministerio de Cultura Juvent. y Deportes", value: 0.9 },
  { month: 4, series: "Ministerio de Cultura Juvent. y Deportes", value: 1.0 },
  { month: 5, series: "Ministerio de Cultura Juvent. y Deportes", value: 1.0 },
  { month: 6, series: "Ministerio de Cultura Juvent. y Deportes", value: 1.0 },
  { month: 7, series: "Ministerio de Cultura Juvent. y Deportes", value: 1.0 },
  { month: 8, series: "Ministerio de Cultura Juvent. y Deportes", value: 1.1 },
  { month: 9, series: "Ministerio de Cultura Juvent. y Deportes", value: 1.1 },

  // Gobernación y Policía
  { month: 1, series: "Ministerio de Gobernación y Policía", value: 3.5 },
  { month: 2, series: "Ministerio de Gobernación y Policía", value: 3.5 },
  { month: 3, series: "Ministerio de Gobernación y Policía", value: 3.6 },
  { month: 4, series: "Ministerio de Gobernación y Policía", value: 3.6 },
  { month: 5, series: "Ministerio de Gobernación y Policía", value: 3.7 },
  { month: 6, series: "Ministerio de Gobernación y Policía", value: 3.8 },
  { month: 7, series: "Ministerio de Gobernación y Policía", value: 3.8 },
  { month: 8, series: "Ministerio de Gobernación y Policía", value: 3.9 },
  { month: 9, series: "Ministerio de Gobernación y Policía", value: 4.0 },

  // Justicia y Paz
  { month: 1, series: "Ministerio de Justicia y Paz", value: 1.1 },
  { month: 2, series: "Ministerio de Justicia y Paz", value: 1.1 },
  { month: 3, series: "Ministerio de Justicia y Paz", value: 1.1 },
  { month: 4, series: "Ministerio de Justicia y Paz", value: 1.1 },
  { month: 5, series: "Ministerio de Justicia y Paz", value: 1.2 },
  { month: 6, series: "Ministerio de Justicia y Paz", value: 1.2 },
  { month: 7, series: "Ministerio de Justicia y Paz", value: 1.2 },
  { month: 8, series: "Ministerio de Justicia y Paz", value: 1.2 },
  { month: 9, series: "Ministerio de Justicia y Paz", value: 1.2 },

  // Relaciones Exteriores y Culto
  { month: 1, series: "Ministerio de Relac. Exteriores y Culto", value: 0.7 },
  { month: 2, series: "Ministerio de Relac. Exteriores y Culto", value: 0.7 },
  { month: 3, series: "Ministerio de Relac. Exteriores y Culto", value: 0.7 },
  { month: 4, series: "Ministerio de Relac. Exteriores y Culto", value: 0.7 },
  { month: 5, series: "Ministerio de Relac. Exteriores y Culto", value: 0.8 },
  { month: 6, series: "Ministerio de Relac. Exteriores y Culto", value: 0.8 },
  { month: 7, series: "Ministerio de Relac. Exteriores y Culto", value: 0.8 },
  { month: 8, series: "Ministerio de Relac. Exteriores y Culto", value: 0.8 },
  { month: 9, series: "Ministerio de Relac. Exteriores y Culto", value: 0.8 },

  // Planificación Nacional y Política Económica
  { month: 1, series: "Minist.Planific.Nac.y Política Económica", value: 0.5 },
  { month: 2, series: "Minist.Planific.Nac.y Política Económica", value: 0.5 },
  { month: 3, series: "Minist.Planific.Nac.y Política Económica", value: 0.5 },
  { month: 4, series: "Minist.Planific.Nac.y Política Económica", value: 0.5 },
  { month: 5, series: "Minist.Planific.Nac.y Política Económica", value: 0.6 },
  { month: 6, series: "Minist.Planific.Nac.y Política Económica", value: 0.6 },
  { month: 7, series: "Minist.Planific.Nac.y Política Económica", value: 0.6 },
  { month: 8, series: "Minist.Planific.Nac.y Política Económica", value: 0.6 },
  { month: 9, series: "Minist.Planific.Nac.y Política Económica", value: 0.6 },

  // Asamblea Legislativa
  { month: 1, series: "Asamblea Legislativa", value: 0.4 },
  { month: 2, series: "Asamblea Legislativa", value: 0.4 },
  { month: 3, series: "Asamblea Legislativa", value: 0.4 },
  { month: 4, series: "Asamblea Legislativa", value: 0.4 },
  { month: 5, series: "Asamblea Legislativa", value: 0.4 },
  { month: 6, series: "Asamblea Legislativa", value: 0.4 },
  { month: 7, series: "Asamblea Legislativa", value: 0.4 },
  { month: 8, series: "Asamblea Legislativa", value: 0.4 },
  { month: 9, series: "Asamblea Legislativa", value: 0.4 },

  // Contraloría General
  { month: 1, series: "Contraloría General de la República", value: 0.2 },
  { month: 2, series: "Contraloría General de la República", value: 0.2 },
  { month: 3, series: "Contraloría General de la República", value: 0.2 },
  { month: 4, series: "Contraloría General de la República", value: 0.2 },
  { month: 5, series: "Contraloría General de la República", value: 0.2 },
  { month: 6, series: "Contraloría General de la República", value: 0.2 },
  { month: 7, series: "Contraloría General de la República", value: 0.2 },
  { month: 8, series: "Contraloría General de la República", value: 0.2 },
  { month: 9, series: "Contraloría General de la República", value: 0.2 },

  // Defensoría de los Habitantes
  { month: 1, series: "Defensoría Habitantes de la República.", value: 0.3 },
  { month: 2, series: "Defensoría Habitantes de la República.", value: 0.3 },
  { month: 3, series: "Defensoría Habitantes de la República.", value: 0.3 },
  { month: 4, series: "Defensoría Habitantes de la República.", value: 0.3 },
  { month: 5, series: "Defensoría Habitantes de la República.", value: 0.3 },
  { month: 6, series: "Defensoría Habitantes de la República.", value: 0.3 },
  { month: 7, series: "Defensoría Habitantes de la República.", value: 0.3 },
  { month: 8, series: "Defensoría Habitantes de la República.", value: 0.3 },
  { month: 9, series: "Defensoría Habitantes de la República.", value: 0.3 },
];
