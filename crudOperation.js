sap.ui.define([
   'sap/ui/core/BusyIndicator'
],function(BusyIndicator){
    "use strict";
    return{
        Operation:function(mainObject){
            BusyIndicator.show();
            const {payload,method,entitySet,mainModel,controller}= mainObject;
            
            return new Promise((resolve,reject)=>{
                if(method.toLowerCase() === "get"){
                    try {
                        controller.getView().getModel(mainModel).read(`/${entitySet}`,{
                            success:function(data,response){
                                resolve(data,response);
                                BusyIndicator.hide();
                            },
                            error:function(err){
                                reject(err);
                                BusyIndicator.hide();
                            }
                        })
                    } catch (error) {
                        reject(error);
                    }
                   
                }
                if(method.toLowerCase() === "post"){
                    try {
                        controller.getView().getModel(mainModel).create(`/${entitySet}`,payload,{
                            success:function(data,response){
                                BusyIndicator.hide();
                                resolve(data,response);
                            },
                            error:function(err){
                                BusyIndicator.hide();
                                reject(err);
                            }
                        }) 
                    } catch (error) {
                        reject(error);
                    }
                    
                }
                if(method.toLowerCase() === "delete"){
                    try {
                         if(!entitySet.includes("(") && !entitySet.includes(")")) throw 'Pass Primary Key'
                        controller.getView().getModel(mainModel).remove(`/${entitySet}`,{
                            success:function(data,response){
                                BusyIndicator.hide();
                                resolve(data,response);
                            },
                            error:function(err){
                                BusyIndicator.hide();
                                reject(err);
                            }
                        })
                    } catch (error) {
                        reject(error);
                    }
                    
                }
                if(method.toLowerCase() === "put"){
                    try {
                        if(!entitySet.includes("(") && !entitySet.includes(")")) throw 'Pass Primary Key'
                        controller.getView().getModel(mainModel).update(`/${entitySet}`,payload,{
                            success:function(data,response){
                                BusyIndicator.hide();
                                resolve(data,response);
                            },
                            error:function(err){
                                BusyIndicator.hide();
                                reject(err);
                            }
                        })
                    } catch (error) {
                        reject(error);
                    }
                   
                }
               
            })

        }
    }
})