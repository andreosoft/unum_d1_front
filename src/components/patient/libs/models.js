/** @format */

export default {
  data() {
    return {
      modelAnamnesis: [
        {
          name: 'Complaints',
          title: 'Complaints',
          fields: [],
        },
        {
          name: 'lifeAnamnesis',
          title: 'Life anamnesis',
          fields: [
            {
              name: 'ChronicDiseases',
              title: 'Chronic diseases',
              validator: ['req'],
              type: 'string',
            },
            {
              name: 'Injuries',
              title: 'Injuries',
              validator: ['req'],
              type: 'string',
            },
            {
              name: 'Operations',
              title: 'Operations',
              validator: ['req'],
              type: 'string',
            },
          ],
        },
        {
          name: 'allergicAnamnesis',
          title: 'Allergic anamnesis',
          fields: [
            {
              name: 'Allergies to medicinal substances',
              title: 'Allergies to medicinal substances',
              validator: ['req'],
              type: 'string',
            },
            {
              name: 'Food allergy',
              title: 'Food allergy',
              validator: ['req'],
              type: 'string',
            },
            {
              name: 'Household allergies',
              title: 'Household allergies',
              validator: ['req'],
              type: 'string',
            },
          ],
        },
        { name: 'expertAnamnesis', title: 'expert Anamnesis', fields: [] },
        { name: 'objectiveHistory', title: 'objective history', fields: [] },
        { name: 'generalHistory', title: 'general history', fields: [] },
        { name: 'localhistory', title: 'local history', fields: [] },
      ],
      modelDiagnosis: [
        {
          name: 'diagnosis',
          title: 'Diagnosis',
          fields: [
            {
              name: 'code',
              title: 'code',
              validator: [],
              type: 'string',
            },
            {
              name: 'diagnos',
              title: 'Diagnosis',
              validator: ['req'],
              type: 'string',
            },
            {
              name: 'diagnosComments',
              title: 'Diagnosis comments',
              validator: ['req'],
              type: 'string',
            },
          ],
        },
      ],
      modelSurveys: [
        {
          name: 'Laboratory_surveys',
          title: 'Laboratory surveys',
          fields: [],
        },
        {
          name: 'Hardware and instrumental surveys',
          title: 'Hardware and instrumental surveys',
          fields: [],
        },
      ],

      modelAppointments: [
        {
          name: 'Appointments',
          title: 'Appointments',
          fields: [],
        },
      ],
      modelRecomendations: [
        {
          name: 'Recomendations',
          title: 'Recomendations',
          fields: [],
        },
      ],
      modelInfo: [
        {
          name: 'Info',
          title: 'information',
          fields: [
            {
              name: 'information',
              title: 'information',
              validator: [],
              type: '',
            },
            {
              name: 'sex',
              title: 'Пол',
              validator: [],
              options: ['male', 'female'],
              type: 'select',
            },
            {
              name: 'height',
              title: 'height',
              validator: [],
              type: 'number',
            },
            {
              name: 'weight',
              title: 'weight',
              validator: [],
              type: 'number',
            },
            {
              name: 'ad',
              title: 'ad',
              validator: [],
              type: 'string',
            },
            {
              name: 'hr',
              title: 'hr',
              validator: [],
              type: 'number',
            },
            {
              name: 'blood',
              title: 'blood',
              validator: [],
              options: ['I+', 'I-', 'II+', 'II-', 'III+', 'III-', 'IV+', 'IV-'],
              type: 'select',
            },
          ],
        },
      ],
    };
  },
};
