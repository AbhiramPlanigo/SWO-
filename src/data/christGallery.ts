/**
 * Real Christ University Gallery Assets
 * Sourced directly from official gallery: https://byc.christuniversity.in/gallery/main-campus
 * Covers Bangalore Central / Main Campus festivals, ceremonies, auditoriums, and student activities.
 */

export interface ChristPhoto {
  id: string;
  url: string;
  title: string;
  category: 'cultural' | 'tech' | 'ceremony' | 'academic' | 'music' | 'sports' | 'campus';
  album: string;
}

export const CHRIST_GALLERY_IMAGES = {
  // Cultural Festivals & Highlights
  darpanInauguration: 'https://farm66.staticflickr.com/65535/53890794279_c2e8e2a4bc_b.jpg',
  darpanDance: 'https://farm66.staticflickr.com/65535/53910152524_cc40b846c7_b.jpg',
  darpanSinging: 'https://farm66.staticflickr.com/65535/53909815546_788505c7dd_b.jpg',
  bhashaUtsavEthnicDay: 'https://farm66.staticflickr.com/65535/53178501137_7dd2c25b3f_b.jpg',
  bhashaUtsavProcession: 'https://farm66.staticflickr.com/65535/53178501312_822dcd828a_b.jpg',
  blossomsInauguration: 'https://farm66.staticflickr.com/65535/53589012105_a341a3ffee_b.jpg',
  blossomsProcession: 'https://farm66.staticflickr.com/65535/53587698992_475d56f118_z.jpg',
  streetPlayBlossoms: 'https://farm66.staticflickr.com/65535/55056223906_b575e1435a_b.jpg',
  natakamTheatreDay: 'https://farm66.staticflickr.com/65535/54775448963_3e14379203_b.jpg',

  // Music & Concerts
  agamBandConcert: 'https://farm66.staticflickr.com/65535/53597004938_fffdc77a4c_b.jpg',
  soundCurryFest: 'https://farm66.staticflickr.com/65535/53662408075_e9557b0e6a_b.jpg',
  magnificatChoir: 'https://farm66.staticflickr.com/65535/54979528973_772fec7f07_b.jpg',

  // Conclaves, Talks & Academic
  youthConclave: 'https://farm66.staticflickr.com/65535/53601520593_35b116390a_b.jpg',
  capsInduction: 'https://farm66.staticflickr.com/65535/53882242025_280d4e0cb0_b.jpg',
  aiGuildInauguration: 'https://farm66.staticflickr.com/65535/54209949900_8938a64d67_b.jpg',
  scienceFest: 'https://farm66.staticflickr.com/65535/54003993334_07a4b69d9b_b.jpg',
  bloombergLab: 'https://farm66.staticflickr.com/65535/54216537825_fac5e707f2_b.jpg',

  // Ceremonies & Institutional
  investitureCeremony: 'https://farm66.staticflickr.com/65535/53188337164_f346df7a8f_b.jpg',
  teachersDayCelebration: 'https://farm66.staticflickr.com/65535/54775734305_2bede96c49_b.jpg',
  internationalYogaDay: 'https://farm66.staticflickr.com/65535/53817060514_52fed8e40e_b.jpg',
  funFiestaSports: 'https://farm66.staticflickr.com/65535/53908887357_f8ab876270_b.jpg',

  // People & Portraits (Christ University students & faculty)
  studentLeaderAvatar: 'https://farm66.staticflickr.com/65535/53188337164_f346df7a8f_b.jpg',
  studentCouncilAvatar: 'https://farm66.staticflickr.com/65535/53188337114_6037bba686_b.jpg',
  dignitarySpeakerAvatar: 'https://farm66.staticflickr.com/65535/53600439267_de66a73a92_b.jpg',
  facultyMentorAvatar: 'https://farm66.staticflickr.com/65535/54775630968_3b1b6f2374_b.jpg',
  capsCoordinatorAvatar: 'https://farm66.staticflickr.com/65535/53882241965_c4806b8f4c_b.jpg',
};
