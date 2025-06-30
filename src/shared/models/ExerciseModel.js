/**
 * Model untuk menyimpan data latihan/exercise
 */
class ExerciseModel {
  constructor() {
    // Data latihan default berdasarkan kategori yang ada di dashboard
    this.exercises = [
      // Vowel Sounds
      { id: 'vs_001', name: 'Short A Sound (/æ/)', category: 'vowel_sounds', difficulty: 'beginner' },
      { id: 'vs_002', name: 'Long A Sound (/eɪ/)', category: 'vowel_sounds', difficulty: 'beginner' },
      { id: 'vs_003', name: 'Short I Sound (/ɪ/)', category: 'vowel_sounds', difficulty: 'beginner' },
      { id: 'vs_004', name: 'Long I Sound (/aɪ/)', category: 'vowel_sounds', difficulty: 'intermediate' },
      { id: 'vs_005', name: 'Short O Sound (/ɒ/)', category: 'vowel_sounds', difficulty: 'beginner' },
      { id: 'vs_006', name: 'Long O Sound (/oʊ/)', category: 'vowel_sounds', difficulty: 'intermediate' },
      { id: 'vs_007', name: 'Short U Sound (/ʌ/)', category: 'vowel_sounds', difficulty: 'beginner' },
      { id: 'vs_008', name: 'Long U Sound (/uː/)', category: 'vowel_sounds', difficulty: 'intermediate' },
      { id: 'vs_009', name: 'Schwa Sound (/ə/)', category: 'vowel_sounds', difficulty: 'advanced' },
      { id: 'vs_010', name: 'R-controlled Vowels', category: 'vowel_sounds', difficulty: 'advanced' },

      // Consonant Sounds
      { id: 'cs_001', name: 'TH Sound (/θ/)', category: 'consonant_sounds', difficulty: 'intermediate' },
      { id: 'cs_002', name: 'TH Sound (/ð/)', category: 'consonant_sounds', difficulty: 'intermediate' },
      { id: 'cs_003', name: 'R Sound (/r/)', category: 'consonant_sounds', difficulty: 'advanced' },
      { id: 'cs_004', name: 'L Sound (/l/)', category: 'consonant_sounds', difficulty: 'intermediate' },
      { id: 'cs_005', name: 'W Sound (/w/)', category: 'consonant_sounds', difficulty: 'beginner' },
      { id: 'cs_006', name: 'V Sound (/v/)', category: 'consonant_sounds', difficulty: 'beginner' },
      { id: 'cs_007', name: 'F Sound (/f/)', category: 'consonant_sounds', difficulty: 'beginner' },
      { id: 'cs_008', name: 'P and B Sounds', category: 'consonant_sounds', difficulty: 'beginner' },
      { id: 'cs_009', name: 'T and D Sounds', category: 'consonant_sounds', difficulty: 'intermediate' },
      { id: 'cs_010', name: 'K and G Sounds', category: 'consonant_sounds', difficulty: 'intermediate' },

      // Word Stress
      { id: 'ws_001', name: 'Two-syllable Words', category: 'word_stress', difficulty: 'beginner' },
      { id: 'ws_002', name: 'Three-syllable Words', category: 'word_stress', difficulty: 'intermediate' },
      { id: 'ws_003', name: 'Compound Words', category: 'word_stress', difficulty: 'intermediate' },
      { id: 'ws_004', name: 'Prefixes and Suffixes', category: 'word_stress', difficulty: 'advanced' },
      { id: 'ws_005', name: 'Content vs Function Words', category: 'word_stress', difficulty: 'advanced' },

      // Sentence Rhythm
      { id: 'sr_001', name: 'Basic Sentence Stress', category: 'sentence_rhythm', difficulty: 'beginner' },
      { id: 'sr_002', name: 'Stress-timed Rhythm', category: 'sentence_rhythm', difficulty: 'intermediate' },
      { id: 'sr_003', name: 'Weak Forms', category: 'sentence_rhythm', difficulty: 'advanced' },
      { id: 'sr_004', name: 'Linking Words', category: 'sentence_rhythm', difficulty: 'advanced' },
      { id: 'sr_005', name: 'Contractions', category: 'sentence_rhythm', difficulty: 'intermediate' },

      // Intonation
      { id: 'in_001', name: 'Rising Intonation', category: 'intonation', difficulty: 'beginner' },
      { id: 'in_002', name: 'Falling Intonation', category: 'intonation', difficulty: 'beginner' },
      { id: 'in_003', name: 'Question Intonation', category: 'intonation', difficulty: 'intermediate' },
      { id: 'in_004', name: 'Statement Intonation', category: 'intonation', difficulty: 'intermediate' },
      { id: 'in_005', name: 'Emphasis and Focus', category: 'intonation', difficulty: 'advanced' },

      // Connected Speech
      { id: 'csp_001', name: 'Elision', category: 'connected_speech', difficulty: 'advanced' },
      { id: 'csp_002', name: 'Assimilation', category: 'connected_speech', difficulty: 'advanced' },
      { id: 'csp_003', name: 'Intrusion', category: 'connected_speech', difficulty: 'advanced' },
      { id: 'csp_004', name: 'Reduction', category: 'connected_speech', difficulty: 'advanced' },
      { id: 'csp_005', name: 'Linking Sounds', category: 'connected_speech', difficulty: 'intermediate' },

      // Fluency Practice
      { id: 'fp_001', name: 'Tongue Twisters', category: 'fluency_practice', difficulty: 'intermediate' },
      { id: 'fp_002', name: 'Reading Aloud', category: 'fluency_practice', difficulty: 'beginner' },
      { id: 'fp_003', name: 'Conversation Practice', category: 'fluency_practice', difficulty: 'advanced' },
      { id: 'fp_004', name: 'Shadowing Exercise', category: 'fluency_practice', difficulty: 'advanced' },
      { id: 'fp_005', name: 'Speed Reading', category: 'fluency_practice', difficulty: 'intermediate' }
    ];

    this.categories = [
      { id: 'vowel_sounds', name: 'Vowel Sounds', description: 'Latihan bunyi vokal Amerika' },
      { id: 'consonant_sounds', name: 'Consonant Sounds', description: 'Latihan bunyi konsonan Amerika' },
      { id: 'word_stress', name: 'Word Stress', description: 'Latihan penekanan kata' },
      { id: 'sentence_rhythm', name: 'Sentence Rhythm', description: 'Latihan irama kalimat' },
      { id: 'intonation', name: 'Intonation', description: 'Latihan intonasi' },
      { id: 'connected_speech', name: 'Connected Speech', description: 'Latihan ucapan terhubung' },
      { id: 'fluency_practice', name: 'Fluency Practice', description: 'Latihan kelancaran berbicara' }
    ];
  }

  getAllExercises() {
    return this.exercises;
  }

  getExerciseById(id) {
    return this.exercises.find(exercise => exercise.id === id);
  }

  getExercisesByCategory(categoryId) {
    return this.exercises.filter(exercise => exercise.category === categoryId);
  }

  getExercisesByDifficulty(difficulty) {
    return this.exercises.filter(exercise => exercise.difficulty === difficulty);
  }

  getAllCategories() {
    return this.categories;
  }

  getCategoryById(id) {
    return this.categories.find(category => category.id === id);
  }

  getCategoryByName(name) {
    return this.categories.find(category => category.name === name);
  }

  getExerciseCount() {
    return this.exercises.length;
  }

  getCategoryCount() {
    return this.categories.length;
  }

  getExerciseCountByCategory(categoryId) {
    return this.exercises.filter(exercise => exercise.category === categoryId).length;
  }
}

export default ExerciseModel;
