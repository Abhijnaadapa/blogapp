const UserAuthor=require("../models/userAuthorModel")
async function userOrAuthor(req, res) {
  // Get user data from request
  const newUserAuthor = req.body;

  // Find user by email
  const userInDb = await UserAuthor.findOne({ email: newUserAuthor.email });

  if (userInDb) {
      // If user is disabled, prevent login
      if (!userInDb.isActive) {
          return res.status(401).send({ message: "Your account has been disabled." });
      }

      // If role matches, allow login
      if (newUserAuthor.role === userInDb.role) {
          return res.send({ message: newUserAuthor.role, payload: userInDb });
      } else {
          return res.status(400).send({ message: "Invalid role selection." });
      }
  }

  // If user does not exist, create a new one
  const newUser = new UserAuthor(newUserAuthor);
  const savedUser = await newUser.save();

  // Check if the newly created user is inactive (edge case)
  if (!savedUser.isActive) {
      return res.status(401).send({ message: "Your account has been disabled." });
  }

  res.status(201).send({ message: savedUser.role, payload: savedUser });
}
module.exports=userOrAuthor