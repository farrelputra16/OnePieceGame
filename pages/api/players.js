import clientPromise from '../../lib/mongodb';

export default async function handler(req, res) {
  const client = await clientPromise;
  const db = client.db("LuffyGame");
  
  // Ambil user lain (kecuali diri sendiri, nanti difilter di frontend atau di sini)
  const players = await db.collection("users")
    .find({}, { projection: { password: 0 } }) // Jangan kirim password ke frontend!
    .sort({ bounty: -1 })
    .limit(20)
    .toArray();

  res.status(200).json(players);
}