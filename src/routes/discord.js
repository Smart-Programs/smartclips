export function get (req, res) {
  res.statusCode = 302
  res.setHeader('location', 'https://discord.com/invite/58RTAez')
  return res.end()
}
