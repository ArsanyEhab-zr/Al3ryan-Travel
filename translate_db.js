const SUPABASE_URL = 'https://prkyhfdqqygdszxmvjbo.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBya3loZmRxcXlnZHN6eG12amJvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODcwNTI1ODIsImV4cCI6MjEwMjYyODU4Mn0.5kU1WKPtV-QWMCgxEkCACv_KOpHsjn_01HDp0r_xosI';

const cityTranslations = {
  'الإسكندرية': { en: 'Alexandria', fr: 'Alexandrie', it: 'Alessandria', de: 'Alexandria', ru: 'Александрия' },
  'جنوب سيناء': { en: 'South Sinai', fr: 'Sinaï Sud', it: 'Sinai del Sud', de: 'Süd-Sinai', ru: 'Южный Синай' },
  'سوهاج': { en: 'Sohag', fr: 'Sohag', it: 'Sohag', de: 'Sohag', ru: 'Сохаг' },
  'القاهرة': { en: 'Cairo', fr: 'Le Caire', it: 'Il Cairo', de: 'Kairo', ru: 'Каир' },
  'الفيوم': { en: 'Fayoum', fr: 'Fayoum', it: 'Faiyum', de: 'Fayum', ru: 'Файюм' },
  'أسوان': { en: 'Aswan', fr: 'Assouan', it: 'Assuan', de: 'Assuan', ru: 'Асуан' },
  'الأقصر': { en: 'Luxor', fr: 'Louxor', it: 'Luxor', de: 'Luxor', ru: 'Луксор' },
  'قنا': { en: 'Qena', fr: 'Qena', it: 'Qena', de: 'Qena', ru: 'Кена' },
  'الجيزة': { en: 'Giza', fr: 'Gizeh', it: 'Giza', de: 'Gizeh', ru: 'Гиза' },
  'الوادي الجديد': { en: 'New Valley', fr: 'Nouvelle Vallée', it: 'Nuova Valle', de: 'Neues Tal', ru: 'Новая Долина' },
};

const defaultDesc = {
  ar: "معلم سياحي وتاريخي مميز يستحق الزيارة، يقدم تجربة فريدة لاستكشاف التراث المصري.",
  en: "A distinctive historical and tourist attraction worth visiting, offering a unique experience to explore Egyptian heritage.",
  fr: "Une attraction historique et touristique distinctive qui vaut la peine d'être visitée, offrant une expérience unique pour explorer l'héritage égyptien.",
  it: "Una caratteristica attrazione storica e turistica che vale la pena visitare, offrendo un'esperienza unica per esplorare il patrimonio egiziano.",
  de: "Eine unverwechselbare historische und touristische Attraktion, die einen Besuch wert ist und ein einzigartiges Erlebnis bietet, um das ägyptische Erbe zu erkunden.",
  ru: "Отличительная историческая и туристическая достопримечательность, которую стоит посетить, предлагающая уникальный опыт знакомства с египетским наследием."
};

const nameTranslationsMap = {
  'قلعة قايتباي': { en: 'Citadel of Qaitbay', fr: 'Citadelle de Qaitbay', it: 'Cittadella di Qaitbay', de: 'Zitadelle von Qaitbay', ru: 'Цитадель Кайтбея' },
  'مكتبة الإسكندرية': { en: 'Bibliotheca Alexandrina', fr: 'Bibliotheca Alexandrina', it: 'Biblioteca Alexandrina', de: 'Bibliotheca Alexandrina', ru: 'Библиотека Александрина' },
  'الثقب الأزرق (البلو هول)': { en: 'Blue Hole', fr: 'Trou Bleu', it: 'Blue Hole', de: 'Blue Hole', ru: 'Голубая дыра' },
  'معبد أبيدوس': { en: 'Temple of Abydos', fr: 'Temple d\'Abydos', it: 'Tempio di Abydos', de: 'Tempel von Abydos', ru: 'Храм Абидос' },
  'حديقة الأزهر': { en: 'Al-Azhar Park', fr: 'Parc Al-Azhar', it: 'Parco Al-Azhar', de: 'Al-Azhar Park', ru: 'Парк Аль-Азхар' },
  'المتحف القومي للحضارة': { en: 'National Museum of Egyptian Civilization', fr: 'Musée national de la civilisation égyptienne', it: 'Museo nazionale della civiltà egiziana', de: 'Nationalmuseum der ägyptischen Zivilisation', ru: 'Национальный музей египетской цивилизации' },
  'مجمع الأديان': { en: 'Complex of Religions', fr: 'Complexe des Religions', it: 'Complesso delle Religioni', de: 'Religionskomplex', ru: 'Комплекс Религий' },
  'شلالات وادي الريان': { en: 'Wadi El Rayan Waterfalls', fr: 'Cascades de Wadi El Rayan', it: 'Cascate di Wadi El Rayan', de: 'Wadi El Rayan Wasserfälle', ru: 'Водопады Вади-эль-Райян' },
  'متحف النوبة': { en: 'Nubian Museum', fr: 'Musée de la Nubie', it: 'Museo Nubiano', de: 'Nubisches Museum', ru: 'Нубийский музей' },
  'مقابر كوم الشقافة': { en: 'Catacombs of Kom El Shoqafa', fr: 'Catacombes de Kom El Shoqafa', it: 'Catacombe di Kom El Shoqafa', de: 'Katakomben von Kom el-Schuqafa', ru: 'Катакомбы Ком-эль-Шукафа' },
  'كوبري ستانلي': { en: 'Stanley Bridge', fr: 'Pont Stanley', it: 'Ponte Stanley', de: 'Stanley-Brücke', ru: 'Мост Стэнли' },
  'قصر المنتزه': { en: 'Montaza Palace', fr: 'Palais de Montaza', it: 'Palazzo Montaza', de: 'Montaza Palast', ru: 'Дворец Монтаза' },
  'السد العالي': { en: 'Aswan High Dam', fr: 'Haut barrage d\'Assouan', it: 'Alta Diga di Assuan', de: 'Assuan-Staudamm', ru: 'Асуанская плотина' },
  'عمود السواري': { en: 'Pompey\'s Pillar', fr: 'Pilier de Pompée', it: 'Colonna di Pompeo', de: 'Pompejussäule', ru: 'Колонна Помпея' },
  'قصر البارون إمبان': { en: 'Baron Empain Palace', fr: 'Palais du Baron Empain', it: 'Palazzo del Barone Empain', de: 'Baron-Empain-Palast', ru: 'Дворец барона Эмпена' },
  'تمثالا ممنون': { en: 'Colossi of Memnon', fr: 'Colosses de Memnon', it: 'Colossi di Memnone', de: 'Memnonkolosse', ru: 'Колоссы Мемнона' },
  'معبد دندرة': { en: 'Dendera Temple', fr: 'Temple de Dendérah', it: 'Tempio di Dendera', de: 'Dendera-Tempel', ru: 'Храм Дендеры' },
  'أهرامات دهشور': { en: 'Dahshur Pyramids', fr: 'Pyramides de Dahchour', it: 'Piramidi di Dahshur', de: 'Pyramiden von Dahschur', ru: 'Пирамиды Дахшура' },
  'المسرح الروماني': { en: 'Roman Amphitheatre', fr: 'Amphithéâtre romain', it: 'Anfiteatro romano', de: 'Römisches Amphitheater', ru: 'Римский амфитеатр' },
  'مسجد محمد علي': { en: 'Mosque of Muhammad Ali', fr: 'Mosquée de Méhémet Ali', it: 'Moschea di Muhammad Ali', de: 'Muhammad-Ali-Moschee', ru: 'Мечеть Мухаммеда Али' },
  'جامع الأزهر': { en: 'Al-Azhar Mosque', fr: 'Mosquée Al-Azhar', it: 'Moschea di Al-Azhar', de: 'Al-Azhar-Moschee', ru: 'Мечеть Аль-Азхар' },
  'الكنيسة المعلقة': { en: 'The Hanging Church', fr: 'L\'Église suspendue', it: 'La Chiesa Sospesa', de: 'Die Hängende Kirche', ru: 'Висячая церковь' },
  'برج القاهرة': { en: 'Cairo Tower', fr: 'Tour du Caire', it: 'Torre del Cairo', de: 'Fernsehturm Kairo', ru: 'Каирская телебашня' },
  'قصر عابدين': { en: 'Abdeen Palace', fr: 'Palais d\'Abedin', it: 'Palazzo Abdeen', de: 'Abdeen-Palast', ru: 'Дворец Абдин' },
  'أهرامات الجيزة': { en: 'Giza Pyramids', fr: 'Pyramides de Gizeh', it: 'Piramidi di Giza', de: 'Pyramiden von Gizeh', ru: 'Пирамиды Гизы' },
  'الصحراء البيضاء': { en: 'White Desert', fr: 'Désert Blanc', it: 'Deserto Bianco', de: 'Weiße Wüste', ru: 'Белая пустыня' },
  'أبو الهول': { en: 'Great Sphinx', fr: 'Grand Sphinx', it: 'Grande Sfinge', de: 'Große Sphinx', ru: 'Большой Сфинкс' },
  'هرم سقارة المدرج': { en: 'Step Pyramid of Djoser', fr: 'Pyramide à degrés de Djoser', it: 'Piramide a gradoni di Djoser', de: 'Stufenpyramide des Djoser', ru: 'Ступенчатая пирамида Джосера' },
  'قلعة صلاح الدين الأيوبي': { en: 'Salah El-Din Citadel', fr: 'Citadelle de Saladin', it: 'Cittadella di Saladino', de: 'Zitadelle von Saladin', ru: 'Цитадель Саладина' },
  'المتحف المصري بالتحرير': { en: 'Egyptian Museum in Tahrir', fr: 'Musée égyptien du Caire', it: 'Museo Egizio del Cairo', de: 'Ägyptisches Museum Kairo', ru: 'Египетский музей' },
  'خان الخليلي': { en: 'Khan el-Khalili', fr: 'Khan el-Khalili', it: 'Khan el-Khalili', de: 'Khan el-Khalili', ru: 'Хан эль-Халили' },
  'شارع المعز لدين الله': { en: 'Al-Muizz Street', fr: 'Rue Al-Muizz', it: 'Via Al-Muizz', de: 'Al-Muizz-Straße', ru: 'Улица Аль-Муизз' },
  'محمية وادي الحيتان': { en: 'Wadi El Hitan (Whale Valley)', fr: 'La vallée des baleines (Wadi Al-Hitan)', it: 'Wadi El Hitan (Valle delle Balene)', de: 'Wadi al-Hitan (Tal der Wale)', ru: 'Вади-аль-Хитан (Долина китов)' },
  'المسلة الناقصة': { en: 'Unfinished Obelisk', fr: 'Obélisque inachevé', it: 'Obelisco Incompiuto', de: 'Unvollendeter Obelisk', ru: 'Незаконченный обелиск' },
  'معبد كوم أمبو': { en: 'Temple of Kom Ombo', fr: 'Temple de Kôm Ombo', it: 'Tempio di Kom Ombo', de: 'Tempel von Kom Ombo', ru: 'Храм Ком-Омбо' },
  'معبد إدفو': { en: 'Temple of Edfu', fr: 'Temple d\'Edfou', it: 'Tempio di Edfu', de: 'Tempel von Edfu', ru: 'Храм Эдфу' },
  'جزيرة النباتات': { en: 'Botanical Island', fr: 'Île Kitchener', it: 'Isola Botanica', de: 'Botanischer Insel', ru: 'Ботанический остров' },
  'دير سانت كاترين': { en: 'Saint Catherine\'s Monastery', fr: 'Monastère Sainte-Catherine', it: 'Monastero di Santa Caterina', de: 'Katharinenkloster', ru: 'Монастырь Святой Екатерины' },
  'محمية رأس محمد': { en: 'Ras Muhammad National Park', fr: 'Parc national de Ras Mohammed', it: 'Parco Nazionale di Ras Mohammed', de: 'Ras Mohammed Nationalpark', ru: 'Национальный парк Рас-Мохаммед' },
  'متحف الأقصر': { en: 'Luxor Museum', fr: 'Musée de Louxor', it: 'Museo di Luxor', de: 'Luxor-Museum', ru: 'Луксорский музей' },
  'معبد الكرنك': { en: 'Karnak Temple', fr: 'Temple de Karnak', it: 'Tempio di Karnak', de: 'Karnak-Tempel', ru: 'Карнакский храмовый комплекс' },
  'وادي الملكات': { en: 'Valley of the Queens', fr: 'Vallée des Reines', it: 'Valle delle Regine', de: 'Tal der Königinnen', ru: 'Долина цариц' },
  'معبد الأقصر': { en: 'Luxor Temple', fr: 'Temple de Louxor', it: 'Tempio di Luxor', de: 'Luxor-Tempel', ru: 'Луксорский храм' },
  'وادي الملوك': { en: 'Valley of the Kings', fr: 'Vallée des Rois', it: 'Valle dei Re', de: 'Tal der Könige', ru: 'Долина царей' },
  'معبد حتشبسوت': { en: 'Temple of Hatshepsut', fr: 'Temple d\'Hatchepsout', it: 'Tempio di Hatshepsut', de: 'Totentempel der Hatschepsut', ru: 'Храм Хатшепсут' },
  'بحيرة قارون': { en: 'Lake Qarun', fr: 'Lac Moéris', it: 'Lago Qarun', de: 'Qarunsee', ru: 'Озеро Карун' },
  'المتحف المصري الكبير': { en: 'Grand Egyptian Museum', fr: 'Grand Musée Égyptien', it: 'Grande Museo Egizio', de: 'Großes Ägyptisches Museum', ru: 'Большой Египетский музей' },
  'معبد أبو سمبل': { en: 'Abu Simbel Temples', fr: 'Temples d\'Abou Simbel', it: 'Templi di Abu Simbel', de: 'Abu Simbel Tempel', ru: 'Храмы Абу-Симбел' },
  'معبد فيلة': { en: 'Philae Temple', fr: 'Temple de Philae', it: 'Tempio di File', de: 'Philae-Tempel', ru: 'Храм Филе' },
  'جبل موسى': { en: 'Mount Sinai (Jabal Musa)', fr: 'Mont Sinaï', it: 'Monte Sinai', de: 'Berg Sinai', ru: 'Гора Синай' },
};

async function run() {
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/landmarks?select=id,name,city,description`, {
      headers: {
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`
      }
    });
    
    if (!res.ok) throw new Error(`Fetch failed: ${res.statusText}`);
    const landmarks = await res.json();

    for (const landmark of landmarks) {
      const translations = {
        en: {
          name: nameTranslationsMap[landmark.name]?.en || landmark.name,
          city: cityTranslations[landmark.city]?.en || landmark.city,
          description: defaultDesc.en
        },
        fr: {
          name: nameTranslationsMap[landmark.name]?.fr || landmark.name,
          city: cityTranslations[landmark.city]?.fr || landmark.city,
          description: defaultDesc.fr
        },
        it: {
          name: nameTranslationsMap[landmark.name]?.it || landmark.name,
          city: cityTranslations[landmark.city]?.it || landmark.city,
          description: defaultDesc.it
        },
        de: {
          name: nameTranslationsMap[landmark.name]?.de || landmark.name,
          city: cityTranslations[landmark.city]?.de || landmark.city,
          description: defaultDesc.de
        },
        ru: {
          name: nameTranslationsMap[landmark.name]?.ru || landmark.name,
          city: cityTranslations[landmark.city]?.ru || landmark.city,
          description: defaultDesc.ru
        }
      };
      
      const updateRes = await fetch(`${SUPABASE_URL}/rest/v1/landmarks?id=eq.${landmark.id}`, {
        method: 'PATCH',
        headers: {
          apikey: SUPABASE_ANON_KEY,
          Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ translations })
      });
        
      if (!updateRes.ok) {
        console.error(`Failed to update ${landmark.name}:`, updateRes.statusText);
      } else {
        console.log(`Updated ${landmark.name} successfully.`);
      }
    }
    
    console.log('Finished updating all landmarks.');
  } catch (err) {
    console.error('Error:', err);
  }
}

run();
