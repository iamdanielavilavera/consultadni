# consultadni

Consultar DNI.

# instalar paquetes

```
npm install
```


# correr servidor

```
npm start
```

```
node app.js
```

# Petición

```
http://localhost:3000/
```

request POST:
```json
{
    "dni" : "04412417"
}
```

response:
```json
{
    "data": "VIZCARRA|CORNEJO|MARTIN ALBERTO",
    "success": true,
    "mensaje": ""
}
```
