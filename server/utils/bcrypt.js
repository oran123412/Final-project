import bcrypt from "bcryptjs";

const generateHash = async (str) => {
  const saltRounds = process.env.SALT_ROUNDS
    ? parseInt(process.env.SALT_ROUNDS, 10)
    : 10;
  const salt = await bcrypt.genSalt(saltRounds);
  return bcrypt.hash(str, salt);
};

const cmpHash = (str, hash) => bcrypt.compare(str, hash);

export { generateHash, cmpHash };
