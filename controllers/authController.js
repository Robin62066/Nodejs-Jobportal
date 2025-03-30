import userModel from "../model/userModel.js";

export const registerController = async (req, res, next) => {
  //   try {
  const { name, email, password } = req.body;
  //authenticate users
  if (!name) {
    next("Name is require");
  }
  if (!email) {
    next("email is require");
  }
  if (!password) {
    next("Password is require and should be grater than 6");
  }
  //check for existing user
  const existingUser = await userModel.findOne({ email });
  if (existingUser) {
    next("User is already exist");
  }
  const user = await userModel.create({ name, email, password });
  // token
  const token = user.createJWT();
  res.status(201).send({
    success: true,
    message: "User register successfully",
    user: {
      name: user.name,
      lastName: user.lastName,
      email: user.email,
      location: user.location,
    },
    token,
  });

  //   } catch (error) {
  //     console.log(error);
  //     next(error);
  //   }
};
export const loginController = async (req, res, next) => {
  const { email, password } = req.body;
  //validations
  if (!email) {
    next("Please provide email");
  }
  if (!password) {
    next("please provide password");
  }
  //find existing user
  const user = await userModel.findOne({ email });
  if (!user) {
    next("Invoiled username or password");
  }

  //compaire password
  const isMatch = await user.comparePassword(password);

  if (!isMatch) {
    next("Invoiled userrname or password");
  }
  const token = user.createJWT();
  res.status(200).json({
    success: true,
    message: "login successfully",
    user,
    token,
  });
};
