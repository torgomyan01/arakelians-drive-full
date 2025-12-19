export interface VehicleIdentificationSign {
  id: string;
  number: string; // e.g., "1", "2", "13"
  name: string;
  description: string;
  image?: string; // Path to image in public folder
}

export const vehicleIdentificationSigns: VehicleIdentificationSign[] = [
  {
    id: '1',
    number: '1',
    name: 'Ավտոգնացք',
    description: '«Ավտոգնացք»`',
    image: '/vehicle-identification-signs/9_1.png',
  },
  {
    id: '2',
    number: '2',
    name: 'Արագության սահմանափակում',
    description: '«Արագության սահմանափակում»`',
    image: '/vehicle-identification-signs/9_2.png',
  },
  {
    id: '3',
    number: '3',
    name: 'Դանդաղընթաց տրանսպորտային միջոց',
    description: '«Դանդաղընթաց տրանսպորտային միջոց»`',
    image: '/vehicle-identification-signs/9_3.png',
  },
  {
    id: '4',
    number: '4',
    name: 'Երեխաների փոխադրում',
    description: '«Երեխաների փոխադրում»`',
    image: '/vehicle-identification-signs/9_4.png',
  },
  {
    id: '5',
    number: '5',
    name: 'Բութակներ',
    description: '«Բութակներ»՝',
    image: '/vehicle-identification-signs/9_5.png',
  },
  {
    id: '6',
    number: '6',
    name: 'Երկարաչափ տրանսպորտային միջոց',
    description: '«Երկարաչափ տրանսպորտային միջոց»`',
    image: '/vehicle-identification-signs/9_6.png',
  },
  {
    id: '7',
    number: '7',
    name: 'Խուլ վարորդ',
    description: '«Խուլ վարորդ»`',
    image: '/vehicle-identification-signs/9_7.png',
  },
  {
    id: '8',
    number: '8',
    name: 'Մեծ եզրաչափերով բեռ',
    description: '«Մեծ եզրաչափերով բեռ»`',
    image: '/vehicle-identification-signs/9_8.png',
  },
  {
    id: '9',
    number: '9',
    name: 'Վթարային կանգառ',
    description: '«Վթարային կանգառ»`',
    image: '/vehicle-identification-signs/9_9.png',
  },
  {
    id: '10',
    number: '10',
    name: 'Վտանգավոր բեռ',
    description: '«Վտանգավոր բեռ»`',
    image: '/vehicle-identification-signs/9_10.png',
  },
  {
    id: '11',
    number: '11',
    name: 'Ուսումնական տրանսպորտային միջոց',
    description: '«Ուսումնական տրանսպորտային միջոց»`',
    image: '/vehicle-identification-signs/9_11.png',
  },
  {
    id: '12',
    number: '12',
    name: 'Բժիշկ',
    description: '«Բժիշկ»`',
    image: '/vehicle-identification-signs/9_12.png',
  },
  {
    id: '13',
    number: '13',
    name: 'Հաշմանդամ',
    description: '«Հաշմանդամ»`',
    image: '/vehicle-identification-signs/9_13.png',
  },
];

// Helper functions
export function getAllVehicleSigns(): VehicleIdentificationSign[] {
  return vehicleIdentificationSigns;
}

export function getVehicleSignById(id: string): VehicleIdentificationSign | undefined {
  return vehicleIdentificationSigns.find((sign) => sign.id === id);
}

export function getVehicleSignByNumber(number: string): VehicleIdentificationSign | undefined {
  return vehicleIdentificationSigns.find((sign) => sign.number === number);
}
