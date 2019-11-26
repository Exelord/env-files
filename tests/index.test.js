const envFiles = require('../index');

it('requires env property', () => {
  expect(() => {
    envFiles();
  }).toThrow('ENV-FILES: You need to specify "env" property!');
  
  expect(() => {
    envFiles({ env: 'test'});
  }).not.toThrow('ENV-FILES: You need to specify "env" property!');
});

it('throws an error when env is not available', () => {
  expect(() => {
    envFiles({ env: 'production', dir: 'tests/fixtures/environments' });
  }).toThrow('ENV-FILES: You are trying to use a non-existing environment: "production"\nAvailable environments: empty, full');
  
  expect(() => {
    envFiles({ env: 'empty', dir: 'tests/fixtures/environments' });
  }).not.toThrow('ENV-FILES: You are trying to use a non-existing environment: "production"\nAvailable environments: empty, full');
});

it('uses default config', () => {
  const config = envFiles({ env: 'empty', dir: 'tests/fixtures/environments' });

  expect(config).toEqual({ isIsFromDefaults: true, isShouldBeOverridden: true })
});

it('overrides default config with actual env config', () => {
  const config = envFiles({ env: 'full', dir: 'tests/fixtures/environments' });

  expect(config).toEqual({ isIsFromDefaults: true, isShouldBeOverridden: false, isIsFromConfig: true })
});

it('passes env args', () => {
  const config = envFiles({ env: 'full', dir: 'tests/fixtures/environments' }, 'works');

  expect(config).toEqual({ isIsFromDefaults: true, isShouldBeOverridden: false, isIsFromConfig: true, it: 'works' })
});