import { InvitationData } from '../types/invitation';

import gal1 from '../assets/galeri1.jpg';
import gal2 from '../assets/galeri2.jpg';
import gal3 from '../assets/galeri3.jpg';
import gal4 from '../assets/galeri4.jpg';
import gal5 from '../assets/galeri5.jpg';
import gal6 from '../assets/galeri6.jpg';
import qrisImg from '../assets/qris.jpg'; 
import laguMuktiHana from '../assets/laguMuktiHana.mp3';

export const DEFAULT_INVITATION: InvitationData = {
  general: {
    groomNickname: 'Mukti',
    brideNickname: 'Hana',
    title: 'The Wedding of Mukti & Hana',
    eventDateDisplay: 'Minggu, 01 November 2026',
    hijriDateDisplay: '21 Jumadil Awal 1448 ',
    monogram: 'MH',
    musicUrl: laguMuktiHana,
    musicTitle: 'Mukti & Hana Wedding Song',
    themeColor: '#be7382',
  },
  mempelai: {
    groom: {
      name: 'Mukti Salim',
      nickname: 'Mukti',
      order: 'Putra Pertama',
      father: 'Bapak K.H Khoerudin',
      mother: 'Ibu Siti Jubaedah',
      photo: './src/assets/Foto-Mukti.jpg',
      instagram: 'muktisalim',
    },
    bride: {
      name: 'Hana Rahmawati S.Ak',
      nickname: 'Hana',
      order: 'Putri Pertama',
      father: 'Bapak Cecep Setiadi',
      mother: 'Ibu Nurhayati',
      photo: './src/assets/Foto-Hana.jpg',
      instagram: 'hanaaarahmaa',
    },
  },
  ayat: {
    bismillah: 'بِسْمِ اللهِ الرَّحْمَنِ الرَّحِيْمِ',
    salamPembuka: "Assalamu'alaikum Warahmatullahi Wabarakatuh",
    intro: 'Dengan memohon rahmat dan ridho Allah SWT, kami mengundang Bapak/Ibu/Saudara/i untuk hadir pada acara pernikahan kami:',
    arabicText: 'وَمِنْ اٰيٰتِهٖٓ اَنْ خَلَقَ لَكُمْ مِّنْ اَنْفُسِكُمْ اَزْوَاجًا لِّتَسْكُنُوْٓا اِلَيْهَا وَجَعَلَ بَيْنَكُمْ مَّوَدَّةً وَّرَحْمَةً ۗاِنَّ فِيْ ذٰلِكَ لَاٰيٰتٍ لِّقَوْمٍ يَّتَفَكَّرُوْنَ',
    translation: '“Dan di antara tanda-tanda (kebesaran)-Nya ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri, agar kamu cenderung dan merasa tenteram kepadanya, dan Dia menjadikan di antaramu rasa kasih dan sayang. Sungguh, pada yang demikian itu benar-benar terdapat tanda-tanda (kebesaran Allah) bagi kaum yang berpikir.”',
    source: '(QS. Ar-Rum: 21)',
  },
  events: {
    akad: {
      title: 'Akad Nikah',
      date: 'Minggu, 01 November 2026',
      hijri: '21 Jumadil Awal 1448',
      time: '09:00 WIB',
      venue: 'Gedung Gor Harum',
      address: 'GPQ4+WCQ, Jl. Mad Nur, Jampang, Kec. Ciseeng, Kabupaten Bogor, Jawa Barat 16120',
      coordinates: {
        lat: -6.4601512,
        lng: 106.706113,
      },
      gmapsUrl: 'https://maps.app.goo.gl/RzMPzbsyGaZmEW178',
    },
    resepsi: {
      title: 'Resepsi Pernikahan',
      date: 'Minggu, 01 November 2026',
      hijri: '21 Jumadil Awal 1448',
      time: '10:00 WIB - Selesai',
      venue: 'Gedung Gor Harum',
      address: 'GPQ4+WCQ, Jl. Mad Nur, Jampang, Kec. Ciseeng, Kabupaten Bogor, Jawa Barat 16120',
      coordinates: {
        lat: -6.4601512,
        lng: 106.706113,
      },
      gmapsUrl: 'https://maps.app.goo.gl/RzMPzbsyGaZmEW178',
      dressCode: 'Batik / Pakaian Formal',
      isoTargetDateTime: '2026-11-01T10:00:00',
    },
  },
  stories: [
    {
      id: 'story-1',
      title: 'Takdir yang Mempertemukan',
      year: '2023',
      story: 'Tidak ada kebetulan di dunia ini, yang ada hanyalah skenario terindah yang telah tersusun rapi oleh Sang Maha Kuasa. Di antara luasnya bumi dan jutaan manusia yang berjalan di atasnya, takdir mempertemukan langkah kami dalam sebuah waktu, tempat, dan cara yang sama sekali tidak pernah disangka sebelumnya. Pertemuan sederhana itu perlahan-lahan menumbuhkan rasa, membuka lembaran pertama dari sebuah cerita yang tidak pernah kami rencanakan, namun menjadi salah satu hal paling disyukuri dalam hidup.',
    },
    {
      id: 'story-2',
      title: 'Merajut Sabar & Bertumbuh Bersama',
      year: '2026',
      story: 'Seiring berjalannya waktu, hari-hari yang kami lalui bersama tidak selalu berjalan di atas jalan yang rata. Ada tawa yang dibagikan, ada air mata yang diusap, dan ada banyak perbedaan yang justru mengajarkan kami arti kedewasaan. Hubungan ini tumbuh bukan karena kesempurnaan, melainkan karena keikhlasan untuk saling memahami, saling menguatkan di kala lelah, dan terus belajar untuk saling melengkapi. Di setiap langkahnya, kami menyadari bahwa cinta ini bukan sekadar rasa, melainkan sebuah ikhtiar panjang untuk berjalan beriringan menuju ridha-Nya.',
    },
    {
      id: 'story-3',
      title: 'Ikrar Suci Menuju Halal',
      year: '2026',
      story: 'Setelah melewati berbagai babak perjalanan yang diiringi oleh doa-doa khusyuk di sepertiga malam, keyakinan itu akhirnya menemukan bentuknya. Hari itu, dua hati sepakat untuk mengakhiri keraguan dan menyatukan niat dalam ikatan yang diridhai keluarga serta dibimbing oleh bimbingan-Nya. Sebuah langkah awal yang nyata untuk menapaki lembaran baru, menyempurnakan separuh agama, dan bersiap mengarungi ibadah terpanjang sehidup semati dalam naungan keluarga yang sakinah, mawaddah, warahmah.',
    },
  ],
  gallery: [
    {
      id: 'gal-1',
      url: gal1,
      caption: 'Momen Bahagia 1',
    },
    {
      id: 'gal-2',
      url: gal2,
      caption: 'Momen Bahagia 2',
    },
    {
      id: 'gal-3',
      url: gal3,
      caption: 'Momen Bahagia 3',
    },
    {
      id: 'gal-4',
      url: gal4,
      caption: 'Momen Bahagia 4',
    },
    {
      id: 'gal-5',
      url: gal5,
      caption: 'Momen Bahagia 5',
    },
    {
      id: 'gal-6',
      url: gal6,
      caption: 'Momen Bahagia 6',
    },
  ],
  videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
  gifts: {
    title: 'Kado Digital',
    description: 'Kehadiran dan doa restu Bapak/Ibu/Saudara/i merupakan karunia terindah bagi kami. Namun apabila berkeinginan untuk memberikan tanda kasih secara digital, dapat disalurkan melalui rekening berikut:',
    bankAccounts: [
      {
        id: 'bank-1',
        bankName: 'BCA',
        accountNumber: '5468014283',
        accountHolder: 'Hana Rahmawati',
        bankLogo: 'https://i.simanten.com/media/images/lib/bca.png',
      },
      {
        id: 'bank-2',
        bankName: 'Seabank',
        accountNumber: '901354326849',
        accountHolder: 'Mukti Salim',
        bankLogo: 'https://i.simanten.com/media/images/lib/sea.png',
      },
    ],
    qrisUrl: qrisImg, 
    physicalGift: {
      recipientName: 'Hana Rahmawati',
      phone: '',
      address: 'GPQ4+WCQ, Jl. Mad Nur, Jampang, Kec. Ciseeng, Kabupaten Bogor, Jawa Barat 16120',
    },
  },
  closing: {
    thanksTitle: 'Terima Kasih',
    thanksMessage: 'Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir untuk memberikan doa restu kepada kami.',
    salamPenutup: 'Wassalamu’alaikum Warahmatullahi Wabarakatuh',
    familySignature: 'Turut berbahagia,\nSegenap keluarga besar,\nMukti & Hana',
  },
  rsvps: []
};