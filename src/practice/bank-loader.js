/* Ziptility practice tests: bank fetcher.
   In-memory cache keyed by "<id>-v<version>": bank artifacts are immutable
   (build-practice-banks.mjs never overwrites an existing dist file), so a
   session-lifetime cache by id+version is always safe. */
const cache = new Map();

export async function loadBank(id, version, baseUrl) {
  const key = id + '-v' + version;
  if (cache.has(key)) return cache.get(key);

  const url = baseUrl + key + '.json';
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 10000);
  let res;
  try {
    res = await fetch(url, { signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
  if (!res.ok) throw new Error('practice bank fetch failed: ' + url + ' (' + res.status + ')');
  const bank = await res.json();
  cache.set(key, bank);
  return bank;
}

export function clearCache() {
  cache.clear();
}
