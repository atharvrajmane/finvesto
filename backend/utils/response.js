function success(res, data = null, message = "", status = 200) {
  const payload = { success: true, message, data };
  return res.status(status).json(payload);
}

module.exports = { success };
