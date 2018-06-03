var express = require('express'),
  cors = require('cors'),
  app = express(),
  port = process.env.PORT,
  bodyParser = require('body-parser');

// var corsOptions = {
//   origin: true,
//   optionsSuccessStatus: 200 
// }

app.use(cors(), (res,req) => {
	let log = req.path;
	console.log(req.path);
});

// app.use(function(req, res, next) {
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//   next();
// });

app.set('port', port);

 //Active le Cross-Origin-Request

// const connectionInfo = {
//   host: 'localhost',
//   database : 'festival',
//   port: 5432,
//   ssl : true,
//   user: 'postgres',
//   password: 'festival943413',
// }
const { Client } = require('pg')

const connectionInfo ={
  connectionString: process.env.DATABASE_URL,
  ssl: true,
};

app.listen(port, function() {
  console.log('[festivaljs-api] écoute sur le port ', app.get('port'));
});

// app.get('/*', (req, res) => {
// 	const client = new Client(connectionInfo);

// 	client.connect((err) => {
// 		if (err) {
// 		  console.error('connection error', err.stack)
// 		} else {
// 		  console.log(req.path);
// 		}
// 	});	  	
// })

app.get("/api/v1/festivals", async (req, res) => {
	const client = new Client(connectionInfo);

	client.connect((err) => {
		if (err) {
		  console.error('connection error', err.stack)
		} else {
		  console.log(`GET ${req.path}, params : ${req.params[0]}`)
		}
	});	  	

	await client.query('SELECT * FROM "Festival"', async (err, resp) => {
		await client.end( (err) => {
			if(err){
				console.log(err.stack);
			}
		});
		if(err){
			console.log("query err : " + err.stack);
		} else {
			res.json(to_jsonapi(resp.rows, "festival"));
		}
	});
});

app.get("/api/v1/artistes", async (req, res) => {
	const client = new Client(connectionInfo);

	client.connect((err) => {
		if (err) {
		  console.error('connection error', err.stack)
		} else {
		  console.log(`GET ${req.path}, params : ${req.params[0]}`)
		}
	});	  	

	await client.query('SELECT * FROM "Artiste"', async (err, resp) => {
		await client.end( (err) => {
			if(err){
				console.log(err.stack);
			}
		});
		if(err){
			console.log("query err : " + err.stack);
		} else {
			res.json(to_jsonapi(resp.rows, "artiste"));
		}
	});
});

app.get("/api/v1/villes", async (req, res) => {
	const client = new Client(connectionInfo);

	client.connect((err) => {
		if (err) {
		  console.error('connection error', err.stack)
		} else {
		  console.log(`GET ${req.path}, params : ${req.params[0]}`)
		}
	});	  	

	await client.query('SELECT * FROM "Ville"', async (err, resp) => {
		await client.end( (err) => {
			if(err){
				console.log(err.stack);
			}
		});
		if(err){
			console.log("query err : " + err.stack);
		} else {
			res.json(to_jsonapi(resp.rows, "ville"));
		}
	});
});

app.get("/api/v1/pays", async (req, res) => {
	const client = new Client(connectionInfo);

	client.connect((err) => {
		if (err) {
		  console.error('connection error', err.stack)
		} else {
		  console.log(`GET ${req.path}, params : ${req.params[0]}`)
		}
	});	  	

	await client.query('SELECT * FROM "Pays"', async (err, resp) => {
		await client.end( (err) => {
			if(err){
				console.log(err.stack);
			}
		});
		if(err){
			console.log("query err : " + err.stack);
		} else {
			res.json(to_jsonapi(resp.rows, "pays"));
		}
	});
});

app.get("/api/v1/genres", async (req, res) => {
	const client = new Client(connectionInfo);

	client.connect((err) => {
		if (err) {
		  console.error('connection error', err.stack)
		} else {
		  console.log(`GET ${req.path}, params : ${req.params[0]}`)
		}
	});	  	

	await client.query('SELECT * FROM "GenreMusical"', async (err, resp) => {
		await client.end( (err) => {
			if(err){
				console.log(err.stack);
			}
		});
		if(err){
			console.log("query err : " + err.stack);
		} else {
			res.json(to_jsonapi(resp.rows, "genre"));
		}
	});
});

app.get("/api/v1/festivals/:id", async (req, res) => {
	const client = new Client(connectionInfo);
	let query = {};
	if(req.query.include) {
		query = {
  			text: 'SELECT f.id, f.nom, f."dateDebut", f."dateFin", f.image, f."idVille", f."nbFestivaliers", v.nom as "nomVille", v."idPays"' + 
  					'FROM "Festival" as f, "Ville" as v WHERE f.id = $1 AND f."idVille" = v.id',
  			values: [req.params.id]
		}
	} else {
		query = {
  			text: 'SELECT * FROM "Festival" WHERE id = $1',
  			values: [req.params.id]
		}
	}
	
	client.connect((err) => {
		if (err) {
		  console.error('connection error', err.stack)
		} else {
		  console.log(`GET ${req.path}, params : ${req.query.include}`)
		}
	});	  	

	await client.query(query, async (err, resp) => {
		await client.end( (err) => {
			if(err){
				console.log(err.stack);
			}
		});
		if(err){
			console.log("query err : " + err.stack);
		} else {
			if(req.query.include){
				resp.rows[0].relationships = {
					"ville" : {
						"data" : {
							"type" : "ville",
							"id" : resp.rows[0].idVille 
						}
					}
				}
			}
			console.log(resp.rows);
			res.json(to_jsonapi(resp.rows[0], "festival"));
		}
	});
});

app.get("/api/v1/artistes/:id", async (req, res) => {
	const client = new Client(connectionInfo);
	const query = {
  		text: 'SELECT * FROM "Artiste" WHERE id=$1',
  		values: [req.params.id],
	}

	client.connect((err) => {
		if (err) {
		  console.error('connection error', err.stack)
		} else {
		  console.log(`GET ${req.path}, params : ${req.params[0]}`)
		}
	});	  	

	await client.query(query, async (err, resp) => {
		await client.end( (err) => {
			if(err){
				console.log(err.stack);
			}
		});
		if(err){
			console.log("query err : " + err.stack);
		} else {
			res.json(to_jsonapi(resp.rows[0], "artiste"));
		}
	});
});

app.get("/api/v1/villes/:id", async (req, res) => {
	const client = new Client(connectionInfo);
	const query = {
  		text: 'SELECT * FROM "Ville" WHERE id=$1',
  		values: [req.params.id],
	}

	client.connect((err) => {
		if (err) {
		  console.error('connection error', err.stack)
		} else {
		  console.log(`GET ${req.path}, params : ${req.params[0]}`)
		}
	});	  	

	await client.query(query, async (err, resp) => {
		await client.end( (err) => {
			if(err){
				console.log(err.stack);
			}
		});
		if(err){
			console.log("query err : " + err.stack);
		} else {
			res.json(to_jsonapi(resp.rows[0], "artiste"));
		}
	});
});






/*
Raison pour laquelle on ré-instancie le client à chaque fois :
https://github.com/brianc/node-postgres/issues/1352
*/

function to_jsonapi(result, type) {
  
  if (Array.isArray(result)) {
  	datajson = [];
    result.forEach(function(item) {
      datajson.push({
        "type": type,
        "id": item.id,
        "attributes": item
      });
    });
  } else if (typeof result === "object") {
    // Happens when there is only one item
    datajson = {
   	  "type": type,
      "id": result.id,
  	  "attributes": result
    }
    // datajson.push({
    //   "type": type,
    //   "id": result.id,
    //   "attributes": result
    // });
  } else {
    datajson.push({
      "type": type
    });
  }
  return {
    "data": datajson
  };
}
