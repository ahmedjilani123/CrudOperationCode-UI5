sap.ui.define([
   'sap/ui/core/BusyIndicator'
],function(BusyIndicator){
    "use strict";
    return{
   /**
         * Perform CRUD operations using OData with optional filters and expand parameters.
         * 
         * @param {Object} mainObject - The object containing parameters for the operation.
         * @param {string} mainObject.method - The HTTP method to use (GET, POST, PUT, DELETE).
         * @param {string} mainObject.entitySet - The name of the OData entity set (e.g., "Products").
         * @param {string} [mainObject.mainModel] - The name of the model to be used. If not provided, the default model will be used.
         * @param {sap.ui.core.mvc.Controller} mainObject.controller - The controller that initiates the request.
         * @param {Array<sap.ui.model.Filter>} [mainObject.filters] - An array of filters to be applied for the GET request (optional).
         * @param {string} [mainObject.expand] - The expand parameter for OData, allowing nested entities to be fetched (optional).
         * @param {Object} [mainObject.payload] - The data payload to be used for POST or PUT requests (optional).
         * 
         * @returns {Promise} A Promise that resolves with the operation's response data or rejects with an error.
         * 
         * @example
         * // Example usage for a GET request with filters and expand
         * operationObj.Operation({
         *     method: "get",
         *     entitySet: "Products",
         *     mainModel: "myModel",
         *     controller: this,
         *     filters: [new sap.ui.model.Filter("Category", sap.ui.model.FilterOperator.EQ, "Electronics")],
         *     expand: "Category/Details"
         * });
         * 
         * @example
         * // Example usage for a POST request
         * operationObj.Operation({
         *     method: "post",
         *     entitySet: "Products",
         *     mainModel: "myModel",
         *     controller: this,
         *     payload: {
         *         ProductName: "New Product",
         *         Category: "Electronics"
         *     }
         * });
         */



        Operation:function(mainObject){
            BusyIndicator.show();
            return new Promise((resolve,reject)=>{
                try {
                    if(mainObject === undefined || Object.keys(mainObject).length == 0) throw 'Object is Empty';
                    const {payload,method,entitySet,mainModel,controller,filters, expand}= mainObject;
                    const models = (mainModel?.trim()?.includes("")) ? controller.getView().getModel() : controller.getView().getModel(mainModel);
                    const oDataParams = {};
                    if (filters && Array.isArray(filters) && filters.length > 0) {
                        oDataParams.filters = filters;
                    }
                    if (expand && typeof expand === 'string' && expand.trim() !== "") {
                        oDataParams.urlParameters = {
                            "$expand": expand
                        };
                    }
                    if(method.toLowerCase() === "get"){
                        try {
                            models.read(`/${entitySet}`,{
                                ...oDataParams,
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
                            models.create(`/${entitySet}`,payload,{
                                ...oDataParams,
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
                             models.remove(`/${entitySet}`,{
                                ...oDataParams,
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
                            models.update(`/${entitySet}`,payload,{
                                ...oDataParams,
                                success:function(data,response){
                                    BusyIndicator.hide();
                                    resolve(data,response);
                                },
                                error:function(err){
                                    BusyIndicator.hide();
                                    reject(err);
                                }
                            })
                        } catch (error) {   //optional error
                            reject(error);
                        }
                       
                    }

                } catch (error) {
                    reject(error);
                    BusyIndicator.hide();
                }
               
            })

        }
    }
})