const highlightText = (text, highlight) => {
  
    if (!highlight.trim()) {
      return text;
    }
    const regex = new RegExp(`(${highlight})`, 'gi');
    const parts = text.split(regex);
    return parts.map((part, index) =>
      regex.test(part) ? <span key={index} style={{ backgroundColor: '#D1F8EF' }}>{part}</span> : part
    );
};

export default highlightText;