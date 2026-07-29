const generateSlug = (name) => {
    const strName = typeof name === 'string' && name.trim() ? name : 'portfolio';
    const base = strName
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, '-')   // replace spaces/special chars with hyphens
        .replace(/^-+|-+$/g, '');       // trim leading/trailing hyphens

    const randomSuffix = Math.random().toString(36).substring(2, 7); // short random string
    return `${base || 'portfolio'}-${randomSuffix}`;
};

module.exports = generateSlug;