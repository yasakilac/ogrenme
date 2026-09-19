import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShieldCheck, 
  X, 
  Plus, 
  Trash2, 
  Download, 
  Upload, 
  Users, 
  BookOpen, 
  Volume2, 
  Check, 
  AlertCircle, 
  Sparkles,
  ExternalLink,
  RotateCcw
} from 'lucide-react';
import { PracticeWord, UserProfile, AlphabetType } from '../types';
import { 
  loadProfiles, 
  saveProfiles, 
  getActiveUserId, 
  setActiveUserId, 
  createProfile, 
  deleteProfile,
  loadCustomWords,
  saveCustomWord,
  deleteCustomWord,
  exportAllAppData,
  importAllAppData,
  resetProgressData
} from '../utils/storage';
import { soundManager } from '../utils/sound';
import { PRACTICE_WORDS } from '../data/wordsData';

interface AdminPanelModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDataChanged: () => void;
}

export const AdminPanelModal: React.FC<AdminPanelModalProps> = ({
  isOpen,
  onClose,
  onDataChanged
}) => {
  const [activeTab, setActiveTab] = useState<'words' | 'users' | 'audio' | 'backup'>('words');

  // Words management state
  const [customWords, setCustomWords] = useState<PracticeWord[]>(loadCustomWords());
  const [isAddingWord, setIsAddingWord] = useState(false);
  const [newWord, setNewWord] = useState<Partial<PracticeWord>>({
    kana: '',
    romaji: '',
    meaningTr: '',
    targetKana: '',
    targetRomaji: '',
    imageUrl: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=500&auto=format&fit=crop&q=80',
    alphabet: 'hiragana',
    category: 'Genel',
    hint: ''
  });

  // Users management state
  const [profiles, setProfiles] = useState<UserProfile[]>(loadProfiles());
  const [activeUserId, setActiveId] = useState<string>(getActiveUserId());
  const [newUserName, setNewUserName] = useState('');
  const [newUserAvatar, setNewUserAvatar] = useState('🌸');
  const [newUserRole, setNewUserRole] = useState<'student' | 'admin'>('student');

  // Audio settings state
  const [currentSpeaker, setCurrentSpeaker] = useState<'0' | '1'>(soundManager.speakerSet);

  // Backup / Import state
  const [importJsonText, setImportJsonText] = useState('');
  const [feedbackMsg, setFeedbackMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  if (!isOpen) return null;

  const showNotice = (type: 'success' | 'error', text: string) => {
    setFeedbackMsg({ type, text });
    setTimeout(() => setFeedbackMsg(null), 4000);
  };

  // --- Handlers for Words ---
  const handleSaveWord = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWord.kana || !newWord.meaningTr || !newWord.romaji) {
      showNotice('error', 'Lütfen en az Japonca kelime, Romaji ve Türkçe anlamı girin.');
      return;
    }

    const wordToSave: PracticeWord = {
      id: `custom_${Date.now()}`,
      kana: newWord.kana.trim(),
      romaji: newWord.romaji.trim(),
      meaningTr: newWord.meaningTr.trim(),
      targetKana: newWord.targetKana?.trim() || newWord.kana.trim().slice(0, 1),
      targetRomaji: newWord.targetRomaji?.trim() || newWord.romaji.trim().slice(0, 1),
      imageUrl: newWord.imageUrl?.trim() || 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=500&auto=format&fit=crop&q=80',
      alphabet: (newWord.alphabet as AlphabetType) || 'hiragana',
      category: newWord.category?.trim() || 'Genel',
      hint: newWord.hint?.trim() || ''
    };

    const updated = saveCustomWord(wordToSave);
    setCustomWords(updated);
    setIsAddingWord(false);
    setNewWord({
      kana: '',
      romaji: '',
      meaningTr: '',
      targetKana: '',
      targetRomaji: '',
      imageUrl: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=500&auto=format&fit=crop&q=80',
      alphabet: 'hiragana',
      category: 'Genel',
      hint: ''
    });
    showNotice('success', 'Yeni kelime başarıyla eklendi!');
    onDataChanged();
  };

  const handleDeleteWord = (id: string) => {
    const updated = deleteCustomWord(id);
    setCustomWords(updated);
    showNotice('success', 'Özel kelime silindi.');
    onDataChanged();
  };

  // --- Handlers for Users ---
  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserName.trim()) return;

    const created = createProfile(newUserName, newUserAvatar, newUserRole);
    setProfiles(loadProfiles());
    setActiveId(created.id);
    setNewUserName('');
    showNotice('success', `${created.name} profili oluşturuldu ve aktif yapıldı!`);
    onDataChanged();
  };

  const handleSelectUser = (id: string) => {
    setActiveUserId(id);
    setActiveId(id);
    showNotice('success', 'Aktif kullanıcı değiştirildi.');
    onDataChanged();
  };

  const handleDeleteUser = (id: string) => {
    deleteProfile(id);
    setProfiles(loadProfiles());
    setActiveId(getActiveUserId());
    showNotice('success', 'Kullanıcı profili silindi.');
    onDataChanged();
  };

  const handleResetUserProgress = (id: string) => {
    resetProgressData(id);
    showNotice('success', 'Kullanıcı ilerlemesi sıfırlandı.');
    onDataChanged();
  };

  // --- Handlers for Audio ---
  const handleSpeakerChange = (speaker: '0' | '1') => {
    soundManager.setSpeaker(speaker);
    setCurrentSpeaker(speaker);
    soundManager.speak('あ');
    showNotice('success', speaker === '0' ? 'Kadın doğal Tokyo sesi seçildi.' : 'Erkek doğal Tokyo sesi seçildi.');
  };

  // --- Handlers for Backup & Restore ---
  const handleExportData = () => {
    const jsonStr = exportAllAppData();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `nihongo_kana_backup_${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(url);
    showNotice('success', 'Tüm uygulama verileri JSON dosyası olarak indirildi.');
  };

  const handleImportData = () => {
    if (!importJsonText.trim()) return;
    const ok = importAllAppData(importJsonText);
    if (ok) {
      setProfiles(loadProfiles());
      setCustomWords(loadCustomWords());
      setActiveId(getActiveUserId());
      setImportJsonText('');
      showNotice('success', 'Veriler başarıyla yüklendi ve güncellendi!');
      onDataChanged();
    } else {
      showNotice('error', 'Geçersiz JSON formatı! Lütfen geçerli bir yedek dosyası yapıştırın.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white border border-[#E6E1D8] rounded-3xl w-full max-w-3xl shadow-2xl overflow-hidden my-auto max-h-[90vh] flex flex-col"
      >
        {/* --- MODAL HEADER --- */}
        <div className="p-4 sm:p-5 bg-[#1F1E1B] text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-rose-600 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-black tracking-tight flex items-center gap-2">
                <span>Yönetici & Geliştirme Paneli</span>
                <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-400/30">
                  Admin
                </span>
              </h2>
              <p className="text-xs text-gray-400">
                Kelime ekleme, kullanıcı kaydı, ses motoru ve veri yönetimi
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* --- NAVIGATION TABS --- */}
        <div className="flex border-b border-[#E6E1D8] bg-[#FAF8F5] px-4 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab('words')}
            className={`px-4 py-3 text-xs sm:text-sm font-bold border-b-2 flex items-center gap-2 transition-all shrink-0 ${
              activeTab === 'words'
                ? 'border-rose-600 text-rose-700 bg-white'
                : 'border-transparent text-[#5C574F] hover:text-[#1F1E1B]'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Kelime & Görsel Yönetimi ({customWords.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('users')}
            className={`px-4 py-3 text-xs sm:text-sm font-bold border-b-2 flex items-center gap-2 transition-all shrink-0 ${
              activeTab === 'users'
                ? 'border-rose-600 text-rose-700 bg-white'
                : 'border-transparent text-[#5C574F] hover:text-[#1F1E1B]'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Kullanıcılar ({profiles.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('audio')}
            className={`px-4 py-3 text-xs sm:text-sm font-bold border-b-2 flex items-center gap-2 transition-all shrink-0 ${
              activeTab === 'audio'
                ? 'border-rose-600 text-rose-700 bg-white'
                : 'border-transparent text-[#5C574F] hover:text-[#1F1E1B]'
            }`}
          >
            <Volume2 className="w-4 h-4" />
            <span>Ses Paketi</span>
          </button>

          <button
            onClick={() => setActiveTab('backup')}
            className={`px-4 py-3 text-xs sm:text-sm font-bold border-b-2 flex items-center gap-2 transition-all shrink-0 ${
              activeTab === 'backup'
                ? 'border-rose-600 text-rose-700 bg-white'
                : 'border-transparent text-[#5C574F] hover:text-[#1F1E1B]'
            }`}
          >
            <Download className="w-4 h-4" />
            <span>Yedekleme & JSON</span>
          </button>
        </div>

        {/* --- FEEDBACK NOTICE --- */}
        {feedbackMsg && (
          <div className={`px-4 py-2 text-xs font-semibold flex items-center gap-2 ${
            feedbackMsg.type === 'success' ? 'bg-emerald-50 text-emerald-800' : 'bg-rose-50 text-rose-800'
          }`}>
            {feedbackMsg.type === 'success' ? <Check className="w-4 h-4 text-emerald-600" /> : <AlertCircle className="w-4 h-4 text-rose-600" />}
            <span>{feedbackMsg.text}</span>
          </div>
        )}

        {/* --- MODAL BODY --- */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-6">
          {/* ======================================================== */}
          {/* TAB 1: KELİME VE GÖRSEL YÖNETİMİ                         */}
          {/* ======================================================== */}
          {activeTab === 'words' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-base text-[#1F1E1B]">
                    Resimli Kelimeler & Kırmızı Harf Alıştırmaları
                  </h3>
                  <p className="text-xs text-[#7A756D]">
                    Buradan yeni kelimeler ekleyebilir, görsel ve kırmızı renkli harf belirleyebilirsiniz.
                  </p>
                </div>
                <button
                  onClick={() => setIsAddingWord(!isAddingWord)}
                  className="px-3 py-2 rounded-xl bg-rose-700 hover:bg-rose-800 text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs"
                >
                  <Plus className="w-4 h-4" />
                  <span>{isAddingWord ? 'İptal' : 'Yeni Kelime Ekle'}</span>
                </button>
              </div>

              {/* Add New Word Form */}
              <AnimatePresence>
                {isAddingWord && (
                  <motion.form
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    onSubmit={handleSaveWord}
                    className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#E6E1D8] space-y-3"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="text-xs font-bold text-[#5C574F] block mb-1">
                          Japonca Kelime *
                        </label>
                        <input
                          type="text"
                          required
                          value={newWord.kana}
                          onChange={(e) => setNewWord({ ...newWord, kana: e.target.value })}
                          placeholder="örn: ねこ"
                          className="w-full px-3 py-2 rounded-xl bg-white border border-[#E6E1D8] text-sm text-[#1F1E1B]"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-bold text-rose-700 block mb-1">
                          Kırmızı Vurgulanacak Harf *
                        </label>
                        <input
                          type="text"
                          value={newWord.targetKana}
                          onChange={(e) => setNewWord({ ...newWord, targetKana: e.target.value })}
                          placeholder="örn: ね"
                          className="w-full px-3 py-2 rounded-xl bg-white border border-rose-300 text-sm font-bold text-rose-700"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-bold text-[#5C574F] block mb-1">
                          Romaji (Okunuş) *
                        </label>
                        <input
                          type="text"
                          required
                          value={newWord.romaji}
                          onChange={(e) => setNewWord({ ...newWord, romaji: e.target.value })}
                          placeholder="örn: neko"
                          className="w-full px-3 py-2 rounded-xl bg-white border border-[#E6E1D8] text-sm font-mono text-[#1F1E1B]"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="text-xs font-bold text-[#5C574F] block mb-1">
                          Türkçe Anlam *
                        </label>
                        <input
                          type="text"
                          required
                          value={newWord.meaningTr}
                          onChange={(e) => setNewWord({ ...newWord, meaningTr: e.target.value })}
                          placeholder="örn: Kedi"
                          className="w-full px-3 py-2 rounded-xl bg-white border border-[#E6E1D8] text-sm text-[#1F1E1B]"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-bold text-[#5C574F] block mb-1">
                          Kategori
                        </label>
                        <input
                          type="text"
                          value={newWord.category}
                          onChange={(e) => setNewWord({ ...newWord, category: e.target.value })}
                          placeholder="Hayvanlar, Doğa, Yiyecek..."
                          className="w-full px-3 py-2 rounded-xl bg-white border border-[#E6E1D8] text-sm text-[#1F1E1B]"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-bold text-[#5C574F] block mb-1">
                          Alfabe
                        </label>
                        <select
                          value={newWord.alphabet}
                          onChange={(e) => setNewWord({ ...newWord, alphabet: e.target.value as AlphabetType })}
                          className="w-full px-3 py-2 rounded-xl bg-white border border-[#E6E1D8] text-sm text-[#1F1E1B]"
                        >
                          <option value="hiragana">Hiragana</option>
                          <option value="katakana">Katakana</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-[#5C574F] block mb-1">
                        Görsel URL (Unsplash veya resim bağlantısı)
                      </label>
                      <input
                        type="url"
                        value={newWord.imageUrl}
                        onChange={(e) => setNewWord({ ...newWord, imageUrl: e.target.value })}
                        placeholder="https://images.unsplash.com/..."
                        className="w-full px-3 py-2 rounded-xl bg-white border border-[#E6E1D8] text-xs text-[#1F1E1B]"
                      />
                    </div>

                    <div className="flex justify-end gap-2 pt-2">
                      <button
                        type="button"
                        onClick={() => setIsAddingWord(false)}
                        className="px-3 py-1.5 rounded-xl border border-[#E6E1D8] text-xs font-semibold text-[#5C574F]"
                      >
                        İptal
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-1.5 rounded-xl bg-rose-700 text-white text-xs font-bold hover:bg-rose-800"
                      >
                        Kaydet
                      </button>
                    </div>
                  </motion.form>
                )}
              </AnimatePresence>

              {/* Custom Words List */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-[#7A756D] uppercase tracking-wider block">
                  Eklenen Özel Kelimeler ({customWords.length})
                </span>

                {customWords.length === 0 ? (
                  <div className="p-4 rounded-xl bg-[#FAF8F5] border border-dashed border-[#E6E1D8] text-center text-xs text-[#7A756D]">
                    Henüz özel kelime eklenmedi. Yukarıdaki "Yeni Kelime Ekle" butonu ile alıştırma havuzunu genişletebilirsiniz.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {customWords.map((word) => (
                      <div
                        key={word.id}
                        className="p-3 rounded-xl bg-white border border-[#E6E1D8] flex items-center justify-between gap-3 shadow-xs"
                      >
                        <div className="flex items-center gap-2.5">
                          <img
                            src={word.imageUrl}
                            alt=""
                            className="w-10 h-10 rounded-lg object-cover"
                          />
                          <div>
                            <span className="text-base font-bold text-[#1F1E1B]">
                              <span className="text-rose-600 font-extrabold">{word.targetKana}</span>
                              {word.kana.slice(word.targetKana.length)}
                            </span>
                            <span className="text-xs text-[#7A756D] font-mono ml-1.5">({word.romaji})</span>
                            <div className="text-xs font-semibold text-emerald-800">
                              {word.meaningTr}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => soundManager.speak(word.kana)}
                            className="w-7 h-7 rounded-lg hover:bg-[#F2EFE9] flex items-center justify-center text-[#5C574F]"
                          >
                            <Volume2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteWord(word.id)}
                            className="w-7 h-7 rounded-lg hover:bg-rose-50 flex items-center justify-center text-rose-600"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Built-in Words Summary */}
              <div className="pt-2">
                <span className="text-xs font-semibold text-[#7A756D]">
                  Sistemde kayıtlı temel görsel kelime sayısı: {PRACTICE_WORDS.length} adet
                </span>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 2: KULLANICI KAYDI VE ÖĞRENCİLER                     */}
          {/* ======================================================== */}
          {activeTab === 'users' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-base text-[#1F1E1B]">
                    Öğrenci & Kullanıcı Profilleri
                  </h3>
                  <p className="text-xs text-[#7A756D]">
                    Birden fazla öğrenci kaydedebilir, ilerlemeleri ayrı ayrı tutabilir ve kullanıcılar arasında geçiş yapabilirsiniz.
                  </p>
                </div>
              </div>

              {/* Create User Form */}
              <form onSubmit={handleCreateUser} className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#E6E1D8] space-y-3">
                <span className="text-xs font-bold text-[#1F1E1B] block">
                  Yeni Öğrenci / Profil Ekle
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-2.5">
                  <div className="sm:col-span-2">
                    <input
                      type="text"
                      required
                      value={newUserName}
                      onChange={(e) => setNewUserName(e.target.value)}
                      placeholder="Öğrenci Adı (örn: Mehmet, Elif)..."
                      className="w-full px-3 py-2 rounded-xl bg-white border border-[#E6E1D8] text-xs text-[#1F1E1B]"
                    />
                  </div>
                  <div>
                    <select
                      value={newUserAvatar}
                      onChange={(e) => setNewUserAvatar(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-white border border-[#E6E1D8] text-xs text-[#1F1E1B]"
                    >
                      <option value="🌸">🌸 Çiçek</option>
                      <option value="🎌">🎌 Bayrak</option>
                      <option value="⛩️">⛩️ Torii</option>
                      <option value="🦊">🦊 Tilki (Kitsune)</option>
                      <option value="🍣">🍣 Suşi</option>
                      <option value="🍙">🍙 Onigiri</option>
                      <option value="🥋">🥋 Karate</option>
                    </select>
                  </div>
                  <div>
                    <button
                      type="submit"
                      className="w-full px-3 py-2 rounded-xl bg-rose-700 hover:bg-rose-800 text-white text-xs font-bold"
                    >
                      Kayıt Et
                    </button>
                  </div>
                </div>
              </form>

              {/* Profiles List */}
              <div className="space-y-2">
                {profiles.map((profile) => {
                  const isActive = profile.id === activeUserId;
                  return (
                    <div
                      key={profile.id}
                      className={`p-3.5 rounded-2xl border flex items-center justify-between gap-3 transition-all ${
                        isActive
                          ? 'bg-rose-50/60 border-rose-300 ring-2 ring-rose-200'
                          : 'bg-white border-[#E6E1D8] hover:border-[#D1CABE]'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{profile.avatar}</span>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-sm text-[#1F1E1B]">
                              {profile.name}
                            </span>
                            {profile.role === 'admin' && (
                              <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-100 text-amber-900">
                                Yönetici
                              </span>
                            )}
                            {isActive && (
                              <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-100 text-emerald-900">
                                Aktif Kullanıcı
                              </span>
                            )}
                          </div>
                          <span className="text-[11px] text-[#7A756D]">
                            Kayıt: {new Date(profile.createdAt).toLocaleDateString('tr-TR')}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {!isActive && (
                          <button
                            type="button"
                            onClick={() => handleSelectUser(profile.id)}
                            className="px-3 py-1.5 rounded-xl bg-[#FAF8F5] hover:bg-rose-600 hover:text-white border border-[#E6E1D8] text-xs font-bold transition-colors"
                          >
                            Seç
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => handleResetUserProgress(profile.id)}
                          className="px-2.5 py-1.5 rounded-xl text-xs text-[#7A756D] hover:text-[#1F1E1B] hover:bg-[#F2EFE9]"
                          title="İlerlemeyi sıfırla"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                        </button>
                        {profiles.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleDeleteUser(profile.id)}
                            className="px-2.5 py-1.5 rounded-xl text-xs text-rose-600 hover:bg-rose-50"
                            title="Profili sil"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 3: SES PAKETİ AYARLARI                               */}
          {/* ======================================================== */}
          {activeTab === 'audio' && (
            <div className="space-y-4">
              <div>
                <h3 className="font-bold text-base text-[#1F1E1B]">
                  Doğal Tokyo İnsan Sesi Paketi
                </h3>
                <p className="text-xs text-[#7A756D]">
                  Uygulama, yapay robotik sesler yerine doğrudan gerçek Tokyo yerlisi insan seslendirmelerini kullanır.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div
                  onClick={() => handleSpeakerChange('0')}
                  className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                    currentSpeaker === '0'
                      ? 'bg-rose-50 border-rose-500 shadow-sm'
                      : 'bg-white border-[#E6E1D8] hover:border-[#D1CABE]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-rose-700">
                      Ses Paketi 1 (Önerilen)
                    </span>
                    {currentSpeaker === '0' && (
                      <span className="w-2.5 h-2.5 rounded-full bg-rose-600" />
                    )}
                  </div>
                  <h4 className="font-black text-base text-[#1F1E1B]">
                    Doğal Kadın Sesi (Tokyo Aksanı)
                  </h4>
                  <p className="text-xs text-[#5C574F] mt-1">
                    Net, yüksek kaliteli ve tüm harfler için gerçek insan stüdyo kaydı.
                  </p>
                  <div className="flex flex-wrap gap-2 mt-3">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        soundManager.speakSingleLetter('あ');
                      }}
                      className="px-2.5 py-1.5 rounded-xl bg-white border border-[#E6E1D8] text-xs font-bold flex items-center gap-1.5 hover:bg-[#F2EFE9]"
                    >
                      <Volume2 className="w-3.5 h-3.5 text-rose-600" />
                      <span>Harf: "あ"</span>
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        soundManager.playWordInNativeVoice('あめ');
                      }}
                      className="px-2.5 py-1.5 rounded-xl bg-rose-100/70 border border-rose-200 text-rose-800 text-xs font-bold flex items-center gap-1.5 hover:bg-rose-100"
                    >
                      <Volume2 className="w-3.5 h-3.5 text-rose-700" />
                      <span>Kelime: "あめ" (Aynı Ses)</span>
                    </button>
                  </div>
                </div>

                <div
                  onClick={() => handleSpeakerChange('1')}
                  className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                    currentSpeaker === '1'
                      ? 'bg-rose-50 border-rose-500 shadow-sm'
                      : 'bg-white border-[#E6E1D8] hover:border-[#D1CABE]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-rose-700">
                      Ses Paketi 2
                    </span>
                    {currentSpeaker === '1' && (
                      <span className="w-2.5 h-2.5 rounded-full bg-rose-600" />
                    )}
                  </div>
                  <h4 className="font-black text-base text-[#1F1E1B]">
                    Doğal Erkek Sesi (Tokyo Aksanı)
                  </h4>
                  <p className="text-xs text-[#5C574F] mt-1">
                    Derin, tok ve net telaffuzlu ikinci stüdyo kayıt paketi.
                  </p>
                  <div className="flex flex-wrap gap-2 mt-3">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        soundManager.speakSingleLetter('か');
                      }}
                      className="px-2.5 py-1.5 rounded-xl bg-white border border-[#E6E1D8] text-xs font-bold flex items-center gap-1.5 hover:bg-[#F2EFE9]"
                    >
                      <Volume2 className="w-3.5 h-3.5 text-rose-600" />
                      <span>Harf: "か"</span>
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        soundManager.playWordInNativeVoice('ねこ');
                      }}
                      className="px-2.5 py-1.5 rounded-xl bg-rose-100/70 border border-rose-200 text-rose-800 text-xs font-bold flex items-center gap-1.5 hover:bg-rose-100"
                    >
                      <Volume2 className="w-3.5 h-3.5 text-rose-700" />
                      <span>Kelime: "ねこ" (Aynı Ses)</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 4: YEDEKLEME VE JSON İÇE / DIŞA AKTARMA             */}
          {/* ======================================================== */}
          {activeTab === 'backup' && (
            <div className="space-y-4">
              <div>
                <h3 className="font-bold text-base text-[#1F1E1B]">
                  Veri Yedekleme & Geliştirme (JSON)
                </h3>
                <p className="text-xs text-[#7A756D]">
                  Tüm özel kelimeleri, öğrenci profillerini ve ilerleme kayıtlarını tek tıkla yedekleyebilir veya başka bir cihaza aktarabilirsiniz.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#E6E1D8] flex flex-col sm:flex-row items-center justify-between gap-3">
                <div>
                  <h4 className="font-bold text-sm text-[#1F1E1B]">
                    Tüm Verileri İndir (JSON Export)
                  </h4>
                  <p className="text-xs text-[#7A756D]">
                    Müfredat, eklediğin kelimeler ve tüm öğrenci başarı skorlarını içeren dosya.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleExportData}
                  className="px-4 py-2 rounded-xl bg-[#1F1E1B] text-white text-xs font-bold flex items-center gap-2 hover:bg-black transition-colors shrink-0"
                >
                  <Download className="w-4 h-4" />
                  <span>Yedeği İndir (.json)</span>
                </button>
              </div>

              <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#E6E1D8] space-y-2.5">
                <h4 className="font-bold text-sm text-[#1F1E1B]">
                  Yedek Yükle veya Geliştirme Kodunu Yapıştır (JSON Import)
                </h4>
                <p className="text-xs text-[#7A756D]">
                  Önceden indirdiğin bir JSON yedek metnini buraya yapıştırıp uygulamayı anında güncelleyebilirsin.
                </p>
                <textarea
                  rows={4}
                  value={importJsonText}
                  onChange={(e) => setImportJsonText(e.target.value)}
                  placeholder="Yedek JSON metnini buraya yapıştırın..."
                  className="w-full p-3 rounded-xl bg-white border border-[#E6E1D8] text-xs font-mono text-[#1F1E1B] focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
                <button
                  type="button"
                  onClick={handleImportData}
                  className="px-4 py-2 rounded-xl bg-rose-700 hover:bg-rose-800 text-white text-xs font-bold flex items-center gap-2 transition-colors"
                >
                  <Upload className="w-4 h-4" />
                  <span>Verileri Uygula & Geri Yükle</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* --- MODAL FOOTER --- */}
        <div className="p-3 sm:p-4 bg-[#FAF8F5] border-t border-[#E6E1D8] flex items-center justify-between text-xs text-[#7A756D]">
          <span>Japonca Kana Platformu v2.0</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-white border border-[#E6E1D8] font-bold text-[#1F1E1B] hover:bg-[#F2EFE9]"
          >
            Kapat
          </button>
        </div>
      </motion.div>
    </div>
  );
};
