'use strict';

module.exports = function(Service) {

};

/*
{
  "reference_number": "SR-00001/16",
  "name": "Construir API",
  "category": "Desarrollo",
  "description": "Engloba todas las tareas para construir una API",
  "image": "http://s3",
  "stages": [
    {
    	"name": "Investigacion",
    	"tasks": [
    		{
    			"reference_number": "TS-00001",
    			"name": "Buscar framework",
    			"assigned_resource": "[job_id]",
    			"duration": 1,
    			"dependencies": [
    				"TS-00000",
    				"TS-00003"
    			],
    			"notes": "Elije bien!",
				"docs": [
					"http://s3",
					"http://s3"
				]
    		},
    		{
    			"reference_number": "TS-00002",
    			"name": "Probar el framework",
    			"assigned_resource": "[job_id]",
    			"duration": 1,
    			"dependencies": [
    				"TS-00001"
    			],
    			"notes": "",
				"docs": [
					"http://s3",
					"http://s3"
				]
    		}
    	]
    },
    {
    	"stage_name": "Setup de proyecto",
    	"tasks": [
    		{
    			"reference_number": "TS-00005",
    			"name": "Esquema principal",
    			"assigned_resource": "[job_id]",
    			"duration": 1,
    			"dependencies": [
    				"TS-00001",
    				"TS-00002"
    			],
    			"notes": "Haz comentarios please ;)",
				"docs": [
					"http://s3",
					"http://s3"
				]
    		},
    		{
    			"reference_number": "TS-00001",
    			"name": "Inyeccion de dependencias",
    			"assigned_resource": "[job_id]",
    			"duration": 1,
    			"dependencies": [
    				"TS-00005"
    			],
    			"notes": "",
				"docs": [
					"http://s3",
					"http://s3"
				]
    		}
    	]
    }
  ],
  "costs": {
  	"human_costs": {
		"amount": 4000
  	},
  	"generic_costs": {
  		"amount": 2000,
  		"items": [
  			{
  				"name": "Transporte",
  				"amount": 500
  			},
  			{
  				"name": "Alojamiento",
  				"amount": 1500
  			}
  		]
  	}
  },
  "duration": 4
}
*/
