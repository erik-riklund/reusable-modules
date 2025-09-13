// //
// // Created by Erik Riklund (Gopher) 2025
// // <https://github.com/erik-riklund>
// //

// import { it, expect } from 'bun:test'
// import { parseSelector } from '../helpers'

// // ---

// it('should parse a selector with a single label',
//   () =>
//   {
//     const pattern = 'group *';
//     const labels = ['name'];
//     const selector = 'group `foo`';

//     const result = parseSelector(pattern, labels, selector);

//     expect(result).toEqual({ name: 'foo' });
//   }
// );

// it('should parse a selector with a single string value',
//   () =>
//   {
//     const pattern = 'group **';
//     const labels = ['name'];
//     const selector = 'group "foo"';

//     const result = parseSelector(pattern, labels, selector);

//     expect(result).toEqual({ name: 'foo' });
//   }
// );

// it('should parse a selector with a keyword and a single label',
//   () =>
//   {
//     const pattern = 'group {is,is not} *';
//     const labels = ['keyword', 'name'];
//     const selector = 'group is `foo`';

//     const result = parseSelector(pattern, labels, selector);

//     expect(result).toEqual({ keyword: 'is', name: 'foo' });
//   }
// );

// it('should parse a selector with a label and an optional keyword',
//   () =>
//   {
//     const pattern = 'attribute * [is missing]';
//     const labels = ['name', 'keyword'];
//     const selector = 'attribute `foo` is missing';

//     const result = parseSelector(pattern, labels, selector);

//     expect(result).toEqual({ name: 'foo', keyword: 'is missing' });
//   }
// );

// it('should parse a selector with a label and an optional keyword (absence)',
//   () =>
//   {
//     const pattern = 'attribute * [is missing]';
//     const labels = ['name', 'keyword'];
//     const selector = 'attribute `foo`';

//     const result = parseSelector(pattern, labels, selector);

//     expect(result).toEqual({ name: 'foo', keyword: undefined! });
//   }
// );

// it('should parse a selector with an optional label',
//   () =>
//   {
//     const pattern = 'selector *? .. *';
//     const labels = ['modifier', 'name'];
//     const selector = 'selector `foo` .. `bar`';

//     const result = parseSelector(pattern, labels, selector);

//     expect(result).toEqual({ modifier: 'foo', name: 'bar' });
//   }
// );

// it('should parse a selector with an optional label (absence)',
//   () =>
//   {
//     const pattern = 'selector *? .. *';
//     const labels = ['modifier', 'name'];
//     const selector = 'selector .. `bar`';

//     const result = parseSelector(pattern, labels, selector);

//     expect(result).toEqual({ modifier: undefined!, name: 'bar' });
//   }
// );