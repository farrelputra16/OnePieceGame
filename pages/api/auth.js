import clientPromise from '../../lib/mongodb';
import bcrypt from 'bcryptjs';

export default async function handler(req, res) {
  const client = await clientPromise;
  const db = client.db("LuffyGame");
  
  if (req.method === 'POST') {
    const { username, password, type } = req.body; // type: 'login' atau 'register'

    if (type === 'register') {
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = { 
        username, 
        password: hashedPassword, 
        berries: 1000, 
        bounty: 0, 
        favoriteChar: 'Luffy' 
      };
      await db.collection("users").insertOne(newUser);
      return res.status(200).json({ message: "User Created" });
    } 
    
    if (type === 'login') {
      const user = await db.collection("users").findOne({ username });
      if (user && await bcrypt.compare(password, user.password)) {
        return res.status(200).json({ success: true, user });
      }
      return res.status(401).json({ message: "Invalid Credentials" });
    }
  }
}