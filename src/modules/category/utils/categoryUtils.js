export const mapToSelect = (categories = []) => categories.filter(c => c.active).map(c => ({ value: c.id, label: c.name }));
