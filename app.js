const express = require('express');
const request = require('request').defaults({
	jar: true,
	encoding: 'binary'
});
const cheerio = require('cheerio');

const app = express();
const port = process.env.PORT || 3000;
const urlTokens = 'https://aplicaciones007.jne.gob.pe/srop_publico/Consulta/Afiliado';
const urlInfo = 'https://aplicaciones007.jne.gob.pe/srop_publico/Consulta/api/AfiliadoApi/GetNombresCiudadano';

app.use(express.json());

app.get('/', (req, res) => {
	res.send('DNI v1.0');
});

app.post('/', (req, res) => {
	if (typeof req.body.dni === 'undefined' || req.body.dni === null) {
		res.status(500).json({
			error: 'No ha enviado el DNI a buscar'
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
					if (!err && response.statusCode == 200) {
						res.json(body);
					} else {
						res.status(500).json({
							error: 'Error al buscar el DNI'
						});
					}
				});
			} else {
				res.status(500).json({
					error: 'Error al buscar el DNI'
				});
			}
		});
	}
})


app.listen(port, () => {
	console.log(`App listening at http://localhost:${port}`)
});