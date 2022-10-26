const auth = require('../auth');
const nanoid = require('nanoid')
const table='user';


module.exports = (injectedStore) => {

    let store = injectedStore;
    if(!store){
        store = require('../../../store/mysql')
    }

    function list () {
        return store.list(table)
    }

    function get (id) {
        return store.get(table,id)
    }

   async function upsert( body){
        const user = {
            id:body.id,
            name: body.name,
            username: body.username
        }
        if (body.id) {
            user.id = body.id;
        } else {
            user.id = nanoid();
        }
        if (body.username || body.password) {
            await auth.upsert({
                    id: user.id,
                    username: user.username,
                    password: body.password,
            })
        }
       return store.upsert(table, user)
    }
async function follow(from, to) {
    return store.upsert(table +'_follow',{
        user_from: from,
        user_to: to
    });
}
function getFollowers(id){
    
    return store.query(table+'_follow', id);
}
    return {list,get,upsert,follow,getFollowers}
}

