const prisma = require("../script.ts");

exports.createLocalUser = async (data) => {
  const user = await prisma.user.create({
    data: data,
  });
  return user;
};

exports.createGoogleUser = async (profile, accessToken, refreshToken) => {
  const user = await prisma.user.create({
    data: {
      email: profile.emails[0].value,
      googleId: profile.id,
      name: profile.displayName,
      profilePicture: profile.photos[0].value,
      googleAccessToken: accessToken,
      googleRefreshToken: refreshToken,
    },
  });
  return user;
};

exports.getEmailExist = async (email) => {
  const existingEmail = await prisma.user.findUnique({
    where: { email: email },
  });
  return existingEmail;
};

exports.getUserIdExist = async (id) => {
  const existingUserId = await prisma.user.findUnique({
    where: {
      id: id,
    },
  });
  return existingUserId;
};

exports.getGoogleUserExist = async (id) => {
  const existingGoogle = await prisma.user.findUnique({
    where: { googleId: id },
  });
  return existingGoogle;
};
// Routes for testing and editing the db
exports.getAllUsers = async () => {
  const allUsers = await prisma.user.findMany();
  return allUsers;
};

exports.deleteUserByEmail = async (email) => {
  const deleteUser = await prisma.user.delete({
    where: {
      email: email,
    },
  });
  return deleteUser;
};
