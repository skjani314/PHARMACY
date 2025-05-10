import jwt from "jsonwebtoken";


export const authenticate = async (req, res, next) => {
        const accessToken = req.headers?.authorization?.split(" ")[1];
    if (!accessToken) return res.status(401).json({ message: "Unauthorized" });
    try {
      const decoded = jwt.verify(accessToken, process.env.KEY);
      req.user = decoded; 
      next();
    } catch (err) {
      res.status(401).json({ message: "Invalid Token" });
    }
  };