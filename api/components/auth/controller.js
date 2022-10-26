//registro
const bcrypt = require('bcrypt');
const auth = require('../../../auth');
const table = 'auth'
module.exports = (injectedStore) => {

    let store = injectedStore;
    if (!store) {
        store = require('../../../store/mysql')
    }

    //funcion para validar login
    async function login(username, password) {
        const data = await store.query(table, { username: username });

        return bcrypt.compare(password, data.password)
        .then(sonIguales =>{
            if (sonIguales === true) {
                //generamos el token
                return auth.sign({...data});
            } else {
                throw new Error('información invalida')
            }
        });
    }

    //Funcion para insertar registro
    async function upsert(data) {
        const authData = {
            id: data.id,
        }

        if (data.username) {
            authData.username = data.username;
        }
        if (data.password) {
            authData.password = await bcrypt.hash(data.password, 5);
        }
        return store.upsert(table, authData);
    }

    return {
        upsert, login
    };

};