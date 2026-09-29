import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const summaryPath = resolve(projectRoot, 'coverage/coverage-summary.json');
const badgesDirectory = resolve(projectRoot, 'badges');
const summary = JSON.parse(await readFile(summaryPath, 'utf8'));

const metrics = [
  ['lines', 'Lines'],
  ['branches', 'Branches'],
  ['statements', 'Statements'],
];

const colorFor = (percentage) => {
  if (percentage >= 98) return '#4c1';
  if (percentage >= 90) return '#97ca00';
  if (percentage >= 80) return '#dfb317';
  return '#e05d44';
};

const createBadge = (label, percentage) => {
  const value = `${percentage}%`;
  const color = colorFor(percentage);

  return `<svg xmlns="http://www.w3.org/2000/svg" width="150" height="20" role="img" aria-label="${label}: ${value}">
  <title>${label}: ${value}</title>
  <linearGradient id="s" x2="0" y2="100%">
    <stop offset="0" stop-color="#bbb" stop-opacity=".1"/>
    <stop offset="1" stop-opacity=".1"/>
  </linearGradient>
  <clipPath id="r"><rect width="150" height="20" rx="3" fill="#fff"/></clipPath>
  <g clip-path="url(#r)">
    <rect width="90" height="20" fill="#555"/>
    <rect x="90" width="60" height="20" fill="${color}"/>
    <rect width="150" height="20" fill="url(#s)"/>
  </g>
  <g fill="#fff" text-anchor="middle" font-family="Verdana,Geneva,DejaVu Sans,sans-serif" font-size="11">
    <text x="45" y="15" fill="#010101" fill-opacity=".3">${label}</text>
    <text x="45" y="14">${label}</text>
    <text x="120" y="15" fill="#010101" fill-opacity=".3">${value}</text>
    <text x="120" y="14">${value}</text>
  </g>
</svg>
`;
};

await mkdir(badgesDirectory, { recursive: true });

for (const [metric, label] of metrics) {
  const percentage = summary.total[metric].pct;
  await writeFile(
    resolve(badgesDirectory, `coverage-${metric}.svg`),
    createBadge(label, percentage),
  );
}

console.log(`Coverage badges generated from ${summaryPath}`);
