import express, { urlencoded } from 'express';
import { crearTransferencia, crearUsuario, mostrarUsuarios, editarUsuario, eliminarUsuario, mostrarTransferencias } from './models/bancosolar.js';
const app = express();
const port = process.env.PORT ?? 8080;

app.use(express.static("public"))
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

 

app.get("/", (req,res)=>{
    res.render("index")
});


app.post("/usuario", async (req,res)=>{
    let nombre = req.body.nombre
    let balance = req.body.balance
    crearUsuario(nombre,balance)
    res.send(await mostrarUsuarios())
});


app.get("/usuarios", async (req,res)=>{
    res.send(await mostrarUsuarios())
});

app.put("/usuario", async (req,res)=>{ 
    let id = req.query.id
    let nombre = req.body.nombre
    let balance = req.body.balance 
    editarUsuario(id,nombre,balance)
    res.send(await mostrarUsuarios())
});

app.delete("/usuario", async (req,res)=>{ 
    let id = req.query.id
    eliminarUsuario(id)
    res.send(await mostrarUsuarios())
});

app.post("/transferencia", async (req,res)=>{
    console.log("BODY :",req.body)
    let emisor = parseInt(req.body.emisor)
    let receptor = parseInt(req.body.receptor)
    let monto = parseInt(req.body.monto)
    crearTransferencia(emisor,receptor,monto) 
    res.send(await mostrarTransferencias())
});

app.get("/transferencias", async (req,res)=>{
    res.send(await mostrarTransferencias())
});






app.listen(port, () => {
    console.log(`App listening on port ${port}`);
  });



