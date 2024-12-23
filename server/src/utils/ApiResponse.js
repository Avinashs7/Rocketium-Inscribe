/**
 * This class provides the API response in a standard format and can be used in the client side
 * This enables custom format for specific project to follow in all the response object
 */
class ApiResponse {
    constructor(statuscode,data,message="Sucess"){
        this.statuscode=statuscode
        this.data=data
        this.message=message
        this.success=statuscode<400
    }
}

module.exports=ApiResponse