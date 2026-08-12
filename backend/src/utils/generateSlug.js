const generateSlug = (name) => {
    const strName = typeof name === 'string' && name.trim() ? name : 'portfolio';
    const base = strName
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');

    const randomSuffix = Math.random().toString(36).substring(2, 7);
    return `${base || 'portfolio'}-${randomSuffix}`;
};

module.exports = generateSlug;