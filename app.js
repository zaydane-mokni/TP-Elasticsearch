let express = require('express');
const hostname = '127.0.0.1';
const port = 3000;
const { Client } = require('@elastic/elasticsearch')
const client = new Client({
    node: 'http://localhost:9200',
})
let app = express();
app.get('/TP4', async function (req, res) {
    let result;

    console.log('****** TP4 - Recherche ****** \n');

    console.log('******** Q1 ********')
     result = await client.count({
        index: 'person-v3',
        body: {
            query: {
                match: { 'gender': 'female' },
            }
        }
    });
    console.log('Combien de personnes sont des femmes : ' , result.body.count);

    console.log('\n ******** Q2 ********')
    result = await client.count({
        index: 'person-v3',
        body: {
            query: {
                range: { 'age' : {'gt' : 20}},
            }
        }
    });
    console.log('Combien de personnes ont un age supérieur à 20 ans : ' + result.body.count);

    console.log('\n ******** Q3 ********')
    result = await client.count({
        index: 'person-v3',
        body: {
            query: {
                "bool": {
                    "must": [
                        {"match": {
                                "gender": "male"
                            }},
                        { "range": {
                                "age": {
                                    "gt": 20
                                }
                        }}
                    ]
                }
            }
        }
    });
    console.log('Combien d’hommes ont un age supérieur à 20 ans : ' + result.body.count);

    console.log('\n ******** Q4 ********')
    result = await client.count({
        index: 'person-v3',
        body: {
            query: {
                "bool": {
                    "must": [
                        {"match": {
                                "gender": "male"
                            }},
                        { "range": {
                                "age": {
                                    "gt": 20
                                }
                            }}
                    ]
                }
            }
        }
    });
    console.log('Combien d’hommes ont un age supérieur à 20 ans : ' + result.body.count);

    console.log('\n ******** Q5 ********')
    result = await client.search({
        index: 'person-v3',
        body: {
            query: {
                "bool": {
                    "must": [
                        {"range": {
                                "age": {
                                    "gte": 20
                                }
                            }},
                        { "range": {
                                "balance": {
                                    "gt": 1000,
                                    "lt": 2000
                                }
                        }}
                    ]
                }
            }
        }
    });
    console.log('Retournez toutes les persnnes qui ont un age supérieur à 20 ans, et dont la balance est compriseentre $1000 et $2000 : ' , result.body.hits.hits);

    console.log('\n ******** Q6 ********')
    result = await client.search({
        index: 'person-v3',
        body: {
            "query": {
                "geo_distance": {
                    "distance": "20km",
                    "location": {
                        "lat" : 51.571303,
                        "lon" : 148.730499
                    }
                }
            }
        }
    });
    console.log('Trouvez toutes les personnes qui sont situées à moins de 10km de Paris : ' , result.body.hits.hits);

    res.status(403).send('Elasticsearch TP4!');
});

app.get('/TP5', async function (req, res) {
    let result;

    console.log('\n ****** TP5 - Agrégation ****** \n');

    console.log('\n ******** Q1 ********')
    result = await client.search({
        index: 'person-v3',
        body: {
            "aggs": {
                "avg_age": {
                    "avg": {"field": "age"}
                }
            }
        }
    });
    console.log('Calculer l’age moyen des personnes indexées : ' , result.body.aggregations);


    console.log('\n ******** Q2 ********')
    result = await client.search({
        index: 'person-v3',
        body: {
            "aggs": {
                "number_person": {
                    "terms": {
                        "field": "gender.keyword"
                    },
                }
            }
        }
    });
    console.log('Calculer le nombre de personnes par genre: ' , result.body.aggregations.number_person.buckets);


    console.log('\n ******** Q3 ********')
    result = await client.search({
        index: 'person-v3',
        body: {
            "aggs": {
                "number_person": {
                    "terms": {
                        "field": "gender.keyword"
                    },
                    "aggs": {
                        "eyeColor": {
                            "terms": {
                                "field": "eyeColor.keyword"
                            }
                        }
                    }
                }
            }
        }
    });
    console.log('Calculer le nombre de personnes par genre et par couleur des yeux : ' , result.body.aggregations.number_person.buckets);


    console.log('\n ******** Q4 ********')
    result = await client.search({
        index: 'person-v3',
        body: {
            "aggs": {
                "number_person": {
                    "terms": {
                        "field": "gender.keyword"
                    },
                    "aggs": {
                        "registered_year": {
                            "terms": {
                                "field": "registered"
                            }
                        }
                    }
                }
            }
        }
    });
    console.log('Calculer le nombre de personnes par genre et par année d’enregistrement : ' , result.body.aggregations.number_person.buckets);
    res.status(403).send('Elasticsearch TP5!');
});

app.listen(port, hostname, () => {
    console.log(`To see TP4 Logs http://${hostname}:${port}/TP4`);
    console.log(`To see TP5 Logs http://${hostname}:${port}/TP5`);
});

