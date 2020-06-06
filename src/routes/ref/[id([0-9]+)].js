export function get (req, res) {
  // req.session.referrer = {
  //   id: req.params.id
  // }

  res.statusCode = 302
  res.setHeader('location', '/')
  return res.end()
}
