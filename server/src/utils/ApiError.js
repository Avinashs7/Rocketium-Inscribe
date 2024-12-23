/**
 *This class is to wrap up or API error in standard format 
 *Many where writing the error message with the same format is difficult but this is to define the template and send the object of it
 *It extends Error class provided by javascript
 **/

 class ApiError extends Error{
    constructor(statuscode,message="something went wrong",errors=[],stack=""){
        super(message)
        this.statuscode=statuscode
        this.message=message
        this.errors=errors
        if(stack)
            this.stack=stack
        else
            Error.captureStackTrace(this.constructor)
    }
}
module.exports=ApiError