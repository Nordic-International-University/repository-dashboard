const statusMessages = new Map<number, string>([
  [200, 'Kirish muvaffaqiyatli ✅'],
  [400, 'So‘rov noto‘g‘ri tuzilgan ❌'],
  [401, 'Login yoki parol noto‘g‘ri 🚫'],
  [403, 'Ruxsat yo‘q 🛑'],
  [404, 'Topilmadi 🔍'],
  [500, 'Ichki server xatoligi ⚠️'],
])

export function getStatusMessage(status: number): string {
  return statusMessages.get(status) ?? `Internet tarmog'iga ulanmagansiz!`
}
