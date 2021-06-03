const User = require("../models/User");
const Friendship = require("../models/Friendship");

const jwt = require("jsonwebtoken");

exports.signUp = async (req, res) => {
  const { firstName = "", lastName = "", email = "", password = "" } = req.body;
  if (!firstName || !lastName || !email || !password) {
    res.status(400);
    res.json({
      msg: "All fields are required",
    });
    return;
  }

  const user = new User({
    firstName,
    lastName,
    email,
    password,
  });
  try {
    await user.save();
    return res.json({ success: true });
  } catch (err) {
    console.log(err);
    res.status(401);
    return res.json({ success: false, msg: "Unable to save user..." });
  }
};

exports.login = async (req, res) => {
  const { email = "", password = "" } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      console.log("User not found...");
      res.status(404);
      return res.json({ msg: "User not found... " });
    }
    // checks if password matches
    const isMatch = await user.comparePassword(password);
    console.log("isMatch?", isMatch);
    if (!isMatch) {
      console.log("wrong password");
      res.status(400);
      return res.json({ msg: "wrong password " });
    }

    const tokenPayload = { _id: user._id };

    const token = jwt.sign(tokenPayload, process.env.SECRET_KEY || "secret123");
    // remove the field "password"
    delete user.password;
    return res.json({
      success: true,
      token,
      user: user.toJSON(),
    });
  } catch (err) {
    if (err) throw err;
  }
};

exports.checkAuth = async (req, res) => {
  if (!req.cookies || !req.cookies.authToken) {
    console.log(req.cookies);
    console.log("No token sent?");
    return res.json({ isLoggedIn: false });
  }
  try {
    const payload = await jwt.verify(
      req.cookies.authToken,
      process.env.SECRET_KEY || "secret123"
    );
    const userId = payload._id;
    // check if user exists
    const user = await User.findById(userId);

    if (!user) {
      res.json({ isLoggedIn: false });
      throw new Error("User not found");
      return;
    }
    return res.json({
      isLoggedIn: true,
      user,
    });
  } catch (err) {
    if (err) throw err;
    return res.json({ isLoggedIn: false });
  }
};

exports.list = async (req, res) => {
  const { email = "" } = req.query;
  let filter = {};
  if (email) {
    filter = {
      email,
    };
  }
  let users = await User.find(filter);
  if (users) {
    users = users.map((user) => user.toJSON());
  }
  return res.json({
    success: true,
    msg: "Got all users",
    users,
  });
};

exports.sendFriendRequest = async (req, res) => {
  // assumes that you pass a token, else request is rejected
  // for now, I'll let them pass json data
  // containing requestor and recepient

  // this is working
  const { requestor = "", recipient = "" } = req.body;
  if (!requestor || !recipient) {
    res.status(400);
    return res.json({
      success: false,
      msg: "Requestor and recipient fields are required",
    });
  }

  // first checks if both requestor and recipient users actually exist
  const requestorUserObj = await User.findById(requestor);
  const recipientUserObj = await User.findById(recipient);

  if (!requestorUserObj || !recipientUserObj) {
    res.status(404);
    return res.json({
      success: false,
      msg: `Users with IDs ${requestor} and ${recipient} do not exist`,
    });
  }

  // now, adds friendship entries to 'Friendship' collection
  const friendshipA = new Friendship({
    requestor: requestorUserObj,
    recipient: recipientUserObj,
    status: 0,
  });
  const friendshipB = new Friendship({
    requestor: requestorUserObj,
    recipient: recipientUserObj,
    status: 1,
  });

  await friendshipA.save();
  await friendshipB.save();

  // up to here

  const updateUserRequestor = await User.findOneAndUpdate(
    { _id: requestorUserObj },
    { $push: { friends: friendshipA._id } }
  );

  const updateUserRecipient = await User.findOneAndUpdate(
    { _id: recipientUserObj },
    { $push: { friends: friendshipB._id } }
  );

  // yep, working hanggang dito

  return res.json({
    success: true,
    msg: "Friend request sent, currently pending.",
  });
};

exports.acceptFriendRequest = async (req, res) => {
  // assumes that you pass a token, else request is rejected
  // for now, I'll let them pass json data
  // containing requestor and recepient

  // this is working
  const { requestor = "", recipient = "" } = req.body;
  if (!requestor || !recipient) {
    res.status(400);
    return res.json({
      success: false,
      msg: "Requestor and recipient fields are required",
    });
  }

  // first checks if both requestor and recipient users actually exist
  const requestorUserObj = await User.findById(requestor);
  const recipientUserObj = await User.findById(recipient);

  if (!requestorUserObj || !recipientUserObj) {
    res.status(404);
    return res.json({
      success: false,
      msg: `Users with IDs ${requestor} and ${recipient} do not exist`,
    });
  }
  // change status of friend request from pending / requested to friends
  const result = await Friendship.updateMany(
    {
      requestor,
      recipient,
    },
    {
      status: 2,
    }
  );
  return res.json({
    msg: `Friendship accepted`,
    result,
  });
};

exports.rejectFriendRequest = async (req, res) => {
  // assumes that you pass a token, else request is rejected
  // for now, I'll let them pass json data
  // containing requestor and recepient

  // this is working
  const { requestor = "", recipient = "" } = req.body;
  if (!requestor || !recipient) {
    res.status(400);
    return res.json({
      success: false,
      msg: "Requestor and recipient fields are required",
    });
  }

  // first checks if both requestor and recipient users actually exist
  const requestorUserObj = await User.findById(requestor);
  const recipientUserObj = await User.findById(recipient);

  if (!requestorUserObj || !recipientUserObj) {
    res.status(404);
    return res.json({
      success: false,
      msg: `Users with IDs ${requestor} and ${recipient} do not exist`,
    });
  }
  // remove first entry of friendship, we'll need the ID
  const friendshipA = await Friendship.findOneAndRemove({
    requestor,
    recipient,
  });
  // remove second entry of friendship, we'll need the ID
  const friendshipB = await Friendship.findOneAndRemove({
    requestor,
    recipient,
  });

  // now, remove the friend ID from the friends array field
  const updateUserA = await User.findOneAndUpdate(
    { _id: requestorUserObj },
    { $pull: { friends: friendshipA._id } }
  );

  const updateUserB = await User.findOneAndUpdate(
    { _id: recipientUserObj },
    { $pull: { friends: friendshipB._id } }
  );

  return res.json({
    msg: `Friend request rejected`,
  });
};
