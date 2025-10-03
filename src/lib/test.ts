/**
 * Обновляет информацию о визите пользователя
 * @param {Object} userData - Данные пользователя
 * @param {string} userData.userId - UUID пользователя
 * @param {string} userData.userName - Имя пользователя
 * @param {string} userData.userFullName - Полное имя пользователя
 * @returns {Promise<Object>} Результат операции
 */

import { supabase } from "../utils/supabase/client";

interface userData {
  userId: string;
  userName: string;
  userFullName: string;
}

/**
 * Альтернативная функция без использования хранимой функции
 * @param {Object} userData - Данные пользователя
 */
export async function updateUserVisitDirect(userData: userData) {
  try {
    const { userId, userName, userFullName } = userData;

    if (!userId) {
      throw new Error("userId является обязательным полем");
    }

    // Сначала проверяем существующую запись
    const { data: existingUser } = await supabase
      .from("users_activity")
      .select("visits_count")
      .eq("user_id", userId)
      .single();

    if (existingUser) {
      // Обновляем существующую запись
      const { data, error } = await supabase
        .from("users_activity")
        .update({
          user_name: userName,
          user_full_name: userFullName,
          last_visit_at: new Date().toISOString(),
          visits_count: existingUser.visits_count + 1,
          updated_at: new Date().toISOString(),
        })
        .eq("user_id", userId)
        .select();

      if (error) throw error;
      return { success: true, data };
    } else {
      // Создаем новую запись
      const { data, error } = await supabase
        .from("users_activity")
        .insert({
          user_id: userId,
          user_name: userName,
          user_full_name: userFullName,
          last_visit_at: new Date().toISOString(),
          visits_count: 1,
        })
        .select();

      if (error) throw error;
      return { success: true, data };
    }
  } catch (error) {
    console.error("Ошибка при обновлении визита пользователя:", error);
    return { success: false, error: error.message };
  }
}

/**
 * Получение статистики пользователя
 * @param {string} userId - UUID пользователя
 */
export async function getUserActivity(userId: string) {
  try {
    const { data, error } = await supabase
      .from("users_activity")
      .select("*")
      .eq("user_id", userId)
      .single();

    if (error && error.code !== "PGRST116") throw error; // PGRST116 - no rows returned

    return { success: true, data };
  } catch (error) {
    console.error("Ошибка при получении статистики пользователя:", error);
    return { success: false, error: error.message };
  }
}
