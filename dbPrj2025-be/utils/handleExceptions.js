function handleExceptions(status, msg, res) {
  console.log(msg);
  return res.status(status).json({message: msg})
}

module.exports = handleExceptions