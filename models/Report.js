const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const csv = require('mongoose-to-csv');

const ReportSchema = new Schema({
    // IDENTIFICATION
    DMM_day: {
        type: String,
        required: true
    },

    nurse: {
        type: String, //for now, if we're not doing auth
        //type: Schema.Types.ObjectId,
        //ref: 'User'
    },

    submitter: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },

    village: {
        type: Schema.Types.ObjectId,
        ref: 'Village'
    },

    province: {
        type: Schema.Types.ObjectId,
        ref: 'Province'
    },

    // This can be derived from village but caching it is easier for other queries
    health_area: {
        type: Schema.Types.ObjectId,
        ref: 'HealthArea'
    },

    // This can be derived from village but caching it is easier for other queries
    health_zone: {
        type: Schema.Types.ObjectId,
        ref: 'HealthZone'
    },

    date : {
        type: Date,
        default: Date.now()
    },

    // 1.11 diseases treated

    // not needed, may as well be in next section
    onchocerciasis: {
        first_round: {
            type: Boolean,
            default: false
        },
        second_round: {
            type: Boolean,
            default: false
        },
    },
    
    lymphatic_filariasis: {
        mectizan_and_albendazole: {
            type: Boolean,
            default: false
        },
        albendazole_alone: {
            first_round: {
                type: Boolean,
                default: false
            },
            second_round: {
                type: Boolean,
                default: false
            },
        },
    },

    schistosomiasis: {
        type: Boolean,
        default: false
    },

    soil_transmitted_helminthiasis: {
        type: Boolean,
        default: false
    },

    trachoma: {
        type: Boolean,
        default: false
    },

    dcs_training_completion_date: {
        type: Date,
        required: true,
        default: Date.now()
    },

    medicines_arrival_date: {
        type: Date,
        required: true,
        default: Date.now()
    },

    MDD_start_date: {
        type: Date,
        required: true,
        default: Date.now()
    },

    MDD_end_date: {
        type: Date,
        required: true,
        default: Date.now()
    },

    date_of_transmission: {
        type: Date,
        required: true,
        default: Date.now()
    },

    // distributors object with distributor name and number of people treated
    distributors: {
        men: {
            type: Number,
            default: 0,
        },
        women: {
            type: Number,
            default: 0,
        }
    },

    // II. DENUMBER
    patients: {
        men: {
            lessThanSixMonths: {
                type: Number,
                default: 0,
            },
            sixMonthsToFiveYears: {
                type: Number,
                default: 0,
            },
            fiveToFourteen: {
                type: Number,
                default: 0,
            },
            fifteenAndAbove: {
                type: Number,
                default: 0,
            }
        },
        women: {
            lessThanSixMonths: {
                type: Number,
                default: 0,
            },
            sixMonthsToFiveYears: {
                type: Number,
                default: 0,
            },
            fiveToFourteen: {
                type: Number,
                default: 0,
            },
            fifteenAndAbove: {
                type: Number,
                default: 0,
            }
        }
    },

    households: {
        visited: {
            type: Number,
            default: 0,
        },

        treated: {
            type: Number,
            default: 0,
        }
    },

    // III. MORBIDITY

    blind: {
        men: {
            type: Number,
            default: 0,
        },
        women: {
            type: Number,
            default: 0,
        }
    },

    lymphedema: {
        men: {
            upper_limbs: {
                left: { //I think this is called an arm
                    type: Number,
                    default: 0,
                },
                right: {
                    type: Number,
                    default: 0,
                }
            },
            lower_limbs: {
                left: {
                    type: Number,
                    default: 0,
                },
                right: {
                    type: Number,
                    default: 0,
                }
            }
        },
        women: {
            upper_limbs: {
                left: {
                    type: Number,
                    default: 0,
                },
                right: {
                    type: Number,
                    default: 0,
                }
            },
            lower_limbs: {
                left: {
                    type: Number,
                    default: 0,
                },
                right: {
                    type: Number,
                    default: 0,
                }
            },
            breast: {
                left: {
                    type: Number,
                    default: 0,
                },
                right: {
                    type: Number,
                    default: 0,
                }
            }
        }
    },

    hydroceles: {
        men: {
            type: Number,
            default: 0,
        }
    },

    trichiasis: {
        men: {
            type: Number,
            default: 0,
        }, 
        women: {
            type: Number,
            default: 0,
        }
    },

    guinea_worm: {
        men: {
            type: Number,
            default: 0,
        }, 
        women: {
            type: Number,
            default: 0,
        }
    },

    // IV. PROCESSING
    mectizan: {
        men: {
            fiveToFourteen: {
                type: Number,
                default: 0,
            },
            fifteenAndOver: {
                type: Number,
                default: 0,
            }
        },

        women: {
            fiveToFourteen: {
                type: Number,
                default: 0,
            },
            fifteenAndOver: {
                type: Number,
                default: 0,
            }
        },
        
    },

    mectizan_and_albendazole: {
        men: {
            fiveToFourteen: {
                type: Number,
                default: 0,
            },
            fifteenAndOver: {
                type: Number,
                default: 0,
            }
        },

        women: {
            fiveToFourteen: {
                type: Number,
                default: 0,
            },
            fifteenAndOver: {
                type: Number,
                default: 0,
            }
        },
        
    },

    albendazole: {
        men: {
            fiveToFourteen: {
                type: Number,
                default: 0,
            },
            fifteenAndOver: {
                type: Number,
                default: 0,
            }
        },

        women: {
            fiveToFourteen: {
                type: Number,
                default: 0,
            },
            fifteenAndOver: {
                type: Number,
                default: 0,
            }
        },
        
    },

    praziquantel: {
        men: {
            fiveToFourteen: {
                type: Number,
                default: 0,
            },
        },

        women: {
            fiveToFourteen: {
                type: Number,
                default: 0,
            },
        },
        
    },

    albendazole_soil_transmitted: {
        men: {
            fiveToFourteen: {
                type: Number,
                default: 0,
            },
        },

        women: {
            fiveToFourteen: {
                type: Number,
                default: 0,
            },
        },
        
    },

    side_effects_num: {
        type: Number,
        default: 0,
    },

    // V. UNTREATED PERSONS
    untreated_persons: {
        childrenYoungerThanFive: {
            type: Number,
            default: 0,
        },
        pregnantWomen: {
            type: Number,
            default: 0,
        },
        breastfeedingWomen: {
            type: Number,
            default: 0,
        },
        bedriddenPatients: {
            type: Number,
            default: 0,
        },
        refusals: {
            type: Number,
            default: 0,
        },
        absent: {
            type: Number,
            default: 0,
        },
    },

    // VI. DRUG MANAGEMENT
    ivermectin_management: {
        quantityReceived: {
            type: Number,
            default: 0
        },
        quantityUsed: {
            type: Number,
            default: 0
        },
        amountLost: {
            type: Number,
            default: 0
        },
        quantityReturnedToCS: {
            type: Number,
            default: 0
        },        
    },

    albendazole_management: {
        quantityReceived: {
            type: Number,
            default: 0
        },
        quantityUsed: {
            type: Number,
            default: 0
        },
        amountLost: {
            type: Number,
            default: 0
        },
        quantityReturnedToCS: {
            type: Number,
            default: 0
        },        
    },

    praziquantel_management: {
        quantityReceived: {
            type: Number,
            default: 0
        },
        quantityUsed: {
            type: Number,
            default: 0
        },
        amountLost: {
            type: Number,
            default: 0
        },
        quantityReturnedToCS: {
            type: Number,
            default: 0
        },        
    },

    // VII.  VALIDATION AND KOBO
    is_validated: {
        type: Boolean,
        default: false
    },

    sent_to_kobo: {
        type: Boolean,
        default: false
    }

});

ReportSchema.plugin(csv, {
    headers: 'Nurse Submitter DMM_day Nurse NURSETHREE',
    alias: {
      'Nurse': 'nurse',
      'submitter': 'submitter',
      'DMM_day': 'DMM_day',

      // STARTING AT EXCEL COLUMN CC

      // V. UNTREATED PERSONS
      'PERSONNES_NON_TRAITEES.Enfants_<_5_ans': 'untreated_persons.childrenYoungerThanFive',
      'PERSONNES_NON_TRAITEES.Fem_allaitante_<_7_jours': 'untreated_persons.breastfeedingWomen',
      'PERSONNES_NON_TRAITEES.FG': 'untreated_persons.pregnantWomen',
      'PERSONNES_NON_TRAITEES.Malade_grabataire': 'untreated_persons.bedriddenPatients',
      'PERSONNES_NON_TRAITEES.Absent': 'untreated_persons.absent',
      'PERSONNES_NON_TRAITEES.Refus': 'untreated_persons.refusals',

      // VI. DRUG MANAGEMENT
      'GESTION_DES_MEDICAMENTS.MECTIZAN.Reçus': 'ivermectin_management.quantityReceived',
      'GESTION_DES_MEDICAMENTS.MECTIZAN.Utilisé': 'ivermectin_management.quantityUsed',
      'GESTION_DES_MEDICAMENTS.MECTIZAN.Perdu': 'ivermectin_management.amountLost',
    //   'GESTION_DES_MEDICAMENTS.MECTIZAN.Restant': ,
      'GESTION_DES_MEDICAMENTS.MECTIZAN.Rendu_au_CS': 'ivermectin_management.quantityReturnedToCS',

      'GESTION_DES_MEDICAMENTS.ALBENDAZOLE.Reçus': 'albendazole_management.quantityReceived',
      'GESTION_DES_MEDICAMENTS.ALBENDAZOLE.Utilisé': 'albendazole_management.quantityUsed',
      'GESTION_DES_MEDICAMENTS.ALBENDAZOLE.Perdu': 'albendazole_management.amountLost',
    //   'GESTION_DES_MEDICAMENTS.ALBENDAZOLE.Restant': ,
      'GESTION_DES_MEDICAMENTS.ALBENDAZOLE.Rendu_au_CS': 'albendazole_management.quantityReturnedToCS',

      'GESTION_DES_MEDICAMENTS.PRAZIQUANTEL.Reçus': 'praziquantel_management.quantityReceived',
      'GESTION_DES_MEDICAMENTS.PRAZIQUANTEL.Utilisé': 'praziquantel_management.quantityUsed',
      'GESTION_DES_MEDICAMENTS.PRAZIQUANTEL.Perdu': 'praziquantel_management.amountLost',
    //   'GESTION_DES_MEDICAMENTS.PRAZIQUANTEL.Restant': ,
      'GESTION_DES_MEDICAMENTS.PRAZIQUANTEL.Rendu_au_CS': 'praziquantel_management.quantityReturnedToCS',

    //   'GESTION_DES_MEDICAMENTS.POMMADE_TETRACYCLINE_1%.Reçus': ,
    //   'GESTION_DES_MEDICAMENTS.POMMADE_TETRACYCLINE_1%.Utilisé': ,
    //   'GESTION_DES_MEDICAMENTS.POMMADE_TETRACYCLINE_1%.Perdu': ,
    //   'GESTION_DES_MEDICAMENTS.POMMADE_TETRACYCLINE_1%.Restant': ,
    //   'GESTION_DES_MEDICAMENTS.POMMADE_TETRACYCLINE_1%.Rendu_au_CS': ,

    //   'GESTION_DES_MEDICAMENTS.AZITHROMYCINE_SIROP.Reçus': ,
    //   'GESTION_DES_MEDICAMENTS.AZITHROMYCINE_SIROP.Utilisé': ,
    //   'GESTION_DES_MEDICAMENTS.AZITHROMYCINE_SIROP.Perdu': ,
    //   'GESTION_DES_MEDICAMENTS.AZITHROMYCINE_SIROP.Restant': ,
    //   'GESTION_DES_MEDICAMENTS.AZITHROMYCINE_SIROP.Rendu_au_CS': ,

    //   'GESTION_DES_MEDICAMENTS.AZITHROMYCINE_COMPRIME.Reçus': ,
    //   'GESTION_DES_MEDICAMENTS.AZITHROMYCINE_COMPRIME.Utilisé': ,
    //   'GESTION_DES_MEDICAMENTS.AZITHROMYCINE_COMPRIME.Perdu': ,
    //   'GESTION_DES_MEDICAMENTS.AZITHROMYCINE_COMPRIME.Restant': ,
    //   'GESTION_DES_MEDICAMENTS.AZITHROMYCINE_COMPRIME.Rendu_au_CS': ,
        
      // III. MORBIDITY
      'COMPLICATIONS_ONCHOCERCOSE.AVEUGLE.HOMME': 'blind.men',
      'COMPLICATIONS_ONCHOCERCOSE.AVEUGLE.FEMME': 'blind.women',
    //   'COMPLICATIONS_ONCHOCERCOSE.AVEUGLE.TOTAL': ,

    //   'COMPLICATIONS_FILARIOSE_LYMPHATIQUE.ELEPHANTIASIS.HOMME': ,
    //   'COMPLICATIONS_FILARIOSE_LYMPHATIQUE.ELEPHANTIASIS.FEMME': ,
    //   'COMPLICATIONS_FILARIOSE_LYMPHATIQUE.ELEPHANTIASIS.TOTAL': ,
    //   'COMPLICATIONS_FILARIOSE_LYMPHATIQUE.HYDROCELE.TOTAL': ,

      'COMPLICATIONS_TRACHOME.TRICHIASIS.HOMME': 'trichiasis.men',
      'COMPLICATIONS_TRACHOME.TRICHIASIS.FEMME': 'trichiasis.women',
    //   'COMPLICATIONS_TRACHOME.TRICHIASIS.TOTAL': ,

      'RECHERCHE_VER_DE_GUINEE.HOMME': 'guinea_worm.men',
      'RECHERCHE_VER_DE_GUINEE.FEMME': 'guinea_worm.women',
    //   'RECHERCHE_VER_DE_GUINEE.TOTAL': ,

    },
    virtuals: {
      'Nurse': function(doc) {
        return doc.nurse;
      },
    }
});

module.exports = mongoose.model('Report', ReportSchema);