export type LearningItem = {
  id: string;
  phrase: string;
  translation: string;
  pronunciation: string;
};

export type Category = {
  id: string;
  name: string;
  items: LearningItem[];
};

const SAMPLE_DATA = {
  language: "French",
  categories: [
    {
      id: "vocab",
      name: "Vocabulary",
      items: [
        { id: "1", phrase: "Bonjour", translation: "Hello", pronunciation: "bohn-zhoor" },
        { id: "2", phrase: "Merci", translation: "Thank you", pronunciation: "mehr-see" },
      ],
    },
    {
      id: "phrases",
      name: "Common Phrases",
      items: [
        { id: "3", phrase: "Comment ça va?", translation: "How are you?", pronunciation: "koh-mahn sa va" },
      ],
    },
  ] as Category[],
};

export default SAMPLE_DATA;
