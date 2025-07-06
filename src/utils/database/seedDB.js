import { getCategories, saveCategories, getPracticesByCategory, savePractices } from './aureaVoiceDB.js';
import CategoryModel from '../../features/category/models/CategoryModel.js';
import { practiceSeedData } from './practiceDataSeed.js';

const CATEGORY_IDS = [
  'inventaris-vokal',
  'inventaris-konsonan',
  'struktur-suku-kata',
  'penekanan-kata',
  'irama-bahasa',
  'skenario-dunia-nyata'
];

export async function seedIfNeeded() {
  // Seed kategori
  const categories = await getCategories();
  if (!categories || categories.length === 0) {
    const categoryModel = new CategoryModel();
    const categoryData = [];
    for (const id of CATEGORY_IDS) {
      await categoryModel.setCurrentCategory(id);
      const data = categoryModel.getCategoryData();
      categoryData.push({
        id: data.id,
        title: data.title,
        // Tambahkan field lain jika perlu
      });
    }
    await saveCategories(categoryData);
  }

  // Seed latihan/practice
  for (const categoryId of CATEGORY_IDS) {
    const practices = await getPracticesByCategory(categoryId);
    if (!practices || practices.length === 0) {
      const items = practiceSeedData.filter(item => item.id_kategori === categoryId);
      if (items.length > 0) {
        await savePractices(items);
      }
    }
  }
}
