import menuItems from '../prisma/seeds/menu';

describe('proper seeds formatting', () => {
  it('should contain all necessary fields', () => {
    menuItems.forEach((val, i) => {
      expect(val.id).toEqual(i + 1);
      expect(val.title).not.toBeUndefined();
      expect(val.unitPrice).not.toBeUndefined();
      expect(val.unitPrice).toBeGreaterThan(0);
    });
  });
});