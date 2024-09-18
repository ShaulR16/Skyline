async function loadMarkdown(filePath) {
  try {
      const response = await fetch(filePath);
      const text = await response.text();
      return parseMarkdown(text);
  } catch (error) {
      console.error('Error loading markdown file:', error);
  }
}

function parseMarkdown(text) {
  const result = {};
  const sections = text.split('\n').filter(line => line.trim() !== '');

  sections.forEach(section => {
      const [key, ...valueParts] = section.split(': ');
      if (key && valueParts.length > 0) {
          result[key.trim()] = valueParts.join(': ').trim();
      }
  });

  return result;
}
