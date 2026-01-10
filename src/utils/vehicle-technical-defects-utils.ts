export type VehicleTechnicalDefectCategory =
  | 'braking'
  | 'steering'
  | 'lighting'
  | 'wheels'
  | 'engine'
  | 'other';

export const categoryLabels: Record<VehicleTechnicalDefectCategory, string> = {
  braking: 'Արգելակային համակարգ',
  steering: 'Ղեկային կառավարման համակարգ',
  lighting: 'Արտաքին լուսային սարքեր',
  wheels: 'Անիվներ և դողեր',
  engine: 'Շարժիչ',
  other: 'Այլ',
};
