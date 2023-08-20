import { Sequelize, DataTypes } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  dialect: 'postgres',
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
});

sequelize
  .authenticate()
  .then(() => {
    console.log('Conexión exitosa.');
  })
  .catch((error) => {
    console.error('Error de conexión:', error);
  });


export const transferencia = sequelize.define('transferencias',{
    emisor:{type:DataTypes.INTEGER},
    receptor:{type:DataTypes.INTEGER},
    monto:{type:DataTypes.FLOAT},
});


export const usuario = sequelize.define('usuarios',{
    nombre:{type:DataTypes.STRING},
    balance:{type:DataTypes.FLOAT},
});


transferencia.belongsTo(usuario, { foreignKey: 'emisor', as: 'EmisorUsuario' });
transferencia.belongsTo(usuario, { foreignKey: 'receptor', as: 'ReceptorUsuario' });

 async function crearUsuario(nombre,balance){
    await usuario.create({nombre,balance})
}

 async function crearTransferencia(emisor,receptor,monto){
    // verificar que el emisor tenga balance > monto
    const auxEmisor = await usuario.findByPk(emisor)
    let balanceEmisor = auxEmisor.balance 
    if (balanceEmisor >= monto){
       
        // restar monto a balance del emisor 
        let balanceEmisorActual = balanceEmisor - monto
        editarBalanceUsuario(emisor,balanceEmisorActual)
        
        // sumar monto al receptor
        const auxReceptor = await usuario.findByPk(receptor)
        let balanceReceptor = auxReceptor.balance
        let balanceReceptorActual = balanceReceptor + monto
        editarBalanceUsuario(receptor,balanceReceptorActual)
        await transferencia.create({emisor,receptor,monto}) 
    } else {
       console.log("Saldo Insuficiente")
    }

}

async function editarBalanceUsuario(id,balance){
    const aux = await usuario.findByPk(id)
    aux.balance = balance
    return aux.save()
}

async function mostrarUsuarios(){
    return await usuario.findAll()
}

async function editarUsuario(id,nombre,balance){
    const aux = await usuario.findByPk(id)
    aux.nombre = nombre
    aux.balance = balance
    return aux.save()
}

async function eliminarUsuario(id){
    const aux = await usuario.findByPk(id)
    return await aux.destroy(id)
}

async function mostrarTransferencias() {
    try {
      const transferenciasConUsuarios = await transferencia.findAll({
        include: [
          { model: usuario, as: 'EmisorUsuario', attributes: ['nombre'] },
          { model: usuario, as: 'ReceptorUsuario', attributes: ['nombre'] }
        ]
      });
  
      return transferenciasConUsuarios;
    } catch (error) {
      console.error('Error al obtener transferencias:', error);
    }
  }
  




export {crearUsuario,crearTransferencia, mostrarUsuarios, editarUsuario, eliminarUsuario, mostrarTransferencias}

sequelize.sync()