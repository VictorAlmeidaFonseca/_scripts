export const ATTENDANTS = "ATTENDANTS";
export const MICROPHONES = "MICROPHONES";
export const AUDIO_AND_VIDEO = "AUDIO_AND_VIDEO";
export const PLATAFORM_ATTENDANT = "PLATAFORM_ATTENDANT";

export const rolesGroup = {
  full: [ATTENDANTS, MICROPHONES, AUDIO_AND_VIDEO, PLATAFORM_ATTENDANT],
  pg18: [PLATAFORM_ATTENDANT, AUDIO_AND_VIDEO, MICROPHONES],
  standart: [ATTENDANTS, MICROPHONES, PLATAFORM_ATTENDANT],
};

export const personRoles = {
  "Marcos P.": rolesGroup.full,
  "Celson C.": rolesGroup.full,
  "Victor F.": rolesGroup.full,
  "Rafael C.": rolesGroup.standart,
  "Flavio P.": rolesGroup.full,
  "Johnny T.": rolesGroup.full,
  "Gabriel S.": rolesGroup.full,
  "Francisco A.": rolesGroup.full,
  "Jonathan C.": rolesGroup.full,
  "Gleison N.": rolesGroup.full,
  "Richard C.": rolesGroup.full,
  "Jorge S.": rolesGroup.standart,
  "Norbert G.": rolesGroup.standart,
  "Paulo S.": rolesGroup.standart,
  "Paulo C.": rolesGroup.standart,
  "Matheus C.": rolesGroup.standart,
  "Antonio N.": rolesGroup.standart,
  "Richard C.": rolesGroup.pg18,
  "Bryan B." : rolesGroup.pg18
};


export const Person = {
  "Marcos P." : "Marcos P.",
  "Celson C." : "Celson C.",
  "Victor F." : "Victor F.",
  "Rafael C." : "Rafael C.",
  "Flavio P." : "Flavio P.",
  "Johnny T." : "Johnny T.",
  "Gabriel S." : "Gabriel S.",
  "Francisco A." : "Francisco A.",
  "Jonathan C." : "Jonathan C.",
  "Gleison N." : "Gleison N.",
  "Richard C." : "Richard C.",
  "Jorge S." : "Jorge S.",
  "Norbert G." : "Norbert G.",
  "Paulo S." : "Paulo S.",
  "Paulo C." : "Paulo C.",
  "Matheus C." : "Matheus C.",
  "Antonio N." : "Antonio N.",
  "Richard C." : "Richard C.",
  "Bryan B." : "Bryan B.",
};


