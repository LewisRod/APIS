export const apiKeyMiddleware = (req, res, next) => {
  const key = req.headers["x-api-key"]
  if (!key || key !== process.env.API_KEY) {
    return res.status(401).json({ error: "ponga la api key bien menol" });
  }
  next()
}
