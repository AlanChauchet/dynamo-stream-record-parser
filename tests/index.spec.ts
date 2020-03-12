import { parseDynamoStreamRecord } from '../src';

describe('parseDynamoStreamRecord', () => {
    describe('when passing an object', () => {
        it('should just clone object when given value only has external keys', () => {
            const object = {
                test: 'that',
                data: {
                    see: 'what'
                }
            };

            const result = parseDynamoStreamRecord(object);

            expect(result).toEqual({
                test: 'that',
                data: {
                    see: 'what'
                }
            });

            expect(result).not.toBe(object);
        });

        describe('and object is a stream record', () => {
            const object = {
                test: 'that',
                data: {
                    see: 'what'
                },
                testB: {
                    B: 'testBValue'
                },
                testS: {
                    S: 'testSValue'
                },
                testBS: {
                    BS: ['testBSValue1', 'testBSValue2']
                },
                testSS: {
                    SS: ['testSSValue1', 'testSSValue2']
                },
                testBool: {
                    BOOL: true
                },
                testN: {
                    N: '1234'
                },
                testNS: {
                    NS: ['1234', '5678']
                },
                testM: {
                    M: {
                        testMKey: {
                            S: 'testMValue'
                        }
                    }
                },
                testL: {
                    L: [{
                        S: 'testLValue1'
                    }, {
                        S: 'testLValue2'
                    }]
                },
                testNull: {
                    NULL: true
                }
            };

            it('should parse stream record keys of any type and keep other keys unchanged', () => {
                const result = parseDynamoStreamRecord(object);

                expect(result).toEqual({
                    test: 'that',
                    data: {
                        see: 'what'
                    },
                    testB: 'testBValue',
                    testS: 'testSValue',
                    testBS: ['testBSValue1', 'testBSValue2'],
                    testSS: ['testSSValue1', 'testSSValue2'],
                    testBool: true,
                    testN: 1234,
                    testNS: [1234, 5678],
                    testM: {
                        testMKey: 'testMValue'
                    },
                    testL: ['testLValue1', 'testLValue2'],
                    testNull: null
                });
            });

            it('should create BigInt for parsed numbers when useBigInt option is given', () => {
                const result = parseDynamoStreamRecord(object, true);
                expect(result).toEqual({
                    test: 'that',
                    data: {
                        see: 'what'
                    },
                    testB: 'testBValue',
                    testS: 'testSValue',
                    testBS: ['testBSValue1', 'testBSValue2'],
                    testSS: ['testSSValue1', 'testSSValue2'],
                    testBool: true,
                    testN: BigInt(1234),
                    testNS: [BigInt(1234), BigInt(5678)],
                    testM: {
                        testMKey: 'testMValue'
                    },
                    testL: ['testLValue1', 'testLValue2'],
                    testNull: null
                });
            });
        });
    });

    describe('when passing an array', () => {
        const array = [{
            testB: {
                B: 'testBValue'
            },
            testS: {
                S: 'testSValue'
            }
        }, {
            testBS: {
                BS: ['testBSValue1', 'testBSValue2']
            },
            testSS: {
                SS: ['testSSValue1', 'testSSValue2']
            },
            testBool: {
                BOOL: true
            }
        }, 5];

        it('should parse every object in the array', () => {
            const result = parseDynamoStreamRecord(array);

            expect(result).toEqual([{
                testB: 'testBValue',
                testS: 'testSValue'
            }, {
                testBS: ['testBSValue1', 'testBSValue2'],
                testSS: ['testSSValue1', 'testSSValue2'],
                testBool: true
            }, 5]);
        });
    });

    describe('when passing some other type', () => {
        const otherType = 'test';

        it('should return the same value as the one passed', () => {
            expect(parseDynamoStreamRecord(otherType)).toBe(otherType);
        });
     });
});
