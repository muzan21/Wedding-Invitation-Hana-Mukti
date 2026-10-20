export interface BankAccount {
  id: string;
  bankName: string;
  accountNumber: string;
  accountHolder: string;
  bankLogo?: string;
}

export interface LoveStoryItem {
  id: string;
  title: string;
  year: string;
  story: string;
}

export interface GalleryItem {
  id: string;
  url: string;
  caption?: string;
}

export interface RsvpEntry {
  id: string;
  name: string;
  attendance: 'hadir' | 'tidak' | 'ragu';
  guestCount: number;
  relation?: string;
  message: string;
  createdAt: string;
  likes?: number;
}

export interface InvitationData {
  general: {
    groomNickname: string;
    brideNickname: string;
    title: string;
    eventDateDisplay: string;
    hijriDateDisplay: string;
    monogram: string;
    musicUrl: string;
    musicTitle: string;
    themeColor: string;
  };
  mempelai: {
    groom: {
      name: string;
      nickname: string;
      order: string; // e.g. "Putra Ketiga"
      father: string; // e.g. "Bapak Dityo Afkar Rizal"
      mother: string; // e.g. "Ibu Hj. Nuraini"
      photo: string;
      instagram?: string;
    };
    bride: {
      name: string;
      nickname: string;
      order: string; // e.g. "Putri Pertama"
      father: string; // e.g. "Bapak H. Muhammad Adnan"
      mother: string; // e.g. "Ibu Hj. Arini Zafiya"
      photo: string;
      instagram?: string;
    };
  };
  ayat: {
    bismillah: string;
    salamPembuka: string;
    intro: string;
    arabicText: string;
    translation: string;
    source: string;
  };
  events: {
    akad: {
      title: string;
      date: string;
      hijri: string;
      time: string;
      venue: string;
      address: string;
      coordinates: {
        lat: number;
        lng: number;
      };
      gmapsUrl: string;
    };
    resepsi: {
      title: string;
      date: string;
      hijri: string;
      time: string;
      venue: string;
      address: string;
      coordinates: {
        lat: number;
        lng: number;
      };
      gmapsUrl: string;
      dressCode: string;
      isoTargetDateTime: string; // for countdown
    };
  };
  stories: LoveStoryItem[];
  gallery: GalleryItem[];
  videoUrl?: string;
  gifts: {
    title: string;
    description: string;
    bankAccounts: BankAccount[];
    qrisUrl?: string;
    physicalGift?: {
      recipientName: string;
      phone: string;
      address: string;
    };
  };
  closing: {
    thanksTitle: string;
    thanksMessage: string;
    salamPenutup: string;
    familySignature: string;
  };
  rsvps: RsvpEntry[];
}
