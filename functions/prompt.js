exports.basePrompt = ({ productName }) => `
A high-impact e-commerce thumbnail for a professional power tool,
using the attached product image as the main subject.

Product: ${productName}

The tool is shown clearly, large, and sharp in the foreground,
angled slightly to show depth and design details.

Lighting: dramatic studio lighting,
strong highlights and deep shadows.

Camera: close-up, 3/4 angle,
shallow depth of field, ultra sharp focus.

Style: modern, premium, industrial, professional.

Color grading: high contrast, bold colors.

Aspect ratio: 1:1

Preserve the product exactly as-is.
Do not alter shape, color, logo, or structure.

No text, no watermark, no logo, no human face.
`;

exports.stylePresets = {
  zoom: `
Extreme close-up composition,
product dominates the frame.
`,
  impact: `
Cinematic 3D action-packed advertisement,
dynamic motion and power burst.
`,
  splash: `
Realistic usage context,
splash and particles.
`
};

exports.tonePresets = {
  premium: `
Clean, high-end commercial look.
`,
  aggressive: `
Dark, aggressive industrial energy.
`
};

exports.buildPrompt = (data) => `
${exports.basePrompt(data)}
${exports.stylePresets[data.style]}
${exports.tonePresets[data.tone]}
`;
