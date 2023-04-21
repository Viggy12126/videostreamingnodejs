
 const ErrorMiddleware=(err,req,res,next)=>{

    err.statuscode=err.statuscode || 500;

    err.message= err.message || "Internal Server Error";

    res.status(err.statuscode).json({
         success: false,
         message : err.message
    })

}

export default ErrorMiddleware;