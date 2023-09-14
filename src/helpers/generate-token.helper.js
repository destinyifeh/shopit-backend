exports.generateToken = () => {
  let token = Math.random().toString().substring(0, 6);
  console.log(token, "token");
  return token;
};
