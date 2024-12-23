/**
 * Higher order function which returns a promise which is used to handle asynchronous nature of the function
 */
const asyncHandler=(requestHandler)=>{
    return (req,res,next)=>{
        Promise.resolve(requestHandler(req,res,next)).catch(err=>next(err));
    }
}

module.exports=asyncHandler