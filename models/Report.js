const mongoose = require('mongoose');
const Schema = mongoose.Schema;

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

    village: {
        type: Schema.Types.ObjectId,
        ref: 'Village'
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
        default: Date.now
    },

    // 1.11 diseases treated
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

    // 1.12 number of treatment cycles 

    treatment_circles: {
        onchocerciasis: {
            type: Number,
            default: 0
        },
        lymphatic_filariasis: {
            type: Number,
            default: 0
        },
        schistosomiasis: {
            type: Number,
            default: 0
        },
        soil_transmitted_helminthiasis: {
            type: Number,
            default: 0
        },
        trachoma: {
            type: Number,
            default: 0
        },
    },

    dcs_training_completion_date: {
        type: Date,
        required: true,
        default: Date.now
    },

    medicines_arrival_date: {
        type: Date,
        required: true,
        default: Date.now
    },

    MDD_start_date: {
        type: Date,
        required: true,
        default: Date.now
    },

    MDD_end_date: {
        type: Date,
        required: true,
        default: Date.now
    },

    date_of_transmission: {
        type: Date,
        required: true,
        default: Date.now
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
                type: Number,
                default: 0,
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

module.exports = mongoose.model('Report', ReportSchema);