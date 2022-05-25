const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const TrainingFormSchema = new Schema({
  date: {
    type: Date,
    default: Date.now()
  },

  // IDENTIFICATION
  identification: {
    chiefName: {
      type: String,
      required: true
    },

    contactNumber: {
      type: Number,
      required: false
    },

    identificationYear: {
      type: Number,
      required: false
    },

    reportingMonth: {
      type: String,
      required: false
    },

    reportingProvince: {
      type: Schema.Types.ObjectId,
      ref: "Province",
      required: false
    },

    coordinatingProvince: {
      type: Schema.Types.ObjectId,
      ref: "Province",
      required: false
    },

    supportingPartner: {
      type: String,
      required: false
    },

    ASNumber: {
      type: Number,
      required: false
    },

    numCommunities: {
      type: Number,
      required: false
    },

    mtnTreated: {
      type: String,
      required: false
    }
  },

  // COVID SITUATION STATE
  covidSituation: {
    activeCovidCases: {
      type: Number,
      default: 0
    },
    newActiveCovidCases: {
      type: Number,
      default: 0
    },
    covidDeaths: {
      type: Number,
      default: 0
    }
  },

  // MEDICINAL SUPPLY
  medicinalSupply: {
    praziquantel: {
      praziquantelArrival: {
        type: Number,
        default: 0
      },
      numPraziquantelRemaining: {
        type: Number,
        default: 0
      },
      praziquantelArrivalDate: {
        type: Date,
        default: Date.now()
      },
      numPraziquantelReceived: {
        type: Number,
        default: 0
      }
    },
    ivermectin: {
      ivermectinArrival: {
        type: Number,
        default: 0
      },
      numMectizanRemaining: {
        type: Number,
        default: 0
      },
      ivermectinArrivalDate: {
        type: Date,
        default: Date.now()
      },
      numIvermectinReceived: {
        type: Number,
        default: 0
      }
    },
    albendazole: {
      albendazoleArrival: {
        type: Number,
        default: 0
      },
      numAlbendazoleRemaining: {
        type: Number,
        default: 0
      },
      albendazoleArrivalDate: {
        type: Date,
        default: Date.now()
      },
      numAlbendazoleReceived: {
        type: Number,
        default: 0
      }
    }
  },

  // FINANCIAL RESOURCES
  financialResources: {
    fundsArrived: {
      type: String,
      required: false
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
      required: false
    }
  },

  // TRAINING OF TRAINERS
  trainingOfTrainers: {
    isTrainingTrainers: {
      type: String,
      required: false
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
    }
  },

  // IT TRAINING
  trainingIT: {
    organizedTrainingIT: {
      type: String,
      required: false
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
      required: false
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
    }
  },

  // TRAINING SUPERVISION
  trainingSupervision: {
    supervisionDCTraining: {
      type: String,
      required: false
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
    }
  },

  // ESPM
  ESPM: {
    implementationESPM: {
      type: String,
      required: false
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
      required: false
    },
    DMMStartDate: {
      type: Date,
      required: false,
      default: Date.now()
    }
  },

  // MASS DISTRIBUTION OF MEDICINAL PRODUCTS
  massDistribution: {
    ASDMMDebut: {
      type: String,
      required: false
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
    }
  },

  // DMM SUPERVISION
  DMMSupervision: {
    ASDMMDebutDate: {
      type: Date,
      required: false,
      default: Date.now()
    },

    ASStartDate: {
      type: Date,
      required: false,
      default: Date.now()
    },

    DMMHierarchyVisits: {
      type: String,
      required: false
    }
  },

  // DATA VALIDATION
  dataValidation: {
    validationASStartDateZS: {
      type: Date,
      required: false,
      default: Date.now()
    },

    validationASEndDateZS: {
      type: Date,
      required: false,
      default: Date.now()
    },

    validationASStartDateCoordination: {
      type: Date,
      required: false,
      default: Date.now()
    },

    validationASEndDateCoordination: {
      type: Date,
      required: false,
      default: Date.now()
    }
  },

  // PROCESSING START DATE
  processing: {
    encodingStartDate: {
      type: String,
      required: false
    },

    numVillagesAlreadyEncoded: {
      type: Number,
      required: false
    },

    formTransmissionDate: {
      type: Date,
      required: false,
      default: Date.now()
    }
  }
});

module.exports = mongoose.model("TrainingForm", TrainingFormSchema);
