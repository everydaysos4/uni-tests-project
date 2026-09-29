import { readFile } from 'node:fs/promises';
import { platform, arch } from 'node:os';
import { UserDirectory } from '../src/pages/users/model/user-directory.js';

const database = JSON.parse(await readFile(new URL('../db.json', import.meta.url), 'utf8'));

const enlarge = (users, copies) =>
  Array.from({ length: copies }, (_, copyIndex) =>
    users.map((user) => ({ ...user, id: `${copyIndex}-${user.id}` })),
  ).flat();

const measure = (label, users, iterations) => {
  const directory = new UserDirectory(users);

  for (let index = 0; index < 5; index += 1) {
    directory.find('a', 'username', index % 2 === 0 ? 'asc' : 'desc');
  }

  const startedAt = performance.now();
  for (let index = 0; index < iterations; index += 1) {
    directory.find('a', 'username', index % 2 === 0 ? 'asc' : 'desc');
  }
  const duration = performance.now() - startedAt;

  console.log(
    `${label}: ${users.length} records, ${iterations} iterations, ${(duration / iterations).toFixed(3)} ms/op`,
  );
};

console.log(`Node ${process.version}, ${platform()} ${arch()}`);
measure('Current dataset', database.users, 1_000);
measure('Large dataset', enlarge(database.users, 1_000), 20);
