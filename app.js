const express = require('express');
const cors = require('cors');
const request = require('request').defaults({
	jar: true,
	encoding: 'binary'
});
const cheerio = require('cheerio');

const app = express();
const port = process.env.PORT || 3000;
const urlTokens = 'https://aplicaciones007.jne.gob.pe/srop_publico/Consulta/Afiliado';
const urlInfo = 'https://aplicaciones007.jne.gob.pe/srop_publico/Consulta/api/AfiliadoApi/GetNombresCiudadano';

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
	res.send('DNI v1.0');
});

app.post('/', (req, res) => {
	if (typeof req.body.dni === 'undefined' || req.body.dni === null) {
		res.status(500).json({
			message: 'No ha enviado el DNI a buscar'
		});
	} else {
		request(urlTokens, (err, response, body) => {
			if (!err && response.statusCode == 200) {
				const $ = cheerio.load(body);
				let pTokenForm = $("script").eq(3).html() || '';
				let pTokenCookie = $("script").eq(4).html() || '';
				pTokenForm = pTokenForm.split("'");
				pTokenForm = pTokenForm.length > 2 ? pTokenForm[1] : '';
				pTokenCookie = pTokenCookie.split("'");
				pTokenCookie = pTokenCookie.length > 2 ? pTokenCookie[1] : '';
				const options = {
					uri: urlInfo,
					method: 'POST',
					json: {
						'CODDNI': req.body.dni
					},
					headers: {
						'RequestVerificationToken': pTokenCookie + ':' + pTokenForm
					}
				};
				request(options, (err, response, body) => {
					if (!err && response.statusCode == 200 && body.success) {
						var name = body.data.split('|').map(function (splited) {return splited.trim();}).join(' ').trim();
						if(name.length > 0){
							res.json({name : name});
						}else{
							res.status(400).json({
								message: 'DNI no encontrado'
							});
						}
						
					} else {
						res.status(500).json({
							message: 'Error al buscar el DNI'
						});
					}
				});
			} else {
				res.status(500).json({
					message: 'Error al buscar el DNI'
				});
			}
		});
	}
})


app.listen(port, () => {
	console.log(`App listening at http://localhost:${port}`)
});