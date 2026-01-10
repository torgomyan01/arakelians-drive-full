export type RoadSignCategory =
  | 'warning'
  | 'priority'
  | 'prohibitory'
  | 'mandatory'
  | 'special'
  | 'information'
  | 'service'
  | 'additional';

export const categoryLabels: Record<RoadSignCategory, string> = {
  warning: 'Նախազգուշացնող',
  priority: 'Առավելության',
  prohibitory: 'Արգելող',
  mandatory: 'Թելադրող',
  special: 'Հատուկ թելադրանքի',
  information: 'Տեղեկատվության',
  service: 'Սպասարկման',
  additional: 'Լրացուցիչ տեղեկատվության',
};
