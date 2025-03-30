//error middleware || simple next function

const errorMiddleware = (err, req, res, next) => {
  console.log(err);
  const defaultError = {
    statusCode : 500,
    message : err
  }
 
  //code missing feild error
  if(err.name ==='validationError'){
    defaultError.statusCode = 400
    defaultError.message = Object.values(err.errors).map(item => item.message).join(',')
  }
  res.status(defaultError.statusCode).json({
    message: defaultError.message
  })

  //duplicate error
  if(err.code && err.code === 11000){
    defaultError.statusCode = 400
    defaultError.message = `${Object.keys(err.keyValue)} feild has to me include`
  }
};
export default errorMiddleware;
