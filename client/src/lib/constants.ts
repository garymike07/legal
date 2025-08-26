export const LEGAL_CATEGORIES = [
  { value: 'constitutional', label: 'Constitutional Law' },
  { value: 'civil', label: 'Civil Law' },
  { value: 'criminal', label: 'Criminal Law' },
  { value: 'family', label: 'Family Law' },
  { value: 'property', label: 'Property Law' },
  { value: 'business', label: 'Business Law' },
  { value: 'employment', label: 'Employment Law' },
  { value: 'human_rights', label: 'Human Rights' },
];

export const USER_ROLES = [
  { value: 'citizen', label: 'Citizen' },
  { value: 'lawyer', label: 'Lawyer' },
  { value: 'prisoner', label: 'Prisoner' },
  { value: 'admin', label: 'Administrator' },
];

export const CASE_STATUSES = [
  { value: 'active', label: 'Active' },
  { value: 'pending', label: 'Pending' },
  { value: 'closed', label: 'Closed' },
  { value: 'appealed', label: 'Appealed' },
];

export const QUESTION_STATUSES = [
  { value: 'open', label: 'Open' },
  { value: 'answered', label: 'Answered' },
  { value: 'closed', label: 'Closed' },
];

export const EXTERNAL_LINKS = {
  kenyaLaw: "https://new.kenyalaw.org/",
  constitution: "http://parliament.go.ke/sites/default/files/2023-03/The_Constitution_of_Kenya_2010.pdf",
  nlas: "https://www.nlas.go.ke/",
  legislation: "https://new.kenyalaw.org/legislation/",
  judgments: "https://new.kenyalaw.org/judgments/",
};

export const CONSTITUTION_CHAPTERS = [
  {
    id: "chapter-1",
    title: "Chapter 1: Sovereignty of the People and Supremacy of the Constitution",
    articles: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"],
  },
  {
    id: "chapter-2", 
    title: "Chapter 2: The Republic",
    articles: ["11", "12", "13", "14", "15", "16", "17"],
  },
  {
    id: "chapter-3",
    title: "Chapter 3: Citizenship",
    articles: ["18", "19", "20", "21", "22", "23", "24"],
  },
  {
    id: "chapter-4",
    title: "Chapter 4: The Bill of Rights",
    articles: ["25", "26", "27", "28", "29", "30", "31", "32", "33", "34", "35", "36", "37", "38", "39", "40", "41", "42", "43", "44", "45", "46", "47", "48", "49", "50", "51", "52", "53", "54", "55", "56", "57", "58", "59"],
  },
  {
    id: "chapter-5",
    title: "Chapter 5: Land and Environment",
    articles: ["60", "61", "62", "63", "64", "65", "66", "67", "68", "69", "70", "71", "72"],
  },
  {
    id: "chapter-6",
    title: "Chapter 6: Leadership and Integrity",
    articles: ["73", "74", "75", "76", "77", "78", "79", "80", "81", "82", "83", "84"],
  },
  {
    id: "chapter-7",
    title: "Chapter 7: Representation of the People",
    articles: ["85", "86", "87", "88", "89", "90", "91", "92", "93", "94", "95", "96", "97", "98", "99", "100", "101", "102", "103", "104"],
  },
  {
    id: "chapter-8",
    title: "Chapter 8: The Legislature",
    articles: ["105", "106", "107", "108", "109", "110", "111", "112", "113", "114", "115", "116", "117", "118", "119", "120", "121", "122", "123", "124", "125", "126", "127", "128", "129", "130", "131", "132", "133", "134", "135", "136", "137", "138", "139", "140", "141", "142"],
  },
  {
    id: "chapter-9",
    title: "Chapter 9: The Executive",
    articles: ["143", "144", "145", "146", "147", "148", "149", "150", "151", "152", "153", "154", "155", "156", "157", "158", "159", "160", "161", "162", "163", "164", "165", "166", "167", "168", "169", "170", "171", "172", "173", "174", "175", "176", "177", "178", "179", "180", "181"],
  },
  {
    id: "chapter-10",
    title: "Chapter 10: Judiciary",
    articles: ["182", "183", "184", "185", "186", "187", "188", "189", "190", "191", "192", "193", "194", "195", "196", "197", "198", "199", "200", "201", "202", "203", "204", "205", "206", "207", "208", "209", "210", "211", "212", "213", "214", "215", "216", "217", "218", "219", "220", "221", "222", "223", "224", "225", "226", "227", "228", "229", "230", "231", "232", "233", "234", "235", "236", "237", "238", "239", "240"],
  },
];

export const DOCUMENT_TEMPLATES = [
  {
    id: "contract-template",
    name: "Service Contract",
    description: "Standard service agreement template",
    category: "business",
  },
  {
    id: "employment-contract",
    name: "Employment Contract",
    description: "Employment agreement template",
    category: "employment",
  },
  {
    id: "property-agreement",
    name: "Property Sale Agreement",
    description: "Property transfer agreement",
    category: "property",
  },
  {
    id: "family-will",
    name: "Last Will and Testament",
    description: "Will and testament document",
    category: "family",
  },
];
