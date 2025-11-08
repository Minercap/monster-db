module.exports = async function handler(req, res) {
  try {
    return res.status(200).json({ ok: true, time: new Date().toISOString() });
  } catch (err) {
    return res.status(500).json({ ok: false, error: err.message });
  }
};
