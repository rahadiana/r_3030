'use strict';

const SiapData = function (options) {
    if (!(this instanceof SiapData)) 
        return new SiapData(options);
    
    this.API_URL = options.API_URL;
    this.API_KEY = options.API_KEY;

    return this;
};

SiapData.prototype.GetData = function (variable) {
    return new Promise(async (resolve, reject) => {
        try {
            var axios = require('axios');
            const {ResponseHandler} = require('@rahadiana/node_response_standard')
            const VariablePath = [
                "biodatas",
                "ayah",
                "ibu",
                "pasangan",
                "anak",
                "jabatan",
                "pangkat",
                "pendidikan",
                "identitas"
            ]

            function isValidJson(json) {
                const JsonParse = JSON.stringify(json)
                try {
                    JSON.parse(JsonParse);
                    return json;
                } catch (e) {
                    return "invalid json";
                }
            }

            const FinalVariablePath = VariablePath.find(
                element => element === variable.toLowerCase()
            );

            if (FinalVariablePath === undefined) {
                return resolve(ResponseHandler(500, '', "avail method : " + VariablePath))
            } else {
                var config = {
                    method: 'get',
                    timeout: 25000,
                    url: `${this.API_URL}${FinalVariablePath}?auth=${this.API_KEY}`
                };

                axios(config)
                    .then(function (response) {
                        return resolve(
                            ResponseHandler(response.status, isValidJson(response.data), "Berhasil Mengambil Data")
                        )
                    })
                    .catch(function (e) {
                        return resolve(ResponseHandler(e.code, e, e.message))
                    });
            }
        } catch (e) {
            return reject(e);
        }
    })
}

module.exports = SiapData;
