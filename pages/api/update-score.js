import clientPromise from '../../lib/mongodb';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { winnerUsername, loserUsername, matchType } = req.body; // matchType: 'PVE' atau 'PVP'
  const client = await clientPromise;
  const db = client.db("LuffyGame");

  try {
    // --- SKENARIO 1: LAWAN NPC BIASA (PVE) ---
    if (matchType === 'PVE') {
      const reward = 50; // Hadiah kecil farming NPC
      
      await db.collection("users").updateOne(
        { username: winnerUsername },
        { $inc: { berries: reward, wins: 1 } }
      );

      return res.status(200).json({ 
        success: true, 
        message: `Training Complete! You earned ฿${reward}`,
        berriesEarned: reward 
      });
    }

    // --- SKENARIO 2: LAWAN USER ASLI (PVP - STEAL) ---
    if (matchType === 'PVP') {
      // Ambil data user yang kalah untuk hitung persentase curian
      const loser = await db.collection("users").findOne({ username: loserUsername });
      
      if (!loser) return res.status(404).json({ error: "Pirate escaped!" });

      // Hitung Curi 10% dari total Berries lawan (Minimal 100, Maksimal 5000)
      let stealAmount = Math.floor(loser.berries * 0.10);
      if (stealAmount < 100) stealAmount = 100;
      if (stealAmount > 5000) stealAmount = 5000;

      // Pastikan lawan punya berries cukup (tidak sampai minus)
      const finalStolen = Math.min(loser.berries, stealAmount);

      // 1. Transfer Berries ke Pemenang (+ Bounty naik drastis)
      await db.collection("users").updateOne(
        { username: winnerUsername },
        { $inc: { berries: finalStolen, bounty: 500000, wins: 1 } }
      );

      // 2. Kurangi Berries Pecundang
      await db.collection("users").updateOne(
        { username: loserUsername },
        { $inc: { berries: -finalStolen, losses: 1 } }
      );

      return res.status(200).json({ 
        success: true, 
        message: `VICTORY! You stole ฿${finalStolen} from ${loserUsername}!`,
        berriesEarned: finalStolen
      });
    }

  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}