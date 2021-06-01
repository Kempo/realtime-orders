import menuItems from '../prisma/seeds/menu';

const CATEGORIES_SIZE = 6, MENU_LENGTH = 29;

describe('proper seeds formatting', () => {
  it('should contain all necessary fields', () => {
    menuItems.forEach((val, i) => {
      expect(val.id).toEqual(i + 1);
      expect(val.title).not.toBeUndefined();
      expect(val.unitPrice).not.toBeUndefined();
      expect(val.unitPrice).toBeGreaterThan(0);
      expect(val.category).not.toBeUndefined();
    });

  });

  it('should have the correct fields and categories', () => {
    const categories: Set<String> = new Set();
    menuItems.forEach(curr => {
      if(!curr.category || !curr.dietary) {
        fail('Menu item should have category and dietary field.');
      }
      categories.add(curr.category);
    });

    expect(categories.size).toBe(CATEGORIES_SIZE);
  });

  it('should have the correct menu length', () => {
    expect(menuItems.length).toBe(MENU_LENGTH);
  })
});