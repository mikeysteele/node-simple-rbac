/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


module.exports.getPermissions = function(object){
    return new Promise(function(fulfill,reject){
        if (!object.permissions){
            reject("passed object has no permissions");
        }else if (!object.permissions instanceof Array && typeof object.permissions !== 'object' ){
            reject('permissions needs to be an array');
        }else{
            fulfill(object.permissions);
        }
    });
    
};