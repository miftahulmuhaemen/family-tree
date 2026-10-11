import { describe, expect, test } from 'bun:test';
import { validateGedcomDetailed } from './gedcomValidation';

describe('validateGedcomDetailed', () => {
  test('returns good status for valid GEDCOM data', () => {
    const validGedcom = `0 HEAD
1 SOUR FamilyTree
1 GEDC
2 VERS 5.5.1
1 CHAR UTF-8
0 @I1@ INDI
1 NAME John /Doe/
1 SEX M
1 BIRT
2 DATE 1 JAN 1970
0 @I2@ INDI
1 NAME Jane /Doe/
1 SEX F
0 @I3@ INDI
1 NAME Child One
1 SEX M
0 @F1@ FAM
1 HUSB @I1@
1 WIFE @I2@
1 MARR
1 CHIL @I3@
0 TRLR`;

    const res = validateGedcomDetailed(validGedcom);
    expect(res.isValid).toBe(true);
    expect(res.status).toBe('good');
    expect(res.message).toBe('Validation check, good!');
  });

  test('flags empty content', () => {
    const res = validateGedcomDetailed('');
    expect(res.isValid).toBe(false);
    expect(res.status).toBe('bad');
    expect(res.message).toContain('Content is empty');
  });

  test('flags when no individual records exist', () => {
    const noIndi = `0 HEAD
1 SOUR FamilyTree
0 TRLR`;
    const res = validateGedcomDetailed(noIndi);
    expect(res.isValid).toBe(false);
    expect(res.status).toBe('bad');
    expect(res.message).toContain('No individual records');
  });

  test('flags duplicate individual ID and points to line', () => {
    const duplicateId = `0 @I1@ INDI
1 NAME Person One
0 @I1@ INDI
1 NAME Person Two`;
    const res = validateGedcomDetailed(duplicateId);
    expect(res.isValid).toBe(false);
    expect(res.status).toBe('bad');
    expect(res.message).toContain('Duplicate individual ID @I1@');
    expect(res.errorLine).toBe(3);
  });

  test('flags unclosed @ identifier and points to line', () => {
    const unclosed = `0 @I1 INDI
1 NAME Person One`;
    const res = validateGedcomDetailed(unclosed);
    expect(res.isValid).toBe(false);
    expect(res.status).toBe('bad');
    expect(res.message).toContain("Unclosed '@' identifier");
    expect(res.errorLine).toBe(1);
  });

  test('flags invalid level jump and points to line', () => {
    const levelJump = `0 @I1@ INDI
2 BIRT
1 NAME Person One`;
    const res = validateGedcomDetailed(levelJump);
    expect(res.isValid).toBe(false);
    expect(res.status).toBe('bad');
    expect(res.message).toContain('Invalid level hierarchy');
    expect(res.errorLine).toBe(2);
  });

  test('flags dangling child reference in family and points to line', () => {
    const danglingChild = `0 @I1@ INDI
1 NAME Father
0 @F1@ FAM
1 HUSB @I1@
1 CHIL @I99@`;
    const res = validateGedcomDetailed(danglingChild);
    expect(res.isValid).toBe(false);
    expect(res.status).toBe('bad');
    expect(res.message).toContain('Child @I99@ in family @F1@ does not exist');
    expect(res.errorLine).toBe(5);
  });

  test('flags dangling husband reference in family and points to line', () => {
    const danglingHusb = `0 @I1@ INDI
1 NAME Mother
0 @F1@ FAM
1 HUSB @I99@
1 WIFE @I1@`;
    const res = validateGedcomDetailed(danglingHusb);
    expect(res.isValid).toBe(false);
    expect(res.status).toBe('bad');
    expect(res.message).toContain('Husband @I99@ in family @F1@ does not exist');
    expect(res.errorLine).toBe(4);
  });

  test('flags self-marriage and points to line', () => {
    const selfMarriage = `0 @I1@ INDI
1 NAME Alone
0 @F1@ FAM
1 HUSB @I1@
1 WIFE @I1@`;
    const res = validateGedcomDetailed(selfMarriage);
    expect(res.isValid).toBe(false);
    expect(res.status).toBe('bad');
    expect(res.message).toContain('cannot be married to themselves');
    expect(res.errorLine).toBe(5);
  });

  test('flags self-parenting and points to line', () => {
    const selfParent = `0 @I1@ INDI
1 NAME Loop
0 @F1@ FAM
1 HUSB @I1@
1 CHIL @I1@`;
    const res = validateGedcomDetailed(selfParent);
    expect(res.isValid).toBe(false);
    expect(res.status).toBe('bad');
    expect(res.message).toContain('cannot be their own parent/child');
    expect(res.errorLine).toBe(5);
  });

  test('flags deep ancestor cycle', () => {
    const cycle = `0 @I1@ INDI
1 NAME Person A
0 @I2@ INDI
1 NAME Person B
0 @F1@ FAM
1 HUSB @I1@
1 CHIL @I2@
0 @F2@ FAM
1 HUSB @I2@
1 CHIL @I1@`;
    const res = validateGedcomDetailed(cycle);
    expect(res.isValid).toBe(false);
    expect(res.status).toBe('bad');
    expect(res.message).toContain('Ancestor cycle detected');
  });
});
