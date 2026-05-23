const { buildPayload } = require('../src/index');

describe('buildPayload', () => {
  const ORIGINAL_ENV = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...ORIGINAL_ENV };
  });

  afterAll(() => {
    process.env = ORIGINAL_ENV;
  });

  test('creates a JSON string with required fields', () => {
    process.env.GITHUB_REPOSITORY = 'owner/repo';
    process.env.GITHUB_SHA = 'deadbeef';
    process.env.GITHUB_ACTOR = 'alice';
    const json = buildPayload();
    const obj = JSON.parse(json);
    expect(obj).toMatchObject({
      repo: 'owner/repo',
      commit: 'deadbeef',
      actor: 'alice',
      ref: 'refs/heads/main'
    });
    expect(new Date(obj.timestamp).toString()).not.toBe('Invalid Date');
  });

  test('uses custom branch when BRANCH is set', () => {
    process.env.BRANCH = 'feature-x';
    const obj = JSON.parse(buildPayload());
    expect(obj.ref).toBe('refs/heads/feature-x');
  });
});
