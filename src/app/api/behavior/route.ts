import { NextResponse } from 'next/server';
import clientPromise from '@/utils/mongodb-client';

export async function POST(req: Request) {
  try {
    // Trong hàm POST
    console.log("Connecting to:", process.env.MONGODB_URI ? "URI EXISTS" : "URI MISSING");
    const { userId, productId, action } = await req.json();

    // Nếu không có userId (chưa đăng nhập), bỏ qua không thu thập
    if (!userId) return NextResponse.json({ skipped: true });

    const scores: Record<string, number> = {
      view: 1,
      click: 2,
      add_to_cart: 3,
    };

    const points = scores[action] || 0;
    if (points === 0) return NextResponse.json({ error: 'Invalid action' }, { status: 400 });

    const client = await clientPromise;
    const db = client.db("smart-pos"); // Thay tên DB của bạn

    await db.collection("user_events").updateOne(
      { userId, productId },
      { 
        $inc: { score: points },
        $set: { updatedAt: new Date() } 
      },
      { upsert: true } // Nếu chưa có cặp này thì tự tạo mới
    );

    return NextResponse.json({ success: true });
  } catch (e) {
    console.log('Error in behavior API:', e);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}