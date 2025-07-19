const jwt = require('jsonwebtoken')
const VerifyAdmin = (req,res,next)=>{

    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token found' });
    }
    const token = authHeader.split(' ')[1];

    if(!token) { return res.status(401).json({message:'No token found'})}
    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        if (decoded.role !== 'admin') { res.status(403).json({message:'Access Denied'})}
        req.user=decoded
        next()
    }
    catch(err)
    { 
        return res.status(400).json({ message: 'Invalid token' });
    }
}
module.exports = VerifyAdmin;