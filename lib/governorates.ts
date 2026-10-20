
export const GOVERNORATES = [
  ["cairo", "القاهرة", "Cairo"],
  ["giza", "الجيزة", "Giza"],
  ["alexandria", "الإسكندرية", "Alexandria"],
  ["dakahlia", "الدقهلية", "Dakahlia"],
  ["sharqia", "الشرقية", "Sharqia"],
  ["gharbia", "الغربية", "Gharbia"],
  ["monufia", "المنوفية", "Monufia"],
  ["qalyubia", "القليوبية", "Qalyubia"],
  ["beheira", "البحيرة", "Beheira"],
  ["kafr-el-sheikh", "كفر الشيخ", "Kafr El Sheikh"],
  ["damietta", "دمياط", "Damietta"],
  ["port-said", "بورسعيد", "Port Said"],
  ["ismailia", "الإسماعيلية", "Ismailia"],
  ["suez", "السويس", "Suez"],
  ["fayoum", "الفيوم", "Fayoum"],
  ["beni-suef", "بني سويف", "Beni Suef"],
  ["minya", "المنيا", "Minya"],
  ["assiut", "أسيوط", "Assiut"],
  ["sohag", "سوهاج", "Sohag"],
  ["qena", "قنا", "Qena"],
  ["luxor", "الأقصر", "Luxor"],
  ["aswan", "أسوان", "Aswan"],
  ["red-sea", "البحر الأحمر", "Red Sea"],
  ["new-valley", "الوادي الجديد", "New Valley"],
  ["matrouh", "مطروح", "Matrouh"],
  ["north-sinai", "شمال سيناء", "North Sinai"],
  ["south-sinai", "جنوب سيناء", "South Sinai"],
] as const;

export function getGovernorate(code: string) {
  return GOVERNORATES.find((item) => item[0] === code);
}
