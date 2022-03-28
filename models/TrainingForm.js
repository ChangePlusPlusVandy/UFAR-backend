const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TrainingFormSchema = new Schema({
    date: {
        type: Date,
        default: Date.now()
    },

    // IDENTIFICATION
    identification: {
        chiefName: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },

        contactNumber: {
            type: Number,
            required: true
        },

        identificationYear: {
            type: Number,
            required: true
        },

        reportingMonth: {
            type: String,
            required: true
        },

        reportingProvince: {
            type: String,
            required: true
        },

        coordinatingProvince: {
            type: String,
            required: true
        },

        supportingPartner: {
            type: String,
            required: true
        },

        ASNumber: {
            type: Number,
            required: true
        },

        numCommunities: {
            type: Number,
            required: true
        },

        mtnTreated: {
            type: String,
            required: true
        },
    },

    //COVID SITUATION STATE
    covidSituation:{
        activeCovidCases: {
            type: Number,
            default: 0,
        },
        newActiveCovidCases: {
            type: Number,
            default: 0,
        },
        covidDeaths: {
            type: Number,
            default: 0,
        }
    },

    //MEDICINAL SUPPLY
    medicinalSupply: {
        praziquantel: {
          numPraziquantelRemaining:{
                type: Number,
                default: 0,
          },
          praziquantelArrivalDate:{
                type: Date,
                default: Date.now()
          },
          numPraziquantelReceived: {
                type: Number,
                default: 0,
          },
        },
        ivermectin: {
          numMectizanRemaining: {
                type: Number,
                default: 0,
          },
          ivermectinArrivalDate: {
                type: Date,
                default: Date.now()
          }, 
          numIvermectinReceived: {
                type: Number,
                default: 0,
          },
        },
        albendazole: {
          numAlbendazoleRemaining: {
            type: Number,
            default: 0,
          },
          albendazoleArrivalDate: {
            type: Date,
            default: Date.now()
          },
          numAlbendazoleReceived: {
            type: Number,
            default: 0,
          },
        },
      },

    // FINANCIAL RESOURCES
    financialResources: {
        fundsArrived: {
            type: String,
            required: true
        },

        amountPlanning: {
            type: Number,
            default: 0
        },

        amountTraining: {
            type: Number,
            default: 0
        },

        amountESPM: {
            type: Number,
            default: 0
        },

        amountDMM: {
            type: Number,
            default: 0
        },

        amountSupervision: {
            type: Number,
            default: 0
        },

        amountManagement: {
            type: Number,
            default: 0
        },

        amountOther: {
            type: Number,
            default: 0
        },

        hasSupportingDocs: {
            type: String,
            required: true
        },
    },

    // TRAINING OF TRAINERS
    trainingOfTrainers: {
        trainingParticipation: {
            type: String,
            required: true
        },

        trainingStartDate: {
            type: Date,
            default: Date.now()
        },

        trainingEndDate: {
            type: Date,
            default: Date.now()
        },

        numFemaleTrainers: {
            type: Number,
            default: 0
        },

        numMaleTrainers: {
            type: Number,
            default: 0
        },
    },

    // IT TRAINING
    trainingIT: {
        organizedTrainingIT: {
            type: String,
            required: true
        },
        trainingITStartDate: {
            type: Date,
            default: Date.now()
        },
        trainingITEndDate: {
            type: Date,
            default: Date.now()
        },
        numMaleTrainersIT: {
            type: Number,
            default: 0
        },
        numFemaleTrainersIT: {
            type: Number,
            default: 0
        },
        organizedTrainingDC: {
            type: String,
            required: true
        },
        trainingDCStartDate: {
            type: Date,
            default: Date.now()
        },
        trainingDCEndDate: {
            type: Date,
            default: Date.now()
        },

        numFemaleTrainersDC: {
            type: Number,
            default: 0
        },
        numMaleTrainersDC: {
            type: Number,
            default: 0
        },
    },

    // TRAINING SUPERVISION
    trainingSupervision: {
        supervisionDCTraining: {
            type: String,
            required: true
        },

        supervisionTrainingStartDate: {
            type: Date,
            default: Date.now()
        },

        supervisionTrainingEndDate: {
            type: Date,
            default: Date.now()
        },

        supervisionHierachyVisits: {
            type: String
        },
    },

    // ESPM
    ESPM: {
        implementationESPM: {
            type: SVGStringList,
            required: true
        },
        awarenessStartDate: {
            type: Date,
            default: Date.now()
        },
        awarenessEndDate: {
            type: Date,
            default: Date.now()
        },
        organizedDMMCeremony: {
            type: String,
            required: true
        },
        DMMStartDate: {
            type: Date,
            required: true,
            default: Date.now()
        },
    },

    // MASS DISTRIBUTION OF MEDICINAL PRODUCTS
    massDistribution: {
        ASDMMDebut: {
            type: String,
            required: true
        },

        LFOVSTHStartDate: {
            type: Date,
            default: Date.now()
        },

        LFOVSTHEndDate: {
            type: Date,
            default: Date.now()
        },

        SCHStartDate: {
            type: Date,
            default: Date.now()
        },

        SCHEndDate: {
            type: Date,
            default: Date.now()
        },
    },

    // DMM SUPERVISION
    DMMSupervision: {
        ASDMMDebutDate: {
            type: Date,
            required: true,
            default: Date.now()
        },

        ASStartDate: {
            type: Date,
            required: true,
            default: Date.now()
        },

        DMMHierarchyVisits: {
            type: String,
            required: true
        },
    },

    // DATA VALIDATION
    dataValidation: {
        validationASStartDateZS: {
            type: Date,
            required: true,
            default: Date.now()
        },

        validationASEndDateZS: {
            type: Date,
            required: true,
            default: Date.now()
        },

        validationASStartDateCoordination: {
            type: Date,
            required: true,
            default: Date.now()
        },

        validationASEndDateCoordination: {
            type: Date,
            required: true,
            default: Date.now()
        },
    },

    // PROCESSING START DATE
    processing: {
        encodingStartDate: {
            type: String,
            required: true
        },

        numVillagesAlreadyEncoded: {
            type: Number,
            required: true
        },

        formTransmissionDate: {
            type: Date,
            required: true,
            default: Date.now()
        }
    },
});

module.exports = mongoose.model('TrainingForm', TrainingFormSchema);