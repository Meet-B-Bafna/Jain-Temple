// frontend/src/utils/certificate.js

// Highest milestone first, so the first match is the best one earned.
export const CERTIFICATE_TIERS = [
  {
    key: "elite",
    threshold: 9,
    title: "Complete Jain Darshan",
    badge: "ELITE",
    heading: "Certificate of Excellence",
    description:
      "for completing the entire Jain Darshan by visiting 9 sacred Jain " +
      "temples of Lonavala with unwavering faith, devotion and reverence.",
  },
  {
    key: "silver",
    threshold: 5,
    title: "Silver Darshan",
    badge: "SILVER",
    heading: "Certificate of Darshan",
    description:
      "for successfully completing the Silver Darshan by visiting 5 sacred " +
      "Jain temples of Lonavala and offering darshan with devotion and humility.",
  },
  {
    key: "bronze",
    threshold: 3,
    title: "Bronze Darshan",
    badge: "BRONZE",
    heading: "Certificate of Darshan",
    description:
      "for successfully completing the Bronze Darshan by visiting 3 sacred " +
      "Jain temples of Lonavala and offering darshan with devotion.",
  },
];

export function getEarnedTier(visitedCount) {
  return (
    CERTIFICATE_TIERS.find((tier) => visitedCount >= tier.threshold) || null
  );
}

/* ---------- Colour themes ---------- */

const THEMES = {
  bronze: {
    bg: [250, 246, 238],
    paper: [254, 251, 245],
    outer: [112, 66, 28],
    accent: [184, 115, 51],
    light: [246, 222, 190],
    title: [51, 36, 22],
    name: [112, 66, 28],
    body: [51, 39, 25],
    muted: [125, 108, 90],
    tint: [70, 38, 14],
    tintOpacity: 0.5,
    mandala: 0.16,
    sealFill: [184, 115, 51],
    sealText: [112, 66, 28],
    sealInner: [254, 251, 245],
    tag: [160, 98, 40],
    blessing: [184, 115, 51],
    arcs: [10],
    doubleFrame: false,
  },
  silver: {
    bg: [243, 245, 249],
    paper: [251, 252, 254],
    outer: [70, 84, 108],
    accent: [128, 142, 166],
    light: [220, 228, 242],
    title: [26, 36, 58],
    name: [44, 66, 112],
    body: [38, 46, 62],
    muted: [108, 117, 132],
    tint: [18, 30, 58],
    tintOpacity: 0.52,
    mandala: 0.2,
    sealFill: [150, 163, 184],
    sealText: [44, 66, 112],
    sealInner: [251, 252, 254],
    tag: [88, 102, 130],
    blessing: [96, 110, 136],
    arcs: [8, 13],
    doubleFrame: true,
  },
  elite: {
    bg: [32, 12, 15],
    paper: [44, 17, 21],
    outer: [214, 172, 84],
    accent: [214, 172, 84],
    light: [250, 228, 168],
    title: [250, 232, 176],
    name: [240, 200, 100],
    body: [244, 232, 208],
    muted: [196, 170, 130],
    tint: [48, 8, 18],
    tintOpacity: 0.45,
    mandala: 0.22,
    sealFill: [222, 180, 90],
    sealText: [96, 52, 16],
    sealInner: [252, 240, 208],
    tag: [214, 172, 84],
    blessing: [214, 172, 84],
    arcs: [8, 13, 18],
    doubleFrame: true,
  },
};

function makeCertificateNumber() {
  const year = new Date().getFullYear();
  const random = Math.random().toString(36).slice(2, 8).toUpperCase();

  return `JD-${year}-${random}`;
}

async function loadImage(src, width, height) {
  try {
    const response = await fetch(src);

    if (!response.ok) return null;

    const blob = await response.blob();
    const objectUrl = URL.createObjectURL(blob);

    try {
      const image = new Image();
      image.src = objectUrl;

      await image.decode();

      const canvas = document.createElement("canvas");
      canvas.width = width * 4;
      canvas.height = height * 4;

      const ctx = canvas.getContext("2d");

      const targetRatio = canvas.width / canvas.height;
      const imageRatio = image.width / image.height;

      let sx = 0;
      let sy = 0;
      let sw = image.width;
      let sh = image.height;

      if (imageRatio > targetRatio) {
        sw = image.height * targetRatio;
        sx = (image.width - sw) / 2;
      } else {
        sh = image.width / targetRatio;
        sy = (image.height - sh) / 2;
      }

      ctx.drawImage(image, sx, sy, sw, sh, 0, 0, canvas.width, canvas.height);

      return canvas.toDataURL("image/jpeg", 0.95);
    } finally {
      URL.revokeObjectURL(objectUrl);
    }
  } catch (error) {
    console.error("Certificate image loading failed:", error);
    return null;
  }
}

/* ---------- Drawing helpers ---------- */

function withOpacity(doc, opacity, draw) {
  doc.saveGraphicsState();
  doc.setGState(new doc.GState({ opacity, "stroke-opacity": opacity }));
  draw();
  doc.restoreGraphicsState();
}

// Letter-spaced text, centred by hand (jsPDF's own centring ignores spacing).
function spacedText(doc, text, centerX, y, charSpace) {
  const width = doc.getTextWidth(text) + charSpace * (text.length - 1);

  doc.text(text, centerX - width / 2, y, { charSpace });

  return width;
}

function drawDiamond(doc, x, y, r) {
  doc.triangle(x, y - r, x + r, y, x, y + r, "F");
  doc.triangle(x, y - r, x - r, y, x, y + r, "F");
}

// Quarter-circle arcs fanning out from a corner.
function drawCornerArcs(doc, x, y, sx, sy, radii) {
  radii.forEach((radius) => {
    let previous = null;

    for (let i = 0; i <= 24; i += 1) {
      const angle = (i / 24) * (Math.PI / 2);
      const point = [
        x + sx * radius * Math.cos(angle),
        y + sy * radius * Math.sin(angle),
      ];

      if (previous) doc.line(previous[0], previous[1], point[0], point[1]);
      previous = point;
    }
  });
}

// Faint mandala-style pattern behind the text.
function drawMandala(doc, cx, cy, theme) {
  withOpacity(doc, theme.mandala, () => {
    doc.setDrawColor(...theme.accent);
    doc.setLineWidth(0.3);

    [18, 28, 38, 50, 62].forEach((radius) => doc.circle(cx, cy, radius));

    for (let i = 0; i < 16; i += 1) {
      const angle = (i * Math.PI * 2) / 16;

      doc.line(
        cx + 18 * Math.cos(angle),
        cy + 18 * Math.sin(angle),
        cx + 62 * Math.cos(angle),
        cy + 62 * Math.sin(angle)
      );
    }

    for (let i = 0; i < 16; i += 1) {
      const angle = (i * Math.PI * 2) / 16 + Math.PI / 16;

      doc.circle(cx + 44 * Math.cos(angle), cy + 44 * Math.sin(angle), 6);
    }
  });
}

function drawBorders(doc, W, H, theme, tierKey) {
  doc.setFillColor(...theme.bg);
  doc.rect(0, 0, W, H, "F");

  doc.setFillColor(...theme.paper);
  doc.rect(11, 11, W - 22, H - 22, "F");

  // Outer border
  doc.setDrawColor(...theme.outer);
  doc.setLineWidth(tierKey === "elite" ? 2 : 1.6);
  doc.rect(7, 7, W - 14, H - 14);

  // Inner border
  doc.setDrawColor(...theme.accent);
  doc.setLineWidth(0.5);
  doc.rect(11, 11, W - 22, H - 22);

  // Extra fine line for silver and elite
  if (theme.doubleFrame) {
    doc.setLineWidth(0.25);
    doc.rect(13.2, 13.2, W - 26.4, H - 26.4);
  }

  // Corner arcs
  doc.setDrawColor(...theme.accent);
  doc.setLineWidth(0.4);

  [
    [11, H - 11, 1, -1],
    [W - 11, H - 11, -1, -1],
  ].forEach(([x, y, sx, sy]) => {
    drawCornerArcs(doc, x, y, sx, sy, theme.arcs);
  });

  // Corner diamonds
  const corners = [
    [7, 7],
    [W - 7, 7],
    [7, H - 7],
    [W - 7, H - 7],
  ];

  doc.setFillColor(...theme.outer);
  corners.forEach(([x, y]) => drawDiamond(doc, x, y, 4.4));

  doc.setFillColor(...theme.paper);
  corners.forEach(([x, y]) => drawDiamond(doc, x, y, 2.6));

  doc.setFillColor(...theme.accent);
  corners.forEach(([x, y]) => drawDiamond(doc, x, y, 1.3));
}

function drawBanner(doc, centerX, palitana, jainFlag, theme) {
  const x = 14;
  const y = 14;
  const w = 269;
  const h = 52;

  if (palitana) {
    doc.addImage(palitana, "JPEG", x, y, w, h);
  } else {
    doc.setFillColor(...theme.outer);
    doc.rect(x, y, w, h, "F");
  }

  withOpacity(doc, palitana ? theme.tintOpacity : 0.3, () => {
    doc.setFillColor(...theme.tint);
    doc.rect(x, y, w, h, "F");
  });

  doc.setDrawColor(...theme.accent);
  doc.setLineWidth(0.8);
  doc.rect(x, y, w, h);

  if (theme.doubleFrame) {
    doc.setLineWidth(0.25);
    doc.rect(x + 1.4, y + 1.4, w - 2.8, h - 2.8);
  }

  doc.setFont("times", "bold");
  doc.setFontSize(27);
  doc.setTextColor(255, 255, 255);
  spacedText(doc, "JAIN DARSHAN", centerX, 38, 3);

  doc.setFontSize(12);
  doc.setTextColor(...theme.light);
  const subWidth = spacedText(doc, "LONAVALA", centerX, 49, 3);

  doc.setDrawColor(...theme.light);
  doc.setLineWidth(0.5);
  doc.line(centerX - subWidth / 2 - 30, 47.5, centerX - subWidth / 2 - 6, 47.5);
  doc.line(centerX + subWidth / 2 + 6, 47.5, centerX + subWidth / 2 + 30, 47.5);

  if (jainFlag) {
    doc.setFillColor(255, 255, 255);
    doc.roundedRect(246, 17, 32, 22, 1.5, 1.5, "F");

    doc.addImage(jainFlag, "JPEG", 248.5, 19.5, 27, 17);

    doc.setDrawColor(...theme.accent);
    doc.setLineWidth(0.7);
    doc.roundedRect(246, 17, 32, 22, 1.5, 1.5, "S");
  }
}

// Pointed star-burst used behind the number on silver and elite seals.
function drawStarBurst(doc, x, y, outer, inner, points) {
  const total = points * 2;

  for (let i = 0; i < total; i += 1) {
    const a1 = (i * Math.PI * 2) / total;
    const a2 = ((i + 1) * Math.PI * 2) / total;
    const r1 = i % 2 === 0 ? outer : inner;
    const r2 = i % 2 === 0 ? inner : outer;

    doc.triangle(
      x,
      y,
      x + r1 * Math.cos(a1),
      y + r1 * Math.sin(a1),
      x + r2 * Math.cos(a2),
      y + r2 * Math.sin(a2),
      "F"
    );
  }
}

// Laurel wreath on both sides of the seal (elite only).
function drawWreath(doc, x, y, radius, theme) {
  doc.setFillColor(...theme.accent);

  for (let side = -1; side <= 1; side += 2) {
    for (let k = 0; k < 11; k += 1) {
      const angle = ((-72 + k * 14.4) * Math.PI) / 180;
      const px = x + side * radius * Math.cos(angle);
      const py = y + radius * Math.sin(angle);

      // Leaf direction follows the circle, tilted outwards
      const tilt = 0.5;
      const dirX = side * (-Math.sin(angle) * Math.cos(tilt) + Math.cos(angle) * Math.sin(tilt));
      const dirY = Math.cos(angle) * Math.cos(tilt) + Math.sin(angle) * Math.sin(tilt);
      const nx = -dirY;
      const ny = dirX;

      const length = 2.7;
      const width = 1.15;

      const tipA = [px + dirX * length, py + dirY * length];
      const tipB = [px - dirX * length, py - dirY * length];
      const sideA = [px + nx * width, py + ny * width];
      const sideB = [px - nx * width, py - ny * width];

      doc.triangle(tipA[0], tipA[1], sideA[0], sideA[1], sideB[0], sideB[1], "F");
      doc.triangle(tipB[0], tipB[1], sideA[0], sideA[1], sideB[0], sideB[1], "F");
    }
  }
}

function drawSeal(doc, x, y, tier, theme) {
  doc.setFillColor(...theme.sealFill);

  if (tier.key === "bronze") {
    for (let i = 0; i < 24; i += 1) {
      const angle = (i * Math.PI * 2) / 24;
      doc.circle(x + 13 * Math.cos(angle), y + 13 * Math.sin(angle), 2, "F");
    }

    doc.circle(x, y, 13, "F");
  } else if (tier.key === "silver") {
    drawStarBurst(doc, x, y, 15, 12.2, 20);
    doc.circle(x, y, 12.5, "F");
  } else {
    drawWreath(doc, x, y, 17.6, theme);
    drawStarBurst(doc, x, y, 16, 12.8, 24);
    doc.circle(x, y, 13.2, "F");
  }

  // Inner disc
  doc.setFillColor(...theme.sealInner);
  doc.circle(x, y, 10.5, "F");

  doc.setDrawColor(...theme.sealText);
  doc.setLineWidth(0.5);
  doc.circle(x, y, 10.5);
  doc.circle(x, y, 9.2);

  doc.setFont("times", "bold");
  doc.setFontSize(20);
  doc.setTextColor(...theme.sealText);
  doc.text(String(tier.threshold), x, y + 2, { align: "center" });

  doc.setFontSize(5.5);
  doc.text("TEMPLES", x, y + 6.8, { align: "center" });
}

/* ---------- Certificate layout ---------- */

export function renderCertificate(doc, { name, tier, palitana, jainFlag }) {
  const theme = THEMES[tier.key];

  const W = 297;
  const H = 210;
  const centerX = W / 2;

  drawBorders(doc, W, H, theme, tier.key);
  drawMandala(doc, centerX, 126, theme);
  drawBanner(doc, centerX, palitana, jainFlag, theme);

  // Title
  doc.setFont("times", "bold");
  doc.setFontSize(34);
  doc.setTextColor(...theme.title);
  doc.text(tier.heading, centerX, 86, { align: "center" });

  // Tier tag
  doc.setFont("times", "bold");
  doc.setFontSize(9.5);
  doc.setTextColor(...theme.tag);
  spacedText(doc, `${tier.badge} ACHIEVEMENT`, centerX, 93.5, 2);

  // Divider
  doc.setDrawColor(...theme.accent);
  doc.setLineWidth(0.7);
  doc.line(88, 99, centerX - 5, 99);
  doc.line(centerX + 5, 99, W - 88, 99);

  doc.setFillColor(...theme.accent);
  drawDiamond(doc, centerX, 99, 2.6);

  // Presented to
  doc.setFont("times", "italic");
  doc.setFontSize(14);
  doc.setTextColor(...theme.muted);
  doc.text("This certificate is proudly presented to", centerX, 109, {
    align: "center",
  });

  // Name (shrinks if long)
  doc.setFont("times", "bolditalic");
  doc.setTextColor(...theme.name);

  let nameSize = 38;
  doc.setFontSize(nameSize);

  while (doc.getTextWidth(name) > 220 && nameSize > 16) {
    nameSize -= 2;
    doc.setFontSize(nameSize);
  }

  doc.text(name, centerX, 126, { align: "center" });

  doc.setDrawColor(...theme.accent);
  doc.setLineWidth(0.5);
  doc.line(70, 132, W - 70, 132);

  // Description
  doc.setFont("times", "normal");
  doc.setFontSize(13);
  doc.setTextColor(...theme.body);

  const lines = doc.splitTextToSize(tier.description, 200);
  doc.text(lines, centerX, 142, { align: "center", lineHeightFactor: 1.5 });

  // Seal
  drawSeal(doc, centerX, tier.key === "elite" ? 170 : 171, tier, theme);

  // Date (left)
  const date = new Date().toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  doc.setDrawColor(...theme.accent);
  doc.setLineWidth(0.4);
  doc.line(35, 179, 100, 179);

  doc.setFont("times", "normal");
  doc.setFontSize(11);
  doc.setTextColor(...theme.body);
  doc.text(date, 67.5, 176, { align: "center" });

  doc.setFontSize(9);
  doc.setTextColor(...theme.muted);
  doc.text("DATE", 67.5, 185, { align: "center" });

  // Certificate number (right)
  doc.line(197, 179, 262, 179);

  doc.setFontSize(11);
  doc.setTextColor(...theme.body);
  doc.text(makeCertificateNumber(), 229.5, 176, { align: "center" });

  doc.setFontSize(9);
  doc.setTextColor(...theme.muted);
  doc.text("CERTIFICATE NUMBER", 229.5, 185, { align: "center" });

  // Blessing
  doc.setFont("times", "italic");
  doc.setFontSize(12);
  doc.setTextColor(...theme.blessing);
  doc.text("Jai Jinendra", centerX, 196.5, { align: "center" });
}

export async function downloadCertificate({ name, tier }) {
  // Loaded only when needed, so it doesn't slow down the first page load.
  const { jsPDF } = await import("jspdf");

  const doc = new jsPDF({
    orientation: "landscape",
    unit: "mm",
    format: "a4",
  });

  const palitana = await loadImage("/palitana.jpg", 269, 52);
  const jainFlag = await loadImage("/jain%20flag.jpg", 27, 17);

  renderCertificate(doc, { name, tier, palitana, jainFlag });

  const safeName = name.replace(/[^A-Za-z0-9]+/g, "-").replace(/^-|-$/g, "");
  doc.save(`Jain-Darshan-Certificate-${safeName}.pdf`);
}