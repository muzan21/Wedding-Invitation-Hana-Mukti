import React, { useState } from 'react';
import { Gift, CreditCard, QrCode, Copy, Check, MapPin, X } from 'lucide-react';
import { BankAccount } from '../types/invitation';

interface GiftSectionProps {
  title: string;
  description: string;
  bankAccounts: BankAccount[];
  qrisUrl?: string;
  physicalGift?: {
    recipientName: string;
    phone: string;
    address: string;
  };
}

export const GiftSection: React.FC<GiftSectionProps> = ({
  title,
  description,
  bankAccounts,
  qrisUrl,
  physicalGift,
}) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showQrisModal, setShowQrisModal] = useState(false);
  const [copiedAddress, setCopiedAddress] = useState(false);

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handleCopyAddress = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedAddress(true);
    setTimeout(() => setCopiedAddress(false), 2500);
  };

  return (
    <section id="sec-gifts" className="relative w-full py-12 px-5 overflow-hidden">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-full bg-[#be7382]/15 text-[#be7382] flex items-center justify-center mx-auto mb-3 shadow-inner">
            <Gift className="w-6 h-6" />
          </div>
          <p className="text-[11px] tracking-[0.25em] font-semibold text-[#8a5b6f] uppercase">
            Tanda Kasih
          </p>
          <h2 className="font-serif-title text-3xl font-bold text-[#542d3e] mt-1">
            {title || 'Kado Digital'}
          </h2>
          <div className="w-12 h-0.5 bg-[#be7382]/40 mx-auto mt-2 rounded-full mb-3" />
          <p className="text-xs text-[#6e5866] leading-relaxed max-w-sm mx-auto">
            {description}
          </p>
        </div>

        {/* Bank Account Cards */}
        <div className="space-y-4">
          {bankAccounts.map((bank) => {
            const isCopied = copiedId === bank.id;
            return (
              <div
                key={bank.id}
                className="bg-white/90 backdrop-blur-md rounded-2xl p-5 shadow-md border border-[#eedfe5] relative overflow-hidden"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-[#faf0f4] flex items-center justify-center text-[#be7382]">
                      <CreditCard className="w-4 h-4" />
                    </div>
                    <span className="font-bold text-sm text-[#4e3643]">
                      {bank.bankName}
                    </span>
                  </div>
                  {bank.bankLogo && (
                    <img
                      src={bank.bankLogo}
                      alt={bank.bankName}
                      className="h-6 object-contain"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  )}
                </div>

                <div className="bg-[#faf4f6] rounded-xl p-3 border border-[#ebd6df] mb-3">
                  <p className="text-[10px] uppercase tracking-wider text-[#916b7e]">
                    Nomor Rekening:
                  </p>
                  <p className="font-mono text-base font-bold text-[#4a2635] tracking-wider mt-0.5">
                    {bank.accountNumber}
                  </p>
                  <p className="text-xs text-[#6e5866] mt-0.5">
                    a.n <span className="font-semibold">{bank.accountHolder}</span>
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => handleCopy(bank.id, bank.accountNumber)}
                  className={`w-full py-2.5 px-4 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    isCopied
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'bg-[#be7382] hover:bg-[#a95767] text-white shadow-md shadow-[#be7382]/20'
                  }`}
                >
                  {isCopied ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Nomor Rekening Berhasil Disalin!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span>Salin Nomor Rekening</span>
                    </>
                  )}
                </button>
              </div>
            );
          })}
        </div>

        {/* QRIS Button */}
        {qrisUrl && (
          <div className="mt-5 text-center">
            <button
              type="button"
              onClick={() => setShowQrisModal(true)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white border border-[#eedfe5] text-[#863e52] hover:bg-[#fff7fa] text-xs font-semibold shadow-sm hover:shadow transition-all"
            >
              <QrCode className="w-4 h-4 text-[#be7382]" />
              <span>Lihat QRIS Pembayaran</span>
            </button>
          </div>
        )}

        {/* Physical Gift Mailing Address */}
        {physicalGift && physicalGift.address && (
          <div className="mt-6 bg-white/90 backdrop-blur-md rounded-2xl p-5 shadow-md border border-[#eedfe5]">
            <div className="flex items-center gap-2 mb-2 text-[#562c3f]">
              <MapPin className="w-4 h-4 text-[#be7382]" />
              <h4 className="font-semibold text-xs uppercase tracking-wider">
                Kirim Kado Fisik
              </h4>
            </div>
            <p className="text-xs text-[#4a3742] font-medium leading-relaxed">
              {physicalGift.recipientName}
            </p>
            <p className="text-xs text-[#6e5866] mt-1 leading-relaxed bg-[#faf4f6] p-3 rounded-xl border border-[#ebd6df]">
              {physicalGift.address}
            </p>
            <button
              type="button"
              onClick={() => handleCopyAddress(`${physicalGift.recipientName}\n${physicalGift.phone}\n${physicalGift.address}`)}
              className="mt-3 w-full py-2 px-4 rounded-xl text-xs font-medium bg-white border border-[#ebd6df] text-[#6b5863] hover:text-[#4a3b44] flex items-center justify-center gap-2 hover:bg-[#faf4f6] transition-all cursor-pointer"
            >
              {copiedAddress ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-700 font-semibold">Alamat Berhasil Disalin!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-[#be7382]" />
                  <span>Salin Alamat Lengkap</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>

      {/* QRIS Modal */}
      {showQrisModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-rose-100 text-center relative animate-fade-in">
            <button
              type="button"
              onClick={() => setShowQrisModal(false)}
              className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-10 h-10 rounded-full bg-[#faf0f4] flex items-center justify-center text-[#be7382] mx-auto mb-2">
              <QrCode className="w-5 h-5" />
            </div>

            <h3 className="font-serif-title text-xl font-bold text-[#562c3f]">
              QRIS Amplop Digital
            </h3>
            <p className="text-xs text-[#7d6774] mt-1 mb-4">
              Scan melalui BCA, GoPay, OVO, Dana, ShopeePay, atau Mobile Banking apa saja
            </p>

            <div className="bg-white p-4 rounded-2xl border-2 border-dashed border-[#be7382]/30 shadow-inner inline-block mx-auto mb-4">
              <img
                src={qrisUrl}
                alt="QRIS Code"
                className="w-48 h-48 object-contain mx-auto"
              />
            </div>

            <div className="text-[11px] text-[#866a79] mb-4">
              Atas Nama: <strong className="text-[#4e3643]">MUKTI & HANA WEDDING</strong>
            </div>

            <button
              type="button"
              onClick={() => setShowQrisModal(false)}
              className="w-full py-2.5 rounded-xl bg-[#be7382] text-white text-xs font-semibold hover:bg-[#af5a6a] transition-all"
            >
              Tutup QRIS
            </button>
          </div>
        </div>
      )}
    </section>
  );
};
