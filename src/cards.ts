export type Language = 'grego' | 'hebraico';
export type Kind = 'alphabet' | 'words';
export type Card = {
  id: string; language: Language; kind: Kind; script: string; name: string; transliteration: string; sound: string; reference?: string;
};

const greek = [
  ['Α α','Alfa','a','a'], ['Β β','Beta','b','b'], ['Γ γ','Gama','g','g de gato'], ['Δ δ','Delta','d','d'],
  ['Ε ε','Épsilon','e','é breve'], ['Ζ ζ','Zeta','z','z'], ['Η η','Eta','ē','ê longo, por convenção didática'],
  ['Θ θ','Teta','th','t aspirado, sem equivalente direto'], ['Ι ι','Iota','i','i'], ['Κ κ','Capa','k','c de casa'],
  ['Λ λ','Lambda','l','l'], ['Μ μ','Mi','m','m'], ['Ν ν','Ni','n','n'], ['Ξ ξ','Csi','x','ks'],
  ['Ο ο','Ômicron','o','ó breve'], ['Π π','Pi','p','p'], ['Ρ ρ','Rô','r','r vibrante'], ['Σ σ ς','Sigma','s','s; ς é a forma final'],
  ['Τ τ','Tau','t','t'], ['Υ υ','Ípsilon','y','aproximação do u francês'], ['Φ φ','Fi','ph','p aspirado, sem equivalente direto'],
  ['Χ χ','Qui','ch','k aspirado, sem equivalente direto'], ['Ψ ψ','Psi','ps','ps'], ['Ω ω','Ômega','ō','ó longo, por convenção didática'],
];
const hebrew = [
  ['א','Álef','ʾ','oclusão glotal; pode ser pouco audível'], ['ב','Bet','b / v','b com ponto central; v sem ele'],
  ['ג','Guímel','g','g de gato'], ['ד','Dálet','d','d'], ['ה','Hê','h','h aspirado'], ['ו','Vav','w / v','w em reconstruções; v em uso sefardita/moderno'],
  ['ז','Záin','z','z'], ['ח','Het','ḥ','som gutural; aprox. ch do alemão Bach'], ['ט','Tet','ṭ','t enfático em reconstruções'],
  ['י','Yod','y','i consonantal, como em iate'], ['כ ך','Caf','k / kh','k ou som gutural; ך é a forma final'],
  ['ל','Lâmed','l','l'], ['מ ם','Mem','m','m; ם é a forma final'], ['נ ן','Nun','n','n; ן é a forma final'],
  ['ס','Sámeq','s','s de sapo'], ['ע','Áin','ʿ','som faríngeo em reconstruções; pode ficar pouco audível'],
  ['פ ף','Pê','p / f','p com ponto; f sem ele; ף é a forma final'], ['צ ץ','Tsádi','ṣ','ts em uso moderno; ץ é a forma final'],
  ['ק','Qof','q','k mais posterior em reconstruções'], ['ר','Resh','r','r vibrante em muitas tradições'],
  ['שׁ שׂ','Shin / Sin','š / ś','ch de chuva com ponto à direita; s com ponto à esquerda'], ['ת','Tav','t','t'],
];

const vocab: [Language, string, string, string, string, string][] = [
  ['grego','λόγος','palavra, mensagem','lógos','LÓ-gos','João 1:1 · G3056'],
  ['grego','πίστις','fé, confiança','pístis','PÍS-tis','Hebreus 11:1 · G4102'],
  ['grego','ἀγάπη','amor','agápē','a-GÁ-pê','1 Coríntios 13:13 · G0026'],
  ['grego','χάρις','graça, favor','cháris','KHÁ-ris','Efésios 2:8 · G5485'],
  ['grego','εἰρήνη','paz','eirḗnē','ei-RÊ-nê','João 14:27 · G1515'],
  ['grego','πνεῦμα','espírito, vento','pneûma','PNÊU-ma','João 3:8 · G4151'],
  ['grego','ζωή','vida','zōḗ','zo-Ê','João 1:4 · G2222'],
  ['grego','ἐλπίς','esperança','elpís','el-PÍS','Romanos 5:5 · G1680'],
  ['hebraico','שָׁלוֹם','paz, bem-estar','šālôm','sha-LÔM','Números 6:26 · H7965'],
  ['hebraico','אֶרֶץ','terra, território','ʾereṣ','É-rets','Gênesis 1:1 · H0776'],
  ['hebraico','מֶלֶךְ','rei','meleḵ','MÉ-lekh','1 Samuel 8:5 · H4428'],
  ['hebraico','אוֹר','luz','ʾôr','OR','Gênesis 1:3 · H0216'],
  ['hebraico','תּוֹרָה','instrução, lei','tôrāh','to-RÁ','Salmos 1:2 · H8451'],
  ['hebraico','רוּחַ','vento, espírito','rûaḥ','RÚ-aḥ','Gênesis 1:2 · H7307'],
  ['hebraico','חֶסֶד','bondade, lealdade','ḥeseḏ','KHÉ-sed','Salmos 136:1 · H2617'],
  ['hebraico','יוֹם','dia','yôm','IÔM','Gênesis 1:5 · H3117'],
];
function alphabet(language: Language, rows: string[][]): Card[] {
  return rows.map(([script, name, transliteration, sound], index) => ({ id: language + '-a-' + index,
    language, kind: 'alphabet', script, name, transliteration, sound }));
}

export const cards: Card[] = [
  ...alphabet('grego', greek), ...alphabet('hebraico', hebrew),
  ...vocab.map(([language, script, name, transliteration, sound, reference], index) => ({
    id: language + '-v-' + index, language, kind: 'words' as const, script, name, transliteration, sound, reference,
  })),
];
