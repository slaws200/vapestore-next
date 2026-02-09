import { NextResponse } from "next/server";

const BOT_TOKEN = process.env.BOT_TOKEN!;
const CHAT_ID = process.env.ADMIN_CHAT_ID!; // куда слать заказы

/** Тело вебхука: продукт + id и username пользователя Telegram */
interface OrderWebhookBody {
  id: string; // telegram user id
  username?: string;
  name: string;
  price: number;
  [key: string]: unknown;
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as OrderWebhookBody;
    const { id, username, name, price } = body;

    const message = `Привет! В приложении оформили заказ ${name} на сумму ${price} рублей. ID пользователя: ${id}.${
      username ? " Пользователь: @" + username : ""
    }`;

    await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chat_id: CHAT_ID,
        text: message,
      }),
    });

    return NextResponse.json({
      success: true,
      message: "Заказ успешно оформлен!",
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      {
        success: false,
        message: "Произошла ошибка при оформлении заказа",
      },
      { status: 500 }
    );
  }
}
