let profile = {
    user_profile: {
        "roles": [
            "ADMIN"
        ],
        "gender": "male",
        "user_id": 80,
        "profiles": {
            "ADMIN": {
                "authUrl": {
                    "tl_user": [
                        {
                            "url": "/v1/agency/tl_user/id/:id",
                            "method": "GET"
                        },
                        {
                            "url": "/v1/agency/tl_user",
                            "method": "GET"
                        },
                        {
                            "url": "/v1/agency/tl_user",
                            "method": "POST"
                        },
                        {
                            "url": "/v1/agency/tl_user/saveAll",
                            "method": "POST"
                        },
                        {
                            "url": "/v1/agency/tl_user/id/:id",
                            "method": "PUT"
                        },
                        {
                            "url": "/v1/agency/tl_user/id/:id",
                            "method": "DELETE"
                        }
                    ],
                    "tl_util": [
                        {
                            "url": "/v1/agency/tl_util/parent_id/:parent_id",
                            "method": "GET"
                        },
                        {
                            "url": "/v1/agency/tl_util",
                            "method": "GET"
                        },
                        {
                            "url": "/v1/agency/tl_util",
                            "method": "POST"
                        },
                        {
                            "url": "/v1/agency/tl_util/saveAll",
                            "method": "POST"
                        },
                        {
                            "url": "/v1/agency/tl_util/id/:id",
                            "method": "PUT"
                        },
                        {
                            "url": "/v1/agency/tl_util/id/:id",
                            "method": "DELETE"
                        }
                    ],
                    "tl_group": [
                        {
                            "url": "/v1/agency/tl_group/id/:id",
                            "method": "GET"
                        },
                        {
                            "url": "/v1/agency/tl_group",
                            "method": "GET"
                        },
                        {
                            "url": "/v1/agency/tl_group",
                            "method": "POST"
                        },
                        {
                            "url": "/v1/agency/tl_group/saveAll",
                            "method": "POST"
                        },
                        {
                            "url": "/v1/agency/tl_group/id/:id",
                            "method": "PUT"
                        },
                        {
                            "url": "/v1/agency/tl_group/id/:id",
                            "method": "DELETE"
                        }
                    ],
                    "tl_driver": [
                        {
                            "url": "/v1/agency/tl_driver/id/:id",
                            "method": "GET"
                        },
                        {
                            "url": "/v1/agency/tl_driver",
                            "method": "GET"
                        },
                        {
                            "url": "/v1/agency/tl_driver",
                            "method": "POST"
                        },
                        {
                            "url": "/v1/agency/tl_driver/saveAll",
                            "method": "POST"
                        },
                        {
                            "url": "/v1/agency/tl_driver/id/:id",
                            "method": "PUT"
                        },
                        {
                            "url": "/v1/agency/tl_driver/id/:id",
                            "method": "DELETE"
                        }
                    ],
                    "tl_profile": [
                        {
                            "url": "/v1/agency/tl_profile/id/:id",
                            "method": "GET"
                        },
                        {
                            "url": "/v1/agency/tl_profile",
                            "method": "GET"
                        },
                        {
                            "url": "/v1/agency/tl_profile",
                            "method": "POST"
                        },
                        {
                            "url": "/v1/agency/tl_profile/saveAll",
                            "method": "POST"
                        },
                        {
                            "url": "/v1/agency/tl_profile/id/:id",
                            "method": "PUT"
                        },
                        {
                            "url": "/v1/agency/tl_profile/deletefile/:id",
                            "method": "DELETE"
                        }
                    ],
                    "tl_vehicle": [
                        {
                            "url": "/v1/agency/tl_vehicle/id/:id",
                            "method": "GET"
                        },
                        {
                            "url": "/v1/agency/tl_vehicle",
                            "method": "GET"
                        },
                        {
                            "url": "/v1/agency/tl_vehicle",
                            "method": "POST"
                        },
                        {
                            "url": "/v1/agency/tl_vehicle/saveAll",
                            "method": "POST"
                        },
                        {
                            "url": "/v1/agency/tl_vehicle/id/:id",
                            "method": "PUT"
                        },
                        {
                            "url": "/v1/agency/tl_vehicle/id/:id",
                            "method": "DELETE"
                        }
                    ],
                    "uploadFile": [
                        {
                            "url": "/v1/agency/uploadFile/base64/:id",
                            "method": "GET"
                        },
                        {
                            "url": "/v1/agency/uploadFile",
                            "method": "GET"
                        },
                        {
                            "url": "/v1/agency/uploadFile",
                            "method": "POST"
                        },
                        {
                            "url": "/v1/agency/uploadFile/saveAll",
                            "method": "POST"
                        },
                        {
                            "url": "/v1/agency/uploadFile/id/:id",
                            "method": "PUT"
                        },
                        {
                            "url": "/v1/agency/uploadFile/deletefile/:id",
                            "method": "DELETE"
                        }
                    ],
                    "tl_customer": [
                        {
                            "url": "/v1/agency/tl_customer/id/:id",
                            "method": "GET"
                        },
                        {
                            "url": "/v1/agency/tl_customer",
                            "method": "GET"
                        },
                        {
                            "url": "/v1/agency/tl_customer",
                            "method": "POST"
                        },
                        {
                            "url": "/v1/agency/tl_customer/saveAll",
                            "method": "POST"
                        },
                        {
                            "url": "/v1/agency/tl_customer/id/:id",
                            "method": "PUT"
                        },
                        {
                            "url": "/v1/agency/tl_customer/id/:id",
                            "method": "DELETE"
                        }
                    ],
                    "tl_function": [
                        {
                            "url": "/v1/agency/tl_function/id/:id",
                            "method": "GET"
                        },
                        {
                            "url": "/v1/agency/tl_function",
                            "method": "GET"
                        },
                        {
                            "url": "/v1/agency/tl_function",
                            "method": "POST"
                        },
                        {
                            "url": "/v1/agency/tl_function/saveAll",
                            "method": "POST"
                        },
                        {
                            "url": "/v1/agency/tl_function/id/:id",
                            "method": "PUT"
                        },
                        {
                            "url": "/v1/agency/tl_function/id/:id",
                            "method": "DELETE"
                        }
                    ],
                    "tl_industry": [
                        {
                            "url": "/v1/agency/tl_industry/id/:id",
                            "method": "GET"
                        },
                        {
                            "url": "/v1/agency/tl_industry",
                            "method": "GET"
                        },
                        {
                            "url": "/v1/agency/tl_industry",
                            "method": "POST"
                        },
                        {
                            "url": "/v1/agency/tl_industry/saveAll",
                            "method": "POST"
                        },
                        {
                            "url": "/v1/agency/tl_industry/id/:id",
                            "method": "PUT"
                        },
                        {
                            "url": "/v1/agency/tl_industry/id/:id",
                            "method": "DELETE"
                        }
                    ],
                    "tl_user_type": [
                        {
                            "url": "/v1/agency/tl_user_type/user_type/:user_type",
                            "method": "GET"
                        },
                        {
                            "url": "/v1/agency/tl_user_type",
                            "method": "GET"
                        },
                        {
                            "url": "/v1/agency/tl_user_type",
                            "method": "POST"
                        },
                        {
                            "url": "/v1/agency/tl_user_type/saveAll",
                            "method": "POST"
                        },
                        {
                            "url": "/v1/agency/tl_user_type/id/:id",
                            "method": "PUT"
                        },
                        {
                            "url": "/v1/agency/tl_user_type/id/:id",
                            "method": "DELETE"
                        }
                    ],
                    "tl_contractor": [
                        {
                            "url": "/v1/agency/tl_contractor/id/:id",
                            "method": "GET"
                        },
                        {
                            "url": "/v1/agency/tl_contractor",
                            "method": "GET"
                        },
                        {
                            "url": "/v1/agency/tl_contractor",
                            "method": "POST"
                        },
                        {
                            "url": "/v1/agency/tl_contractor/saveAll",
                            "method": "POST"
                        },
                        {
                            "url": "/v1/agency/tl_contractor/id/:id",
                            "method": "PUT"
                        },
                        {
                            "url": "/v1/agency/tl_contractor/id/:id",
                            "method": "DELETE"
                        }
                    ],
                    "tl_field_info": [
                        {
                            "url": "/v1/agency/tl_field_info/form_name/:form_name",
                            "method": "GET"
                        },
                        {
                            "url": "/v1/agency/tl_field_info",
                            "method": "GET"
                        },
                        {
                            "url": "/v1/agency/tl_field_info",
                            "method": "POST"
                        },
                        {
                            "url": "/v1/agency/tl_field_info/saveAll",
                            "method": "POST"
                        },
                        {
                            "url": "/v1/agency/tl_field_info/id/:id",
                            "method": "PUT"
                        },
                        {
                            "url": "/v1/agency/tl_field_info/id/:id",
                            "method": "DELETE"
                        }
                    ],
                    "tl_shop_keeper": [
                        {
                            "url": "/v1/agency/tl_shop_keeper/id/:id",
                            "method": "GET"
                        },
                        {
                            "url": "/v1/agency/tl_shop_keeper",
                            "method": "GET"
                        },
                        {
                            "url": "/v1/agency/tl_shop_keeper",
                            "method": "POST"
                        },
                        {
                            "url": "/v1/agency/tl_shop_keeper/saveAll",
                            "method": "POST"
                        },
                        {
                            "url": "/v1/agency/tl_shop_keeper/id/:id",
                            "method": "PUT"
                        },
                        {
                            "url": "/v1/agency/tl_shop_keeper/id/:id",
                            "method": "DELETE"
                        }
                    ],
                    "tl_water_plant": [
                        {
                            "url": "/v1/agency/tl_water_plant/id/:id",
                            "method": "GET"
                        },
                        {
                            "url": "/v1/agency/tl_water_plant",
                            "method": "GET"
                        },
                        {
                            "url": "/v1/agency/tl_water_plant",
                            "method": "POST"
                        },
                        {
                            "url": "/v1/agency/tl_water_plant/saveAll",
                            "method": "POST"
                        },
                        {
                            "url": "/v1/agency/tl_water_plant/id/:id",
                            "method": "PUT"
                        },
                        {
                            "url": "/v1/agency/tl_water_plant/id/:id",
                            "method": "DELETE"
                        }
                    ],
                    "tl_delivery_boy": [
                        {
                            "url": "/v1/agency/tl_delivery_boy/id/:id",
                            "method": "GET"
                        },
                        {
                            "url": "/v1/agency/tl_delivery_boy",
                            "method": "GET"
                        },
                        {
                            "url": "/v1/agency/tl_delivery_boy",
                            "method": "POST"
                        },
                        {
                            "url": "/v1/agency/tl_delivery_boy/saveAll",
                            "method": "POST"
                        },
                        {
                            "url": "/v1/agency/tl_delivery_boy/id/:id",
                            "method": "PUT"
                        },
                        {
                            "url": "/v1/agency/tl_delivery_boy/id/:id",
                            "method": "DELETE"
                        }
                    ],
                    "tl_sub_contractor": [
                        {
                            "url": "/v1/agency/tl_sub_contractor/id/:id",
                            "method": "GET"
                        },
                        {
                            "url": "/v1/agency/tl_sub_contractor",
                            "method": "GET"
                        },
                        {
                            "url": "/v1/agency/tl_sub_contractor",
                            "method": "POST"
                        },
                        {
                            "url": "/v1/agency/tl_sub_contractor/saveAll",
                            "method": "POST"
                        },
                        {
                            "url": "/v1/agency/tl_sub_contractor/id/:id",
                            "method": "PUT"
                        },
                        {
                            "url": "/v1/agency/tl_sub_contractor/id/:id",
                            "method": "DELETE"
                        }
                    ],
                    "tl_transport_agent": [
                        {
                            "url": "/v1/agency/tl_transport_agent/id/:id",
                            "method": "GET"
                        },
                        {
                            "url": "/v1/agency/tl_transport_agent",
                            "method": "GET"
                        },
                        {
                            "url": "/v1/agency/tl_transport_agent",
                            "method": "POST"
                        },
                        {
                            "url": "/v1/agency/tl_transport_agent/saveAll",
                            "method": "POST"
                        },
                        {
                            "url": "/v1/agency/tl_transport_agent/id/:id",
                            "method": "PUT"
                        },
                        {
                            "url": "/v1/agency/tl_transport_agent/id/:id",
                            "method": "DELETE"
                        }
                    ],
                    "tl_profile_function": [
                        {
                            "url": "/v1/agency/tl_profile_function/id/:id",
                            "method": "GET"
                        },
                        {
                            "url": "/v1/agency/tl_profile_function",
                            "method": "GET"
                        },
                        {
                            "url": "/v1/agency/tl_profile_function",
                            "method": "POST"
                        },
                        {
                            "url": "/v1/agency/tl_profile_function/saveAll",
                            "method": "POST"
                        },
                        {
                            "url": "/v1/agency/tl_profile_function/id/:id",
                            "method": "PUT"
                        },
                        {
                            "url": "/v1/agency/tl_profile_function/id/:id",
                            "method": "DELETE"
                        }
                    ]
                },
                "user_type": "ADMIN",
                "profile_id": 64,
                "user_type_id": 3
            }
        },
        "last_name": "kasinathan",
        "activeRole": "",
        "first_name": "jegan",
        "user_number": 100080,
        "country_code": null
    }
}

module.exports = { profile };