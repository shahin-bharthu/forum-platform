import { Light as SyntaxHighlighter } from 'react-syntax-highlighter';
import { stackoverflowLight } from 'react-syntax-highlighter/dist/esm/styles/hljs'; // Import your desired theme
import parse from 'html-react-parser';
import DOMPurify from 'dompurify';

// Decode HTML entities like &lt;, &gt;, etc.
const decodeHtmlEntities = (str) => {
  const txt = document.createElement('textarea');
  txt.innerHTML = str;
  return txt.value;
};

// CodeRenderer component to render code blocks
const CodeRenderer = ({ code, language }) => {
  return (
    <SyntaxHighlighter language={language} style={stackoverflowLight} wrapLongLines customStyle={{ padding: '1em', fontSize:'0.85rem'}}>
      {code}
    </SyntaxHighlighter>
  );
};

export const renderHTML = (htmlContent) => {
  //sanitizing the HTML content to prevent XSS
  const sanitizedHTML = DOMPurify.sanitize(htmlContent,{ALLOWED_ATTR: ['href', 'target', 'rel', 'class'],});

  // html-react-parser to parse the HTML content
  return parse(sanitizedHTML, {
    replace: (domNode) => {
      // for codeblocks in quill to show them as it is
      if (domNode.name === 'div' && domNode.attribs.class === 'ql-code-block-container') {
        const codeContent = domNode.children
          .filter(child => child.name === 'div' && child.attribs.class === 'ql-code-block') 
          .map((child) => child.children[0]?.data || '')
          .join('\n'); 

        const decodedCode = decodeHtmlEntities(codeContent);
      
        const language = 'javascript';

        return <CodeRenderer key={domNode.attribs.key} code={decodedCode} language={language} />;
      }
    },
  });
};
