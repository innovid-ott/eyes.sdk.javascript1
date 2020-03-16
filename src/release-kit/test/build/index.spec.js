const assert = require('assert')
const {getPathsToInternalPackages} = require('../../src/build/index')

describe('build', () => {
  describe('getPathsToInternalPackages', () => {
    it('returns a collection of relative file paths for just internal packages', () => {
      const deps = {
        blah: 'portal:../blah/blah',
        blahblah: 'portal:../blah/blahblah',
        externalPkg: '^1.2.3',
      }
      assert.deepStrictEqual(getPathsToInternalPackages(deps), ['../blah/blah', '../blah/blahblah'])
    })
    it('returns a collection of anchored relative paths from nested internal packages', () => {
      const deps = {
        blah: 'portal:../blah',
      }
      assert.deepStrictEqual(getPathsToInternalPackages(deps, '../../src/blahblah'), [
        '../../src/blah',
      ])
    })
  })
})
