const UnknownArray = ["Unknown"];

export default {
  name: {
    required: true,
    minLength: 1,
    maxLength: 200,
  },
  modelNumber: {
    required: true,
    minLength: 1,
    maxLength: 200,
  },
  unitType: {
    required: true,
    minLength: 1,
    maxLength: 200,
  },
  series: {
    required: true,
    minLength: 1,
    maxLength: 200,
  },
  seriesNumber: {
    required: true,
    minLength: 1,
    maxLength: 200,
  },
  manufacturer: {
    required: true,
    minLength: 1,
    maxLength: 200,
  },
  description: {
    required: true,
    minLength: 10,
    maxLength: 5000,
  },
  pilots: {
    required: true,
    default: UnknownArray,
  },
  developedFrom: {
    required: true,
    default: UnknownArray,
  },
  developedInto: {
    required: true,
    default: UnknownArray,
  },
  yearCreated: {
    required: true,
    minLength: 2,
    maxLength: 4,
  },
  operators: {
    required: true,
    default: UnknownArray,
  },
  height: { required: true, minLength: 1, maxLength: 10 },
  weight: { required: true, minLength: 1, maxLength: 10 },
  powerSource: {
    required: true,
    minLength: 10,
    maxLength: 200,
  },
  powerOutput: {
    required: true,
    minLength: 1,
    maxLength: 200,
  },
  armor: {
    required: true,
    default: UnknownArray,
  },
  armaments: {
    required: true,
    default: UnknownArray,
  },
  specialEquipment: {
    required: true,
    default: UnknownArray,
  },
  configurations: {
    required: true,
    default: UnknownArray,
  },

  variants: {
    required: true,
    default: UnknownArray,
  },
};
