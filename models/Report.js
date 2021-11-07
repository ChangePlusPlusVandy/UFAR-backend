const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ReportSchema = new Schema({
    // IDENTIFICATION
    DMM_day: {
        type: String,
        required: true
    },
    nurse: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },

    province: {
        type: Schema.Types.ObjectId,
        ref: 'Province'
    },

    district: {
        type: Schema.Types.ObjectId,
        ref: 'District'
    },

    health_area: {
        type: Schema.Types.ObjectId,
        ref: 'HealthZone'
    },

    village: {
        type: Schema.Types.ObjectId,
        ref: 'Village'
    },

    date : {
        type: Date,
        default: Date.now
    },

    // todo: skipping the diseases treated for this section
    // teatment circles object with disease name and number of people treated
    treatment_circles: [{
        disease: {
            type: Schema.Types.ObjectId,
            ref: 'Disease'
        }
    }],

    dcs_training_completion_date: {
        type: Date,
        required: true
    },

    medicines_arrival_date: {
        type: Date,
        required: true
    },

    MDD_start_date: {
        type: Date,
        required: true
    },

    MDD_end_date: {
        type: Date,
        required: true
    },

    date_of_transmission: {
        type: Date,
        required: true
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

        wives: {
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

        wives: {
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

        wives: {
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

        wives: {
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

        wives: {
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

    // VI. DRUG management is done by the DRUG model
});


module.exports = mongoose.model('Report', ReportSchema);