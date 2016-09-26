var Rbac = require('../index.js');
var assertions = {
    'permission2': function (rbac, user, article, resolve,reject) {
            resolve(user.username === article.author.username);
    }
}

//obviously this AuthService is fake for the purposes of demonstration)
var AuthService =  {
    getUserPermissions: function(user){
        return new Promise(function(resolve,reject){
            if (user.username === 'michael'){
                 resolve(['permission1','permission2'])
            }else{
                resolve(['permission2'])
            }
        
        });
    }
}


var customProvider = {
    getPermissions: function(user){
        return AuthService.getUserPermissions(user);   
    }
}

var rbac = new Rbac({
    assertions: assertions,
    provider: {type: customProvider}
});
 
var user = {
    username: 'michael',
  
};
 
var user2 = {
    username: 'james',

};
 
var article = {
    author: {
        username: 'michael'
    }
};
 
rbac.IsGranted(user, 'permission1').then(function (access) {
    console.log(true); //true 
},function(e){
    console.log(e);
});
rbac.IsGranted(user2, 'permission1').then(function (access) {
    console.log(access); //false 
 
});
rbac.IsGranted(user, 'permission2', article).then(function (access) {
    console.log(access); //true 
});
 
 
rbac.IsGranted(user2, 'permission2',article).then(function (access) {
    console.log(access); //false 
});