import User from "./User.js";

const createUserMongo = (userData) => {
  let user = new User(userData);
  return user.save();
};

const getAllUsersMongo = () => {
  return User.find({}, { password: 0 });
};

const getUserByIdMongo = (id) => {
  return User.findById(id, { password: 0 });
};

export const updateUserMongo = async (id, updates) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { $set: updates },
      { new: true }
    );
    return updatedUser;
  } catch (error) {
    console.error("Error updating user in MongoDB:", error);
    throw error;
  }
};

export const patchIsBizMongo = async (id, updates) => {
  const { isBusiness, isAdmin } = updates;
  const updateData = {};
  if (typeof isBusiness !== "undefined") {
    updateData.isBusiness = isBusiness;
  }
  if (typeof isAdmin !== "undefined") {
    updateData.isAdmin = isAdmin;
  }
  return User.findByIdAndUpdate(id, { $set: updateData }, { new: true });
};

const deleteUserMongo = (id) => {
  return User.findByIdAndDelete(id);
};

export { createUserMongo, getAllUsersMongo, getUserByIdMongo, deleteUserMongo };
