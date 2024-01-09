import { PDFDocument, rgb } from "pdf-lib";
import { getWeeklyPeriodsOfMonth } from "./weeks.js";
import { PLATAFORM_ATTENDANT, ATTENDANTS, AUDIO_AND_VIDEO, MICROPHONES } from "../consts/roles.js";

import fontkit from "@pdf-lib/fontkit";
import fs from "fs";

const PATHS = {
  template: "templates/departamentos_2.pdf",
  output: "output/modified.pdf",
  fontBold: "src/fonts/DroidSans-Bold.ttf",
  fontRegular: "src/fonts/DroidSans.ttf",
};

export async function createPdf({ jsonData, weeks, alert }) {
  const template = fs.readFileSync("templates/departamentos.pdf");
  let pdfDoc = await PDFDocument.load(template);
  const pages = pdfDoc.getPages();
  const pdf = pages[0];

  const month = "Fevereiro"

  pdfDoc.registerFontkit(fontkit);

  const { customFontBold, customFontRegular } = await loadFonts(pdfDoc);

  await setMonth({ font: customFontBold, month , pdf });

  const { attendant, plataformAttendant, audioAndVideo, microphones } = await filterByRoles(jsonData);

  await Promise.all([
    addAssign({ assignments: attendant, customFontRegular, customFontBold, headerY: 655, pdf, weeks, alert }),
    addAssign({ assignments: plataformAttendant, customFontRegular, customFontBold, headerY: 485, pdf, weeks, alert }),
    addAssign({ assignments: audioAndVideo, customFontRegular, customFontBold, headerY: 315, pdf, weeks, alert }),
    addAssign({ assignments: microphones, customFontRegular, customFontBold, headerY: 145, pdf, weeks, alert }),
  ]);

  const pdfBytes = await pdfDoc.save();

  fs.writeFileSync(`output/${month}.pdf`, pdfBytes);
}

async function filterByRoles(jsonData) {
  const attendant = jsonData.filter((assign) => {
    return assign.role === ATTENDANTS;
  });

  const plataformAttendant = jsonData.filter((assign) => {
    return assign.role === PLATAFORM_ATTENDANT;
  });

  const audioAndVideo = jsonData.filter((assign) => {
    return assign.role === AUDIO_AND_VIDEO;
  });

  const microphones = jsonData.filter((assign) => {
    return assign.role === MICROPHONES;
  });

  return { attendant, plataformAttendant, audioAndVideo, microphones };
}

async function loadFonts(pdfDoc) {
  const fontBytesBold = fs.readFileSync(PATHS.fontBold);
  const fontBytesRegular = fs.readFileSync(PATHS.fontRegular);
  const customFontBold = await pdfDoc.embedFont(fontBytesBold);
  const customFontRegular = await pdfDoc.embedFont(fontBytesRegular);
  return { customFontBold, customFontRegular };
}

async function setMonth({ month, pdf, font }) {
  const textColor = rgb(0.704, 0.764, 0.864);

  pdf.drawText(month, {
    x: 62,
    y: 750,
    size: 26.9,
    color: textColor,
    font: font,
  });
}

async function addAssign({ pdf, weeks, assignments, customFontRegular, customFontBold, headerY, alert }) {
  // Desenhar cabeçalho "Semana"
  const semanaHeaderX = 170;
  const semanaHeaderText = "Semana";
  pdf.drawText(semanaHeaderText, {
    x: semanaHeaderX,
    y: headerY,
    size: 12.1,
    color: rgb(0.272, 0.396, 0.548),
    font: customFontBold,
  });

  // Calcular a largura do texto do cabeçalho "Semana" para centralizar os números abaixo
  const semanaHeaderWidth = customFontBold.widthOfTextAtSize(semanaHeaderText, 12.1);

  // Desenhar cabeçalho "Responsáveis"
  const responsaveisHeaderX = 372;
  const responsaveisHeaderText = "Responsáveis";
  pdf.drawText(responsaveisHeaderText, {
    x: responsaveisHeaderX,
    y: headerY,
    size: 12.1,
    color: rgb(0.272, 0.396, 0.548),
    font: customFontBold,
  });

  // Calcular a largura do texto do cabeçalho "Responsáveis"
  const responsaveisHeaderWidth = customFontBold.widthOfTextAtSize(responsaveisHeaderText, 12.1);

  // Y inicial para as semanas e responsáveis
  let eixoY = headerY - 20;

  weeks.forEach((week) => {
    // Calcular a largura do texto da semana para centralizar
    const weekWidth = customFontRegular.widthOfTextAtSize(week, 11);
    // Calcular o ponto inicial `x` para centralizar o texto da semana sob o cabeçalho "Semana"
    const weekX = semanaHeaderX + semanaHeaderWidth / 2 - weekWidth / 2;

    pdf.drawText(week, {
      x: weekX, // Centralizado em relação ao cabeçalho "Semana"
      y: eixoY,
      size: 11,
      font: customFontRegular,
    });

    eixoY -= 19;
  });

  // Redefinir Y para os responsáveis
  let pEixoY = headerY - 20;

  assignments.forEach(({ person }) => {
    // Calcular a largura do nome do responsável para centralizar
    const personWidth = customFontRegular.widthOfTextAtSize(person, 11);
    // Calcular o ponto inicial `x` para centralizar o nome sob o cabeçalho "Responsáveis"
    const personX = responsaveisHeaderX + responsaveisHeaderWidth / 2 - personWidth / 2;

    const colorAlert = rgb(0.545, 0, 0);

    const options = {
      x: personX, // Centralizado em relação ao cabeçalho "Responsáveis"
      y: pEixoY,
      size: 11,
      font: customFontRegular,
    };

    if (person === alert)  {
      options.color = colorAlert;
      options.font = customFontBold;
    }

    pdf.drawText(person, options);

    pEixoY -= 19;
  });

  return pdf;
}
